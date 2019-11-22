import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from 'src/app/core/services/data.service';
import { Pagination } from 'src/app/core/models/pagination';
import { NotificationService } from 'src/app/core/services/notification.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { ModalDirective } from 'ngx-bootstrap';
import { FormGroup, FormControl } from '@angular/forms';
import { UtilityService } from 'src/app/core/services/utility.service';
import { Role } from 'src/app/core/models/role';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  @ViewChild('createProductModal', { static: false }) public createProductModal: ModalDirective;
  @ViewChild('editProductModal', { static: false }) public editProductModal: ModalDirective;
  @ViewChild('confirmDeleteModal', { static: false }) public confirmDeleteModal: ModalDirective;
  @ViewChild('confirmDeleteMultiModal', { static: false }) public confirmDeleteMultiModal: ModalDirective;
  @ViewChild('viewPriceModal', { static: false }) public viewPriceModal: ModalDirective;
  @ViewChild('editPriceProduct', { static: false }) public editPriceProduct: ModalDirective;
  @ViewChild('confirmDeletePriceModal', { static: false }) public confirmDeletePriceModal: ModalDirective;

  public dataProduct;
  public fillterName: string = '';
  public ID_PRODUCT;
  public formEditProduct: FormGroup;

  //add new
  public isShowGiaThang = true;
  public price_type: string = "1";
  public arrPriceProduct: object[] = [];
  public quatity_from?: string = "";
  public quatity_to?: string = "";
  public price_bt?: string = "";
  public price_thang?: string = "";
  public from_date_now: Date = new Date();
  public to_date_now: Date = new Date();

  public arrProductDetail: object[] = [];
  public reset_code: string = "";
  public reset_name: string = "";
  public reset_description: string = "";
  //

  //edit
  public productDetailID_edit: string = "";
  public productID_edit: string = "";

  public listProductDetailDelete: string[] = [];
  public deleteProductPriceID: string = "";
  //

  public settingsFilterGroupSender = {};
  public dataGroupSender = [];
  public selectedGroupSenderID = [];

  public settingsFilterProductType = {};
  public dataProductType = [];
  public selectedProductTypeID = [];

  public role: Role = new Role();

  public pagination: Pagination = new Pagination();
  constructor(private dataService: DataService,
    private notificationService: NotificationService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private utilityService: UtilityService) {
    this.formEditProduct = new FormGroup({
      productID: new FormControl(),
      productCode: new FormControl(),
      productName: new FormControl(),
      productType: new FormControl(),
      description: new FormControl(),

      senderGroupID: new FormControl(),
      fromDate: new FormControl(),
      toDate: new FormControl(),
      priceType: new FormControl(),
      giaThang: new FormControl()
    });

    this.activatedRoute.data.subscribe(data => {
      this.utilityService.getRole(data.MENU_CODE).then((response) => {
        if (response) this.role = response;
      })
    });

    this.settingsFilterGroupSender = {
      text: this.utilityService.translate("product_detail.sender_group"),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate("global.search"),
      noDataLabel: this.utilityService.translate("global.no_data")
    };

    this.settingsFilterProductType = {
      text: this.utilityService.translate("product.product_type"),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate("global.search"),
      noDataLabel: this.utilityService.translate("global.no_data")
    };
  }

  ngOnInit() {
    this.bindProductType();
    this.bindDataGroupSender();
    this.loadDataProduct();
    this.to_date_now.setFullYear(this.to_date_now.getFullYear() + 1);
  }

  //#region load product type
  bindProductType() {
    this.dataProductType = [];
    this.dataProductType.push({ "id": 1, "itemName": "Mua" });
    this.dataProductType.push({ "id": 2, "itemName": "Bán" });
  }

  onItemSelectProductType() {
    this.loadDataProduct();
  }

  OnItemDeSelectProductType() {
    this.loadDataProduct();
  }
  //#endregion

  //#region load group sender
  public async bindDataGroupSender() {
    let response = await this.dataService.getAsync('/api/sendergroup');
    for (let index in response.data) {
      this.dataGroupSender.push({ "id": response.data[index].ID, "itemName": response.data[index].NAME });
    }
    if (this.dataGroupSender.length > 0) {
      this.selectedGroupSenderID.push({ "id": this.dataGroupSender[0].id, "itemName": this.dataGroupSender[0].itemName });
    }
  }
  //#endregion

  //#region load data and paging

  async loadDataProduct() {
    let response: any = await this.dataService.getAsync('/api/product/GetListFillterPaging?pageIndex=' + this.pagination.pageIndex +
      '&pageSize=' + this.pagination.pageSize + '&name_des=' + this.fillterName +
      '&product_type=' + (this.selectedProductTypeID.length > 0 ? this.selectedProductTypeID[0].id : ""));
    this.getDataProduct(response);
  }
  getDataProduct(response?: any) {
    if (response) {
      this.dataProduct = response.data;
      if ('pagination' in response) {
        this.pagination.pageSize = response.pagination.PageSize;
        this.pagination.totalRow = response.pagination.TotalRows;
      }
    }
  }

  setPageIndex(pageNo: number): void {
    this.pagination.pageIndex = pageNo;
    this.loadDataProduct();
  }

  pageChanged(event: any): void {
    this.setPageIndex(event.page);
  }

  changePageSize(size) {
    this.pagination.pageSize = size;
    this.pagination.pageIndex = 1;
    this.loadDataProduct();
  }
  //#endregion

  //#region tim kiem
  searchProduct(fillter) {
    this.fillterName = fillter.fillterName;
    this.loadDataProduct();
  }
  //#endregion


  //#region edit product
  showConfirmEditProduct(product_id) {
    this.productID_edit = product_id;
    this.dataService.get('/api/product/' + product_id)
      .subscribe((response: any) => {
        if (response.err_code == 0) {
          let dataProduct = response.data[0];
          this.formEditProduct = new FormGroup({
            productID: new FormControl(product_id),
            productCode: new FormControl(dataProduct.PRODUCT_CODE),
            productName: new FormControl(dataProduct.PRODUCT_NAME),
            productType: new FormControl([{
              "id": dataProduct.PRODUCT_TYPE,
              "itemName": (dataProduct.PRODUCT_TYPE == "1" ? "Mua" : dataProduct.PRODUCT_TYPE == "2" ? "Bán" : "Loại gói cước")
            }]),
            description: new FormControl(dataProduct.DESCRIPTION),

            senderGroupID: new FormControl(this.dataGroupSender.length > 0 ?
              [{ "id": this.dataGroupSender[0].id, "itemName": this.dataGroupSender[0].itemName }] :
              [{ "id": "", "itemName": "Nhóm thương hiệu" }]),
            fromDate: new FormControl(this.from_date_now),
            toDate: new FormControl(this.to_date_now),
            priceType: new FormControl(this.price_type),
            giaThang: new FormControl(this.price_thang)
          });
          this.editProductModal.show();
        } else {
          this.notificationService.displayErrorMessage(response.err_message);
        }
      })
    this.showProducDetail(product_id);
  }

  public async showProducDetail(producid) {
    let response = await this.dataService.getAsync('/api/productdetail/GetProductDetailByProduct?product_id=' + producid);
    if (response.err_code == 0) {
      this.arrProductDetail = response.data;
    }
  }

  async editProduct() {
    let formData = this.formEditProduct.controls;
    let ID = formData.productID.value;
    let PRODUCT_CODE = formData.productCode.value;
    let PRODUCT_NAME = formData.productName.value;

    let PRODUCT_TYPE = formData.productType.value.length > 0 ? formData.productType.value[0].id : "";
    let DESCRIPTION = formData.description.value;
    let EDIT_USER = this.authService.currentUserValue.USER_NAME;

    if (PRODUCT_CODE == "" || PRODUCT_NAME == "") {
      this.notificationService.displayWarnMessage("Bạn phải nhập tên gói cước!");
      return;
    }

    if (PRODUCT_TYPE == "") {
      this.notificationService.displayWarnMessage("Bạn phải chọn loại gói cước!");
      return;
    }

    let dataEdit = await this.dataService.putAsync('/api/product/' + ID, {
      PRODUCT_CODE, PRODUCT_NAME, PRODUCT_TYPE, DESCRIPTION, EDIT_USER
    });

    if (dataEdit.err_code == 0) {
      //#region edit product detail
      let PRODUCT_ID = ID;
      let CREATE_USER = this.authService.currentUserValue.USER_NAME;
      for (let i in this.arrProductDetail) {
        let obj: any = this.arrProductDetail[i];
        let SENDER_GROUP_ID = obj.SENDER_GROUP_ID;
        let PRICE_TYPE = obj.PRICE_TYPE;
        let FROM_DATE = obj.FROM_DATE;
        let TO_DATE = obj.TO_DATE;
        let PRICE = "";
        let checkExists = await this.dataService.getAsync('/api/productdetail/GetListCheckExists?product_id=' +
          PRODUCT_ID + '&sender_group_id=' + SENDER_GROUP_ID + '&from_date=' + FROM_DATE + '&to_date=' + TO_DATE +
          '&price_type=' + PRICE_TYPE);
        if (checkExists.err_code == 0) {
          let data = checkExists.data;
          if (data.length == 0) {
            //insert
            let productDetail = await this.dataService.postAsync('/api/productdetail', {
              PRODUCT_ID, SENDER_GROUP_ID, PRICE_TYPE, FROM_DATE, TO_DATE, CREATE_USER
            });
            if (PRICE_TYPE == 1) {
              PRICE = obj.PRICE;
              let PR_ID = PRODUCT_ID;
              if (productDetail.err_code == 0) {
                if (PRICE != "" && PRICE != null) {
                  let PR_DETAIL_ID = productDetail.data[0].ID;
                  let checkPrice = await this.dataService.getAsync('/api/ProductDetailPrice/GetListCheckExists?product_detail_id=' +
                    PR_DETAIL_ID);
                  if (checkPrice.err_code == 0) {
                    let detailPrice = checkPrice.data;
                    if (detailPrice.length == 0) {
                      //insert
                      await this.dataService.postAsync('/api/ProductDetailPrice', {
                        PR_ID, PR_DETAIL_ID, PRICE, CREATE_USER
                      });
                    }
                    else {
                      //update
                      await this.dataService.putAsync('/api/ProductDetailPrice/' + checkPrice.data[0].ID, {
                        PR_ID, PR_DETAIL_ID, PRICE, EDIT_USER
                      });
                    }
                  }
                }
              }

            }
          }
          else {
            //update
            await this.dataService.putAsync('/api/productdetail/' + data[0].ID, {
              PRODUCT_ID, SENDER_GROUP_ID, PRICE_TYPE, FROM_DATE, TO_DATE, EDIT_USER
            });
          }
        }
      }
      //#endregion

      //#region xoa du lieu
      this.showProducDetail(PRODUCT_ID);
      if (this.listProductDetailDelete.length > 0) {
        for (let i in this.listProductDetailDelete) {
          await this.dataService.deleteAsync('/api/productdetail/' + this.listProductDetailDelete[i]);
        }
      }
      //#endregion
      this.loadDataProduct();
      this.editProductModal.hide();
      this.notificationService.displaySuccessMessage(dataEdit.err_message);
      this.price_thang = "";
    } else {
      this.notificationService.displayErrorMessage(dataEdit.err_message);
    }
  }
  //#endregion

  //#region detele
  showConfirmDeleteProduct(productID) {
    this.ID_PRODUCT = productID;
    this.confirmDeleteModal.show();
  }

  async deleteProduct(productID) {
    this.ID_PRODUCT = productID;
    let data = await this.dataService.deleteAsync('/api/product/' + productID + "?pageIndex=" + this.pagination.pageIndex +
      '&pageSize=' + this.pagination.pageSize);
    if (data.err_code == 0) {
      this.confirmDeleteModal.hide();
      this.loadDataProduct();
      this.notificationService.displaySuccessMessage(data.err_message);
    }
    else {
      this.notificationService.displayErrorMessage(data.err_message);
    }
  }
  //#endregion

  //#region Create product
  onChangePriceType(priceTypeID) {
    this.price_type = priceTypeID;
    if (priceTypeID == 1) this.isShowGiaThang = true;
    else if (priceTypeID == 2) this.isShowGiaThang = false;
  }

  public async addNewProductDetail(detail) {
    let count = 0;
    let from_Date = detail.fromDate;
    let to_Date = detail.toDate;
    let priceType = detail.priceType;
    let fromDate = "";
    let toDate = "";
    let fromDate_str = "";
    let toDate_str = "";
    let price = "";

    let senderGroup = this.selectedGroupSenderID.length > 0 ? this.selectedGroupSenderID[0].id : "";
    let senderGroupName = this.selectedGroupSenderID.length > 0 ? this.selectedGroupSenderID[0].itemName : "";
    if (senderGroup == "") {
      this.notificationService.displayErrorMessage("Bạn phải chọn nhóm thương hiệu!");
      return;
    }

    if (from_Date != null && from_Date != "") {
      fromDate_str = this.utilityService.formatDateToString(from_Date, "dd/MM/yyyy");
      fromDate = this.utilityService.formatDateToString(from_Date, "yyyyMMdd");
    }

    if (to_Date != null && to_Date != "") {
      toDate_str = this.utilityService.formatDateToString(to_Date, 'dd/MM/yyyy');
      toDate = this.utilityService.formatDateToString(to_Date, "yyyyMMdd");
    }

    if (priceType == 1) price = detail.giaThang;

    if ((fromDate == "" || fromDate == null) && (toDate == "" || toDate == null)) {
      this.notificationService.displayErrorMessage("Thời hạn gói cước chưa thỏa mãn!");
      return;
    }
    for (let i in this.arrProductDetail) {
      let obj: any = this.arrProductDetail[i];
      if (senderGroup == obj.SENDER_GROUP_ID && priceType == obj.PRICE_TYPE &&
        fromDate == obj.FROM_DATE && toDate == obj.TO_DATE) count++;
    }
    if (count == 0) {
      this.arrProductDetail.push({
        SENDER_GROUP_ID: senderGroup, PRICE_TYPE: priceType, FROM_DATE: fromDate, TO_DATE: toDate,
        FROM_DATE_STR: fromDate_str, TO_DATE_STR: toDate_str, PRICE: price, SENDER_GROUP_NAME: senderGroupName
      });
    }
    else {
      this.notificationService.displayErrorMessage("Du lieu da ton tai");
      return
    }
  }

  public async createProduct(product) {
    let PRODUCT_CODE = product.productCode.trim();
    let PRODUCT_NAME = product.productName.trim();
    let DESCRIPTION = product.description.trim();

    let CREATE_USER = this.authService.currentUserValue.USER_NAME;
    if (PRODUCT_CODE == "" || PRODUCT_NAME == "") {
      this.notificationService.displayWarnMessage("Bạn phải nhập tên gói cước!");
      return;
    }

    let PRODUCT_TYPE = this.selectedProductTypeID.length > 0 ? this.selectedProductTypeID[0].id : "";
    if (PRODUCT_TYPE == "") {
      this.notificationService.displayWarnMessage("Bạn phải chọn loại gói cước!");
      return;
    }

    let dataInsert = await this.dataService.postAsync('/api/product', {
      PRODUCT_CODE, PRODUCT_NAME, DESCRIPTION, PRODUCT_TYPE, CREATE_USER
    });

    if (dataInsert.err_code == 0) {
      let PRODUCT_ID = dataInsert.data[0].ID;
      for (let i in this.arrProductDetail) {
        let obj: any = this.arrProductDetail[i];
        let SENDER_GROUP_ID = obj.SENDER_GROUP_ID;
        let PRICE_TYPE = obj.PRICE_TYPE;
        let FROM_DATE = obj.FROM_DATE;
        let TO_DATE = obj.TO_DATE_STR;
        let PRICE = "";
        let checkExists = await this.dataService.getAsync('/api/productdetail/GetListCheckExists?product_id=' +
          PRODUCT_ID + '&sender_group_id=' + SENDER_GROUP_ID + '&from_date=' + FROM_DATE + '&to_date=' + TO_DATE +
          '&price_type=' + PRICE_TYPE);
        if (checkExists.err_code == 0) {
          let data = checkExists.data;
          if (data.length == 0) {
            //insert
            let productDetail = await this.dataService.postAsync('/api/productdetail', {
              PRODUCT_ID, SENDER_GROUP_ID, PRICE_TYPE, FROM_DATE, TO_DATE, CREATE_USER
            });
            if (PRICE_TYPE == 1) {
              PRICE = obj.PRICE;
              let PR_ID = PRODUCT_ID;
              if (productDetail.err_code == 0) {
                if (PRICE != "" && PRICE != null) {
                  let PR_DETAIL_ID = productDetail.data[0].ID;
                  let checkPrice = await this.dataService.getAsync('/api/ProductDetailPrice/GetListCheckExists?product_detail_id=' +
                    PR_DETAIL_ID);
                  if (checkPrice.err_code == 0) {
                    let detailPrice = checkPrice.data;
                    if (detailPrice.length == 0) {
                      //insert
                      await this.dataService.postAsync('/api/ProductDetailPrice', {
                        PR_ID, PR_DETAIL_ID, PRICE, CREATE_USER
                      });
                    }
                  }
                }
              }
            }
          }
        }
      }
      this.notificationService.displaySuccessMessage("Tạo product thành công!");
      this.createProductModal.hide();
      this.loadDataProduct();
      this.arrProductDetail = [];
      this.reset_name = "";
      this.reset_code = "";
      this.reset_description = "";
      this.price_thang = "";
      this.selectedProductTypeID = [];
    }
    else this.notificationService.displayErrorMessage(dataInsert.err_message);
  }
  //#endregion

  //#region edit Product
  viewDetailPriceProduct(productDetailID) {
    this.viewPriceModal.show();
    this.productDetailID_edit = productDetailID;
    this.loadDataProductDetailPrice(productDetailID);
  }

  public async loadDataProductDetailPrice(productDetailID) {
    let response = await this.dataService.getAsync('/api/productdetailprice/GetListByProductDetailID?product_detail_id=' +
      productDetailID);
    if (response.err_code == 0) {
      this.arrPriceProduct = response.data;
    }
  }


  public async addNewProductDetailEdit(detail) {
    let count = 0;
    let from_Date = detail.fromDate;
    let to_Date = detail.toDate;
    let priceType = detail.priceType;
    let fromDate = "";
    let toDate = "";
    let fromDate_str = "";
    let toDate_str = "";
    let price = "";

    let senderGroup = detail.senderGroupID.length > 0 ? detail.senderGroupID[0].id : "";
    let senderGroupName = detail.senderGroupID.length > 0 ? detail.senderGroupID[0].itemName : "";

    if (senderGroup == "") {
      this.notificationService.displayErrorMessage("Bạn phải chọn nhóm thương hiệu!");
      return;
    }

    if (from_Date != null && from_Date != "") {
      fromDate_str = this.utilityService.formatDateToString(from_Date, "dd/MM/yyyy");
      fromDate = this.utilityService.formatDateToString(from_Date, "yyyyMMdd");
    }

    if (to_Date != null && to_Date != "") {
      toDate_str = this.utilityService.formatDateToString(to_Date, 'dd/MM/yyyy');
      toDate = this.utilityService.formatDateToString(to_Date, "yyyyMMdd");
    }

    if (priceType == 1) price = detail.giaThang;

    if ((fromDate == "" || fromDate == null) && (toDate == "" || toDate == null)) {
      this.notificationService.displayErrorMessage("Thời hạn gói cước chưa thỏa mãn!");
      return;
    }
    for (let i in this.arrProductDetail) {
      let obj: any = this.arrProductDetail[i];
      if (senderGroup == obj.SENDER_GROUP_ID && priceType == obj.PRICE_TYPE &&
        fromDate == obj.FROM_DATE && toDate == obj.TO_DATE) count++;
    }
    if (count == 0) {
      this.arrProductDetail.push({
        SENDER_GROUP_ID: senderGroup, PRICE_TYPE: priceType, FROM_DATE: fromDate, TO_DATE: toDate,
        FROM_DATE_STR: fromDate_str, TO_DATE_STR: toDate_str, PRICE: price, SENDER_GROUP_NAME: senderGroupName
      });
    }
    else {
      this.notificationService.displayErrorMessage("Du lieu da ton tai");
      return
    }
  }

  addNewPrice(detail) {
    let count = 0;
    let volFrom = detail.qualityFrom;
    let volTo = detail.qualityTo;
    let price = detail.giaBacThang;
    if (volFrom == "" && volTo == "") {
      this.notificationService.displayErrorMessage("Bạn phải nhập lượng tin nhắn áp dụng giá tiền");
      return
    }
    for (let i in this.arrPriceProduct) {
      let obj: any = this.arrPriceProduct[i];
      if (volFrom == obj.VOL_FROM && volTo == obj.VOL_TO) count++;
    }
    if (count == 0) {
      this.arrPriceProduct.push({ VOL_FROM: volFrom, VOL_TO: volTo, PRICE: price });
      this.quatity_from = "";
      this.quatity_to = "";
      this.price_bt = "";
    }
    else {
      this.notificationService.displayErrorMessage("Lượng tin nhắn đã tồn tại");
      return
    }
  }

  public async editProductDetailPrice() {
    if (this.productDetailID_edit != "" && this.productDetailID_edit != null) {
      let PR_DETAIL_ID = this.productDetailID_edit;
      let PR_ID = this.productID_edit;
      let CREATE_USER = this.authService.currentUserValue.USER_NAME;
      let count = 0;
      for (let i in this.arrPriceProduct) {
        let obj: any = this.arrPriceProduct[i];
        let VOL_FROM = obj.VOL_FROM;
        let VOL_TO = obj.VOL_TO;
        let PRICE = obj.PRICE;

        let checkPrice = await this.dataService.getAsync('/api/ProductDetailPrice/GetListCheckExists?product_detail_id=' +
          PR_DETAIL_ID + "&vol_from=" + (VOL_FROM == null ? "" : VOL_FROM) + "&vol_to=" + ((VOL_TO == null) ? "" : VOL_TO));
        if (checkPrice.err_code == 0) {
          let data = checkPrice.data;
          if (data.length == 0) {
            let dataInsert = await this.dataService.postAsync('/api/ProductDetailPrice', {
              PR_ID, PR_DETAIL_ID, VOL_FROM, VOL_TO, PRICE, CREATE_USER
            });
            if (dataInsert.err_code == 0) {
              count++;
            }
          }
        }
      }

      //check lai xoa price khong ton tai trong arrPriceEdit
      let checkToDelete = await this.dataService.getAsync('/api/productdetailprice/GetListByProductDetailID?product_detail_id=' +
        PR_DETAIL_ID);
      if (checkToDelete.err_code == 0) {
        for (let i in checkToDelete.data) {
          let countTrung = 0;
          let objXoa: any = checkToDelete.data[i];
          let vol_from_delete = objXoa.VOL_FROM;
          let vol_to_delete = objXoa.VOL_TO;
          for (let k in this.arrPriceProduct) {
            let objCheck: any = this.arrPriceProduct[k];
            let vol_from_check = objCheck.VOL_FROM;
            let vol_to_check = objCheck.VOL_TO;

            if (vol_from_delete != "" && vol_from_delete != null && vol_from_delete == vol_from_check) {
              if (vol_to_delete != "" && vol_to_delete != null && vol_to_delete == vol_to_check) countTrung++;
              else if ((vol_to_delete == "" || vol_to_delete == null) && (vol_to_check == "" || vol_to_check == null)) countTrung++;
            }
            else if ((vol_from_delete == "" || vol_from_delete == null) && vol_from_delete == vol_from_check) {
              if (vol_to_delete != "" && vol_to_delete != null && vol_to_delete == vol_to_check) countTrung++;
              else if ((vol_to_delete == "" || vol_to_delete == null) && (vol_to_check == "" || vol_to_check == null)) countTrung++;
            }
          }
          if (countTrung == 0) {
            //xoa khoi database
            let dataDelete = await this.dataService.deleteAsync('/api/ProductDetailPrice/' + objXoa.ID);
            count++
          }
        }
      }

      this.loadDataProductDetailPrice(this.productDetailID_edit);
      this.viewPriceModal.hide();
      this.loadDataProductDetailPrice(this.productDetailID_edit);
      if (count > 0) this.notificationService.displaySuccessMessage("Cập nhật thành công");
      else this.notificationService.displayWarnMessage("Không có bản ghi nào được cập nhật");
    }
  }
  //#endregion

  //#region close modal
  closeFormCreateProduct() {
    this.createProductModal.hide();
    this.arrProductDetail = [];
  }
  closefromEditProduct() {
    this.editProductModal.hide();
    this.arrProductDetail = [];
  }
  closeFormEditPrice() {
    this.viewPriceModal.hide();
    this.arrPriceProduct = [];
  }
  //#endregion

  //#region detail in form detail
  public async deleteProductDetail(index, productDetailID) {
    if (productDetailID == null || productDetailID == "") {
      if (this.arrProductDetail != null) {
        for (let i in this.arrProductDetail) {
          if (i == index) {
            this.arrProductDetail.splice(index, 1);
          }
        }
      }
    }
    else {
      let checkToDelete = await this.dataService.getAsync('/api/productdetailprice/GetListByProductDetailID?product_detail_id=' +
        productDetailID);
      if (checkToDelete.err_code == 0) {
        if (checkToDelete.data.length == 0) {
          for (let i in this.arrProductDetail) {
            if (i == index) {
              this.arrProductDetail.splice(index, 1);
              this.listProductDetailDelete.push(productDetailID);
            }
          }
        }
        else {
          this.notificationService.displayWarnMessage("Co du lieu lien quan, khong the xoa");
          return;
        }
      }
    }
  }

  deleteCreateProductDetail(index) {
    if (this.arrProductDetail != null) {
      for (let i in this.arrProductDetail) {
        if (i == index) {
          this.arrProductDetail.splice(index, 1);
        }
      }
    }
  }

  confirmXoaPrice(productDetailID) {
    this.deleteProductPriceID = productDetailID;
    this.confirmDeletePriceModal.show();
  }

  public async deleteProductDetailPrice(productDetailID) {
    if (productDetailID != null && productDetailID != "") {
      let respone = await this.dataService.deleteAsync('/api/ProductDetailPrice/DeleteByProductDetailID?product_detail_id=' +
        productDetailID);
      if (respone.err_code == 0) {
        this.loadDataProductDetailPrice(productDetailID);
        let detail = await this.dataService.getAsync('/api/ProductDetail/' + productDetailID);
        if (detail.err_code == 0) {
          let product_detail = detail.data;
          if (product_detail.length > 0) {
            this.showProducDetail(product_detail[0].PRODUCT_ID);
          }
        }
        this.notificationService.displaySuccessMessage(respone.err_message);
      }
      else this.notificationService.displayErrorMessage(respone.err_message);
      this.confirmDeletePriceModal.hide();
    }
  }

  deletePriceEdit(index) {
    if (this.arrPriceProduct != null) {
      for (let i in this.arrPriceProduct) {
        let obj: any = this.arrPriceProduct[i];
        if (i == index) {
          this.arrPriceProduct.splice(index, 1);
        }
      }
    }
  }
  //#endregion

  //#region export excel
  public async exportExcel() {
    let result: boolean = await this.dataService.getFileExtentionAsync("/api/FileExtention/ExportExcel", "Product");
    if (result) {
      this.notificationService.displaySuccessMessage("Export thành công");
    }
    else {
      this.notificationService.displayErrorMessage("Export file lỗi");
    }
  }
  //#endregion

  deleteMultiProduct() {
    
  }
}
