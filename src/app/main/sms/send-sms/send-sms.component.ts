import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from 'src/app/core/services/data.service';
import { BsModalService, ModalDirective } from 'ngx-bootstrap';
import { NotificationService } from 'src/app/core/services/notification.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { Pagination } from 'src/app/core/models/pagination';
import { UtilityService } from 'src/app/core/services/utility.service';
import { Role } from 'src/app/core/models/role';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-send-sms',
  templateUrl: './send-sms.component.html',
  styleUrls: ['./send-sms.component.css']
})
export class SendSMSComponent implements OnInit {

  @ViewChild('confirmDeleteModal', { static: false }) public confirmDeleteModal: ModalDirective;
  @ViewChild('showSMSTemplateModal', { static: false }) public showSMSTemplateModal: ModalDirective;
  @ViewChild('uploadFile', { static: false }) public uploadFile;
  @ViewChild('uploadExcelModal', { static: false }) public uploadExcelModal;
  @ViewChild('confirmSendSMSModal', { static: false }) public confirmSendSMSModal;
  @ViewChild('confirmAfterSuccessModal', { static: false }) public confirmAfterSuccessModal;
  @ViewChild('confirmDeleteMultiModal', { static: false }) public confirmDeleteMultiModal: ModalDirective;

  public dataPhone = [];
  public dataPhoneTamp = [];
  public dataPhoneList = [];
  public dataAccount = [];
  public dataSenderName = [];
  public dataSMSTemp;
  public dataPartner = [];
  public settingsFilterAccount = {};
  public settingsFilterSender = {};
  public settingsFilterPhoneList = {};
  public selectedItemComboboxAccount = [];
  public selectedItemComboboxSender = [];
  public selectedItemComboboxPhoneList = [];
  public lstIdsAccountPhoneList = [];
  public lstChecked = [];
  public lstNameChecked: string = '';
  public listSMSCampaign = [];
  public isCheckedDelete: boolean = false;
  public arrIdCheckedDelete: string[] = [];
  public arrIdDelete: string[] = [];
  public arrListFile: string[] = [];
  public idPhone;
  public lstId;
  public phone;
  public isShowDateTime;
  public isShowByType = false;
  public lstFileName: string = '';
  public smsContent: string = '';
  public phoneList: string = '';
  public accountId: string = '';
  public numberChar: string = '0';
  public numberSMS: string = '0';

  public numberPhone = 0;
  public countAll: string = '0';
  public countVTL: string = '0';
  public countGPC: string = '0';
  public countVMS: string = '0';
  public countVNM: string = '0';
  public countGtel: string = '0';
  public countSFone: string = '0';
  public moveCampaign: string = '0';
  //public countDDMobile: string = '0';
  public minDate: Date;
  public pagination: Pagination = new Pagination();
  public inAccount: string = '';

  public lstName: string = '';
  public isVirtual: boolean;
  public reportByMail: boolean;
  public timeSchedule: Date;
  public codeName: string = '';
  public isCheckSendVTL = true;
  public isCheckSendGPC = true;
  public isCheckSendVMS = true;
  public isCheckSendVNM = true;
  public isCheckSendGTEL = true;
  public isCheckSendSFONE = true;
  public headerVTL: string = '';
  public headerGPC: string = '';
  public headerVMS: string = '';
  public footerVTL: string = '';
  public footerGPC: string = '';
  public footerVMS: string = '';

  public selectedSmsType = [];
  public dataSmsType = [];
  public settingsFilterSmsType = {};

  public viewQuyTinCSKH = 0;
  public viewQuyTinQC = 0;
  public role: Role = new Role();
  public loading: boolean = false;

