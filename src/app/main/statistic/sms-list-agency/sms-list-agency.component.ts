import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { DataService } from 'src/app/core/services/data.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { Pagination } from 'src/app/core/models/pagination';

@Component({
  selector: 'app-sms-list-agency',
  templateUrl: './sms-list-agency.component.html',
  styleUrls: ['./sms-list-agency.component.css']
})
export class SmsListAgencyComponent implements OnInit {

  public dataSms;
  public smsContent: string = "";
  public phone: string = "";

  public fromDate: string = "";
  public toDate: string = "";
  public timeFrom: Date = new Date();
  public timeTo: Date = new Date();

  public isCheckVTL = true;
  public stringVTL = "VIETTEL";
  public isCheckGPC = true;
  public stringGPC = "GPC";
  public isCheckVNM = true;
  public stringVNM = "VNM";
  public isCheckVMS = true;
  public stringVMS = "VMS";
  public isCheckGTEL = true;
  public stringGTEL = "GTEL";
  public isCheckSFONE = true;
  public stringSFONE = "SFONE";
  public isCheckDD = true;
  public stringDD = "DDMBLE";

  public settingsFilterAccount = {};
  public dataAccount = [];
  public selectedAccountID = [];

  public settingsFilterSender = {};
  public dataSender = [];
  public selectedSenderID = [];

  public settingsFilterPartner = {};
  public dataPartner = [];
  public selectedPartnerID = [];

  public selectedSmsType = [];
  public dataSmsType = [];
  public settingsFilterSmsType = {};

  public selectedSmsStatus = [];
  public dataSmsStatus = [];
  public settingsFilterSmsStatus = {};

  public pagination: Pagination = new Pagination();
  public viewSumSms = "";

  public isShowPartner = false;
  public is_root = false;

  constructor(private authService: AuthService,
    private dataService: DataService,
    private utilityService: UtilityService,
    private notificationService: NotificationService) {

    this.settingsFilterAccount = {
      text: "Chọn tài khoản",
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: "Tìm kiếm",
      noDataLabel: "Không có dữ liệu"
    };

    this.settingsFilterSender = {
      text: "Chọn thương hiệu",
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: "Tìm kiếm",
      noDataLabel: "Không có dữ liệu"
    };

    this.settingsFilterPartner = {
      text: "Chọn cổng",
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: "Tìm kiếm",
      noDataLabel: "Không có dữ liệu"
    };

    this.settingsFilterSmsType = {
      text: "Chọn loại tin nhắn",
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: "Tìm kiếm",
      noDataLabel: "Không có dữ liệu"
    };

    this.settingsFilterSmsStatus = {
      text: "Chọn trạng thái",
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: "Tìm kiếm",
      noDataLabel: "Không có dữ liệu"
    };
  }

  ngOnInit() {
    this.getAccountDetail();
    this.bindDataAccount();
    this.bindDataPartner();
    this.bindDataSmsType();
    this.bindDataSmsStatus();
    this.fromDate = this.utilityService.formatDateToString(this.timeFrom, "yyyyMMdd");
    this.toDate = this.utilityService.formatDateToString(this.timeTo, "yyyyMMdd");
  }

  async getAccountDetail (){
    let response = await this.dataService.getAccountDetail();
    let is_admin = response.data[0].IS_ADMIN;
    if (is_admin != null && is_admin == 1){
      this.isShowPartner = true;
      this.is_root = true;
    } 
    else{
      this.isShowPartner = false;
      this.is_root = false;
    } 
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
    this.loadListSenderName();
    this.getListSms();
  }

  onItemSelect() {
    this.loadListSenderName();
    this.getListSms();
  }

  OnItemDeSelect() {
    this.selectedAccountID = [];
    this.loadListSenderName();
    this.getListSms();
  }

  //#endregion

  //#region sender
  async loadListSenderName() {
    this.dataSender = [];
    this.selectedSenderID = [];

    let response = await this.dataService.getAsync('/api/SenderName/GetSenderNameByAccountID?account_id=' +
      (this.selectedAccountID.length > 0 ? this.selectedAccountID[0].id : ""));
    for (let index in response.data) {
      this.dataSender.push({ "id": response.data[index].ID, "itemName": response.data[index].NAME });
    }
    this.getListSms();
  }
  onItemSelectSender() {
    this.getListSms();
  }

  OnItemDeSelectSender() {
    this.getListSms();
  }
  //#endregion

  //#region partner
  public async bindDataPartner() {
    let response = await this.dataService.getAsync('/api/Partner');
    for (let i in response.data) {
      this.dataPartner.push({ "id": response.data[i].PARTNER_CODE, "itemName": response.data[i].PARTNER_NAME });
    }
    this.getListSms();
  }

  onItemSelectPartner() {
    this.getListSms();
  }

  OnItemDeSelectPartner() {
    this.selectedPartnerID = [];
    this.getListSms();
  }
  //#endregion

  //#region smsType
  public async bindDataSmsType() {
    let response: any = await this.dataService.getAsync('/api/sysvar/GetSysvarByGroup?var_group=SMS_TYPE');
    for (let i in response.data) {
      this.dataSmsType.push({ "id": response.data[i].VAR_VALUE, "itemName": response.data[i].VAR_NAME });
    }
    this.getListSms();
  }

