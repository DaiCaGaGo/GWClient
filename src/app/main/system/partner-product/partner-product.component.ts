import { Component, OnInit, ViewChild} from '@angular/core';
import { ModalDirective, BsModalService } from 'ngx-bootstrap';
import { Pagination } from 'src/app/core/models/pagination';
import { FormGroup, FormControl } from '@angular/forms';
import { DataService } from 'src/app/core/services/data.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { Role } from 'src/app/core/models/role';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-partner-product',
  templateUrl: './partner-product.component.html',
  styleUrls: ['./partner-product.component.css']
})
export class PartnerProductComponent implements OnInit {
  @ViewChild('showModalCreate', { static: false }) public showModalCreate: ModalDirective;
  @ViewChild('showModalUpdate', { static: false }) public showModalUpdate: ModalDirective;
  @ViewChild('confirmDeleteMultiModal', { static: false }) public confirmDeleteMultiModal: ModalDirective;

  public dataPrProduct = [];
  public dataPartner = [];
  public dataProduct = [];
  public pagination: Pagination = new Pagination();
  public productName;
  public fromDate = new Date();
  public inPartner: string = '';
  public inProduct: string = '';
  public inFromDate: string = '';
  public inToDate: string = '';
  public fromPartner: boolean = false;
  public isCheckedDelete: boolean = false;
  public arrIdCheckedDelete: string[] = [];
  public arrIdDelete: string[] = [];
  public arrPrProduct: string[] = [];
  public selectedItems2 = [];
  public itemList2 = [];
  public settingsFilter = {};
  public settingsFilterPartner = {};
  public settingsFilterProduct = {};
  public selectedItemComboboxPartner = [];
  public selectedItemComboboxProduct = [];
  public selectedItemComboboxPartnerModal = [];
  public selectedItemComboboxProductModal = [];
  public partnerDisable: boolean = false;
  public formEditPartnerProduct: FormGroup;
  public role: Role = new Role();

  constructor(
    private dataService: DataService,
    private modalService: BsModalService,
    private activatedRoute: ActivatedRoute,
    private notificationService: NotificationService,
    private authService: AuthService,
    private utilityService: UtilityService) {
    modalService.config.backdrop = 'static';

    this.activatedRoute.data.subscribe(data => {
      this.utilityService.getRole(data.MENU_CODE).then((response) => {
        if (response) this.role = response;
      })
    });

    this.formEditPartnerProduct = new FormGroup({
      id: new FormControl(),
      slPartner: new FormControl(),
      slProduct: new FormControl(),
      fromDate: new FormControl(),
      toDate: new FormControl()
    });

    this.settingsFilterPartner = {
      text: "Chọn đối tác",
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      disabled: false,
      searchPlaceholderText: "Tìm kiếm",
      noDataLabel: "Không có dữ liệu"
    };

    this.settingsFilterProduct = {
      text: "Chọn gói cước",
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: "Tìm kiếm",
      noDataLabel: "Không có dữ liệu"
    };
  }

  ngOnInit() {
    this.getData();
    this.getDataPartner();
    this.getDataProduct();
  }

  async getData() {
    let from_date = this.inFromDate != "" ? this.utilityService.formatDateToString(this.inFromDate, "yyyyMMdd") : "";
    let to_date = this.inToDate != "" ? this.utilityService.formatDateToString(this.inToDate, "yyyyMMdd") : "";
    this.inPartner = this.selectedItemComboboxPartner.length != 0 && this.selectedItemComboboxPartner[0].id != 0 ? this.selectedItemComboboxPartner[0].id : "";
    this.inProduct = this.selectedItemComboboxProduct.length != 0 && this.selectedItemComboboxProduct[0].id != 0 ? this.selectedItemComboboxProduct[0].id : "";
    let response: any = await this.dataService.getAsync('/api/partnerproduct/GetPartnerProductPaging?pageIndex=' + this.pagination.pageIndex + '&pageSize=' +
      this.pagination.pageSize + "&partnerId=" + this.inPartner + "&productId=" + this.inProduct +
      "&fromDate=" + from_date + "&toDate=" + to_date)
    this.loadData(response);
    this.arrIdDelete = [];
  }

  async getDataPartner() {
    this.selectedItemComboboxPartnerModal = [{ "id": 0, "itemName": "Chọn đối tác" }];
    let response: any = await this.dataService.getAsync('/api/partner')
    for (let index in response.data) {
      this.dataPartner.push({ "id": response.data[index].ID, "itemName": response.data[index].PARTNER_NAME });
    }
  }

  async getDataProduct() {
    this.selectedItemComboboxProductModal = [{ "id": 0, "itemName": "Chọn gói cước" }];
    let response: any = await this.dataService.getAsync('/api/product')
    for (let index in response.data) {
      this.dataProduct.push({ "id": response.data[index].ID, "itemName": response.data[index].PRODUCT_NAME });
    }
  }