  constructor(private dataService: DataService,
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

    this.settingsFilterPhoneList = {
      text: this.utilityService.translate("global.choose_phone_list"),
      singleSelection: false,
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

    this.minDate = new Date();
    this.minDate.setDate(this.minDate.getDate());
  }
  ngOnInit() {
    this.getDataAccount();
    this.bindDataSmsType();
  }

  //#region view quy tin
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

  //#region load and change phone list
  public async bindDataPhoneList() {
    this.dataPhoneList = [];
    this.selectedItemComboboxPhoneList = [];
    if (this.selectedItemComboboxAccount.length > 0) {
      let accountId = this.selectedItemComboboxAccount[0].id != null && this.selectedItemComboboxAccount[0].id != "" ?
        this.selectedItemComboboxAccount[0].id : this.accountId;
      let response: any = await this.dataService.getAsync('/api/AccountPhoneList/GetPhoneListByAccountAndType?accountID=' +
        accountId + '&listType=Normal');
      for (let index in response.data) {
        this.dataPhoneList.push({ "id": response.data[index].ID, "itemName": response.data[index].LIST_NAME });
      }
    }
  }

  async getPhoneNumber(event) {
    this.dataPhoneTamp = [];
    this.dataPhone = [];
    let lstName = [];
    if (!this.lstChecked.includes(event.id)){
      this.lstChecked.push(event.id);
      lstName.push(event.itemName);
    }
    else {
      let index = this.lstChecked.indexOf(event.id);
      if (index != -1)
        this.lstChecked.splice(index, 1);
    }
    let ids = this.lstChecked.join(",");
    this.lstNameChecked = lstName.join(",");
    if (ids != "") {
      this.lstIdsAccountPhoneList = [];
      this.lstIdsAccountPhoneList.push(ids);
    }

    let listTelco = ""
    if (this.isCheckSendVTL) listTelco += "VIETTEL,"
    if (this.isCheckSendGPC) listTelco += "GPC,"
    if (this.isCheckSendVMS) listTelco += "VMS,"
    if (this.isCheckSendVNM) listTelco += "VNM,"
    if (this.isCheckSendGTEL) listTelco += "GTEL,"
    if (this.isCheckSendSFONE) listTelco += "SFONE,"

    if (listTelco != "") listTelco = listTelco.substring(0, listTelco.length - 1)
    let response: any = await this.dataService.getAsync('/api/AccountPhoneListDetail/GetPhoneByListID?listID=' + ids + '&listTelco=' + listTelco)
    if (response) {

      let data = response.data;
      this.dataPhone = data.listPhoneTelco
      this.dataPhoneTamp = data.listPhoneTelco
      this.countAll = data.countTotal
      this.countVTL = data.countVIETTEL
      this.countGPC = data.countGPC
      this.countVMS = data.countVMS
      this.countVNM = data.countVNM
      this.countGtel = data.countGTEL
      this.countSFone = data.countSFONE
      this.getDataPaging(this.dataPhone);
    }
  }
  //#endregion

  //#region load data account
  async getDataAccount() {
    let result = await this.dataService.getAsync('/api/account/GetInfoAccountLogin');
    let is_admin = result.data[0].IS_ADMIN;
    if (is_admin != null && is_admin == 1) {
      this.selectedItemComboboxAccount = [{ "id": 0, "itemName": this.utilityService.translate("global.choose_account") }];
      let response: any = await this.dataService.getAsync('/api/account')
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
        this.selectedItemComboboxAccount.push({ "id": this.dataAccount[0].id, "itemName": this.dataAccount[0].itemName });
        this.bindDataPhoneList();
        this.viewQuyTin(this.selectedItemComboboxAccount[0].id);
      }
      else
        this.selectedItemComboboxAccount.push({ "id": 0, "itemName": this.utilityService.translate("global.choose_account") });
    }
    if (this.selectedItemComboboxAccount.length > 0 && this.selectedSmsType.length > 0) {
      this.getDataSenderName(this.selectedItemComboboxAccount[0].id, this.selectedSmsType[0].id);
    }
  }

  changeAccount() {
    if (this.selectedItemComboboxAccount.length > 0 && this.selectedSmsType.length > 0) {
      this.getDataSenderName(this.selectedItemComboboxAccount[0].id, this.selectedSmsType[0].id);
    }
    else this.dataSenderName = [];
    this.bindDataPhoneList();
    this.viewQuyTin(this.selectedItemComboboxAccount[0].id);
  }

  deSelectAccount() {
    this.selectedItemComboboxSender = [];
    this.dataSenderName = [];
    this.bindDataPhoneList();
    this.viewQuyTinCSKH = 0;
    this.viewQuyTinQC = 0;
  }
  //#endregion