  onItemSelectSmsType() {
    this.getListSms();
  }

  OnItemDeSelectSmsType() {
    this.getListSms();
  }
  //#endregion

  //#region sms status
  public bindDataSmsStatus() {
    this.dataSmsStatus = [];
    this.dataSmsStatus.push({ "id": "1", "itemName": "Thành công" });
    this.dataSmsStatus.push({ "id": "2", "itemName": "Thất bại" });
    this.getListSms();
  }

  onItemSelectSmsStatus() {
    this.getListSms();
  }

  OnItemDeSelectSmsStatus() {
    this.getListSms();
  }
  //#endregion

  //#region load data and paging
  public async getListSms() {
    let account_id = this.selectedAccountID.length > 0 ? this.selectedAccountID[0].id : "";
    if(!this.is_root && account_id == ""){
      this.dataSms = [];
      this.viewSumSms = "Tổng số tin: 0";
    }else{
      let response = await this.dataService.getAsync('/api/sms/GetListFillterPaging?pageIndex=' + this.pagination.pageIndex +
        '&pageSize=' + this.pagination.pageSize + '&account_id=' + account_id +
        '&sender_name=' + (this.selectedSenderID.length > 0 ? this.selectedSenderID[0].itemName : "") + '&sms_content=' + this.smsContent + '&phone=' + this.phone +
        '&sms_type=' + (this.selectedSmsType.length > 0 ? this.selectedSmsType[0].id : "") + '&viettel=' + this.stringVTL +
        '&vina=' + this.stringGPC + '&mobi=' + this.stringVMS +
        '&vnMobile=' + this.stringVNM + '&gtel=' + this.stringGTEL + '&sfone=' + this.stringSFONE +
        '&ddMobile=' + this.stringDD + '&tu_ngay=' + this.fromDate + '&den_ngay=' + this.toDate +
        '&partner_code=' + (this.selectedPartnerID.length > 0 ? this.selectedPartnerID[0].id : "") +
        '&sms_status=' + (this.selectedSmsStatus.length > 0 ? this.selectedSmsStatus[0].id : ""));
      if (response.err_code == 0) {
        this.dataSms = response.data;
        if ('pagination' in response) {
          this.pagination.pageSize = response.pagination.PageSize;
          this.pagination.totalRow = response.pagination.TotalRows;
        }

        let sumSms = response.pagination.TotalSms;
        if (sumSms > 0) {
          let responseFillter = await this.dataService.getAsync('/api/sms/GetListFillter?account_id=' + account_id +
            '&sender_name=' + (this.selectedSenderID.length > 0 ? this.selectedSenderID[0].itemName : "") +
            '&sms_content=' + this.smsContent + '&phone=' + this.phone +
            '&sms_type=' + (this.selectedSmsType.length > 0 ? this.selectedSmsType[0].id : "") +
            '&viettel=' + this.stringVTL +
            '&vina=' + this.stringGPC + '&mobi=' + this.stringVMS +
            '&vnMobile=' + this.stringVNM + '&gtel=' + this.stringGTEL + '&sfone=' + this.stringSFONE +
            '&ddMobile=' + this.stringDD + '&tu_ngay=' + this.fromDate + '&den_ngay=' + this.toDate +
            '&partner_code=' + (this.selectedPartnerID.length > 0 ? this.selectedPartnerID[0].id : "") +
            '&receive_result=' + (this.selectedSmsStatus.length > 0 ? this.selectedSmsStatus[0].id : ""));
          let datafillter = responseFillter.data;
          let sumSmsViettel = 0, sumSmsGPC = 0, sumSmsVMS = 0, sumSmsVNM = 0, sumSmsGtel = 0, sumSmsSphone = 0;
          for (let i in datafillter) {
            if (datafillter[i].TELCO == "VIETTEL") sumSmsViettel += datafillter[i].SMS_COUNT;
            else if (datafillter[i].TELCO == "GPC") sumSmsGPC += datafillter[i].SMS_COUNT;
            else if (datafillter[i].TELCO == "VMS") sumSmsVMS += datafillter[i].SMS_COUNT;
            else if (datafillter[i].TELCO == "VNM") sumSmsVNM += datafillter[i].SMS_COUNT;
            else if (datafillter[i].TELCO == "GTEL") sumSmsGtel += datafillter[i].SMS_COUNT;
            else if (datafillter[i].TELCO == "SFONE") sumSmsSphone += datafillter[i].SMS_COUNT;
          }
          this.viewSumSms = "Tổng số: " + sumSms + " tin (Viettel: " + sumSmsViettel +
            (sumSmsVMS > 0 ? (", Mobiphone: " + sumSmsVMS) : "") +
            (sumSmsGPC > 0 ? (", Vinaphone: " + sumSmsGPC) : "") +
            (sumSmsVNM > 0 ? (", VietnamMobile: " + sumSmsVNM) : "") +
            (sumSmsGtel > 0 ? (", Gtel: " + sumSmsGtel) : "") +
            (sumSmsSphone > 0 ? (", Sfone: " + sumSmsSphone) : "") + ")";
        }
        else this.viewSumSms = "Tổng số tin: 0";
      }
    }
  }

