import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from 'src/app/core/services/data.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { ModalDirective } from 'ngx-bootstrap';
import { FormControl, FormGroup } from '@angular/forms';
import { Role } from 'src/app/core/models/role';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-account-product',
  templateUrl: './account-product.component.html',
  styleUrls: ['./account-product.component.css']
})
export class AccountProductComponent implements OnInit {
  @ViewChild('createModal', { static: false }) public createModal: ModalDirective;
  @ViewChild('editModal', { static: false }) public editModal: ModalDirective;
  @ViewChild('confirmDeleteModal', { static: false }) public confirmDeleteModal: ModalDirective;
  @ViewChild('confirmDeleteMultiModal', { static: false }) public confirmDeleteMultiModal: ModalDirective;

  public dataAccountProduct;
  public formEdit: FormGroup;

  public account_product_id;
  public isCheckedDelete: boolean = false;
  public arrIdCheckedDelete: string[] = [];
  public idDelete: string[] = [];

  public from_date_now: Date = new Date();
  public to_date_now: Date = new Date();

  public dataAccount = [];
  public settingsFilter = {};
  public selectedAccountID = [];

  public settingsFilterProduct = {};
  public dataProduct = [];
  public selectedProductID = [];

  public settingsFilterAccountEdit = {};
  public settingsFilterProductEdit = {};
  public role: Role = new Role();

  constructor(
    private dataService: DataService,
    private utilityService: UtilityService,
    private activatedRoute: ActivatedRoute,
    private notificationService: NotificationService,
    private authService: AuthService) {
    this.to_date_now.setFullYear(this.from_date_now.getFullYear() + 1);
    this.formEdit = new FormGroup({
      accountProductID: new FormControl(),
      accountID: new FormControl(),
      productID: new FormControl(),
      fromDate: new FormControl(),
      toDate: new FormControl()
    });

    this.activatedRoute.data.subscribe(data => {
      this.utilityService.getRole(data.MENU_CODE).then((response) => {
        if (response) this.role = response;
      })
    });

    this.settingsFilter = {
      text: "Chọn tài khoản",
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: "Tìm kiếm",
      noDataLabel: "Không có dữ liệu"
    };
    this.bindDataToCombobox();

    this.settingsFilterProduct = {
      text: "Chọn gói cước",
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: "Tìm kiếm",
      noDataLabel: "Không có dữ liệu"
    };
    this.bindDataProduct();

    this.settingsFilterAccountEdit = {
      text: "Chọn tài khoản",
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      disabled: true,
      searchPlaceholderText: "Tìm kiếm",
      noDataLabel: "Không có dữ liệu"
    };

    this.settingsFilterProductEdit = {
      text: "Chọn gói cước",
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      disabled: true,
      searchPlaceholderText: "Tìm kiếm",
      noDataLabel: "Không có dữ liệu"
    };
  }

  //#region load combobox
  public async bindDataToCombobox() {
    let result = await this.dataService.getAsync('/api/account/GetInfoAccountLogin');
    let roleAccess = result.data[0].ROLE_ACCESS;
    if (roleAccess == 50) {
      let response: any = await this.dataService.getAsync('/api/account');
      for (let index in response.data) {
        this.dataAccount.push({ "id": response.data[index].ACCOUNT_ID, "itemName": response.data[index].USER_NAME });
      }
      if (response.data.length > 0) {
        this.selectedAccountID.push({ "id": response.data[0].ACCOUNT_ID, "itemName": response.data[0].USER_NAME });
        this.getListAccountProduct(this.selectedAccountID[0].id);
      }
    }
    else {
      let response = await this.dataService.getAsync('/api/account/GetLisAccountParentAndChild?account_id=' +
        this.authService.currentUserValue.ACCOUNT_ID);
      for (let index in response.data) {
        this.dataAccount.push({ "id": response.data[index].ACCOUNT_ID, "itemName": response.data[index].USER_NAME });
      }
      if (this.dataAccount.length == 1)
        this.selectedAccountID.push({ "id": this.dataAccount[0].id, "itemName": this.dataAccount[0].itemName });
      else
        this.selectedAccountID.push({ "id": 0, "itemName": "Chọn tài khoản" });
    }
  }

