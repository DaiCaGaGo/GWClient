import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from 'src/app/core/services/data.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { Pagination } from 'src/app/core/models/pagination';
import { ModalDirective, idLocale } from 'ngx-bootstrap';
import { NotificationService } from 'src/app/core/services/notification.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-group-customer',
  templateUrl: './group-customer.component.html',
  styleUrls: ['./group-customer.component.css']
})
export class GroupCustomerComponent implements OnInit {
  @ViewChild('importExcelModal', { static: false }) public importExcelModal: ModalDirective
  @ViewChild('importExcel', { static: false }) public importExcel
  @ViewChild('editThisModal', { static: false }) public editThisModal: ModalDirective
  @ViewChild('confirmDeleteModal', { static: false }) public confirmDeleteModal: ModalDirective

  public settingsFilterAccount = {};
  public dataAccount = [];
  public selectedAccountID = [];

  public settingsFilterGroupID = {}
  public selectedGroupID = []
  public dataGroup = []
  public phone_filter = ""

  public dataCustomer = [];
  public pagination: Pagination = new Pagination();

  public fullName = ""
  public phone = ""
  public birthday = ""
  public preName = ""

  public formEditCustomers: FormGroup
  public customerID

  constructor(private dataService: DataService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private utilityService: UtilityService) {

    this.settingsFilterAccount = {
      text: this.utilityService.translate("global.choose_account"),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate("global.search"),
      noDataLabel: this.utilityService.translate("global.no_data")
    }

    this.settingsFilterGroupID = {
      text: this.utilityService.translate("customers.select_group"),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate("global.search"),
      noDataLabel: this.utilityService.translate("global.no_data")
    }

    this.formEditCustomers = new FormGroup({
      id: new FormControl(),
      accountID: new FormControl(),
      fullName: new FormControl(),
      phone: new FormControl(),
      preName: new FormControl(),
      isBirthday: new FormControl(),
      birthday: new FormControl(),
      address: new FormControl(),
      email: new FormControl(),
      description: new FormControl()
    });
  }

  ngOnInit() {
    this.bindDataAccount()
    this.loadGroup()
  }

  //#region load data account
  public async bindDataAccount() {
    let result = await this.dataService.getAsync('/api/account/GetInfoAccountLogin');
    let is_admin = result.data[0].IS_ADMIN;
    if (is_admin != null && is_admin == 1) {
      let response: any = await this.dataService.getAsync('/api/account');
      for (let index in response.data) {
        this.dataAccount.push({ "id": response.data[index].ACCOUNT_ID, "itemName": response.data[index].USER_NAME });
      }
    }
    else {
      let response = await this.dataService.getAsync('/api/account/GetLisAccountParentAndChild?account_id=' +
        this.authService.currentUserValue.ACCOUNT_ID);
      for (let index in response.data) {
        this.dataAccount.push({ "id": response.data[index].ACCOUNT_ID, "itemName": response.data[index].USER_NAME });
      }
      if (this.dataAccount.length == 1) {
        this.selectedAccountID.push({ "id": this.dataAccount[0].id, "itemName": this.dataAccount[0].itemName });
      }
      else
        this.selectedAccountID.push({ "id": 0, "itemName": this.utilityService.translate("global.choose_account") });
    }
    this.loadDataGrid()
  }

  onItemSelect() {
    this.loadGroup()
    this.loadDataGrid()
  }
  //#endregion

  //#region load group
  public async loadGroup() {
    this.dataGroup = []
    this.selectedGroupID = []
    if (this.selectedAccountID.length > 0) {
      let response: any = await this.dataService.getAsync('/api/SmsBirthdayGroup/GetSmsBirthdayGroupByAccountID?accountId=' +
        this.selectedAccountID[0].id);
      if (response.err_code == 0) {
        for (let index in response.data) {
          this.dataGroup.push({ "id": response.data[index].ID, "itemName": response.data[index].GROUP_NAME });
        }
        if (this.dataGroup.length > 0)
          this.selectedGroupID.push({ "id": this.dataGroup[0].id, "itemName": this.dataGroup[0].itemName })
      }
    }
    this.loadDataGrid()
  }

  onItemSelectGroup() {
    this.loadDataGrid()
  }
  //#endregion

  //#region search
  searchData(form) {
    this.phone_filter = form.phone.trim()
    this.loadDataGrid()
  }

  public async loadDataGrid() {
    this.dataCustomer = []
    if (this.selectedAccountID.length > 0 && this.selectedGroupID.length > 0) {
      let response: any = await this.dataService.getAsync('/api/Customer/GetCustomerByGroupID?pageIndex=' +
        this.pagination.pageIndex + '&pageSize=' + this.pagination.pageSize +
        '&accountID=' + this.selectedAccountID[0].id + '&groupID=' + this.selectedGroupID[0].id +
        '&phone=' + this.phone_filter)
      if (response.err_code == 0) this.loadData(response)
    }
  }

  loadData(response?: any) {
    if (response) {
      this.dataCustomer = response.data;
      if ('pagination' in response) {
        this.pagination.pageSize = response.pagination.PageSize;
        this.pagination.totalRow = response.pagination.TotalRows;
      }
    }
  }

  setPageIndex(pageNo: number): void {
    this.pagination.pageIndex = pageNo;
    this.loadDataGrid();
  }

  pageChanged(event: any): void {
    this.setPageIndex(event.page);
  }

  changePageSize(size) {
    this.pagination.pageSize = size;
    this.pagination.pageIndex = 1;
    this.loadDataGrid();
  }
  //#endregion

  //#region open create form
  showFormCreate() {
    this.importExcelModal.show()
  }

  onChangeAccount() {
    this.loadGroup()
  }
  //#endregion