  async getDataSenderName(accountID, smsType) {
    this.selectedItemComboboxSender = [];
    this.dataSenderName = [];
    if (accountID > 0 && smsType != "") {
      let response: any = await this.dataService.getAsync('/api/SenderName/GetSenderByAccountAndType?accountID=' +
        accountID + "&smsType=" + smsType)
      for (let index in response.data) {
        this.dataSenderName.push({ "id": response.data[index].ID, "itemName": response.data[index].NAME });
      }
      if (this.dataSenderName.length == 1)
        this.selectedItemComboboxSender.push({ "id": this.dataSenderName[0].id, "itemName": this.dataSenderName[0].itemName });
    }
  }

  async getDataSMSTemp() {
    this.dataSMSTemp = []
    if (this.selectedItemComboboxSender.length > 0) {
      let response: any = await this.dataService.getAsync('/api/smstemplate/GetSmsTempBySender?senderID=' + this.selectedItemComboboxSender[0].id)
      if (response)
        this.dataSMSTemp = response.data;
    }
    else this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("-44"));
  }

  //#region load data grid
  loadData(response?: any) {
    if (response) {
      this.dataPhone = response.data;
      if ('pagination' in response) {
        this.pagination.pageSize = response.pagination.PageSize;
        this.pagination.totalRow = response.pagination.TotalRows;
      }
    }
  }

  pageChanged(event: any): void {
    this.pagination.pageIndex = event.page;
    this.getDataPaging();
  }

  changePageSize(size) {
    this.pagination.pageSize = size;
    this.pagination.pageIndex = 1;
    this.getDataPaging();
  }
  //#endregion

  //#region load sms type
  public async bindDataSmsType() {
    let response: any = await this.dataService.getAsync('/api/sysvar/GetSysvarByGroup?var_group=SMS_TYPE');
    for (let i in response.data) {
      this.dataSmsType.push({ "id": response.data[i].VAR_VALUE, "itemName": response.data[i].VAR_NAME });
    }
    if (this.dataSmsType.length > 0) {
      this.selectedSmsType.push({ "id": this.dataSmsType[0].id, "itemName": this.dataSmsType[0].itemName });
      if (this.selectedSmsType[0].id == "CSKH") this.isShowByType = false;
      else this.isShowByType = true;
    }
    if (this.selectedItemComboboxAccount.length > 0 && this.selectedSmsType.length > 0) {
      this.getDataSenderName(this.selectedItemComboboxAccount[0].id, this.selectedSmsType[0].id);
    }
  }
  onItemSelectSmsType() {
    if (this.selectedSmsType[0].id == "CSKH") this.isShowByType = false;
    else this.isShowByType = true;
    if (this.selectedItemComboboxAccount.length > 0 && this.selectedSmsType.length > 0) {
      this.getDataSenderName(this.selectedItemComboboxAccount[0].id, this.selectedSmsType[0].id);
    }
    else this.dataSenderName = [];
  }

  OnItemDeSelectSmsType() {
    this.isShowByType = false;
    this.dataSenderName = [];
  }
  //#endregion

  // show modal delete
  showConfirmDelete(list_id, phone) {
    this.lstId = list_id;
    this.phone = phone;
    this.confirmDeleteModal.show();
  }

  // delete account phone list detail by list id
  async confirmDelete(lstId, phone) {
    let response: any = await this.dataService.deleteAsync('/api/accountphonelistdetail/DeletePhone?lstId=' + lstId + '&phone=' + phone)
    if (response.err_code == 0) {
      this.loadData(response);
      this.confirmDeleteModal.hide();
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("200"));
    }
    else if (response.err_code == 103) {
      this.dataPhoneTamp.forEach((item, index) => {
        if (item.PHONE == phone) {
          this.dataPhoneTamp.splice(index, 1);
          this.loadData(response);
          this.confirmDeleteModal.hide();
          this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("200"));
        }
      });
    }
    else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
    }
  }

  CalcNumber(telco, checked) {
    if (telco == 'VIETTEL') {
      if (!checked) this.isCheckSendVTL = false
      else this.isCheckSendVTL = true
    }
    if (telco == 'GPC') {
      if (!checked) this.isCheckSendGPC = false
      else this.isCheckSendGPC = true
    }
    if (telco == 'VMS') {
      if (!checked) this.isCheckSendVMS = false
      else this.isCheckSendVMS = true
    }
    if (telco == 'VNM') {
      if (!checked) this.isCheckSendVNM = false
      else this.isCheckSendVNM = true
    }
    if (telco == 'GTEL') {
      if (!checked) this.isCheckSendGTEL = false
      else this.isCheckSendGTEL = true
    }
    if (telco == 'SFONE') {
      if (!checked) this.isCheckSendSFONE = false
      else this.isCheckSendSFONE = true
    }
    this.getPhoneNumber(event)
  }

  getDataPaging(data?: any) {
    if (this.pagination.pageSize != 'ALL') {
      this.dataPhone = [];
      data = (data == null) ? this.dataPhoneTamp : data;
      this.pagination.totalRow = data.length;
      this.pagination.totalPage = this.utilityService.formatNumberTotalPage(this.pagination.totalRow / this.pagination.pageSize);
      let beginItem: number = (this.pagination.pageIndex - 1) * this.pagination.pageSize;
      let dataPaging: any = [];
      for (let index in data) {
        if (Number(index) >= beginItem && Number(index) < (beginItem + Number(this.pagination.pageSize))) {
          dataPaging.push(data[index]);
        }
      }
      this.dataPhone = dataPaging;
    }
    else {
      this.dataPhone = this.dataPhoneTamp
    }
  }

  // export phone number
  async exportPhoneNumber() {
    if (this.lstChecked.length == 0) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("103"));
      return;
    }
    let lstIdPhoneNumber = this.lstChecked.toString();
    let result: boolean = await this.dataService.getFileExtentionPhoneListAsync("/api/FileExtention/ExportExcelPhoneList", lstIdPhoneNumber, "ExportExcelPhoneList");
    if (result) {
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("120"));
    }
    else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("125"));
    }
  }

  // show sms template
  confirmSMSTemplateModal() {
    if (this.selectedItemComboboxSender.length > 0) {
      this.getDataSMSTemp();
      this.showSMSTemplateModal.show();
    }
    else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("-44"));
    }
  }

  // get sms template
  confirmSMSTemp(content) {
    this.smsContent += content;
    this.showSMSTemplateModal.hide();
    this.countSMS(this.smsContent);
  }

  // count mes
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
    else if (lengthsms < 460) {
      this.numberSMS = "3";
    }
    else {
      this.numberSMS = "4";

      if (lengthsms > 612)
        this.smsContent = smsContent.substr(0, 612);
    }
  }

  countPhone(phone) {
    let phoneList: any = [];
    phoneList = this.checkPhone(phone);
    if (phoneList.length == 0)
      this.numberPhone = 0;
    else if (phoneList.includes(";"))
      this.numberPhone = phoneList.split(';').length - 1;
    else
      this.numberPhone = 1;
  }

  // count phone
  checkPhone(phone) {
    let phoneSplit: any = [];
    let temp = "";
    phoneSplit = phone.split(';');
    for (let i in phoneSplit) {
      let phoneNew = this.utilityService.FilterPhone(phoneSplit[i].replace(/\s/g, ""));
      if (this.utilityService.getTelco(phoneNew) != "") {
        temp += phoneNew + ";";
      }
    }
    return temp;
  }

  // show modal upload excel
  showModalUpload() {
    this.clearData();
    this.lstName = '';
    let accountId = this.authService.currentUserValue;
    this.accountId = accountId.ACCOUNT_ID;
    this.bindDataPhoneList();
    this.uploadExcelModal.show();
  }

  // upload file
  public async submitUploadFile() {
    this.loading = true;
    if (this.lstName === '' || this.lstName === null || this.lstName === 'undefined') {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-23"));
      this.confirmSendSMSModal.hide();
      this.loading = false;
      return;
    }
    let file = this.uploadFile.nativeElement;
    if (file.files.length > 0) {
      let response: any = await this.dataService.importExcelAndSavePhoneListAsync(null, file.files, 1, this.lstName);
      if (response) {
        if (response == null || response.err_code != 0) {
          this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
          this.loading = false;
          return;
        }
        this.uploadExcelModal.hide();
        this.bindDataPhoneList();
        this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("130"));
      }
      else {
        this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
      }
    }
    this.loading = false;
  }

  clearData() {
    this.uploadFile.nativeElement.value = "";
  }

  checkTimeSchedule(event) {
    if (event) {
      this.isShowDateTime = true;
    }
    else {
      this.isShowDateTime = false;
    }
  }

  //#region  show modal and send sms
  showModalSendSMS() {
    this.loading = false;
    this.confirmSendSMSModal.show();
  }

  async confirmSendSMS() {
    this.loading = true;
    //#region  check valid
    let SMS_TYPE = this.selectedSmsType.length > 0 ? this.selectedSmsType[0].id : "";
    if (SMS_TYPE === '' || SMS_TYPE === null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-20"));
      this.confirmSendSMSModal.hide();
      return;
    }
    let ACCOUNT_ID = this.selectedItemComboboxAccount.length > 0 ? this.selectedItemComboboxAccount[0].id : 0;
    if (ACCOUNT_ID == 0) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-21"));
      this.confirmSendSMSModal.hide();
      return;
    }
    let SENDER_NAME = this.selectedItemComboboxSender.length > 0 ? this.selectedItemComboboxSender[0].itemName : "";
    if (SENDER_NAME == "") {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-22"));
      this.confirmSendSMSModal.hide();
      return;
    }
    let IS_VIRTUAL = this.isVirtual == true ? 1 : 0;
    let CODE_NAME = this.codeName;
    if (CODE_NAME === '' || CODE_NAME === null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-23"));
      this.confirmSendSMSModal.hide();
      return;
    }
    let SMS_TEMPLATE = this.utilityService.removeSign4VietnameseString(this.utilityService.removeDiacritics(this.smsContent));
    if (SMS_TEMPLATE === '' || SMS_TEMPLATE === null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-24"));
      this.confirmSendSMSModal.hide();
      return;
    }
    //#endregion

    let dt = [];
    let is_schedule = 0;
    let time = new Date();
    if (this.isShowDateTime) {
      is_schedule = 1;
      time = this.timeSchedule;
    }
    let TIMESCHEDULE = this.utilityService.formatDateToString(time, "yyyyMMddHHmmss");
    let REPORT_BY_EMAIL = this.reportByMail == true ? 1 : 0;

    // if input phone number then add to listSMS
    if (this.phoneList.length > 0 && this.numberPhone > 0) {
      let phoneSplit = [];
      phoneSplit = this.phoneList.split(';');

      if (phoneSplit != null && phoneSplit.length == 1) {
        let p = this.utilityService.GetPhoneNew(this.utilityService.FilterPhone(phoneSplit[0]));
        let phone = this.dataPhoneTamp.filter(s => p.includes(s.PHONE));
        if (phone == null || phone.length == 0) {
          let telco = this.utilityService.getTelco(p);
          dt.push({ LIST_ID: 0, PHONE: p, TELCO: telco });
        }
      }
      else if (phoneSplit != null && phoneSplit.length > 1) {
        for (let i in phoneSplit) {
          let p = this.utilityService.GetPhoneNew(this.utilityService.FilterPhone(phoneSplit[i]));
          let phone = this.dataPhoneTamp.filter(s => p.includes(s.PHONE));
          if (phone == null || phone.length == 0) {
            let telco = this.utilityService.getTelco(this.utilityService.FilterPhone(phoneSplit[i]));
            dt.push({ LIST_ID: 0, PHONE: p, TELCO: telco });
          }
        }
      }
    }
    for (let i in this.dataPhoneTamp) {
      dt.push(this.dataPhoneTamp[i]);
    }
    // check exists phone list
    if (dt.length == 0) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-25"));
      this.confirmSendSMSModal.hide();
      return;
    }

    let listSmsSend = [];
    for (let i = 0; i < dt.length; i++) {
      let phone = dt[i].PHONE;
      let telco = dt[i].TELCO;
      if (telco != undefined && telco != null && telco != "") {
        listSmsSend.push({
          PHONE: phone, TELCO: telco, SMS_CONTENT: SMS_TEMPLATE, SENDER_NAME: SENDER_NAME, SCHEDULE_TIME: TIMESCHEDULE,
          ORDER_NAME: CODE_NAME, ACCOUNT_ID: ACCOUNT_ID, SMS_TYPE: SMS_TYPE,
          IS_VIRTUAL: IS_VIRTUAL, REPORT_BY_EMAIL: REPORT_BY_EMAIL, SMS_TEMPLATE: SMS_TEMPLATE,
          STATUS: (is_schedule == 0 && SMS_TYPE == "CSKH") ? 2 : 0,
          CODE_NAME: CODE_NAME, SENDER_ID: this.selectedItemComboboxSender[0].id
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
    // if (this.isCheckSendDDMBLE) sendDD = 1;
    let insertSms = await this.dataService.postAsync('/api/sms/InsertListSMS?isSchedule=' + is_schedule +
      '&sendViettel=' + sendViettel + '&sendVMS=' + sendVMS + '&sendGPC=' + sendGPC + '&sendVNM=' + sendVNM +
      '&sendSfone=' + sendSfone + '&sendGtel=' + sendGtel + '&sendDD=' + sendDD + '&type=1&phoneList=' + this.lstNameChecked, listSmsSend);
    if (insertSms.err_code == 0)
      this.notificationService.displaySuccessMessage(insertSms.err_message);
    else this.notificationService.displayErrorMessage(insertSms.err_message);

    this.viewQuyTin(ACCOUNT_ID);
    this.loading = false;
    this.confirmAfterSuccess();
    this.confirmSendSMSModal.hide();
  }
  //#endregion

  // send sms continue
  confirmAfterSuccess() {
    this.confirmAfterSuccessModal.hide();
    this.selectedSmsType = [];
    this.selectedItemComboboxAccount = [];
    this.selectedItemComboboxSender = [];
    this.selectedItemComboboxPhoneList = [];
    this.lstChecked = [];
    this.smsContent = "";
    this.phoneList = "";
    this.codeName = "";
    this.dataPhone = [];
    this.dataPhoneTamp = [];
    this.numberChar = "0";
    this.numberPhone = 0;
    this.numberSMS = "0";
    this.countAll = "0";
    this.countGPC = "0";
    this.countGtel = "0";
    this.countSFone = "0";
    this.countVMS = "0";
    this.countVNM = "0";
    this.countVTL = "0";
  }

  // export template excel
  async excelTemplate() {
    let result: boolean = await this.dataService.getFileExtentionAsync("/api/FileExtention/ExportExcelTemplate", "Sms", "Sample_PhoneList.xlsx");
    if (result) {
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("120"));
    }
    else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("125"));
    }
  }

  // delete
  async confirmDeleteListFile(id) {
    let response: any = await this.dataService.deleteAsync('/api/AccountPhoneList/' + id)
    if (response.err_code == 0) {
      let responseDetail: any = await this.dataService.deleteAsync('/api/AccountPhoneListDetail/DeleteAccountPhoneListDetailByAccountPhoneList?id=' + id)
      if (responseDetail.err_code == 0) {
        this.confirmDeleteMultiModal.hide();
        this.arrIdDelete.push(id);
      }
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("200"));
    }
    else if (response.err_code == 103) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("103"));
    }
    else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
    }
  }

  checkAllDelete(isChecked) {
    this.isCheckedDelete = isChecked;
    if (this.isCheckedDelete) {
      for (let index in this.dataPhoneList) {
        let id = this.dataPhoneList[index].ID;
        let telCode = this.dataPhoneList[index].itemName;
        const indexId: number = this.arrIdCheckedDelete.indexOf(id);
        if (indexId === -1) {
          this.arrIdCheckedDelete.push(id);
          this.arrListFile.push(telCode);
        }
      }
    } else {
      this.arrIdCheckedDelete = [];
      this.arrListFile = [];
    }
  }

  checkRowDelete(isChecked, id, fileName) {
    const index: number = this.arrIdCheckedDelete.indexOf(id);
    if (index !== -1) {
      if (!isChecked) {
        this.arrIdCheckedDelete.splice(index, 1);
        this.arrListFile.splice(index, 1);
      }
    }
    else if (isChecked) {
      this.arrIdCheckedDelete.push(id);
      this.arrListFile.push(fileName);
    }

    if (this.arrIdCheckedDelete.length == 0) {
      this.isCheckedDelete = false;
    }
  }

  confirmDeleteMulti() {
    if (this.arrListFile.length > 0) {
      this.lstFileName = this.arrListFile.join(",");
      this.confirmDeleteMultiModal.show();
    }
  }

  deleteMulti() {
    for (let index in this.arrIdCheckedDelete) {
      this.confirmDeleteListFile(this.arrIdCheckedDelete[index]);
    }
    this.arrIdCheckedDelete = [];
    this.arrListFile = [];
    this.confirmDeleteMultiModal.hide();
  }
}