  public async bindDataProduct() {
    let response: any = await this.dataService.getAsync('/api/product');
    for (let i in response.data) {
      this.dataProduct.push({ "id": response.data[i].ID, "itemName": response.data[i].PRODUCT_NAME });
    }
    if (response.data.length > 0) {
      this.selectedProductID.push({ "id": response.data[0].ID, "itemName": response.data[0].PRODUCT_NAME });
    }
  }
  //#endregion

  ngOnInit() {

  }

  //#region change combobox

  onItemSelect(item: any) {
    this.getListAccountProduct(this.selectedAccountID[0].id);
  }

  OnItemDeSelect(item: any) {
    this.getListAccountProduct(0);
  }
  //#endregion

  async getListAccountProduct(accountID) {
    let response = await this.dataService.getAsync('/api/accountproduct/GetLisProductByAccount?account_id=' + accountID);
    if (response.err_code == 0) {
      this.dataAccountProduct = response.data;
    }
  }

  //#region them moi
  async createProduct(form) {
    let ACCOUNT_ID = form.accountID[0].id;
    let PRODUCT_ID = form.productID[0].id;
    let CREATE_USER = this.authService.currentUserValue.USER_NAME;

    let dateFrom = form.fromDate;
    let dateTo = form.toDate;
    let FROM_DATE = "";
    let TO_DATE = "";
    if (dateFrom != null && dateFrom != "")
      FROM_DATE = this.utilityService.formatDateToString(dateFrom, "yyyyMMdd");
    if (dateTo != null && dateTo != "")
      TO_DATE = this.utilityService.formatDateToString(dateTo, 'yyyyMMdd');

    if (ACCOUNT_ID == "" || PRODUCT_ID == "") {
      this.notificationService.displayErrorMessage("Tài khoản và gói cước không được để trống");
      return;
    }
    if (FROM_DATE > TO_DATE) {
      this.notificationService.displayErrorMessage("Ngày bắt đầu không được nhỏ hơn ngày kết thúc");
      return;
    }

    let dataInsert = await this.dataService.postAsync('/api/accountproduct', {
      PRODUCT_ID, ACCOUNT_ID, FROM_DATE, TO_DATE, CREATE_USER
    });
    if (dataInsert.err_code == 0) {
      this.createModal.hide();
      this.selectedAccountID = [];
      this.selectedAccountID.push({ "id": ACCOUNT_ID, "itemName": form.accountID[0].itemName })
      this.getListAccountProduct(ACCOUNT_ID);
      this.notificationService.displaySuccessMessage(dataInsert.err_message);
      // this.from_date_now = form.toDate;
      // this.from_date_now.setDate(form.toDate.getDate() + 1);
      // this.to_date_now.setFullYear(this.from_date_now.getFullYear() + 1);
    }
    else {
      this.notificationService.displayErrorMessage(dataInsert.err_message);
    }
  }
  //#endregion

  //#region edit
  async showFormEdit(id) {
    let response = await this.dataService.getAsync('/api/AccountProduct/' + id);
    if (response.err_code == 0) {
      let data = response.data[0];
      this.formEdit = new FormGroup({
        accountProductID: new FormControl(id),
        accountID: new FormControl([{ "id": data.ACCOUNT_ID, "itemName": data.USER_NAME }]),
        productID: new FormControl([{ "id": data.PRODUCT_ID, "itemName": data.PRODUCT_NAME }]),
        fromDate: new FormControl(this.convertStringDate(data.FROM_DATE).toString()),
        toDate: new FormControl(this.convertStringDate(data.TO_DATE).toString()),
      });
      this.editModal.show();
    }
    else this.notificationService.displayErrorMessage(response.err_message);
  }