  //#region impport file
  async exportExcelTemplate() {
    let result: boolean = await this.dataService.getFileExtentionAsync("/api/FileExtention/ExportExcelTemplate",
      "Customer", "Template_Customers.xlsx");
    if (result) {
      this.notificationService.displaySuccessMessage("Xuất template thành công");
    }
    else {
      this.notificationService.displayErrorMessage("Xuất template lỗi");
    }
  }

  public async importExcelCustomer(form) {
    if (this.selectedAccountID.length == 0) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-63"));
      return;
    }
    let ACCOUNT_ID = this.selectedAccountID[0].id

    if (this.selectedGroupID.length == 0) {
      this.notificationService.displayWarnMessage("Bạn phải chọn nhóm tin sinh nhật");
      return;
    }
    let groupID = this.selectedGroupID[0].id

    let file = this.importExcel.nativeElement;
    if (file.files.length > 0) {
      let response: any = await this.dataService.importExcelCustomerInGroup(null, file.files, ACCOUNT_ID, groupID)
      if (response.err_code == 0) {
        this.notificationService.displaySuccessMessage(response.err_message);
        this.importExcelModal.hide();
        this.importExcel.nativeElement.value = "";
        this.loadDataGrid();
      }
      else {
        this.notificationService.displayErrorMessage(response.err_message);
      }
    }
  }
  //#endregion

  //#region create customer
  public async createCustomer(form) {
    let customers = form.value;
    if (this.selectedAccountID.length == 0) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-63"));
      return;
    }
    let ACCOUNT_ID = this.selectedAccountID[0].id;

    if (this.selectedGroupID.length == 0) {
      this.notificationService.displayWarnMessage("Bạn phải chọn nhóm gửi tin");
      return;
    }
    let GROUP_ID = this.selectedGroupID[0].id

    let FULL_NAME = customers.fullName
    let DANH_XUNG = customers.preName;

    let PHONE = customers.phone;
    if (PHONE == null || PHONE == "" || PHONE == undefined) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-62"));
      return;
    }

    let BIRTHDAY = (customers.birthday != "" && customers.birthday != undefined && customers.birthday != "Invalid Date") ?
      this.utilityService.formatDateToString(customers.birthday, "yyyyMMdd") : "";
    if (BIRTHDAY == "") {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-92"));
      return;
    }

    let BIRTHDAY_PRODUCT = 1

    let response: any = await this.dataService.postAsync('/api/customer', {
      ACCOUNT_ID, DANH_XUNG, FULL_NAME, PHONE, BIRTHDAY, BIRTHDAY_PRODUCT, GROUP_ID
    })
    if (response.err_code == 0) {
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("100"))
      this.importExcelModal.hide()
      this.loadDataGrid()
    }
    else this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"))
  }
  //#endregion

  //#region edit customer
  public async showConfirmEdit(id) {
    let response: any = await this.dataService.getAsync('/api/customer/' + id)
    if (response.err_code == 0) {
      if (response.data.length > 0) {
        let detail = response.data[0];
        this.formEditCustomers = new FormGroup({
          id: new FormControl(id),
          accountID: new FormControl(detail.ACCOUNT_ID),
          preName: new FormControl(detail.DANH_XUNG),
          fullName: new FormControl(detail.FULL_NAME),
          phone: new FormControl(detail.PHONE),
          birthday: new FormControl(detail.BIRTHDAY),
          isBirthday: new FormControl(detail.BIRTHDAY_PRODUCT == "1" ? true : false),
          address: new FormControl(detail.ADDRESS),
          email: new FormControl(detail.EMAIL),
          description: new FormControl(detail.DESCRIPTION)
        });
        this.editThisModal.show();
      } else {
        this.notificationService.displayErrorMessage("Không có dữ liệu");
      }
    }
    else {
      this.notificationService.displayErrorMessage(response.err_message);
    }
  }

  public async editCustomers() {
    let formData = this.formEditCustomers.controls;
    let ID = formData.id.value;
    let ACCOUNT_ID = formData.accountID.value

    let DANH_XUNG = formData.preName.value.trim();
    let FULL_NAME = formData.fullName.value.trim();

    let PHONE = formData.phone.value;
    if (PHONE == null || PHONE == "") {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-62"));
      return;
    }

    let BIRTHDAY_PRODUCT = formData.isBirthday.value == true ? "1" : "0";
    let BIRTHDAY = (formData.birthday.value != "" && formData.birthday.value != undefined && formData.birthday.value != "Invalid Date") ?
      this.utilityService.formatDateToString(formData.birthday.value, "yyyyMMdd") : "";
    let ADDRESS = formData.address.value;
    let EMAIL = formData.email.value;
    let DESCRIPTION = formData.description.value;

    let response: any = await this.dataService.putAsync('/api/customer/' + ID, {
      ACCOUNT_ID, DANH_XUNG, FULL_NAME, BIRTHDAY_PRODUCT, PHONE, BIRTHDAY, ADDRESS, EMAIL, DESCRIPTION
    })
    if (response.err_code == 0) {
      this.loadDataGrid()
      this.editThisModal.hide()
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("300"));
    }
    else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
    }
  }
  //#endregion

  //#region delete customer
  showConfirmDelete(id) {
    this.customerID = id;
    this.confirmDeleteModal.show();
  }

  public async deleteCustomer(customerid) {
    let response: any = await this.dataService.deleteAsync('/api/customer/' + customerid)
    if (response.err_code == 0) {
      this.confirmDeleteModal.hide();
      this.notificationService.displaySuccessMessage(response.err_message);
      this.loadDataGrid();
    }
    else {
      this.notificationService.displayErrorMessage(response.err_message);
    }
  }
  //#endregion

}
