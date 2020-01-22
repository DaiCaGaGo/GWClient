import { Component, OnInit, ViewChild, DebugElement } from '@angular/core';
import { DataService } from 'src/app/core/services/data.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { Pagination } from 'src/app/core/models/pagination';
import { AuthService } from 'src/app/core/services/auth.service';
import { ModalDirective } from 'ngx-bootstrap';
import { Role } from 'src/app/core/models/role';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sms-customize',
  templateUrl: './sms-customize.component.html',
  styleUrls: ['./sms-customize.component.css']
})
export class SmsCustomizeComponent implements OnInit {
  @ViewChild('importExcel', { static: false }) public importExcel;
  @ViewChild('contentSMS', { static: false }) public contentSMS;
  @ViewChild('henGio', { static: false }) public henGio;
  @ViewChild('campaignName', { static: false }) public campaignName;
  @ViewChild('confirmSendSmsModal', { static: false }) public confirmSendSmsModal: ModalDirective;
  @ViewChild('confirmSendSmsContinuousModal', { static: false }) public confirmSendSmsContinuousModal: ModalDirective;
  @ViewChild('messageSendSmsModal', { static: false }) public messageSendSmsModal: ModalDirective;

  public listHeaderFile = [];
  public listDataFile;
  public isShowTable = false;
  public nhapNoiDung: string = "";
  public fillNoiDung = [];
  public listContentSMS: any = [];
  public dataImportExcelPaging = [];
  public minDate: Date = new Date();

  public isShowDateTime = false;
  public isHenGio = false;
  public isShowSendSms = false;

  public viewQuyTinCSKH = 0;
  public viewQuyTinQC = 0;

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
  public isSendVirtual: Boolean = false;
  public isReportByEmail: Boolean = false;

  public paginationImport: Pagination = new Pagination();

  public settingsFilterAccount = {};
  public dataAccount = [];
  public selectedAccountID = [];

  public selectedSenderName = [];
  public dataSender = [];
  public settingsFilterSender = {};

  public selectedSmsType = [];
  public dataSmsType = [];
  public settingsFilterSmsType = {};

  public settingsFilterPhoneList = {};
  public selectedPhoneList = [];
  public dataPhoneList = [];

  public numberChar: string = '0';
  public numberSMS: string = '0';
  public role: Role = new Role();
  public loading: boolean = false;

  public messageSendSms = "";

  constructor(private dataService: DataService,
    private notificationService: NotificationService,
    private utilityService: UtilityService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService) {
    this.minDate.setDate(this.minDate.getDate());

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

    this.settingsFilterPhoneList = {
      text: this.utilityService.translate("global.choose_phone_list"),
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
    this.bindDataPhoneList();
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
      let listAccount: any = await this.dataService.getAsync('/api/account');
      for (let index in listAccount.data) {
        this.dataAccount.push({ "id": listAccount.data[index].ACCOUNT_ID, "itemName": listAccount.data[index].USER_NAME });
      }
    }
    else {
      let listAccount = await this.dataService.getAsync('/api/account/GetLisAccountParentAndChild?account_id=' +
        this.authService.currentUserValue.ACCOUNT_ID);
      for (let index in listAccount.data) {
        this.dataAccount.push({ "id": listAccount.data[index].ACCOUNT_ID, "itemName": listAccount.data[index].USER_NAME });
      }
    }

    if (this.dataAccount.length > 0) {
      this.selectedAccountID.push({ "id": this.dataAccount[0].id, "itemName": this.dataAccount[0].itemName });
      this.viewQuyTin(this.selectedAccountID[0].id);
      if (this.selectedAccountID.length > 0 && this.selectedSmsType.length > 0) {
        this.bindDataSender(this.selectedAccountID[0].id, this.selectedSmsType[0].id);
      }
    }
    else
      this.selectedAccountID.push({ "id": 0, "itemName": this.utilityService.translate("global.choose_account") });
  }

  onItemSelect() {
    if (this.selectedAccountID.length > 0 && this.selectedSmsType.length > 0) {
      this.bindDataSender(this.selectedAccountID[0].id, this.selectedSmsType[0].id);
    }
    this.bindDataPhoneList();
    this.viewQuyTin(this.selectedAccountID[0].id);
  }

