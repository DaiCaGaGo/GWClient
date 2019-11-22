import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from 'src/app/core/services/data.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { ModalDirective, TabHeadingDirective } from 'ngx-bootstrap';
import { AuthService } from 'src/app/core/services/auth.service';
import { Pagination } from 'src/app/core/models/pagination';
import { Role } from 'src/app/core/models/role';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sms-birthday',
  templateUrl: './sms-birthday.component.html',
  styleUrls: ['./sms-birthday.component.css']
})
export class SmsBirthdayComponent implements OnInit {
  @ViewChild('contentSMS', { static: false }) public contentSMS;
  @ViewChild('timer', { static: false }) public timer;
  @ViewChild('importExcel', { static: false }) public importExcel;
  @ViewChild('confirmSendSmsModal', { static: false }) public confirmSendSmsModal: ModalDirective;

  time = { hour: 13, minute: 30 };

  public settingsFilterAccount = {};
  public dataAccount = [];
  public selectedAccountID = [];

  public selectedSenderName = [];
  public dataSender = [];
  public settingsFilterSender = {};

  public selectedSendType = [];
  public dataSendType = [];
  public settingsFilterSendType = {};

  public dataCustomer;

  public fillNoiDung = [];
  public nhapNoiDung: string = "";
  public numberChar: string = '0';
  public numberSMS: string = '0';

  public listContentSMS: any = [];

  public countVTL = 0;
  public countGPC = 0;
  public countVMS = 0;
  public countVNM = 0;
  public countGTEL = 0;
  public countSFONE = 0;
  public countDDMBLE = 0;
  public countTotal = 0;
  public isCheckSendVTL = true;
  public isCheckSendGPC = true;
  public isCheckSendVMS = true;
  public isCheckSendVNM = true;
  public isCheckSendGTEL = true;
  public isCheckSendSFONE = true;
  public isCheckSendDDMBLE = true;
  public isShowSendSms = false;

  public listHeaderFileImport = [];
  public listDataFileImport = [];
  public dataPhoneUpload = [];

  public minDate: Date = new Date();

  public paginationImport: Pagination = new Pagination();
  public dataImportExcelPaging = [];

  public viewQuyTinCSKH = 0;
  public viewQuyTinQC = 0;
  public role: Role = new Role();

  constructor(private dataService: DataService,
    private utilityService: UtilityService,
    private activatedRoute: ActivatedRoute,
    private notificationService: NotificationService,
    private authService: AuthService) {

    this.activatedRoute.data.subscribe(data => {
      this.utilityService.getRole(data.MENU_CODE).then((response) => {
        if (response) this.role = response;
      })
    });

    this.minDate.setDate(this.minDate.getDate());

    this.settingsFilterAccount = {
      text: this.utilityService.translate("global.choose_account"),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate("global.search"),
      noDataLabel: this.utilityService.translate("global.no_data")
    };

    this.settingsFilterSender = {
      text: this.utilityService.translate("global.choose_sender"),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate("global.search"),
      noDataLabel: this.utilityService.translate("global.no_data")
    };

    this.settingsFilterSendType = {
      text: "Chọn lấy dữ liệu",
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: "Tìm kiếm",
      noDataLabel: "Không có dữ liệu"
    };
  }

  ngOnInit() {
    this.bindDataAccount();
    this.bindDataSendType();
  }

