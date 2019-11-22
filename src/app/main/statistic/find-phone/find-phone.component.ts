import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/core/services/data.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { Pagination } from 'src/app/core/models/pagination';

@Component({
  selector: 'app-find-phone',
  templateUrl: './find-phone.component.html',
  styleUrls: ['./find-phone.component.css']
})
export class FindPhoneComponent implements OnInit {

  public dataSms;
  public settingsFilterSender = {};
  public dataSender = [];
  public selectedSenderID = [];
  
  public viewSumSms = "";

  public phone: string = "";
  public fromDate: string = "";
  public toDate: string = "";
  public timeFrom: Date = new Date();
  public timeTo: Date = new Date();

  public pagination: Pagination = new Pagination();

  constructor(private dataService: DataService,
    private utilityService: UtilityService,
    private notificationService: NotificationService) { 
    this.settingsFilterSender = {
      text: "Chọn thương hiệu",
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: "Tìm kiếm",
      noDataLabel: "Không có dữ liệu",
      showCheckbox: false
    };
  }

  ngOnInit() {
    this.fromDate = this.utilityService.formatDateToString(this.timeFrom, "yyyyMMdd");
    this.toDate = this.utilityService.formatDateToString(this.timeTo, "yyyyMMdd");
    this.loadListSenderName();
  }

  //#region sender
  async loadListSenderName() {
    this.dataSender = [];
    this.selectedSenderID = [];

    let response = await this.dataService.getAsync('/api/SenderName/');
    debugger
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

  //#region change time
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
  //#endregion

  //#region load data Sms
  public async searchSms(form) {
    this.fromDate = this.utilityService.formatDateToString(form.fromDate, "yyyyMMdd");
    this.toDate = this.utilityService.formatDateToString(form.toDate, "yyyyMMdd");
    this.phone = form.phone.trim();
    if (this.fromDate > this.toDate) {
      this.notificationService.displayWarnMessage("Ngày tin nhắn chưa thỏa mãn");
      return;
    }
    this.getListSms();
  }

  public async getListSms(){
    if (this.phone != undefined && this.phone != null && this.phone != ""){
      let response = await this.dataService.getAsync('/api/sms/FindSmsByPhone?pageIndex=' + this.pagination.pageIndex +
      '&pageSize=' + this.pagination.pageSize + '&phone=' + this.phone +
      '&sender_name=' + (this.selectedSenderID.length > 0 ? this.selectedSenderID[0].itemName : "") +
      '&tu_ngay=' + this.fromDate + '&den_ngay=' + this.toDate);
      
      // this.dataSms = response.data;
      this.loadData(response);
      let sumSms = response.pagination.TotalSms;
      this.viewSumSms = "Tổng số: " + sumSms;
    }
    else{
      this.dataSms = [];
      this.viewSumSms = "Tổng số tin: 0";
    }
  }

  loadData(response?: any) {
    if (response) {
      this.dataSms = response.data;
      if ('pagination' in response) {
        this.pagination.pageSize = response.pagination.PageSize;
        this.pagination.totalRow = response.pagination.TotalRows;
      }
    }
  }
  //#endregion

//#region paging
setPageIndex(pageNo: number): void {
  this.pagination.pageIndex = pageNo;
  this.getListSms();
}

pageChanged(event: any): void {
  this.setPageIndex(event.page);
}

changePageSize(size) {
  this.pagination.pageSize = size;
  this.pagination.pageIndex = 1;
  this.getListSms();
}
//#endregion

  //#region convert string to date
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
  //#endregion
}