  loadData(response?: any) {
    if (response) {
      this.dataPrProduct = response.data;
      if ('pagination' in response) {
        this.pagination.pageSize = response.pagination.PageSize;
        this.pagination.totalRow = response.pagination.TotalRows;
      }
    }
  }

  // show modal create
  confirmShowModalCreate() {
    this.fromDate = new Date();
    this.showModalCreate.show();
  }

  setPageIndex(pageNo: number): void {
    this.pagination.pageIndex = pageNo;
    this.getData();
  }

  pageChanged(event: any): void {
    this.isCheckedDelete = false;
    this.arrIdCheckedDelete = [];
    this.setPageIndex(event.page);
  }

  changePageSize(size) {
    this.pagination.pageSize = size;
    this.pagination.pageIndex = 1;
    this.getData();
  }

  // create partner product
  async createPartnerProduct(item) {
    let dataSelect = item.controls;
    let partnerProduct = item.value;
    let PARTNER_ID = dataSelect.slPartner.value[0].id;
    if (PARTNER_ID === '' || PARTNER_ID === null || PARTNER_ID == 0) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-33"));
      return;
    }
    let PRODUCT_ID = dataSelect.slProduct.value[0].id;
    if (PRODUCT_ID === '' || PRODUCT_ID === null || PRODUCT_ID == 0) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-34"));
      return;
    }
    let FROM_DATE = partnerProduct.fromDate;
    let TO_DATE = partnerProduct.toDate;
    if (FROM_DATE != '' && FROM_DATE != null && TO_DATE != '' && TO_DATE != null) {
      let fromDate = this.utilityService.formatDateTempalte(FROM_DATE.toString());
      let toDate = this.utilityService.formatDateTempalte(TO_DATE.toString());
      if (fromDate > toDate) {
        this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-35"));
        return;
      }
    }

    let getMaxDate: any = await this.dataService.getAsync('/api/partnerproduct/GetMaxDateByPartnerProduct?id=&partnerId=' + PARTNER_ID)
    if (getMaxDate.err_code == 0) {
      if (getMaxDate.data.length > 0) {
        if (getMaxDate.data[0].FROM_DATE != "" || getMaxDate.data[0].FROM_DATE != null) {
          if (getMaxDate.data[0].TO_DATE == "" || getMaxDate.data[0].TO_DATE == null) {
            this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-36") + "'" + getMaxDate.data[0].PRODUCT_NAME + "' " + this.utilityService.getErrorMessage("-37") + " " + getMaxDate.data[0].PARTNER_NAME);
            return;
          }
          else if (this.utilityService.formatDateToString(FROM_DATE.toString(), "yyyyMMdd") < this.utilityService.formatDateToString(getMaxDate.data[0].TO_DATE, "yyyyMMdd")) {
            this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-38") + " " + this.utilityService.formatDateToString(getMaxDate.data[0].TO_DATE, "dd/MM/yyyy"));
            return;
          }
        }
      }
    }

    let response: any = await this.dataService.postAsync('/api/partnerproduct', { PARTNER_ID, PRODUCT_ID, FROM_DATE, TO_DATE })
    if (response.err_code == 0) {
      this.getData();
      item.reset();
      if (!this.fromPartner)
        this.selectedItemComboboxPartnerModal = [];
      else
        this.selectedItemComboboxPartnerModal = this.selectedItemComboboxPartner;
      this.selectedItemComboboxProductModal = [];
      this.showModalCreate.hide();
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("100"));
    }
    else if (response.err_code == -19) {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("-19"));
    }
    else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
    }
  }

  // show update modal
  async confirmUpdateModal(id) {
    let response: any = await this.dataService.getAsync('/api/partnerproduct/' + id)
    if (response.err_code == 0) {
      let dataPartnerProduct = response.data[0];
      this.formEditPartnerProduct = new FormGroup({
        id: new FormControl(id),
        slPartner: new FormControl([{ "id": dataPartnerProduct.PARTNER_ID, "itemName": dataPartnerProduct.PARTNER_NAME }]),
        slProduct: new FormControl([{ "id": dataPartnerProduct.PRODUCT_ID, "itemName": dataPartnerProduct.PRODUCT_NAME }]),
        fromDate: new FormControl(dataPartnerProduct.FROM_DATE),
        toDate: new FormControl(dataPartnerProduct.TO_DATE)
      });
      this.showModalUpdate.show();
    } else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
    }
  }

  // update partner product
  async editPartnerProduct() {
    let user = this.authService.currentUserValue;
    let formData = this.formEditPartnerProduct.controls;
    let ID = formData.id.value;
    let PARTNER_ID = formData.slPartner.value[0].id;
    if (PARTNER_ID === '' || PARTNER_ID === null || PARTNER_ID == 0) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-33"));
      return;
    }
    let PRODUCT_ID = formData.slProduct.value[0].id;
    if (PRODUCT_ID === '' || PRODUCT_ID === null || PRODUCT_ID == 0) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-34"));
      return;
    }
    let FROM_DATE = formData.fromDate.value;
    let TO_DATE = formData.toDate.value;
    if (FROM_DATE != '' && FROM_DATE != null && TO_DATE != '' && TO_DATE != null) {
      let fromDate = this.utilityService.formatDateTempalte(FROM_DATE.toString());
      let toDate = this.utilityService.formatDateTempalte(TO_DATE.toString());
      if (fromDate > toDate) {
        this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-35"));
        return;
      }
    }
    let getMaxDate: any = await this.dataService.getAsync('/api/partnerproduct/GetMaxDateByPartnerProduct?id= ' + ID + '&partnerId=' + PARTNER_ID)
    if (getMaxDate.err_code == 0) {
      if (getMaxDate.data.length > 0) {
        if (getMaxDate.data[0].FROM_DATE != "" || getMaxDate.data[0].FROM_DATE != null) {
          if (getMaxDate.data[0].TO_DATE == "" || getMaxDate.data[0].TO_DATE == null) {
            this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-36") + " '" + getMaxDate.data[0].PRODUCT_NAME + "' " + this.utilityService.getErrorMessage("-37") + " " + getMaxDate.data[0].PARTNER_NAME);
            return;
          }
          else if (this.utilityService.formatDateToString(FROM_DATE.toString(), "yyyyMMdd") < this.utilityService.formatDateToString(getMaxDate.data[0].TO_DATE, "yyyyMMdd")) {
            this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-38") + " " + this.utilityService.formatDateToString(getMaxDate.data[0].TO_DATE, "dd/MM/yyyy"));
            return;
          }
        }
      }
    }
    let response: any = await this.dataService.putAsync('/api/partnerproduct/' + ID, { PARTNER_ID, PRODUCT_ID, FROM_DATE, TO_DATE })
    if (response.err_code == 0) {
      if (!this.fromPartner)
        this.selectedItemComboboxPartnerModal = [];
      this.selectedItemComboboxProductModal = [];
      this.getData();
      this.showModalUpdate.hide();
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("300"));
    }
    else if (response.err_code == 103) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("103"));
    }
    else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
    }
  }

  // delete
  async confirmDelete(id) {
    if (!this.fromPartner) {
      let response: any = await this.dataService.deleteAsync('/api/partnerproduct/' + id + "?pageIndex=" + this.pagination.pageIndex + '&pageSize=' + this.pagination.pageSize)
      if (response.err_code == 0) {
        this.loadData(response);
        this.confirmDeleteMultiModal.hide();
        this.arrIdDelete.push(id);
        this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("200"));
      }
      else {
        this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
      }
    } else {
      let response: any = await this.dataService.deleteAsync('/api/partnerproduct/DeletePartnerProductInPartnerDetail?id=' + id + "&partnerId=" + this.selectedItemComboboxPartner[0].id + "&pageIndex=" + this.pagination.pageIndex + '&pageSize=' + this.pagination.pageSize)
      if (response.err_code == 0) {
        if (!this.fromPartner)
          this.selectedItemComboboxPartnerModal = [];
        this.selectedItemComboboxProductModal = [];
        this.loadData(response);
        this.confirmDeleteMultiModal.hide();
        this.arrIdDelete.push(id);
        this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("200"));
      }
      else {
        this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
      }
    }

  }

  async exportExcel() {
    let result: boolean = await this.dataService.getFileExtentionAsync("/api/FileExtention/ExportExcel", "PartnerProduct");
    if (result) {
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("120"));
    }
    else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("125"));
    }
  }

  checkAllDelete(isChecked) {
    this.isCheckedDelete = isChecked;
    if (this.isCheckedDelete) {
      for (let index in this.dataPrProduct) {
        let id = this.dataPrProduct[index].ID;
        let product = this.dataPrProduct[index].PRODUCT_NAME;
        const indexId: number = this.arrIdCheckedDelete.indexOf(id);
        if (indexId === -1) {
          this.arrIdCheckedDelete.push(id);
          this.arrPrProduct.push(product);
        }
      }
    } else {
      this.arrIdCheckedDelete = [];
      this.arrPrProduct = [];
    }
  }

  checkRowDelete(isChecked, id, productName) {
    const index: number = this.arrIdCheckedDelete.indexOf(id);
    if (index !== -1) {
      if (!isChecked) {
        this.arrIdCheckedDelete.splice(index, 1);
        this.arrPrProduct.splice(index, 1);
      }
    }
    else if (isChecked) {
      this.arrIdCheckedDelete.push(id);
      this.arrPrProduct.push(productName);
    }

    if (this.arrIdCheckedDelete.length == 0) {
      this.isCheckedDelete = false;
    }
  }

  confirmDeleteMulti() {
    if (this.arrPrProduct.length > 0) {
      this.productName = this.arrPrProduct.join(",");
      this.confirmDeleteMultiModal.show();
    }
  }

  deleteMulti() {
    for (let index in this.arrIdCheckedDelete) {
      this.confirmDelete(this.arrIdCheckedDelete[index]);
    }
    this.arrIdCheckedDelete = [];
    this.arrPrProduct = [];
    this.confirmDeleteMultiModal.hide();
  }
}