  //#region view Quy tin
  public async viewQuyTin(accountID) {
    if (accountID != undefined && accountID != "") {
      let quota_con_cskh = 0;
      let quota_con_qc = 0;

      let getQuotaCSKH: any = await this.dataService.getAsync('/api/AccountCimast/GetAccountCimastByAccountService?accountID=' +
        accountID + '&serviceName=CSKH');
      if (getQuotaCSKH.data.length > 0) {
        quota_con_cskh = getQuotaCSKH.data[0].VOL;
        this.viewQuyTinCSKH = (quota_con_cskh != null && quota_con_cskh > 0) ? quota_con_cskh : 0;
      }
      else this.viewQuyTinCSKH = 0;

      let getQuotaQC: any = await this.dataService.getAsync('/api/AccountCimast/GetAccountCimastByAccountService?accountID=' +
        accountID + '&serviceName=QC');
      if (getQuotaQC.data.length > 0) {
        quota_con_qc = getQuotaQC.data[0].VOL;
        this.viewQuyTinQC = (quota_con_qc != null && quota_con_qc > 0) ? quota_con_qc : 0;
      }
      else this.viewQuyTinQC = 0;
    }
    else {
      this.viewQuyTinCSKH = 0;
      this.viewQuyTinQC = 0;
    }
  }
  //#endregion

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
        this.bindDataSender(this.selectedAccountID[0].id);
        this.viewQuyTin(this.selectedAccountID[0].id);
      }
      else
        this.selectedAccountID.push({ "id": 0, "itemName": "Chọn tài khoản" });
    }
    this.loadDataGrid();
  }

  onItemSelect() {
    this.bindDataSender(this.selectedAccountID[0].id);
    this.loadDataGrid();
    this.viewQuyTin(this.selectedAccountID[0].id);
  }

  OnItemDeSelect() {
    this.loadDataGrid();
    this.viewQuyTinCSKH = 0;
    this.viewQuyTinQC = 0;
  }
  //#endregion

  //#region load data sender
  public async bindDataSender(accountID) {
    this.dataSender = [];
    this.selectedSenderName = [];
    if (accountID != null && accountID != undefined && accountID > 0) {
      let response: any = await this.dataService.getAsync('/api/AccountSenderMapping/GetByAccountOrSender?account_id=' + accountID)
      for (let index in response.data) {
        this.dataSender.push({ "id": response.data[index].SENDER_ID, "itemName": response.data[index].SENDER_NAME });
      }
      if (this.dataSender.length == 1)
        this.selectedSenderName.push({ "id": this.dataSender[0].id, "itemName": this.dataSender[0].itemName });
    }
  }
  //#endregion

  //#region load data send type
  public async bindDataSendType() {
    this.dataSendType.push({ "id": 1, "itemName": "Import từ file excel" });
    this.dataSendType.push({ "id": 2, "itemName": "Lấy từ danh sách khách hàng" });
    this.selectedSendType.push({ "id": this.dataSendType[0].id, "itemName": this.dataSendType[0].itemName });
  }

  onItemSelectSendType() {
    this.loadDataGrid();
  }

  OnItemDeSelectSendType() {
    this.loadDataGrid();
  }
  //#endregion

  //#region load data
  public async loadDataGrid() {
    this.dataCustomer = [];
    this.fillNoiDung = [];
    this.dataImportExcelPaging = this.dataCustomer;
    if (this.selectedAccountID.length > 0 && this.selectedSendType.length > 0) {
      if (this.selectedSendType[0].id == "2") {
        let response: any = await this.dataService.getAsync('/api/Customer/GetCustomerByAccount?accountID=' + this.selectedAccountID[0].id);
        let result = response.data;
        this.dataCustomer = result.data;
        
        let listTelco = result.telco;
        this.countTotal = listTelco[0];
        this.countVTL = listTelco[1];
        this.countGPC = listTelco[2];
        this.countVMS = listTelco[3];
        this.countVNM = listTelco[4];
        this.countGTEL = listTelco[5];
        this.countSFONE = listTelco[6];
        this.countDDMBLE = listTelco[7];
      }
      else if (this.selectedSendType[0].id == "1") {
        if (this.listDataFileImport.length > 0) {
          this.dataCustomer = this.listDataFileImport;
        }
      }
    }
    for (let i = 0; i < this.dataCustomer.length; i++) {
      this.fillNoiDung.push({ NOI_DUNG: "" });
    }

    //#region phan trang
    if (this.paginationImport.pageSize != 'ALL') {
      this.dataImportExcelPaging = [];
      let data = this.dataCustomer;
      this.paginationImport.totalRow = data.length;
      this.paginationImport.totalPage = this.utilityService.formatNumberTotalPage(this.paginationImport.totalRow / this.paginationImport.pageSize);
      let beginItem: number = (this.paginationImport.pageIndex - 1) * this.paginationImport.pageSize;
      let dataPaging: any = [];
      for (let index in data) {
        if (Number(index) >= beginItem && Number(index) < (beginItem + Number(this.paginationImport.pageSize))) {
          dataPaging.push(data[index]);
        }
      }
      this.dataImportExcelPaging = dataPaging;
    }
    else {
      this.dataImportExcelPaging = this.dataCustomer;
    }
    //#endregion
  }
  //#endregion

  //#region tao noi dung tin nhan
  createContent(noiDung) {
    let noiDungOld = noiDung;

    this.fillNoiDung = [];
    let content = noiDung.trim();
    content = this.utilityService.removeDiacritics(content);
    content = this.utilityService.removeSign4VietnameseString(content);

    for (let i = 0; i < this.dataCustomer.length; i++) {
      this.fillNoiDung.push({ NOI_DUNG: '' });
    }

    for (let i = 0; i < this.dataCustomer.length; i++) {
      content = content.replace('[cot2]', this.dataCustomer[i].FULL_NAME);
      content = content.replace('[cot3]', this.dataCustomer[i].PHONE);
      this.fillNoiDung[i].NOI_DUNG = content;
      content = noiDungOld;
    }
  }

  getCot(index) {
    this.contentSMS.nativeElement.focus();
    let startString = this.contentSMS.nativeElement.value.substr(0, this.contentSMS.nativeElement.selectionStart);
    let endString = this.contentSMS.nativeElement.value.substr(this.contentSMS.nativeElement.selectionStart, this.contentSMS.nativeElement.value.length);
    this.nhapNoiDung = startString.trim() + " [cot" + index + "] " + endString.trim();
    this.contentSMS.nativeElement.focus();
  }
  //#endregion

  //#region change count sms
  countSMS(sms) {
    let smsContent = this.utilityService.removeDiacritics(sms);
    smsContent = this.utilityService.removeSign4VietnameseString(sms);
    let result = "";

    for (var i = 0, len = smsContent.length; i < len; i++) {
      if (smsContent.charCodeAt(i) == 160) {
        result += " ";
      }
      else if (smsContent.charCodeAt(i) <= 127) {
        result += smsContent[i];
      }
    }
    smsContent = result;
    var lengthsms = 0
    for (var k = 0; k < smsContent.length; k++) {
      if (smsContent.charAt(k) == '\\' || smsContent.charAt(k) == '^'
        || smsContent.charAt(k) == '{' || smsContent.charAt(k) == '}' || smsContent.charAt(k) == '['
        || smsContent.charAt(k) == ']' || smsContent.charAt(k) == '|') {
        lengthsms = lengthsms + 2;
      }
      else {
        lengthsms = lengthsms + 1;
      }
    }

    this.numberChar = lengthsms.toString();

    if (lengthsms == 0) {
      this.numberSMS = "0";
    }
    else if (lengthsms < 161) {
      this.numberSMS = "1";
    }
    else if (lengthsms < 307) {
      this.numberSMS = "2";
    }
    else {
      this.numberSMS = "3";
    }
  }
  //#endregion

  //#region send sms

  showConfirmSendSms() {
    this.confirmSendSmsModal.show();
  }

  public async sendMessage() {
    this.listContentSMS = [];
    let senderName = "";
    if (this.selectedSenderName.length > 0) {
      senderName = this.selectedSenderName[0].itemName;
    }

    let timeNow = new Date();
    let scheduleTime = this.utilityService.formatDateToString(timeNow, "yyyyMMddHHmmss");
    let nameCampaign = "ChucMungSinhNhat_" + senderName + "" + scheduleTime;

    let hour = this.timer.nativeElement.value;
    let strHour = hour.substr(0, 2);
    let strMinute = hour.substr(3, 2);

    //#region check valid
    if (this.selectedAccountID.length == 0) {
      this.notificationService.displayWarnMessage("Bạn phải chọn tài khoản gửi tin!");
      return;
    }
    let accountID = this.selectedAccountID[0].id;

    if (senderName == null || senderName == "") {
      this.notificationService.displayWarnMessage("Thương hiệu không được để trống!");
      return;
    }
    //#endregion

    let strBirthday = "";
    for (let i = 0; i < this.dataCustomer.length; i++) {
      let noi_dung = this.fillNoiDung[i].NOI_DUNG;
      this.fillNoiDung.push({ NOI_DUNG: noi_dung });
      let phone = this.dataCustomer[i].PHONE;
      let telco = this.dataCustomer[i].TELCO;
      let birthday = this.dataCustomer[i].BIRTHDAY;
      strBirthday = this.utilityService.formatDateToString(birthday, 'MMdd');
      scheduleTime = timeNow.getFullYear() + strBirthday + strHour + strMinute + '00';

      if (noi_dung != "" && phone != "") {
        this.listContentSMS.push({
          PHONE: phone, SMS_CONTENT: noi_dung, SENDER_NAME: senderName, SCHEDULE_TIME: scheduleTime,
          ORDER_NAME: nameCampaign, ACCOUNT_ID: accountID, SMS_TYPE: 'CSKH',
          IS_VIRTUAL: 0, REPORT_BY_EMAIL: 0,
          SMS_TEMPLATE: this.nhapNoiDung != undefined ? this.nhapNoiDung : "",
          STATUS: 0,
          CODE_NAME: nameCampaign,
          SENDER_ID: this.selectedSenderName[0].id,
          TELCO: telco
        });
      }
    }

    let sendViettel = 0, sendVMS = 0, sendGPC = 0, sendVNM = 0, sendSfone = 0, sendGtel = 0, sendDD = 0;
    if (this.isCheckSendVTL) sendViettel = 1;
    if (this.isCheckSendVMS) sendVMS = 1;
    if (this.isCheckSendGPC) sendGPC = 1;
    if (this.isCheckSendVNM) sendVNM = 1;
    if (this.isCheckSendSFONE) sendSfone = 1;
    if (this.isCheckSendGTEL) sendGtel = 1;
    if (this.isCheckSendDDMBLE) sendDD = 1;
    let insertSms = await this.dataService.postAsync('/api/SmsBirthday/InsertSmsBirthday?sendViettel=' + sendViettel +
      '&sendVMS=' + sendVMS + '&sendGPC=' + sendGPC + '&sendVNM=' + sendVNM + '&sendGtel=' + sendGtel +
      '&sendSfone=' + sendSfone + '&sendDD=' + sendDD, this.listContentSMS);
    if (insertSms.err_code == 0)
      this.notificationService.displaySuccessMessage(insertSms.err_message);
    else this.notificationService.displayErrorMessage(insertSms.err_message);

    this.confirmSendSmsModal.hide();
    this.viewQuyTin(accountID);
    for (let i in this.dataCustomer) {
      this.fillNoiDung[i].NOI_DUNG = "";
    }
  }
  //#endregion

  //#region export template file
  async exportExcelTemplate() {
    let result: boolean = await this.dataService.getFileExtentionAsync("/api/FileExtention/ExportExcelTemplate", "SmsBirthday", "Template_SMS_Birthday.xlsx");
    if (result) {
      this.notificationService.displaySuccessMessage("Xuất template thành công");
    }
    else {
      this.notificationService.displayErrorMessage("Xuất template lỗi");
    }
  }
  //#endregion

  //#region import template file
  public async Upload() {

    if (this.selectedAccountID.length == 0) {
      this.notificationService.displayWarnMessage("Bạn phải chọn tài khoản nhắn tin");
      this.importExcel.nativeElement.value = "";
      return;
    }
    let ACCOUNT_ID = this.selectedAccountID[0].id;

    this.listHeaderFileImport = [];
    this.listDataFileImport = [];
    this.dataPhoneUpload = [];

    let file = this.importExcel.nativeElement;
    this.fillNoiDung = [];

    if (file.files.length > 0) {
      let response = await this.dataService.importExcelBirthdaySmsAsync(null, file.files, ACCOUNT_ID);
      if (response.err_code == 0) {
        let result = response.data;
        this.listHeaderFileImport = result.arr_fields;
        let listTelco = result.telco;
        this.listDataFileImport = result.data;

        this.isShowSendSms = true;
        this.countTotal = listTelco[0];
        this.countVTL = listTelco[1];
        this.countGPC = listTelco[2];
        this.countVMS = listTelco[3];
        this.countVNM = listTelco[4];
        this.countGTEL = listTelco[5];
        this.countSFONE = listTelco[6];
        this.countDDMBLE = listTelco[7];

        for (let i = 0; i < this.listDataFileImport.length; i++) {
          this.fillNoiDung.push({ NOI_DUNG: "" });
          this.dataPhoneUpload.push(this.listDataFileImport[i]);
        }

        this.listDataFileImport = this.dataPhoneUpload;
        this.dataCustomer = this.listDataFileImport;
        this.getDataImport(this.listDataFileImport);
        this.notificationService.displaySuccessMessage("Import file excel thành công");
        this.importExcel.nativeElement.value = "";
      }
      else {
        this.notificationService.displayErrorMessage(response.err_message);
        this.importExcel.nativeElement.value = "";
        return;
      }
    }
    else {
      this.notificationService.displayErrorMessage("Có lỗi xảy ra");
      this.importExcel.nativeElement.value = "";
      return;
    }

  }
  //#endregion

  //#region change send by telco
  onCheckSendVTL(isChecked) {
    if (isChecked) {
      this.isCheckSendVTL = true;
    }
    else {
      this.isCheckSendVTL = false;
    }
  }

  onCheckSendGPC(isChecked) {
    if (isChecked) {
      this.isCheckSendGPC = true;
    }
    else {
      this.isCheckSendGPC = false;
    }
  }

  onCheckSendVMS(isChecked) {
    if (isChecked) {
      this.isCheckSendVMS = true;
    }
    else {
      this.isCheckSendVMS = false;
    }
  }

  onCheckSendVNM(isChecked) {
    if (isChecked) {
      this.isCheckSendVNM = true;
    }
    else {
      this.isCheckSendVNM = false;
    }
  }

  onCheckSendGTEL(isChecked) {
    if (isChecked) {
      this.isCheckSendGTEL = true;
    }
    else {
      this.isCheckSendGTEL = false;
    }
  }

  onCheckSendSFONE(isChecked) {
    if (isChecked) {
      this.isCheckSendSFONE = true;
    }
    else {
      this.isCheckSendSFONE = false;
    }
  }

  onCheckSendDDMBLE(isChecked) {
    if (isChecked) {
      this.isCheckSendDDMBLE = true;
    }
    else {
      this.isCheckSendDDMBLE = false;
    }
  }
  //#endregion

  //#region pagging 
  changePageSizeImport(size) {
    this.paginationImport.pageSize = size;
    this.paginationImport.pageIndex = 1;
    this.getDataImport();

    const timer: ReturnType<typeof setTimeout> = setTimeout(() => {
      this.paginationImport.pageIndex = 1;
    }, 1);
  }

  pageChangedImport(event: any): void {
    this.paginationImport.pageIndex = event.page;
    this.getDataImport();
  }

  public async getDataImport(data?: any) {
    if (this.paginationImport.pageSize != 'ALL') {
      this.dataImportExcelPaging = [];
      data = (data == null || data == undefined) ? this.dataCustomer : data;
      this.paginationImport.totalRow = data.length;
      this.paginationImport.totalPage = this.utilityService.formatNumberTotalPage(this.paginationImport.totalRow / this.paginationImport.pageSize);
      let beginItem: number = (this.paginationImport.pageIndex - 1) * this.paginationImport.pageSize;
      let dataPaging: any = [];
      for (let index in data) {
        if (Number(index) >= beginItem && Number(index) < (beginItem + Number(this.paginationImport.pageSize))) {
          dataPaging.push(data[index]);
        }
      }
      this.dataImportExcelPaging = dataPaging;
    }
    else {
      this.dataImportExcelPaging = this.dataCustomer;
    }
  }
  //#endregion

  //#region danh sach tin nhan trong ngay
  //#endregion

}
