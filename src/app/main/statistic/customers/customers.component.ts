import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../../core/services/data.service';
import { Pagination } from '../../../core/models/pagination';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NotificationService } from '../../../core/services/notification.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { UtilityService } from 'src/app/core/services/utility.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { Role } from 'src/app/core/models/role';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})

export class CustomersComponent implements OnInit {
  @ViewChild('confirmDeleteModal', { static: false }) public confirmDeleteModal: ModalDirective;
  @ViewChild('createNewModal', { static: false }) public createNewModal: ModalDirective;
  @ViewChild('editThisModal', { static: false }) public editThisModal: ModalDirective;
  @ViewChild('confirmDeleteMultiModal', { static: false }) public confirmDeleteMultiModal: ModalDirective;
  @ViewChild('importExcelModal', { static: false }) public importExcelModal: ModalDirective
  @ViewChild('importExcel', { static: false }) public importExcel

  public settingsFilterAccount = {};
  public dataAccount = [];
  public selectedAccountID = [];

  public dataCustomers;
  public formEditCustomers: FormGroup;
  public pagination: Pagination = new Pagination();
  public idDelete: string[] = [];
  public settingsSingle = {};
  public CustomersId;
  public Full_Name;

  public customers;
  public arrIdDelete: string[] = [];
  public full_name_fillter = "";
  public phone_fillter = "";
  public birthday_fillter = "";
  public role: Role = new Role();

  public fullName = "";
  public phone = "";
  public preName = "";
  public email = "";
  public address = "";
  public description = "";
  public birthday = "";
  public checkSendSms = true;

  constructor(
    private dataService: DataService,
    private activatedRoute: ActivatedRoute,
    private utilityService: UtilityService,
    private authService: AuthService,
    private notificationService: NotificationService) {

    this.activatedRoute.data.subscribe(data => {
      this.utilityService.getRole(data.MENU_CODE).then((response) => {
        if (response) this.role = response;
      })
    });

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

    this.settingsSingle = {
      singleSelection: true
    };
    this.settingsFilterAccount = {
      text: this.utilityService.translate("global.choose_account"),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate("global.search"),
      noDataLabel: this.utilityService.translate("global.no_data")
    };
  }

  ngOnInit() {
    this.bindDataAccount();
    this.getDataCustomers();
  }