  async editData() {
    let formData = this.formEdit.controls;
    let ID = formData.accountProductID.value;
    let ACCOUNT_ID = formData.accountID.value[0].id;
    let PRODUCT_ID = formData.productID.value[0].id;
    let EDIT_USER = this.authService.currentUserValue.USER_NAME;

    let dateFrom = formData.fromDate.value;
    let dateTo = formData.toDate.value;
    let FROM_DATE = "";
    let TO_DATE = "";
    if (dateFrom != null && dateFrom != "")
      FROM_DATE = this.utilityService.formatDateToString(dateFrom, "yyyyMMdd");
    if (dateTo != null && dateTo != "")
      TO_DATE = this.utilityService.formatDateToString(dateTo, 'yyyyMMdd');

    if (ACCOUNT_ID == "" || PRODUCT_ID == "") {
      this.notificationService.displayErrorMessage("Tài khoản và gói cước không được để trống");
      return;
    }
    let dataEdit = await this.dataService.putAsync('/api/accountproduct/' + ID, {
      PRODUCT_ID, ACCOUNT_ID, FROM_DATE, TO_DATE, EDIT_USER
    });
    if (dataEdit.err_code == 0) {
      this.getListAccountProduct(this.selectedAccountID[0].id);
      this.editModal.hide();
      this.notificationService.displaySuccessMessage(dataEdit.err_message);
    } else {
      this.notificationService.displayErrorMessage(dataEdit.err_message);
    }
  }
  //#endregion

  //#region Delete
  showConfirmDelete(id) {
    this.account_product_id = id;
    this.confirmDeleteModal.show();
  }

  async deleteDetail(id) {
    this.account_product_id = id;
    let data = await this.dataService.deleteAsync('/api/AccountProduct/' + id);
    if (data.err_code == 0) {
      this.confirmDeleteModal.hide();
      this.idDelete.push(id);
      this.getListAccountProduct(this.selectedAccountID[0].id);
      this.notificationService.displaySuccessMessage(data.err_message);
    }
    else this.notificationService.displayErrorMessage(data.err_message);
  }

  checkAllDelete(isChecked) {
    this.isCheckedDelete = isChecked;
    if (this.isCheckedDelete) {
      for (let index in this.dataAccountProduct) {
        let id = this.dataAccountProduct[index].ID;
        const indexId: number = this.arrIdCheckedDelete.indexOf(id);
        if (indexId === -1) {
          this.arrIdCheckedDelete.push(id);
        }
      }
    } else {
      this.arrIdCheckedDelete = [];
    }
  }

  checkRowDelete(isChecked, id) {
    const index: number = this.arrIdCheckedDelete.indexOf(id);
    if (index !== -1) {
      if (!isChecked) {
        this.arrIdCheckedDelete.splice(index, 1);
      }
    }
    else if (isChecked) {
      this.arrIdCheckedDelete.push(id);
    }

    if (this.arrIdCheckedDelete.length == 0) {
      this.isCheckedDelete = false;
    }
  }

  confirmDeleteMulti() {
    if (this.arrIdCheckedDelete.length > 0) {
      this.account_product_id = this.arrIdCheckedDelete.join(", ");
      this.confirmDeleteMultiModal.show();
    }
  }

  public async deleteMultiAccountProduct() {
    let success = 0, error = 0;
    for (let index in this.arrIdCheckedDelete) {
      this.account_product_id = this.arrIdCheckedDelete[index];
      let data = await this.dataService.deleteAsync('/api/AccountProduct/' + this.arrIdCheckedDelete[index]);
      if (data.err_code == 0) {
        success++;
        this.idDelete.push(this.arrIdCheckedDelete[index]);
        this.getListAccountProduct(this.selectedAccountID[0].id);
      }
      else error++;
    }
    this.confirmDeleteMultiModal.hide();
    if (success > 0)
      this.notificationService.displaySuccessMessage("Có " + success + " bản ghi xóa thành công!");
    else if (error > 0)
      this.notificationService.displayErrorMessage("Có " + error + " bản ghi không được xóa!");
  }
  //#endregion

  public convertStringDate(text: string): string {
    let value = "";
    let nam = "", thang = "", ngay = "";
    if (text != "") {
      nam = text.substring(0, 4);
      thang = text.substring(4, 6);
      ngay = text.substring(6, 8);
      value = ngay + "/" + thang + "/" + nam;
    }
    return value;
  }

}
