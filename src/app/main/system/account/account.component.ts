import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../../core/services/data.service';
import { Pagination } from '../../../core/models/pagination';
import { BsModalService, BsModalRef, ModalDirective } from 'ngx-bootstrap/modal';
import { NotificationService } from '../../../core/services/notification.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { AccountMenuComponent } from '../account-menu/account-menu.component';
import { Role } from 'src/app/core/models/role';
import { UtilityService } from 'src/app/core/services/utility.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConst } from 'src/app/core/common/app.constants';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  @ViewChild('confirmDeleteModal', { static: false }) public confirmDeleteModal: ModalDirective;
  @ViewChild('createAccountModal', { static: false }) public createAccountModal: ModalDirective;
  @ViewChild('editAccountModal', { static: false }) public editAccountModal: ModalDirective;
  @ViewChild('confirmDeleteMultiModal', { static: false }) public confirmDeleteMultiModal: ModalDirective;
  @ViewChild('phanQuyenModal', { static: false }) public phanQuyenModal: ModalDirective;
  @ViewChild("accountMenuComponent", { static: false }) accountMenu: AccountMenuComponent;
  @ViewChild('confirmResetPassModal', { static: false }) public confirmResetPassModal: ModalDirective;
  @ViewChild('uploadImage', { static: false }) public uploadImage;
  @ViewChild('uploadImageEdit', { static: false }) public uploadImageEdit;

  public formEditAccount: FormGroup;
  public dataAccount = [];
  public modalRef: BsModalRef;
  public pagination: Pagination = new Pagination();
  public userNameAcount;
  public AccountId;
  public idDelete: string[] = [];
  public fillterUserName: string = '';
  public fillterFullName: string = '';
  public fillterCompanyName: string = '';
  public fillterPhone: string = '';
  public fillterPaymentType: string = '';
  public checkSendSmsLoop = false;
  public is_random_pass = false;
  public isDisablePass = false;
  public isCheckedDelete: boolean = false;
  public arrIdCheckedDelete: string[] = [];
  public createUserName = "";

  public checkActive = true;
  public checkRandomPass = true;
  public passRandom = "";

  public settingsFilterAccount = {};
  public listAccount = [];
  public selectedAccountID = [];
  public role: Role = new Role();

  public settingsFilterAccountType = {};
  public listAccountType = [];
  public selectedAccountType = [];

  public listRole = [];
  public selectedRole = [];
  public settingsFilterRole = {};

  public formResetPass: FormGroup;
  public urlImageUpload
  public urlImageUploadEdit

  constructor(
    private dataService: DataService,
    private modalService: BsModalService,
    private notificationService: NotificationService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private utilityService: UtilityService) {
    this.modalService.config.backdrop = 'static';

    this.formResetPass = new FormGroup({
      id: new FormControl(),
      newPass: new FormControl(),
    })

    this.activatedRoute.data.subscribe(data => {
      this.utilityService.getRole(data.MENU_CODE).then((response) => {
        if (response) this.role = response;
      })
    });

    this.settingsFilterAccount = {
      text: "Chọn tài khoản cha",
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: "Tìm kiếm",
      noDataLabel: "Không có dữ liệu"
    };

    this.formEditAccount = new FormGroup({
      accountId: new FormControl(),
      userName: new FormControl(),
      password: new FormControl(),
      fullName: new FormControl(),
      phone: new FormControl(),
      email: new FormControl(),
      skype: new FormControl(),
      companyName: new FormControl(),
      paymentType: new FormControl(),
      bankName: new FormControl(),
      bankAccount: new FormControl(),
      bankAccountName: new FormControl(),

      hanMucThangCSKH: new FormControl(),
      hanMucNgayCSKH: new FormControl(),
      quotaCSKH: new FormControl(),
      quotaConCSKH: new FormControl(),
      hanMucThangQC: new FormControl(),
      hanMucNgayQC: new FormControl(),
      quotaQC: new FormControl(),
      quotaConQC: new FormControl(),

      isAdmin: new FormControl(),
      isActive: new FormControl(),
      limitQuota: new FormControl(),
      enableSmsCSKH: new FormControl(),
      enableSmsQC: new FormControl(),
      enableDauSoNgan: new FormControl(),
      enableOTT: new FormControl(),
      enableOTP: new FormControl(),
      checkSendSmsLoop: new FormControl(),

      dlvr: new FormControl(),
      dlvrURL: new FormControl(),
      emailReport: new FormControl(),

      parentID: new FormControl(),
      roleID: new FormControl()
    });

    this.settingsFilterAccountType = {
      text: "Chọn loại tài khoản",
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: "Tìm kiếm",
      noDataLabel: "Không có dữ liệu"
    };

    this.settingsFilterRole = {
      text: "Chọn nhóm quyền",
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: "Tìm kiếm",
      noDataLabel: "Không có dữ liệu"
    };
  }

  ngOnInit() {
    this.loadAccountType();

    if (this.activatedRoute.snapshot.queryParamMap.get('redirectFrom') && this.activatedRoute.snapshot.queryParamMap.get('redirectFrom') == 'home') {
      this.getAccountNew();
    }
    else if (this.activatedRoute.snapshot.queryParamMap.get('redirectFrom') && this.activatedRoute.snapshot.queryParamMap.get('redirectFrom') == 'quota_expired') {
      this.getAccountExpiredQuota();
    }
    else {
      this.getDataAccount();
    }
    this.loadListAccountParent();
    this.loadListRole();
  }

  //#region load account type
  loadAccountType() {
    this.listAccountType = [];
    this.selectedAccountType = [];
    this.listAccountType.push({ "id": 1, "itemName": "Trả trước" });
    this.listAccountType.push({ "id": 2, "itemName": "Trả sau" });
  }
  //#endregion

  // get tai khoan sap het quota
  async getAccountExpiredQuota() {
    let response: any = await this.dataService.getAsync('/api/account/GetAccountExpiredQuota?pageIndex=' + this.pagination.pageIndex + '&pageSize=' + this.pagination.pageSize);
    if (response) {
      this.loadData(response);
    }
  }

  //#region load list nhóm quyền
  async loadListRole() {
    this.listRole = [];
    let response = await this.dataService.getAsync('/api/accessrole/')
    if (response.err_code == 0) {
      let result = response.data;
      for (let i in result) {
        this.listRole.push({ "id": result[i].ID, "itemName": result[i].ROLE_NAME })
      }
    }
  }
  //#endregion

  //#region load account parent
  async getAccountNew() {
    let response: any = await this.dataService.getAsync('/api/account/GetAccountNew?pageIndex=' + this.pagination.pageIndex + '&pageSize=' + this.pagination.pageSize);
    if (response) {
      this.loadData(response);
    }
  }

  public async loadListAccountParent() {
    this.listAccount = [];
    let result = await this.dataService.getAsync('/api/account/GetInfoAccountLogin');
    let roleAccess = result.data[0].ROLE_ACCESS;
    if (roleAccess == 50) {
      let response: any = await this.dataService.getAsync('/api/account');
      for (let index in response.data) {
        this.listAccount.push({ "id": response.data[index].ACCOUNT_ID, "itemName": response.data[index].USER_NAME });
      }
    }
    else {
      let response = await this.dataService.getAsync('/api/account/GetLisAccountParentAndChild?account_id=' +
        this.authService.currentUserValue.ACCOUNT_ID);
      for (let index in response.data) {
        this.listAccount.push({ "id": response.data[index].ACCOUNT_ID, "itemName": response.data[index].USER_NAME });
      }
    }
  }
  //#endregion

  //#region get table account
  async getDataAccount() {
    let response = await this.dataService.getAsync('/api/account/GetListFillterPaging?pageIndex=' + this.pagination.pageIndex +
      '&pageSize=' + this.pagination.pageSize + '&user_name=' + this.fillterUserName + '&full_name=' + this.fillterFullName +
      '&phone=' + this.fillterPhone + '&company_name=' + this.fillterCompanyName + '&payment_type=' + this.fillterPaymentType)
    if (response.err_code == 0) {
      this.loadData(response);
      this.idDelete = [];
    }
  }

  loadData(response?: any) {
    if (response) {
      this.dataAccount = response.data;
      if ('pagination' in response) {
        this.pagination.pageSize = response.pagination.PageSize;
        this.pagination.totalRow = response.pagination.TotalRows;
      }
    }
  }

  setPageIndex(pageNo: number): void {
    this.pagination.pageIndex = pageNo;
    if (this.activatedRoute.snapshot.queryParamMap.get('redirectFrom') && this.activatedRoute.snapshot.queryParamMap.get('redirectFrom') == 'home') {
      this.getAccountNew();
    }
    else if (this.activatedRoute.snapshot.queryParamMap.get('redirectFrom') && this.activatedRoute.snapshot.queryParamMap.get('redirectFrom') == 'quota_expired') {
      this.getAccountExpiredQuota();
    }
    else {
      this.getDataAccount();
    }
  }

  pageChanged(event: any): void {
    this.isCheckedDelete = false;
    this.arrIdCheckedDelete = [];
    this.setPageIndex(event.page);
  }

  changePageSize(size) {
    this.pagination.pageSize = size;
    this.pagination.pageIndex = 1;
    if (this.activatedRoute.snapshot.queryParamMap.get('redirectFrom') && this.activatedRoute.snapshot.queryParamMap.get('redirectFrom') == 'home') {
      this.getAccountNew();
    }
    else if (this.activatedRoute.snapshot.queryParamMap.get('redirectFrom') && this.activatedRoute.snapshot.queryParamMap.get('redirectFrom') == 'quota_expired') {
      this.getAccountExpiredQuota();
    }
    else {
      this.getDataAccount();
    }
  }
  //#endregion

  searchAccount(fillter) {
    this.fillterUserName = fillter.fillterUserName;
    this.fillterFullName = fillter.fillterFullName;
    this.fillterCompanyName = fillter.fillterCompanyName;
    this.fillterPhone = fillter.fillterPhone;
    this.fillterPaymentType = fillter.fillterPaymentType;
    if (this.activatedRoute.snapshot.queryParamMap.get('redirectFrom') && this.activatedRoute.snapshot.queryParamMap.get('redirectFrom') == 'home') {
      this.getAccountNew();
    }
    else if (this.activatedRoute.snapshot.queryParamMap.get('redirectFrom') && this.activatedRoute.snapshot.queryParamMap.get('redirectFrom') == 'quota_expired') {
      this.getAccountExpiredQuota();
    }
    else {
      this.getDataAccount();
    }
  }

  //#region  create account
  showCreateAccount() {
    this.selectedRole = [];
    this.is_random_pass = false;
    this.isDisablePass = false;
    this.passRandom = "";
    this.createUserName = "";
    this.urlImageUpload = ""
    this.uploadImage.nativeElement.value = "";
    this.createAccountModal.show();
  }

  model: any = {};
  // mobNumberPattern = "^((\\+91-?)|0)?[0-9]{10}$";  
  mobNumberPattern = "^(84|0)?[0-9]{9}$"

  async createAccount() {
    // let users = JSON.stringify(this.model);

    let USER_NAME = this.model.userName;
    // let PASSWORD = this.model.password;
    // if (this.is_random_pass == true) PASSWORD = this.passRandom;
    let PASSWORD = this.passRandom
    let FULL_NAME = this.model.fullName;
    let PHONE = this.model.phone;
    let EMAIL = this.model.email;
    let SKYPE = this.model.skype;
    let COMPANY_NAME = this.model.companyName
    let BANK_NAME = this.model.bankName;
    let BANK_ACCOUNT = this.model.bankAccount;
    let BANK_ACCOUNT_NAME = this.model.bankAccountName;

    let CREDIT_LINE_IN_MONTH_CSKH = this.model.hanMucThangCSKH;
    let CREDIT_LINE_IN_DAY_CSKH = this.model.hanMucNgayCSKH;
    let QUOTA_CSKH = this.model.quotaCSKH;
    let QUOTA_REMAIN_CSKH = this.model.quotaConCSKH;
    if (QUOTA_CSKH > 0) QUOTA_REMAIN_CSKH = QUOTA_CSKH;
    let CREDIT_LINE_IN_MONTH_QC = this.model.hanMucThangQC;
    let CREDIT_LINE_IN_DAY_QC = this.model.hanMucNgayQC;
    let QUOTA_QC = this.model.quotaQC;
    let QUOTA_REMAIN_QC = this.model.quotaConQC;
    if (QUOTA_QC > 0) QUOTA_REMAIN_QC = QUOTA_QC;

    let IS_ADMIN = this.model.isAdmin == true ? 1 : 0;
    let IS_ACTIVE = this.checkActive == true ? 1 : 0;
    let UNLIMIT_QUOTA = this.model.limitQuota == true ? 1 : 0;
    let ENABLE_SMS_CSKH = this.model.enableSmsCSKH == true ? 1 : 0;
    let ENABLE_SMS_QC = this.model.enableSmsQC == true ? 1 : 0;
    let ENABLE_SHORT_NUMBER = this.model.enableDauSoNgan == true ? 1 : 0;
    let ENABLE_OTT = this.model.enableOTT == true ? 1 : 0;
    let ENABLE_OTP = this.model.enableOTP == true ? 1 : 0;
    let ENABLE_SMS_LOOP = this.model.checkSendSmsLoop == true ? 1 : 0;

    let DLVR = this.model.dlvr == true ? 1 : 0;
    let DLVR_URL = this.model.dlvrURL;
    let EMAIL_REPORT = this.model.emailReport;
    let PARENT_ID = this.selectedAccountID.length > 0 ? this.selectedAccountID[0].id : "";
    let CREATE_USER = this.authService.currentUserValue.USER_NAME;

    let AVATAR = (this.urlImageUpload != null && this.urlImageUpload != "undefined" && this.urlImageUpload != "") ? this.urlImageUpload : ""

    let PAYMENT_TYPE = this.selectedAccountType.length > 0 ? this.selectedAccountType[0].id : "";
    if (PAYMENT_TYPE == "") {
      this.notificationService.displayErrorMessage("Bạn phải chọn loại tài khoản");
      return;
    }

    let ROLE_ACCESS = this.selectedRole.length > 0 ? this.selectedRole[0].id : "";
    if (ROLE_ACCESS == "") {
      this.notificationService.displayErrorMessage("Bạn phải chọn nhóm quyền");
      return;
    }

    let dataInsert = await this.dataService.postAsync('/api/account', {
      USER_NAME, PASSWORD, FULL_NAME, PHONE, SKYPE, EMAIL,
      COMPANY_NAME, PAYMENT_TYPE, BANK_NAME, BANK_ACCOUNT, BANK_ACCOUNT_NAME,
      DLVR, DLVR_URL, EMAIL_REPORT,
      CREDIT_LINE_IN_MONTH_CSKH, CREDIT_LINE_IN_DAY_CSKH, QUOTA_CSKH, QUOTA_REMAIN_CSKH,
      CREDIT_LINE_IN_MONTH_QC, CREDIT_LINE_IN_DAY_QC, QUOTA_QC, QUOTA_REMAIN_QC,
      IS_ADMIN, IS_ACTIVE, UNLIMIT_QUOTA, ENABLE_SMS_CSKH, ENABLE_SMS_QC,
      ENABLE_SHORT_NUMBER, ENABLE_OTT, ENABLE_OTP, PARENT_ID, ROLE_ACCESS, CREATE_USER, ENABLE_SMS_LOOP, AVATAR
    });

    if (dataInsert.err_code == 0) {
      this.createAccountModal.hide();
      this.getDataAccount();
      this.loadListAccountParent();
      this.notificationService.displaySuccessMessage(dataInsert.err_message)
    }
    else {
      this.notificationService.displayErrorMessage(dataInsert.err_message)
    }
    this.model = {}
  }
  //#endregion

  //#region delete account
  showConfirmDeleteAccount(accountId, userName) {
    this.AccountId = accountId;
    this.userNameAcount = userName;
    this.confirmDeleteModal.show();
  }

  async deleteAccount(accountId) {
    this.AccountId = accountId;
    let data = await this.dataService.deleteAsync('/api/account/' + accountId + "?pageIndex=" + this.pagination.pageIndex +
      '&pageSize=' + this.pagination.pageSize);
    if (data.err_code == 0) {
      this.confirmDeleteModal.hide();
      this.idDelete.push(accountId);
      this.getDataAccount();
      this.loadListAccountParent();
      this.notificationService.displaySuccessMessage("Xóa tài khoản thành công");
    }
    else {
      this.notificationService.displayErrorMessage("Xóa tài khoản thất bại");
    }
  }
  //#endregion

  public async exportExcelAccount() {
    let result: boolean = await this.dataService.getFileExtentionAsync("/api/FileExtention/ExportExcel", "Account");
    if (result) {
      this.notificationService.displaySuccessMessage("Export thành công");
    }
    else {
      this.notificationService.displayErrorMessage("Export file lỗi");
    }
  }

  //#region edit account
  async showConfirmEditAccount(accountId) {
    let response = await this.dataService.getAsync('/api/account/' + accountId);
    if (response.err_code == 0) {
      let dataAccount = response.data[0];
      this.formEditAccount = new FormGroup({
        accountId: new FormControl(accountId),
        password: new FormControl(dataAccount.PASSWORD),
        userName: new FormControl(dataAccount.USER_NAME),
        fullName: new FormControl(dataAccount.FULL_NAME),
        phone: new FormControl(dataAccount.PHONE),
        email: new FormControl(dataAccount.EMAIL),
        skype: new FormControl(dataAccount.SKYPE),
        companyName: new FormControl(dataAccount.COMPANY_NAME),
        paymentType: new FormControl([{
          "id": dataAccount.PAYMENT_TYPE,
          "itemName": (dataAccount.PAYMENT_TYPE == 1 ? "Trả trước" : dataAccount.PAYMENT_TYPE == 2 ? "Trả sau" : "")
        }]),
        bankName: new FormControl(dataAccount.BANK_NAME),
        bankAccount: new FormControl(dataAccount.BANK_ACCOUNT),
        bankAccountName: new FormControl(dataAccount.BANK_ACCOUNT_NAME),

        hanMucThangCSKH: new FormControl(dataAccount.CREDIT_LINE_IN_MONTH_CSKH),
        hanMucNgayCSKH: new FormControl(dataAccount.CREDIT_LINE_IN_DAY_CSKH),
        quotaCSKH: new FormControl(dataAccount.QUOTA_CSKH),
        quotaConCSKH: new FormControl(dataAccount.QUOTA_REMAIN_CSKH),
        hanMucThangQC: new FormControl(dataAccount.CREDIT_LINE_IN_MONTH_QC),
        hanMucNgayQC: new FormControl(dataAccount.CREDIT_LINE_IN_DAY_QC),
        quotaQC: new FormControl(dataAccount.QUOTA_QC),
        quotaConQC: new FormControl(dataAccount.QUOTA_REMAIN_QC),

        isAdmin: new FormControl(dataAccount.IS_ADMIN),
        isActive: new FormControl(dataAccount.IS_ACTIVE),
        limitQuota: new FormControl(dataAccount.UNLIMIT_QUOTA),
        enableSmsCSKH: new FormControl(dataAccount.ENABLE_SMS_CSKH),
        enableSmsQC: new FormControl(dataAccount.ENABLE_SMS_QC),
        enableDauSoNgan: new FormControl(dataAccount.ENABLE_SHORT_NUMBER),
        enableOTT: new FormControl(dataAccount.ENABLE_OTT),
        enableOTP: new FormControl(dataAccount.ENABLE_OTP),
        checkSendSmsLoop: new FormControl(dataAccount.IS_SEND_SMS_LOOP),

        dlvr: new FormControl(dataAccount.DLVR),
        dlvrURL: new FormControl(dataAccount.DLVR_URL),
        emailReport: new FormControl(dataAccount.EMAIL_REPORT),

        parentID: new FormControl(dataAccount.PARENT_ID != undefined && dataAccount.PARENT_ID != null && dataAccount.PARENT_ID != "" ?
          [{ "id": dataAccount.PARENT_ID, "itemName": dataAccount.PARENT_NAME }] :
          [{ "id": "", "itemName": "Chọn tài khoản cha" }]),
        roleID: new FormControl(dataAccount.ROLE_ACCESS != undefined && dataAccount.ROLE_ACCESS != null && dataAccount.ROLE_ACCESS != "" ?
          [{ "id": dataAccount.ROLE_ACCESS, "itemName": dataAccount.ROLE_NAME }] :
          [{ "id": "", "itemName": "Chọn nhóm quyền" }]
        )
      });
      this.urlImageUploadEdit = dataAccount.AVATAR
      this.uploadImageEdit.nativeElement.value = "";
      this.editAccountModal.show();
    } else {
      this.notificationService.displayErrorMessage(response.err_message);
    }
  }

  async editAccount() {
    let formData = this.formEditAccount.controls;

    let ACCOUNT_ID = formData.accountId.value;
    let USER_NAME = formData.userName.value;
    let PASSWORD = formData.password.value;
    let FULL_NAME = formData.fullName.value;
    let PHONE = formData.phone.value;
    let EMAIL = formData.email.value;
    let SKYPE = formData.skype.value;
    let COMPANY_NAME = formData.companyName.value;
    let BANK_NAME = formData.bankName.value;
    let BANK_ACCOUNT = formData.bankAccount.value;
    let BANK_ACCOUNT_NAME = formData.bankAccountName.value;

    let CREDIT_LINE_IN_MONTH_CSKH = formData.hanMucThangCSKH.value;
    let CREDIT_LINE_IN_DAY_CSKH = formData.hanMucNgayCSKH.value;
    let QUOTA_CSKH = formData.quotaCSKH.value;
    let QUOTA_REMAIN_CSKH = formData.quotaConCSKH.value;
    let CREDIT_LINE_IN_MONTH_QC = formData.hanMucThangQC.value;
    let CREDIT_LINE_IN_DAY_QC = formData.hanMucNgayQC.value;
    let QUOTA_QC = formData.quotaQC.value;
    let QUOTA_REMAIN_QC = formData.quotaConQC.value;

    let IS_ADMIN = formData.isAdmin.value == true ? 1 : 0;
    let IS_ACTIVE = formData.isActive.value == true ? 1 : 0;
    let UNLIMIT_QUOTA = formData.limitQuota.value == true ? 1 : 0;
    let ENABLE_SMS_CSKH = formData.enableSmsCSKH.value == true ? 1 : 0;
    let ENABLE_SMS_QC = formData.enableSmsQC.value == true ? 1 : 0;
    let ENABLE_SHORT_NUMBER = formData.enableDauSoNgan.value == true ? 1 : 0;
    let ENABLE_OTT = formData.enableOTT.value == true ? 1 : 0;
    let ENABLE_OTP = formData.enableOTP.value == true ? 1 : 0;
    let IS_SEND_SMS_LOOP = formData.checkSendSmsLoop.value == true ? 1 : 0;

    let DLVR = formData.dlvr.value == true ? 1 : 0;
    let DLVR_URL = formData.dlvrURL.value;
    let EMAIL_REPORT = formData.emailReport.value;

    let PARENT_ID = formData.parentID.value.length > 0 ? formData.parentID.value[0].id : "";
    let EDIT_USER = this.authService.currentUserValue.USER_NAME;
    let AVATAR = (this.urlImageUploadEdit != null && this.urlImageUploadEdit != "undefined" && this.urlImageUploadEdit != "") ?
      this.urlImageUploadEdit : ""

    let PAYMENT_TYPE = formData.paymentType.value.length > 0 ? formData.paymentType.value[0].id : "";
    if (PAYMENT_TYPE == "") {
      this.notificationService.displayErrorMessage("Loại tài khoản không được để trống");
      return;
    }

    let ROLE_ACCESS = formData.roleID.value.length > 0 ? formData.roleID.value[0].id : "";
    if (ROLE_ACCESS == "") {
      this.notificationService.displayErrorMessage("Loại tài khoản không được để trống");
      return;
    }

    let dataEdit = await this.dataService.putAsync('/api/account/' + ACCOUNT_ID, {
      FULL_NAME, PHONE, SKYPE, EMAIL,
      COMPANY_NAME, PAYMENT_TYPE, BANK_NAME, BANK_ACCOUNT, BANK_ACCOUNT_NAME,
      CREDIT_LINE_IN_MONTH_CSKH, CREDIT_LINE_IN_DAY_CSKH, QUOTA_CSKH, QUOTA_REMAIN_CSKH,
      CREDIT_LINE_IN_MONTH_QC, CREDIT_LINE_IN_DAY_QC, QUOTA_QC, QUOTA_REMAIN_QC,
      DLVR, DLVR_URL, EMAIL_REPORT,
      IS_ADMIN, IS_ACTIVE, UNLIMIT_QUOTA, ENABLE_SMS_CSKH, ENABLE_SMS_QC, ENABLE_SHORT_NUMBER, ENABLE_OTT, ENABLE_OTP,
      PARENT_ID, ROLE_ACCESS, EDIT_USER, IS_SEND_SMS_LOOP, AVATAR
    })
    if (dataEdit.err_code == 0) {
      this.getDataAccount();
      this.editAccountModal.hide();
      this.notificationService.displaySuccessMessage("Sửa tài khoản thành công");
    } else {
      this.notificationService.displayErrorMessage(dataEdit.err_message);
    }
  }
  //#endregion

  //#region password
  checkCreateRandomPass(isChecked) {
    if (isChecked) {
      this.is_random_pass = true;
      this.isDisablePass = true;
      this.passRandom = this.createRadomPass(6);
    }
    else {
      this.is_random_pass = false;
      this.isDisablePass = false;
      this.passRandom = "";
    }
  }

  createRadomPass(length) {
    var chars = "ABCDEFGHIJKLMNOP1234567890";
    var pass = "";
    for (var x = 0; x < length; x++) {
      var i = Math.floor(Math.random() * chars.length);
      pass += chars.charAt(i);
    }
    return pass;
  }
  //#endregion

  //#region Xóa nhiều account
  checkAllDelete(isChecked) {
    this.isCheckedDelete = isChecked;
    if (this.isCheckedDelete) {
      for (let index in this.dataAccount) {
        let accountId = this.dataAccount[index].ACCOUNT_ID;
        const indexId: number = this.arrIdCheckedDelete.indexOf(accountId);
        if (indexId === -1) {
          this.arrIdCheckedDelete.push(accountId);
        }
      }
    } else {
      this.arrIdCheckedDelete = [];
    }
  }

  checkRowDelete(isChecked, accountId) {
    const index: number = this.arrIdCheckedDelete.indexOf(accountId);
    if (index !== -1) {
      if (!isChecked) {
        this.arrIdCheckedDelete.splice(index, 1);
      }
    }
    else if (isChecked) {
      this.arrIdCheckedDelete.push(accountId);
    }

    if (this.arrIdCheckedDelete.length == 0) {
      this.isCheckedDelete = false;
    }
  }

  confirmDeleteMultiAccount() {
    if (this.arrIdCheckedDelete.length > 0) {
      this.userNameAcount = this.arrIdCheckedDelete.join(", ");
      this.confirmDeleteMultiModal.show();
    }
  }

  public async deleteMultiAccount() {
    let count = 0, error = 0;
    for (let index in this.arrIdCheckedDelete) {
      this.AccountId = this.arrIdCheckedDelete[index];
      let data = await this.dataService.deleteAsync('/api/account/' + this.arrIdCheckedDelete[index] + "?pageIndex=" +
        this.pagination.pageIndex + '&pageSize=' + this.pagination.pageSize);
      if (data.err_code == 0) {
        count++;
        this.idDelete.push(this.arrIdCheckedDelete[index]);
        this.loadListAccountParent();
      }
      else error++;
    }
    this.confirmDeleteMultiModal.hide();
    if (count > 0)
      this.notificationService.displaySuccessMessage("Có " + count + " bản ghi xóa thành công!");
    else if (error > 0)
      this.notificationService.displayErrorMessage("Có " + error + " bản ghi không được xóa!");
  }
  //#endregion

  showPhanQuyen(id) {
    this.accountMenu.account_id = id;
    this.accountMenu.getListAccountMenu();
    this.phanQuyenModal.show();
  }

  //#region reset pass
  showConfirmResetPass(accountId) {
    this.AccountId = accountId;
    this.confirmResetPassModal.show();
  }

  public async resetPass(accountId) {

    let formData = this.formResetPass.controls;
    let passNew = formData.newPass.value;

    if (passNew != "undefined" && passNew != null && passNew != "") {
      this.AccountId = accountId;
      let data = await this.dataService.putAsync('/api/account/UpdatePasswordAccount?accountid=' + accountId +
        '&password=' + passNew);
      if (data.err_code == 0) {
        this.confirmResetPassModal.hide();
        this.loadListAccountParent();
        this.notificationService.displaySuccessMessage("Cập nhật mật khẩu thành công");
        this.getDataAccount()
      }
      else {
        this.notificationService.displayErrorMessage(data.err_message);
      }
    }
    else {
      this.notificationService.displayErrorMessage("Mật khẩu không được để trống.");
    }
  }
  //#endregion

  //#region upload avatar
  public async submitUploadImage() {
    let file = this.uploadImage.nativeElement;
    if (file.files.length > 0) {
      let response: any = await this.dataService.postFileAsync(null, file.files);
      if (response) {
        this.urlImageUpload = AppConst.BASE_API + response.data;
      }
      else {
        this.notificationService.displayErrorMessage("Upload ảnh không thành công");
      }
    }
  }

  public async submitUploadImageEdit() {
    let file = this.uploadImageEdit.nativeElement;
    if (file.files.length > 0) {
      let response: any = await this.dataService.postFileAsync(null, file.files);
      if (response) {
        this.urlImageUploadEdit = AppConst.BASE_API + response.data;
      }
      else {
        this.notificationService.displayErrorMessage("Upload ảnh không thành công");
      }
    }
  }

  removeImage(){
    this.urlImageUploadEdit = ""
  }
  //#endregion

  public convertStringDate(text: string): string {
    let value = "";
    let nam = "", thang = "", ngay = "";
    if (text != "" && text != null && text != undefined) {
      nam = text.substring(0, 4);
      thang = text.substring(4, 6);
      ngay = text.substring(6, 8);
      value = ngay + "/" + thang + "/" + nam;
    }
    return value;
  }
}
