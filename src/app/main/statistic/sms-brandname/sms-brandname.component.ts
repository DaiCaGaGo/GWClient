import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../core/services/data.service';
import { Pagination } from 'src/app/core/models/pagination';
import { UtilityService } from 'src/app/core/services/utility.service';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
  selector: 'app-sms-brandname',
  templateUrl: './sms-brandname.component.html',
  styleUrls: ['./sms-brandname.component.css']
})
export class SmsBrandnameComponent implements OnInit {

  public fromDate: string = "";
  public toDate: string = "";

  public timeFrom: Date = new Date();
  public timeTo: Date = new Date();

  public dataSms;
  public dataSmsNew;
  public dataComboboxSearch = [];

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

  public isShowPartner = false;

  constructor(private dataService: DataService,
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
    this.bindDataAccount();

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
    this.bindDataPartner();

    this.settingsFilterSmsType = {
      text: "Chọn loại tin nhắn",
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: "Tìm kiếm",
      noDataLabel: "Không có dữ liệu"
    };
    this.bindDataSmsType();
  }

  ngOnInit() {
    this.getAccountDetail();
    this.fromDate = this.utilityService.formatDateToString(this.timeFrom, "yyyyMMdd");
    this.toDate = this.utilityService.formatDateToString(this.timeTo, "yyyyMMdd");
    this.getListSms();
  }

  async getAccountDetail() {
    let response = await this.dataService.getAccountDetail();
    let is_admin = response.data[0].IS_ADMIN;
    if (is_admin != null && is_admin == 1) this.isShowPartner = true;
    else this.isShowPartner = false;
  }

  //#region account
  public async bindDataAccount() {
    let response: any = await this.dataService.getAsync('/api/account');
    for (let index in response.data) {
      this.dataAccount.push({ "id": response.data[index].ACCOUNT_ID, "itemName": response.data[index].USER_NAME });
    }
    this.loadListSenderName();
    // this.getListSms();
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
    // this.getListSms();
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
    // this.getListSms();
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
    // this.getListSms();
  }

  onItemSelectSmsType() {
    this.getListSms();
  }

  OnItemDeSelectSmsType() {
    this.getListSms();
  }
  //#endregion

  //#region change date time
  onChangeFromDate(event) {
    if (this.fromDate > this.toDate) {
      this.notificationService.displayWarnMessage("Ngày tin nhắn chưa thỏa mãn");
      return;
    }
    this.fromDate = this.utilityService.formatDateToString(event, "yyyyMMdd");
    this.getListSms();
  }

  onChangeToDate(event) {
    this.toDate = this.utilityService.formatDateToString(event, "yyyyMMdd");
    if (this.fromDate > this.toDate) {
      this.notificationService.displayWarnMessage("Ngày tin nhắn chưa thỏa mãn");
      return;
    }
    this.toDate = this.utilityService.formatDateToString(event, "yyyyMMdd");
    this.getListSms();
  }
  //#endregion

  async searchSms(form) {
    this.fromDate = this.utilityService.formatDateToString(form.fromDate, "yyyyMMdd");
    this.toDate = this.utilityService.formatDateToString(form.toDate, "yyyyMMdd");
    if (this.fromDate > this.toDate) {
      this.notificationService.displaySuccessMessage("Ngày tin nhắn chưa thỏa mãn");
      return;
    }
    this.getListSms();
  }

  //#region load data
  async getListSms() {
    this.dataSmsNew = []
    let response = await this.dataService.getAsync('/api/sms/StatisticSmsBySendername?account_id=' +
      (this.selectedAccountID.length > 0 ? this.selectedAccountID[0].id : "") +
      '&sender_id=' + (this.selectedSenderID.length > 0 ? this.selectedSenderID[0].id : "") +
      '&sms_type=' + (this.selectedSmsType.length > 0 ? this.selectedSmsType[0].id : "") +
      '&tu_ngay=' + this.fromDate + '&den_ngay=' + this.toDate +
      '&partner_code=' + (this.selectedPartnerID.length > 0 ? this.selectedPartnerID[0].id : "") +
      '&telco=' + '');
    if (response.err_code == 0) {
      this.dataSmsNew = response.data;
    }
  }
  //#endregion

  //#region export excel
  async exportExcel() {
    if (this.dataSmsNew.length > 0) {
      let abc = JSON.stringify(this.dataSmsNew)
      let result: boolean = await this.dataService.getFileExtentionSmsByBrandnameAsync("/api/FileExtention/ExportExcelSmsByBrandname",
        abc, "ListSmsByBrandname");
      if (result) {
        this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("120"));
      }
      else {
        this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("125"));
      }
    }
    else this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("125"));
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

}