  pageChanged(event: any): void {
    this.setPageIndex(event.page);
  }
  setPageIndex(pageNo: number): void {
    this.pagination.pageIndex = pageNo;
    this.getListSms();
  }
  changePageSize(size) {
    this.pagination.pageSize = size;
    this.pagination.pageIndex = 1;
    this.getListSms();
  }
  //#endregion

  //#region search
  onChangeFromDate(event) {
    this.fromDate = this.utilityService.formatDateToString(event, "yyyyMMdd");
    if (this.fromDate > this.toDate) {
      this.notificationService.displayWarnMessage("Ngày tin nhắn chưa thỏa mãn");
      return;
    }
    this.getListSms();
  }

  onChangeToDate(event) {
    console.log(event);
    this.toDate = this.utilityService.formatDateToString(event, "yyyyMMdd");
    if (this.fromDate > this.toDate) {
      this.notificationService.displaySuccessMessage("Ngày tin nhắn chưa thỏa mãn");
      return;
    }
    this.getListSms();
  }

  public async searchSms(form) {
    this.smsContent = form.smsContent.trim();
    this.fromDate = this.utilityService.formatDateToString(form.fromDate, "yyyyMMdd");
    this.toDate = this.utilityService.formatDateToString(form.toDate, "yyyyMMdd");
    this.phone = form.phone.trim();
    if (this.fromDate > this.toDate) {
      this.notificationService.displayWarnMessage("Ngày tin nhắn chưa thỏa mãn");
      return;
    }
    this.getListSms();
  }
  //#endregion

  //#region check telco
  onChangeVTL(isChecked) {
    if (isChecked) {
      this.isCheckVTL = true;
      this.stringVTL = "VIETTEL"
    }
    else {
      this.isCheckVTL = false;
      this.stringVTL = "";
    }
    this.getListSms();
  }

  onChangeVMS(isChecked) {
    if (isChecked) {
      this.isCheckVMS = true;
      this.stringVMS = "VMS";
    }
    else {
      this.isCheckVMS = false;
      this.stringVMS = "";
    }
    this.getListSms();
  }

  onChangeGPC(isChecked) {
    if (isChecked) {
      this.isCheckGPC = true;
      this.stringGPC = "GPC";
    }
    else {
      this.isCheckGPC = false;
      this.stringGPC = "";
    }
    this.getListSms();
  }

  onChangeVNM(isChecked) {
    if (isChecked) {
      this.isCheckVNM = true;
      this.stringVNM = "VNM";
    }
    else {
      this.isCheckVNM = false;
      this.stringVNM = "";
    }
    this.getListSms();
  }

  onChangeGTEL(isChecked) {
    if (isChecked) {
      this.isCheckGTEL = true;
      this.stringGTEL = "GTEL";
    }
    else {
      this.isCheckGTEL = false;
      this.stringGTEL = "";
    }
    this.getListSms();
  }

  onChangeSFONE(isChecked) {
    if (isChecked) {
      this.isCheckSFONE = true;
      this.stringSFONE = "SFONE";
    }
    else {
      this.isCheckSFONE = false;
      this.stringSFONE = "";
    }
    this.getListSms();
  }

  onChangeDD(isChecked) {
    if (isChecked) {
      this.isCheckDD = true;
      this.stringDD = "DDMBLE";
    }
    else {
      this.isCheckDD = false;
      this.stringDD = "";
    }
    this.getListSms();
  }
  //#endregion

  public convertStringDate(text: string): string {
    let value = "";
    let nam = "", thang = "", ngay = "";
    let gio = "", phut = "", giay = "";
    if (text != "" && text != null && text != undefined) {
      nam = text.substring(0, 4);
      thang = text.substring(4, 6);
      ngay = text.substring(6, 8);
      gio = text.substring(8, 10);
      phut = text.substring(10, 12);
      giay = text.substring(12, 14);
      value = ngay + "/" + thang + "/" + nam + " " + gio + ":" + phut + ":" + giay;
    }
    return value;
  }

  public async exportExcel() {
    if (this.selectedAccountID.length > 0) {
      let result: boolean = await this.dataService.getFileExtentionSmsStatisticAsync("/api/FileExtention/ExportExcelSmsStatistic",
        this.selectedAccountID[0].id,
        this.selectedSenderID.length > 0 ? this.selectedSenderID[0].itemName : "",
        this.smsContent,
        this.phone,
        this.selectedSmsType.length > 0 ? this.selectedSmsType[0].id : "",
        this.stringVTL,
        this.stringGPC,
        this.stringVMS,
        this.stringVNM, this.stringGTEL, this.stringSFONE, this.stringDD, this.fromDate, this.toDate,
        this.selectedPartnerID.length > 0 ? this.selectedPartnerID[0].id : "",
        this.selectedSmsStatus.length > 0 ? this.selectedSmsStatus[0].id : ""
        , "SmsList");
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
}
