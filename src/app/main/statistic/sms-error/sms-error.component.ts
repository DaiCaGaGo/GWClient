import { Component, OnInit } from '@angular/core';
import { Pagination } from 'src/app/core/models/pagination';
import { AuthService } from 'src/app/core/services/auth.service';
import { DataService } from 'src/app/core/services/data.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { AppConst } from 'src/app/core/common/app.constants';

@Component({
  selector: 'app-sms-error',
  templateUrl: './sms-error.component.html',
  styleUrls: ['./sms-error.component.css']
})
export class SmsErrorComponent implements OnInit {

  public dataSms;
  public smsContent: string = "";
  public phone: string = "";
  public fromDate: string = "";
  public toDate: string = "";
  public roleAccess = 0;
  public timeFrom: string = '';
  public timeTo: string = '';
  public viettel: boolean = false;
  public mobiphone: boolean = false;
  public vinaphone: boolean = false;
  public vietnameMobile: boolean = false;
  public gtel: boolean = false;
  public sfone: boolean = false;
  public countAll = 0;
  public countVTL = 0;
  public countGPC = 0;
  public countVMS = 0;
  public countVNM = 0;
  public countGtel = 0;
  public countSFone = 0;

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
    this.fromDate = (this.timeFrom == '') ? '' : this.utilityService.formatDateToString(this.timeFrom, "yyyyMMdd");
    this.toDate = (this.timeTo == '') ? '' : this.utilityService.formatDateToString(this.timeTo, "yyyyMMdd");
    this.getListSms();
  }

  async getAccountDetail (){
    let response = await this.dataService.getAccountDetail();
    let is_admin = response.data[0].IS_ADMIN;
    if (is_admin != null && is_admin == 1) this.isShowPartner = true;
    else this.isShowPartner = false;
  }

  //#region account
  public async bindDataAccount() {
    let result = await this.dataService.getAsync('/api/account/GetInfoAccountLogin');
    this.roleAccess = result.data[0].ROLE_ACCESS;
    if (this.roleAccess == 50) {
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
    if (this.roleAccess == 50) {
      let response = await this.dataService.getAsync('/api/SenderName/GetSenderNameByAccountID?account_id=' +
        (this.selectedAccountID.length > 0 ? this.selectedAccountID[0].id : ""));
      for (let index in response.data) {
        this.dataSender.push({ "id": response.data[index].ID, "itemName": response.data[index].NAME });
      }
    }
    else {
      let response = await this.dataService.getAsync('/api/SenderName/GetSenderNameByAccountLogin');
      for (let index in response.data) {
        this.dataSender.push({ "id": response.data[index].ID, "itemName": response.data[index].NAME });
      }
    }
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
    this.dataSmsStatus.push({ "id": "0", "itemName": "DELIVERED" });
    this.dataSmsStatus.push({ "id": "1", "itemName": "UNDELIVERED" });
    this.dataSmsStatus.push({ "id": "", "itemName": "Trạng thái trắng" });
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
    let accoutId = this.selectedAccountID != null && this.selectedAccountID.length > 0 ? this.selectedAccountID[0].id : "";
    let response = await this.dataService.getAsync('/api/sms/GetSmsError?pageIndex=' + this.pagination.pageIndex +
      '&pageSize=' + this.pagination.pageSize + '&account_id=' + accoutId +
      '&sender_name=' + (this.selectedSenderID.length > 0 ? this.selectedSenderID[0].itemName : "") + '&sms_content=' + this.smsContent + '&phone=' + this.phone +
      '&sms_type=' + (this.selectedSmsType.length > 0 ? this.selectedSmsType[0].id : "") + '&viettel=' + (this.viettel == true ? "VIETTEL" : "") +
      '&vina=' + (this.vinaphone == true ? "GPC" : "") + '&mobi=' + (this.mobiphone == true ? "VMS" : "") +
      '&vnMobile=' + (this.vietnameMobile == true ? "VNM" : "") + '&gtel=' + (this.gtel == true ? "GTEL" : "") + '&sfone=' + (this.sfone == true ? "SFONE" : "") +
      '&tu_ngay=' + this.fromDate + '&den_ngay=' + this.toDate +
      '&partner_code=' + (this.selectedPartnerID.length > 0 ? this.selectedPartnerID[0].id : "") +
      '&receive_result=' + (this.selectedSmsStatus.length > 0 ? this.selectedSmsStatus[0].id : ""));

    if (response.err_code == 0) {
      this.dataSms = response.data;
      if ('pagination' in response) {
        this.pagination.pageSize = response.pagination.PageSize;
        this.pagination.totalRow = response.pagination.TotalRows;
      }

      //count sms bt telco
      let responseCountSms = await this.dataService.getAsync('/api/sms/CountSMSByTelco?account_id=' + accoutId +
        '&sender_name=' + (this.selectedSenderID.length > 0 ? this.selectedSenderID[0].itemName : "") + '&sms_content=' + this.smsContent + '&phone=' + this.phone +
        '&sms_type=' + (this.selectedSmsType.length > 0 ? this.selectedSmsType[0].id : "") + '&viettel=' + (this.viettel == true ? "VIETTEL" : "") +
        '&vina=' + (this.vinaphone == true ? "GPC" : "") + '&mobi=' + (this.mobiphone == true ? "VMS" : "") +
        '&vnMobile=' + (this.vietnameMobile == true ? "VNM" : "") + '&gtel=' + (this.gtel == true ? "GTEL" : "") + '&sfone=' + (this.sfone == true ? "SFONE" : "") +
        '&tu_ngay=' + this.fromDate + '&den_ngay=' + this.toDate +
        '&partner_code=' + (this.selectedPartnerID.length > 0 ? this.selectedPartnerID[0].id : "") +
        '&receive_result=' + (this.selectedSmsStatus.length > 0 ? this.selectedSmsStatus[0].id : ""));

      if (responseCountSms != null && responseCountSms.data != null && responseCountSms.data.length > 0) {
        this.countVTL = responseCountSms.data[0].VIETTEL;
        this.countGPC = responseCountSms.data[0].GPC;
        this.countVMS = responseCountSms.data[0].VMS;
        this.countVNM = responseCountSms.data[0].VNM;
        this.countGtel = responseCountSms.data[0].GTEL;
        this.countSFone = responseCountSms.data[0].SFONE;
        this.countAll = this.countVTL + this.countGPC + this.countVMS + this.countVNM + this.countGtel + this.countSFone;
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
    // if (this.fromDate > this.toDate) {
    //   this.notificationService.displayWarnMessage("Ngày tin nhắn chưa thỏa mãn");
    //   return;
    // }
    this.getListSms();
  }

  onChangeToDate(event) {
    console.log(event);
    this.toDate = this.utilityService.formatDateToString(event, "yyyyMMdd");
    // if (this.fromDate > this.toDate) {
    //   this.notificationService.displaySuccessMessage("Ngày tin nhắn chưa thỏa mãn");
    //   return;
    // }
    this.getListSms();
  }

  public async searchSms(form) {
    this.smsContent = form.smsContent.trim();
    this.fromDate = this.utilityService.formatDateToString(form.fromDate, "yyyyMMdd");
    this.toDate = this.utilityService.formatDateToString(form.toDate, "yyyyMMdd");
    this.phone = form.phone.trim();
    // if (this.fromDate > this.toDate) {
    //   this.notificationService.displayWarnMessage("Ngày tin nhắn chưa thỏa mãn");
    //   return;
    // }
    //this.getListSms();
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
    let accoutId = this.selectedAccountID != null && this.selectedAccountID.length > 0 ? this.selectedAccountID[0].id : "";
    let result: boolean = await this.dataService.getFileExtentionSmsErrorAsync('/api/FileExtention/ExportExcelSmsError', accoutId
      , (this.selectedSenderID.length > 0 ? this.selectedSenderID[0].itemName : ""), this.smsContent, this.phone
      , (this.selectedSmsType.length > 0 ? this.selectedSmsType[0].id : ""), (this.viettel == true ? "VIETTEL" : "")
      , (this.vinaphone == true ? "GPC" : ""), (this.mobiphone == true ? "VMS" : ""), (this.vietnameMobile == true ? "VNM" : "")
      , (this.gtel == true ? "GTEL" : ""), (this.sfone == true ? "SFONE" : ""), this.fromDate, this.toDate
      , (this.selectedPartnerID.length > 0 ? this.selectedPartnerID[0].id : ""), (this.selectedSmsStatus.length > 0 ? this.selectedSmsStatus[0].id : "")
      , "SmsError");
    if (result) {
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("120"));
    }
    else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("125"));
    }
  }
}
