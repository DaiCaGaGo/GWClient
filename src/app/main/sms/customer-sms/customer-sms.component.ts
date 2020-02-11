import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../../core/services/data.service';
import { Pagination } from '../../../core/models/pagination';
import { NotificationService } from '../../../core/services/notification.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { ModalDirective } from 'ngx-bootstrap';
import { AuthService } from 'src/app/core/services/auth.service';
import { Role } from 'src/app/core/models/role';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-customer-sms',
  templateUrl: './customer-sms.component.html',
  styleUrls: ['./customer-sms.component.css']
})
export class CustomerSmsComponent implements OnInit {
  @ViewChild('importExcel', { static: false }) public importExcel;
  @ViewChild('contentSMS', { static: false }) public contentSMS;
  @ViewChild('campaignName', { static: false }) public campaignName;
  @ViewChild('henGio', { static: false }) public henGio;
  @ViewChild('confirmSendSmsModal', { static: false }) public confirmSendSmsModal: ModalDirective;
  @ViewChild('confirmSendSmsTuyChonModal', { static: false }) public confirmSendSmsTuyChonModal: ModalDirective;

  public settingsFilterAccount = {};
  public dataAccount = [];
  public selectedAccountID = [];

  public selectedSenderName = [];
  public dataSender = [];
  public settingsFilterSender = {};

  public selectedSmsType = [];
  public dataSmsType = [];
  public settingsFilterSmsType = {};

  public numberChar: string = '0';
  public numberSMS: string = '0';

  public dataCustomers;
  public arrIdCheckedSend: string[] = [];
  public isCheckedSend: boolean = false;
  public idDelete: string[] = [];
  public arrIdDelete: string[] = [];
  public nhapNoiDung: string = "";

  public CustomersId;
  public fillNoiDung = [];
  public listContentSMS = [];

  public minDate: Date = new Date();
  public isShowDateTime = false;
  public isHenGio = false;
  public isShowSendSms = false;
  public countVTL = 0;
  public countGPC = 0;
  public countVMS = 0;
  public countVNM = 0;
  public countGTEL = 0;
  public countSFONE = 0;
  public countDDMBLE = 0;
  public countTotal = 0;

  public dataPhone = [];
  public dataPhonePagingg = [];
  public dataPhoneList = [];
  public lstChecked = [];
  public idPhone;
  public lstId;
  public phone;
  public isCheckSendVTL = true;
  public isCheckSendGPC = true;
  public isCheckSendVMS = true;
  public isCheckSendVNM = true;
  public isCheckSendGTEL = true;
  public isCheckSendSFONE = true;
  public isCheckSendDDMBLE = true;
  public isSendVirtual: Boolean = false;
  public isReportByEmail: Boolean = false;
  // public isVirtual: boolean;
  public timeSchedule: Date;

  public viewQuyTinCSKH = 0;
  public viewQuyTinQC = 0;

  public pagination: Pagination = new Pagination();
  public dataImportPaging = [];
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