  //#region account
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
      if (this.dataAccount.length == 1)
        this.selectedAccountID.push({ "id": this.dataAccount[0].id, "itemName": this.dataAccount[0].itemName });
      else
        this.selectedAccountID.push({ "id": 0, "itemName": "Chọn tài khoản" });
    }
  }

  onItemSelect() {
    this.getDataCustomers();
  }

  OnItemDeSelect() {
    this.selectedAccountID = [];
    this.getDataCustomers();
  }

  //#endregion

  //#region paging
  async getDataCustomers() {
    this.dataCustomers = []
    if (this.selectedAccountID.length > 0) {
      let response: any = await this.dataService.getAsync('/api/customer/GetCustomerFillterAndPaging?pageIndex=' +
        this.pagination.pageIndex + '&pageSize=' + this.pagination.pageSize +
        '&accountid=' + this.selectedAccountID[0].id + '&full_name=' + this.full_name_fillter +
        '&phone=' + this.phone_fillter + '&birthday=' + this.birthday_fillter)
      if (response.err_code == 0) this.loadData(response);
    }
  }

  loadData(response?: any) {
    if (response) {
      this.dataCustomers = response.data;
      if ('pagination' in response) {
        this.pagination.pageSize = response.pagination.PageSize;
        this.pagination.totalRow = response.pagination.TotalRows;
      }
    }
  }

  setPageIndex(pageNo: number): void {
    this.pagination.pageIndex = pageNo;
    this.getDataCustomers();
  }

  pageChanged(event: any): void {
    this.setPageIndex(event.page);
  }

  changePageSize(size) {
    this.pagination.pageSize = size;
    this.pagination.pageIndex = 1;
    this.getDataCustomers();
  }
  //#endregion

  //#region search customer
  SearchCustomers(fillter) {
    this.full_name_fillter = fillter.full_name_fillter.trim();
    if (fillter.birthday_fillter != "" && fillter.birthday_fillter != undefined && fillter.birthday_fillter != "Invalid Date")
      this.birthday_fillter = this.utilityService.formatDateToString(fillter.birthday_fillter, "yyyyMMdd");
    else this.birthday_fillter = "";
    this.phone_fillter = fillter.phone_fillter.trim();
    this.getDataCustomers();
  }
  //#endregion

  //#region open crate form
  showFormCreate() {
    this.resetFormCreate()
    if (this.dataAccount.length == 1)
      this.selectedAccountID.push({ "id": this.dataAccount[0].id, "itemName": this.dataAccount[0].USER_NAME })
    else
      this.selectedAccountID = []
    this.createNewModal.show()
  }

  closeFormCreate() {
    this.resetFormCreate()
    this.createNewModal.hide()
  }

  resetFormCreate() {
    this.fullName = ""
    this.phone = ""
    this.preName = ""
    this.address = ""
    this.email = ""
    this.description = ""
    this.birthday = ""
  }
  //#endregion

  //#region create new customer
  async createCustomers(customersForm) {
    let customers = customersForm.value;
    if (this.selectedAccountID.length == 0) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-63"));
      return;
    }
    let ACCOUNT_ID = this.selectedAccountID[0].id;
    let FULL_NAME = customers.fullName
    let DANH_XUNG = customers.preName;
    let PHONE = customers.phone;
    if (PHONE == null || PHONE == "" || PHONE == undefined) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-62"));
      return;
    }
    let BIRTHDAY = (customers.birthday != "" && customers.birthday != undefined && customers.birthday != "Invalid Date") ?
      this.utilityService.formatDateToString(customers.birthday, "yyyyMMdd") : "";
    let ADDRESS = customers.address;
    let EMAIL = customers.email;
    let BIRTHDAY_PRODUCT = customers.isBirthday == true ? "1" : "0";
    debugger
    let DESCRIPTION = customers.description;
    let response: any = await this.dataService.postAsync('/api/customer', {
      ACCOUNT_ID, DANH_XUNG, FULL_NAME,
      PHONE, BIRTHDAY, BIRTHDAY_PRODUCT, ADDRESS, EMAIL, DESCRIPTION
    })
    if (response.err_code == 0) {
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("100"));
      this.resetFormCreate()
      this.createNewModal.hide()
      this.getDataCustomers()
    }
    else this.notificationService.displayErrorMessage(response.err_message)
  }
  //#endregion

  //#region edit customer
  async showConfirmEditCustomers(id) {
    let response: any = await this.dataService.getAsync('/api/customer/' + id)
    if (response.err_code == 0) {
      if (response.data.length > 0) {
        let dataCustomers = response.data[0];
        this.formEditCustomers = new FormGroup({
          id: new FormControl(id),
          accountID: new FormControl([{ "id": dataCustomers.ACCOUNT_ID, "itemName": dataCustomers.USER_NAME }]),
          preName: new FormControl(dataCustomers.DANH_XUNG),
          fullName: new FormControl(dataCustomers.FULL_NAME),
          phone: new FormControl(dataCustomers.PHONE),
          birthday: new FormControl(dataCustomers.BIRTHDAY),
          isBirthday: new FormControl(dataCustomers.BIRTHDAY_PRODUCT == "1" ? true : false),
          address: new FormControl(dataCustomers.ADDRESS),
          email: new FormControl(dataCustomers.EMAIL),
          description: new FormControl(dataCustomers.DESCRIPTION)
        });
        this.editThisModal.show();
      } else {
        this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("103"));
      }
    }
    else {
      this.notificationService.displayErrorMessage(response.err_message);
    }
  }

  editCustomers() {
    let formData = this.formEditCustomers.controls;
    let ID = formData.id.value;
    if (formData.accountID.value.length == 0) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-63"));
      return;
    }
    let ACCOUNT_ID = formData.accountID.value[0].id

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

    this.dataService.put('/api/customer/' + ID, {
      ACCOUNT_ID, DANH_XUNG, FULL_NAME, BIRTHDAY_PRODUCT, PHONE, BIRTHDAY, ADDRESS, EMAIL, DESCRIPTION
    })
      .subscribe((response: any) => {
        if (response.err_code == 0) {
          this.getDataCustomers();
          this.editThisModal.hide();
          this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("300"));
        }
        else if (response.err_code == 103) {
          this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("103"));
        }
        else {
          this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
        }
      }, error => {
        console.log(error);
        this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
      });
  }
  //#endregion

  //#region delete
  showConfirmDeleteCustomers(feeid, full_name) {
    this.CustomersId = feeid;
    this.Full_Name = full_name;
    this.confirmDeleteModal.show();
  }

  deleteCustomers(customerid) {
    this.CustomersId = customerid;
    this.dataService.delete('/api/customer/' + customerid + "?pageIndex=" + this.pagination.pageIndex + '&pageSize=' + this.pagination.pageSize)
      .subscribe((response: any) => {
        if (response.err_code == 0) {
          this.confirmDeleteModal.hide();
          this.arrIdDelete.push(customerid);
          this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("200"));
          this.getDataCustomers();
        }
        else if (response.err_code == 103) {
          this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("103"));
        }
        else {
          this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
        }
      }, error => {
        console.log(error);
        this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
      });
  }
  //#endregion

  //#region export excel
  public async exportExcelCustomer() {
    if (this.selectedAccountID.length > 0) {
      let result: boolean = await this.dataService.getFileExtentionCustomerAsync("/api/FileExtention/ExportExcelCustomer",
        this.selectedAccountID[0].id, this.full_name_fillter, this.birthday_fillter, this.phone_fillter, "Customers");
      if (result) {
        this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("120"));
      }
      else {
        this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("125"));
      }
    }
    else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("Bạn phải chọn tài khoản"));
    }
  }
  //#endregion

  //#region impport file
  async exportExcelTemplate() {
    let result: boolean = await this.dataService.getFileExtentionAsync("/api/FileExtention/ExportExcelTemplate",
      "Customer", "Template_Customers.xlsx");
      if (result) {
        this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("120"));
      }
      else {
        this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("125"));
      }
  }

  public async importExcelCustomer(form) {
    if (this.selectedAccountID.length == 0) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-63"));
      return;
    }
    let ACCOUNT_ID = this.selectedAccountID[0].id
    let file = this.importExcel.nativeElement;
    if (file.files.length > 0) {
      let response: any = await this.dataService.importExcelCustomer(null, file.files, ACCOUNT_ID)
      if (response.err_code == 0) {
        let dataImport = response.data
        this.notificationService.displaySuccessMessage(response.err_message);
        this.importExcelModal.hide();
        this.importExcel.nativeElement.value = "";
        this.getDataCustomers();
      }
      else{
        this.notificationService.displayErrorMessage(response.err_message);
      }
    }
  }
  //#endregion
}