  OnItemDeSelect() {
    this.bindDataPhoneList();
    this.dataSender = []
    this.viewQuyTinCSKH = 0;
    this.viewQuyTinQC = 0;
  }
  //#endregion

  //#region load data sms type
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
    else this.dataSender = [];
  }

  onItemSelectSmsType() {
    if (this.selectedAccountID.length > 0 && this.selectedSmsType.length > 0) {
      this.bindDataSender(this.selectedAccountID[0].id, this.selectedSmsType[0].id);
    }
    else this.dataSender = [];
  }
  //#endregion

  //#region load dataSender
  public async bindDataSender(accountID, smsType) {
    this.selectedSenderName = [];
    this.dataSender = [];
    if (accountID > 0 && smsType != "") {
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

  //#region load list phone
  public async bindDataPhoneList() {
    this.dataPhoneList = [];
    this.selectedPhoneList = [];
    if (this.selectedAccountID.length > 0) {
      let response: any = await this.dataService.getAsync('/api/AccountPhoneList/GetPhoneListByAccountAndType?accountID=' +
        this.selectedAccountID[0].id + '&listType=Customize');
      for (let index in response.data) {
        this.dataPhoneList.push({ "id": response.data[index].ID, "itemName": response.data[index].LIST_NAME });
      }
    }
  }
  //#endregion

  //#region upload file
  public async Upload() {

    if (this.selectedAccountID.length == 0) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-21"));
      return;
    }

    this.listHeaderFile = [];
    this.listDataFile = [];
    this.dataImportExcelPaging = []

    let campaignTitle = this.campaignName.nativeElement.value;
    if (campaignTitle == "" || campaignTitle == null || campaignTitle == undefined) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-23"));
      this.campaignName.nativeElement.focus();
      this.importExcel.nativeElement.value = "";
      return;
    }

    let file = this.importExcel.nativeElement;
    if (file.files.length > 0) {
      let response: any = await this.dataService.importExcelAndSaveAsync(null, file.files, 2, this.campaignName.nativeElement.value,
        this.selectedAccountID[0].id, this.selectedAccountID[0].itemName)
        debugger
      if (response.err_code == 0) {
        let result = response.data;
        this.listHeaderFile = result.arr_fields;
        let listTelco = result.telco;

        if (this.listHeaderFile.length > 0 && this.listHeaderFile[0] == "PHONE") {
          this.isShowTable = true;
          this.isShowSendSms = true;
          this.listDataFile = result.data;
          this.countTotal = listTelco[0];
          this.countVTL = listTelco[1];
          this.countGPC = listTelco[2];
          this.countVMS = listTelco[3];
          this.countVNM = listTelco[4];
          this.countGTEL = listTelco[5];
          this.countSFONE = listTelco[6];
          this.countDDMBLE = listTelco[7];

          this.fillNoiDung = [];
          for (let i = 0; i < this.listDataFile.length; i++) {
            this.fillNoiDung.push({ NOI_DUNG: "" });
          }

          this.getDataImport(this.listDataFile);
          this.notificationService.displaySuccessMessage("Import file excel thành công");
        }
        else {
          this.notificationService.displayErrorMessage("File phải có cột đầu tiên là \'PHONE\'");
          this.importExcel.nativeElement.value = "";
          return;
        }
      }
      else {
        this.notificationService.displayErrorMessage("Có lỗi xảy ra!");
        this.importExcel.nativeElement.value = "";
        return;
      }
    }
  }
  //#endregion

  //#region change send by telco
  onCheckSend(telco, isChecked) {
    if (telco == 'VIETTEL') {
      if (isChecked) this.isCheckSendVTL = true
      else this.isCheckSendVTL = false
    }
    if (telco == 'GPC') {
      if (isChecked) this.isCheckSendGPC = true
      else this.isCheckSendGPC = false
    }
    if (telco == 'VMS') {
      if (isChecked) this.isCheckSendVMS = true
      else this.isCheckSendVMS = false
    }
    if (telco == 'VNM') {
      if (isChecked) this.isCheckSendVNM = true
      else this.isCheckSendVNM = false
    }
    if (telco == 'GTEL') {
      if (isChecked) this.isCheckSendGTEL = true
      else this.isCheckSendGTEL = false
    }
    if (telco == 'SFONE') {
      if (isChecked) this.isCheckSendSFONE = true
      else this.isCheckSendSFONE = false
    }
    this.choosePhoneList()
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

  //#region tao noi dung tin nhan
  public async createContent(content) {
    let contentAfter = content;
    this.fillNoiDung = [];

    let smsType = "";
    if (this.selectedSmsType.length > 0) smsType = this.selectedSmsType[0].id;
    else {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-90"));
      return;
    }

    for (let i = 0; i < this.listDataFile.length; i++) {
      this.fillNoiDung.push({ NOI_DUNG: '' });
    }
    for (let i = 0; i < this.listDataFile.length; i++) {
      for (let k = 0; k <= this.listHeaderFile.length; k++) {
        let value = this.listDataFile[i][this.listHeaderFile[k]];
        if (value == null || value == "" || value == undefined) value = "";
        content = content.replace('[cot' + (k + 1) + ']', value);
      }
      this.fillNoiDung[i].NOI_DUNG = content.trim();
      content = contentAfter;
    }
  }

  getCot(index) {
    // var startPos = this.contentSMS.nativeElement.selectionStart;//get cursor position
    this.contentSMS.nativeElement.focus();
    let startString = this.contentSMS.nativeElement.value.substr(0, this.contentSMS.nativeElement.selectionStart);
    let endString = this.contentSMS.nativeElement.value.substr(this.contentSMS.nativeElement.selectionStart, this.contentSMS.nativeElement.value.length);
    this.nhapNoiDung = startString.trim() + " [cot" + index + "] " + endString.trim();
    this.contentSMS.nativeElement.focus();
  }
  //#endregion

  //#region send sms
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

  showConfirmSendSms() {
    this.loading = false;
    this.confirmSendSmsModal.show();
  }

  public async sendMessage1() {
    this.loading = true;
    this.listContentSMS = [];
    let senderName = "";
    if (this.selectedSenderName.length > 0) {
      senderName = this.selectedSenderName[0].itemName;
    }
    let dataType = "";
    if (this.selectedSmsType.length > 0) dataType = this.selectedSmsType[0].id;
    else {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-90"));
      this.confirmSendSmsModal.hide();
      return;
    }
    let timeNow = new Date();
    let scheduleTime = this.utilityService.formatDateToString(timeNow, "yyyyMMddHHmmss");

    let CODE_NAME = this.campaignName.nativeElement.value;
    if (CODE_NAME == "" || CODE_NAME == null || CODE_NAME == undefined) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-23"));
      this.campaignName.nativeElement.focus();
      this.confirmSendSmsModal.hide();
      return;
    }

    //#region hen gio gui
    let is_schedule = 0;
    if (this.isHenGio == true) {
      is_schedule = 1;
      let time = this.henGio.nativeElement.value;
      if (time == null || time == "Invalid date" || time == "") {
        this.notificationService.displayWarnMessage("Input schedule time!");
        this.henGio.nativeElement.focus();
        this.confirmSendSmsModal.hide();
        return;
      }
      else {
        scheduleTime = this.utilityService.formatDateToString(time, "yyyyMMddHHmmss");
      }
    }
    //#endregion

    //#region check valid
    if (this.selectedAccountID.length == 0) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-21"));
      this.confirmSendSmsModal.hide();
      return;
    }
    let accountID = this.selectedAccountID[0].id;

    if (senderName == null || senderName == "") {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-44"));
      this.confirmSendSmsModal.hide();
      return;
    }
    //#endregion

    for (let i = 0; i < this.listDataFile.length; i++) {
      let noi_dung = this.fillNoiDung[i].NOI_DUNG;
      this.fillNoiDung.push({ NOI_DUNG: noi_dung });
      let phone = this.listDataFile[i][this.listHeaderFile[0]];
      if (noi_dung != "" && phone != "") {
        this.listContentSMS.push({
          PHONE: phone, SMS_CONTENT: noi_dung, SENDER_NAME: senderName, SCHEDULE_TIME: scheduleTime,
          ORDER_NAME: this.campaignName.nativeElement.value, ACCOUNT_ID: accountID, SMS_TYPE: dataType,
          IS_VIRTUAL: this.isSendVirtual ? 1 : 0, REPORT_BY_EMAIL: this.isReportByEmail ? 1 : 0,
          SMS_TEMPLATE: this.nhapNoiDung != undefined ? this.nhapNoiDung : "",
          STATUS: (is_schedule == 0 && dataType == "CSKH") ? 2 : 0,
          CODE_NAME: this.campaignName.nativeElement.value,
          SENDER_ID: this.selectedSenderName[0].id,
          TELCO: this.listDataFile[i]["TELCO"]
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
      '&sendSfone=' + sendSfone + '&sendGtel=' + sendGtel + '&sendDD=' + sendDD, this.listContentSMS);
    this.messageSendSms = insertSms.err_message;

    this.loading = false;
    this.confirmSendSmsModal.hide();
    this.messageSendSmsModal.show();
    this.viewQuyTin(accountID);
  }

  public async sendMessage() {
    this.loading = true;
    this.listContentSMS = [];
    let senderName = "";
    if (this.selectedSenderName.length > 0) {
      senderName = this.selectedSenderName[0].itemName;
    }
    let dataType = "";
    if (this.selectedSmsType.length > 0) dataType = this.selectedSmsType[0].id;
    else {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-90"));
      this.confirmSendSmsModal.hide();
      return;
    }
    let timeNow = new Date();
    let scheduleTime = this.utilityService.formatDateToString(timeNow, "yyyyMMddHHmmss");

    let CODE_NAME = this.campaignName.nativeElement.value;
    if (CODE_NAME == "" || CODE_NAME == null || CODE_NAME == undefined) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-23"));
      this.campaignName.nativeElement.focus();
      this.confirmSendSmsModal.hide();
      return;
    }

    //#region hen gio gui
    let is_schedule = 0;
    if (this.isHenGio == true) {
      is_schedule = 1;
      let time = this.henGio.nativeElement.value;
      if (time == null || time == "Invalid date" || time == "") {
        this.notificationService.displayWarnMessage("Input schedule time!");
        this.henGio.nativeElement.focus();
        this.confirmSendSmsModal.hide();
        return;
      }
      else {
        scheduleTime = this.utilityService.formatDateToString(time, "yyyyMMddHHmmss");
      }
    }
    //#endregion

    //#region check valid
    if (this.selectedAccountID.length == 0) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-21"));
      this.confirmSendSmsModal.hide();
      return;
    }
    let accountID = this.selectedAccountID[0].id;

    if (senderName == null || senderName == "") {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-44"));
      this.confirmSendSmsModal.hide();
      return;
    }
    //#endregion

    for (let i = 0; i < this.listDataFile.length; i++) {
      let noi_dung = this.fillNoiDung[i].NOI_DUNG;
      this.fillNoiDung.push({ NOI_DUNG: noi_dung });
      let phone = this.listDataFile[i][this.listHeaderFile[0]];
      if (noi_dung != "" && phone != "") {
        this.listContentSMS.push({
          PHONE: phone, SMS_CONTENT: noi_dung, SENDER_NAME: senderName, SCHEDULE_TIME: scheduleTime,
          ORDER_NAME: this.campaignName.nativeElement.value, ACCOUNT_ID: accountID, SMS_TYPE: dataType,
          IS_VIRTUAL: this.isSendVirtual ? 1 : 0, REPORT_BY_EMAIL: this.isReportByEmail ? 1 : 0,
          SMS_TEMPLATE: this.nhapNoiDung != undefined ? this.nhapNoiDung : "",
          STATUS: (is_schedule == 0 && dataType == "CSKH") ? 2 : 0,
          CODE_NAME: this.campaignName.nativeElement.value,
          SENDER_ID: this.selectedSenderName[0].id,
          TELCO: this.listDataFile[i]["TELCO"]
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
    let insertSms = await this.dataService.postAsync('/api/SmsHistory/InsertListSMSHistory?isSchedule=' + is_schedule +
      '&sendViettel=' + sendViettel + '&sendVMS=' + sendVMS + '&sendGPC=' + sendGPC + '&sendVNM=' + sendVNM +
      '&sendSfone=' + sendSfone + '&sendGtel=' + sendGtel + '&sendDD=' + sendDD, this.listContentSMS);
    this.messageSendSms = insertSms.err_message;
    this.loading = false;
    this.confirmSendSmsModal.hide();
    this.messageSendSmsModal.show();
    this.viewQuyTin(accountID);
  }

  showConfirmSendContinous() {
    this.messageSendSmsModal.hide();
    this.confirmLeavePage();
  }

  confirmLeavePage() {
    this.confirmSendSmsContinuousModal.show();
  }


  sendMessageContinuous() {
    this.confirmSendSmsContinuousModal.hide();
    this.listHeaderFile = [];
    this.listDataFile = [];
    this.fillNoiDung = [];
    this.getDataImport();
    this.countVTL = 0;
    this.countGPC = 0;
    this.countVMS = 0;
    this.countVNM = 0;
    this.countGTEL = 0;
    this.countSFONE = 0;
    this.countDDMBLE = 0;
    this.countTotal = 0;
    this.campaignName.nativeElement.value = "";
    this.importExcel.nativeElement.value = "";
    this.contentSMS.nativeElement.value = "";
  }

  //#endregion

  async exportExcelTemplate() {
    let result: boolean = await this.dataService.getFileExtentionAsync("/api/FileExtention/ExportExcelTemplate", "SmsCustomize", "Template_SMS_Customize.xlsx");
    if (result) {
      this.notificationService.displaySuccessMessage("Xuất template thành công");
    }
    else {
      this.notificationService.displayErrorMessage("Xuất template lỗi");
    }
  }

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

  getDataImport(data?: any) {
    if (this.paginationImport.pageSize != 'ALL') {
      this.dataImportExcelPaging = [];
      data = (data == null) ? this.listDataFile : data;
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
      this.dataImportExcelPaging = this.listDataFile;
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

  public async exportPhoneList() {
    if (this.selectedPhoneList.length > 0) {
      let result: boolean = await this.dataService.getFileExtentionSmsCustomizeAsync("/api/FileExtention/ExportExcelSmsCustomize",
        this.selectedPhoneList[0].id, this.selectedPhoneList[0].itemName);
      if (result) {
        this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("120"));
      }
      else {
        this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("125"));
      }
    }
    else this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("125"));
  }

  public async choosePhoneList() {
    this.listHeaderFile = [];
    this.listDataFile = [];
    this.dataImportExcelPaging = []
    this.fillNoiDung = [];
    if (this.selectedPhoneList.length > 0) {

      let listTelco = ""
      if (this.isCheckSendVTL) listTelco += "VIETTEL,"
      if (this.isCheckSendGPC) listTelco += "GPC,"
      if (this.isCheckSendVMS) listTelco += "VMS,"
      if (this.isCheckSendVNM) listTelco += "VNM,"
      if (this.isCheckSendGTEL) listTelco += "GTEL,"
      if (this.isCheckSendSFONE) listTelco += "SFONE,"

      if (listTelco != "") listTelco = listTelco.substring(0, listTelco.length - 1)
      let response: any = await this.dataService.getAsync('/api/AccountPhoneListDetail/GetPhoneListByListID?listID=' +
        this.selectedPhoneList[0].id + '&listTelco=' + listTelco)
      if (response.err_code == 0) {

        this.isShowTable = true;
        this.isShowSendSms = true;
        this.listHeaderFile.push("PHONE");
        this.listHeaderFile.push("TELCO");

        let dataPhone = response.data
        this.listDataFile = dataPhone.listPhoneTelco

        this.countTotal = dataPhone.countTotal
        this.countVTL = dataPhone.countVIETTEL
        this.countGPC = dataPhone.countGPC
        this.countVMS = dataPhone.countVMS
        this.countVNM = dataPhone.countVNM
        this.countGTEL = dataPhone.countGTEL
        this.countSFONE = dataPhone.countSFONE
        this.countDDMBLE = dataPhone.countDDMBLE
        this.fillNoiDung = dataPhone.CONTENT;

        this.getDataImport(this.listDataFile);
      }
    }
  }
}