    this.settingsFilterSmsType = {
      text: this.utilityService.translate("global.choose_smstype"),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate("global.search"),
      noDataLabel: this.utilityService.translate("global.no_data")
    };
  }

  ngOnInit() {
    this.bindDataAccount();
    this.bindDataSmsType();
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
        this.viewQuyTin(this.selectedAccountID[0].id);
      }
      else
        this.selectedAccountID.push({ "id": 0, "itemName": this.utilityService.translate("global.choose_account") });
    }
    if (this.selectedAccountID.length > 0 && this.selectedSmsType.length > 0) {
      this.bindDataSender(this.selectedAccountID[0].id, this.selectedSmsType[0].id);
    }
    this.getDataCustomers();
  }

  onItemSelect() {
    if (this.selectedAccountID.length > 0 && this.selectedSmsType.length > 0) {
      this.bindDataSender(this.selectedAccountID[0].id, this.selectedSmsType[0].id);
    }
    this.getDataCustomers();
    this.viewQuyTin(this.selectedAccountID[0].id);
  }

  OnItemDeSelect() {
    this.getDataCustomers();
    this.dataSender = []
    this.viewQuyTinCSKH = 0;
    this.viewQuyTinQC = 0;
  }

  //#endregion

  //#region load data sender and type
  public async bindDataSender(accountID, smsType) {
    this.dataSender = [];
    this.selectedSenderName = [];
    if (accountID != null && accountID != undefined && accountID > 0 && smsType != "") {
      let response: any = await this.dataService.getAsync('/api/SenderName/GetSenderByAccountAndType?accountID=' +
        accountID + "&smsType=" + smsType)
      for (let index in response.data) {
        this.dataSender.push({ "id": response.data[index].ID, "itemName": response.data[index].NAME });
      }
      if (this.dataSender.length == 1)
        this.selectedSenderName.push({ "id": this.dataSender[0].id, "itemName": this.dataSender[0].itemName });
    }
  }
  //#endregion

  //#region load sms type
  public async bindDataSmsType() {
    let response: any = await this.dataService.getAsync('/api/sysvar/GetSysvarByGroup?var_group=SMS_TYPE');
    for (let i in response.data) {
      this.dataSmsType.push({ "id": response.data[i].VAR_VALUE, "itemName": response.data[i].VAR_NAME });
    }
    if (this.dataSmsType.length > 0)
      this.selectedSmsType.push({ "id": this.dataSmsType[0].id, "itemName": this.dataSmsType[0].itemName });
    if (this.selectedAccountID.length > 0 && this.selectedSmsType.length > 0) {
      this.bindDataSender(this.selectedAccountID[0].id, this.selectedSmsType[0].id);
    }
  }

  onItemSelectSmsType() {
    if (this.selectedAccountID.length > 0 && this.selectedSmsType.length > 0) {
      this.bindDataSender(this.selectedAccountID[0].id, this.selectedSmsType[0].id);
    }
    else this.dataSender = [];
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

  onCheckSendVirtual(isChecked) {
    if (isChecked) this.isSendVirtual = true;
    else this.isSendVirtual = false;
  }

  onCheckReportEmail(isChecked) {
    if (isChecked) this.isReportByEmail = true;
    else this.isReportByEmail = false;
  }
  //#endregion

  //#region load data customer
  public async getDataCustomers() {
    if (this.selectedAccountID.length > 0) {
      let response: any = await this.dataService.getAsync('/api/Customer/GetCustomerByAccount?accountID=' + this.selectedAccountID[0].id);
      let result = response.data;
      this.dataCustomers = result.data;

      for (let i = 0; i < this.dataCustomers.length; i++) {
        this.fillNoiDung.push({ NOI_DUNG: "" });
      }

      let listTelco = result.telco;
      this.countTotal = listTelco[0];
      this.countVTL = listTelco[1];
      this.countGPC = listTelco[2];
      this.countVMS = listTelco[3];
      this.countVNM = listTelco[4];
      this.countGTEL = listTelco[5];
      this.countSFONE = listTelco[6];
      this.countDDMBLE = listTelco[7];

      //#region phan trang
      if (this.pagination.pageSize != 'ALL') {
        this.dataImportPaging = [];
        let data = this.dataCustomers;
        this.pagination.totalRow = data.length;
        this.pagination.totalPage = this.utilityService.formatNumberTotalPage(this.pagination.totalRow / this.pagination.pageSize);
        let beginItem: number = (this.pagination.pageIndex - 1) * this.pagination.pageSize;
        let dataPaging: any = [];
        for (let index in data) {
          if (Number(index) >= beginItem && Number(index) < (beginItem + Number(this.pagination.pageSize))) {
            dataPaging.push(data[index]);
          }
        }
        this.dataImportPaging = dataPaging;
      }
      else {
        this.dataImportPaging = this.dataCustomers;
      }
      //#endregion
    }
    else this.dataCustomers = [];
  }
  //#endregion

  //#region tao noi dung va check show hen gio
  createContent(noiDung) {
    let noiDungOld = noiDung;

    this.fillNoiDung = [];
    let content = noiDung.trim();
    content = this.utilityService.removeDiacritics(content);
    content = this.utilityService.removeSign4VietnameseString(content);

    for (let i = 0; i < this.dataCustomers.length; i++) {
      this.fillNoiDung.push({ NOI_DUNG: '' });
    }

    for (let i = 0; i < this.dataCustomers.length; i++) {
      this.fillNoiDung[i].NOI_DUNG = content;
      content = noiDungOld;
    }
  }
  checkTimeSchedule(event) {
    if (event == 1) {
      this.isHenGio = true;
      this.isShowDateTime = true;
    }
    else {
      this.isShowDateTime = false;
      this.isHenGio = false;
    }
  }
  //#endregion

  //#region gui all
  showConfirmSendSms() {
    this.confirmSendSmsModal.show();
  }

  public async sendMessage() {
    this.listContentSMS = [];

    let accountID = this.selectedAccountID.length > 0 ? this.selectedAccountID[0].id : "";
    let senderName = this.selectedSenderName.length > 0 ? this.selectedSenderName[0].itemName : "";
    let dataType = this.selectedSmsType.length > 0 ? this.selectedSmsType[0].id : "";
    let CODE_NAME = this.campaignName.nativeElement.value;
    let timeNow = new Date();
    let scheduleTime = this.utilityService.formatDateToString(timeNow, "yyyyMMddHHmmss");

    //#region check valid
    if (accountID == "") {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-21"));
      this.confirmSendSmsModal.hide();
      return;
    }
    if (senderName == "") {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-22"));
      this.confirmSendSmsModal.hide();
      return;
    }

    if (dataType == "") {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-90"));
      this.confirmSendSmsModal.hide();
      return;
    }

    if (CODE_NAME == "" || CODE_NAME == null || CODE_NAME == undefined) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-23"));
      this.campaignName.nativeElement.focus();
      this.confirmSendSmsModal.hide();
      return;
    }
    //#endregion

    //#region hen gio gui
    let is_schedule = 0;
    if (this.isHenGio == true) {
      is_schedule = 1;
      let time = this.henGio.nativeElement.value;
      if (time == null || time == "Invalid date" || time == "") {
        this.notificationService.displayWarnMessage("Input schedule time!");
        this.henGio.nativeElement.focus();
        return;
      }
      else {
        scheduleTime = this.utilityService.formatDateToString(time, "yyyyMMddHHmmss");
      }
    }
    //#endregion

    for (let i = 0; i < this.dataCustomers.length; i++) {
      let noi_dung = this.fillNoiDung[i].NOI_DUNG;
      this.fillNoiDung.push({ NOI_DUNG: noi_dung });
      let phone = this.dataCustomers[i].PHONE;

      if (noi_dung != "" && phone != "") {
        this.listContentSMS.push({
          PHONE: phone, SMS_CONTENT: noi_dung, SENDER_NAME: senderName, SCHEDULE_TIME: scheduleTime,
          ORDER_NAME: this.campaignName.nativeElement.value, ACCOUNT_ID: accountID, SMS_TYPE: dataType,
          IS_VIRTUAL: this.isSendVirtual ? 1 : 0, REPORT_BY_EMAIL: this.isReportByEmail ? 1 : 0,
          SMS_TEMPLATE: this.nhapNoiDung != undefined ? this.nhapNoiDung : "",
          STATUS: (is_schedule == 0 && dataType == "CSKH") ? 2 : 0,
          CODE_NAME: this.campaignName.nativeElement.value,
          SENDER_ID: this.selectedSenderName[0].id
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
    let insertSms = await this.dataService.postAsync('/api/sms/InsertListSMS?isSchedule=' + is_schedule +
      '&sendViettel=' + sendViettel + '&sendVMS=' + sendVMS + '&sendGPC=' + sendGPC + '&sendVNM=' + sendVNM +
      '&sendSfone=' + sendSfone + '&sendGtel=' + sendGtel + '&sendDD=' + sendDD + '&type=3&phoneList=', this.listContentSMS);
    if (insertSms.err_code == 0)
      this.notificationService.displaySuccessMessage(insertSms.err_message);
    else this.notificationService.displayErrorMessage(insertSms.err_message);

    this.confirmSendSmsModal.hide();
    for (let i in this.dataCustomers) {
      this.fillNoiDung[i].NOI_DUNG = "";
    }
  }
  //#endregion

  //#region check gui tuy chon
  checkAllSend(isChecked) {
    this.isCheckedSend = isChecked;
    if (this.isCheckedSend) {
      for (let index in this.dataCustomers) {
        let phone = this.dataCustomers[index].PHONE;
        const indexId: number = this.arrIdCheckedSend.indexOf(phone);
        if (indexId === -1) {
          this.arrIdCheckedSend.push(phone);
        }
      }
    } else {
      this.arrIdCheckedSend = [];
    }
  }

  checkRowSend(isChecked, phone) {
    const index: number = this.arrIdCheckedSend.indexOf(phone);
    if (index !== -1) {
      if (!isChecked) {
        this.arrIdCheckedSend.splice(index, 1);
      }
    }
    else if (isChecked) {
      this.arrIdCheckedSend.push(phone);
    }
    if (this.arrIdCheckedSend.length == 0) {
      this.isCheckedSend = false;
    }
  }
  //#endregion

  //#region gửi tùy chọn
  showConfirmSendSmsTuyChon() {
    this.confirmSendSmsTuyChonModal.show();
  }

  public async sendMessageTuyChon() {
    if (this.arrIdCheckedSend.length == 0) {
      this.notificationService.displayWarnMessage("Không có khách hàng nào được chọn!");
      this.confirmSendSmsTuyChonModal.hide();
      return;
    }

    this.listContentSMS = [];
    let accountID = this.selectedAccountID.length > 0 ? this.selectedAccountID[0].id : "";
    let senderName = this.selectedSenderName.length > 0 ? this.selectedSenderName[0].itemName : "";
    let dataType = this.selectedSmsType.length > 0 ? this.selectedSmsType[0].id : "";
    let CODE_NAME = this.campaignName.nativeElement.value;
    let timeNow = new Date();
    let scheduleTime = this.utilityService.formatDateToString(timeNow, "yyyyMMddHHmmss");

    //#region check valid
    if (accountID == "") {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-21"));
      this.confirmSendSmsTuyChonModal.hide();
      return;
    }
    if (senderName == "") {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-22"));
      this.confirmSendSmsTuyChonModal.hide();
      return;
    }

    if (dataType == "") {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-90"));
      this.confirmSendSmsTuyChonModal.hide();
      return;
    }

    if (CODE_NAME == "" || CODE_NAME == null || CODE_NAME == undefined) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-23"));
      this.campaignName.nativeElement.focus();
      this.confirmSendSmsTuyChonModal.hide();
      return;
    }
    //#endregion

    //#region hen gio gui
    let is_schedule = 0;
    if (this.isHenGio == true) {
      is_schedule = 1;
      let time = this.henGio.nativeElement.value;
      if (time == null || time == "Invalid date" || time == "") {
        this.notificationService.displayWarnMessage("Input schedule time!");
        this.henGio.nativeElement.focus();
        return;
      }
      else {
        scheduleTime = this.utilityService.formatDateToString(time, "yyyyMMddHHmmss");
      }
    }
    //#endregion

    for (let i in this.dataCustomers) {
      if (this.arrIdCheckedSend.includes(this.dataCustomers[i].PHONE)) {
        let noi_dung = this.fillNoiDung[i].NOI_DUNG;
        this.fillNoiDung.push({ NOI_DUNG: noi_dung });
        let phone = this.dataCustomers[i].PHONE;

        if (noi_dung != "" && phone != "") {
          this.listContentSMS.push({
            PHONE: phone, SMS_CONTENT: noi_dung, SENDER_NAME: senderName, SCHEDULE_TIME: scheduleTime,
            ORDER_NAME: this.campaignName.nativeElement.value, ACCOUNT_ID: accountID, SMS_TYPE: dataType,
            IS_VIRTUAL: this.isSendVirtual ? 1 : 0, REPORT_BY_EMAIL: this.isReportByEmail ? 1 : 0,
            SMS_TEMPLATE: this.nhapNoiDung != undefined ? this.nhapNoiDung : "",
            STATUS: (is_schedule == 0 && dataType == "CSKH") ? 2 : 0,
            CODE_NAME: this.campaignName.nativeElement.value,
            SENDER_ID: this.selectedSenderName[0].id
          });
        }
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
    let insertSms = await this.dataService.postAsync('/api/sms/InsertListSMS?isSchedule=' + is_schedule +
      '&sendViettel=' + sendViettel + '&sendVMS=' + sendVMS + '&sendGPC=' + sendGPC + '&sendVNM=' + sendVNM +
      '&sendSfone=' + sendSfone + '&sendGtel=' + sendGtel + '&sendDD=' + sendDD + '&type=3&phoneList=', this.listContentSMS);
    if (insertSms.err_code == 0)
      this.notificationService.displaySuccessMessage(insertSms.err_message);
    else this.notificationService.displayErrorMessage(insertSms.err_message);

    this.confirmSendSmsTuyChonModal.hide();
    this.viewQuyTin(accountID);
    for (let i in this.dataCustomers) {
      this.fillNoiDung[i].NOI_DUNG = "";
    }
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

  //#region pagging 
  changePageSize(size) {
    this.pagination.pageSize = size;
    this.pagination.pageIndex = 1;
    this.getDataImport();

    const timer: ReturnType<typeof setTimeout> = setTimeout(() => {
      this.pagination.pageIndex = 1;
    }, 1);
  }

  pageChanged(event: any): void {
    this.pagination.pageIndex = event.page;
    this.getDataImport();
  }

  public async getDataImport(data?: any) {
    if (this.pagination.pageSize != 'ALL') {
      this.dataImportPaging = [];
      data = (data == null || data == undefined) ? this.dataCustomers : data;
      this.pagination.totalRow = data.length;
      this.pagination.totalPage = this.utilityService.formatNumberTotalPage(this.pagination.totalRow / this.pagination.pageSize);
      let beginItem: number = (this.pagination.pageIndex - 1) * this.pagination.pageSize;
      let dataPaging: any = [];
      for (let index in data) {
        if (Number(index) >= beginItem && Number(index) < (beginItem + Number(this.pagination.pageSize))) {
          dataPaging.push(data[index]);
        }
      }
      this.dataImportPaging = dataPaging;
    }
    else {
      this.dataImportPaging = this.dataCustomers;
    }
  }
  //#endregion

}
