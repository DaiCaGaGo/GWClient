import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/core/services/data.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { Pagination } from 'src/app/core/models/pagination';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  public smsErr = 0;
  public newCustomer = 0;
  public accountExpiredQuota = 0;
  public senderExpired = 0;
  // public currentDate = this.utilityService.formatDateToString(new Date, "dd/MM/yyyy");
  public currentDate = "01/09/2019";

  // public dataSMS: any = [{
  //   type: "Tin lỗi",
  //   value: 8
  // }, {
  //   type: "KH mới",
  //   value: 15
  // }, {
  //   type: "Tin cần duyệt",
  //   value: 14
  // }, {
  //   type: "Lỗi API",
  //   value: 11
  // }, {
  //   type: "Tin bị chặn",
  //   value: 16
  // }, {
  //   type: "Tin trùng lặp",
  //   value: 10
  // }, {
  //   type: "ĐT sắp hết quota",
  //   value: 18
  // }, {
  //   type: "KH sắp hết quota",
  //   value: 7
  // }];

  public grossProductData: any = [];
  public month_now;
  public month_old1;
  public month_old2;

  public grossSmsTelco: any = [];
  public grossSmsGroupSender: any = [];

  public weatherData: any = [{
    month: "January",
    avgT: 98,
    minT: 41,
    maxT: 155,
    prec: 109
  }, {
    month: "February",
    avgT: 1180,
    minT: 58,
    maxT: 178,
    prec: 104
  }, {
    month: "March",
    avgT: 134,
    minT: 72,
    maxT: 196,
    prec: 92
  }, {
    month: "April",
    avgT: 154,
    minT: 81,
    maxT: 228,
    prec: 30
  }, {
    month: "May",
    avgT: 18,
    minT: 103,
    maxT: 257,
    prec: 10
  }, {
    month: "June",
    avgT: 706,
    minT: 122,
    maxT: 29,
    prec: 2
  }, {
    month: "July",
    avgT: 222,
    minT: 132,
    maxT: 313,
    prec: 2
  }, {
    month: "August",
    avgT: 222,
    minT: 132,
    maxT: 311,
    prec: 1
  }, {
    month: "September",
    avgT: 1000,
    minT: 124,
    maxT: 299,
    prec: 8
  }, {
    month: "October",
    avgT: 19,
    minT: 97,
    maxT: 26.1,
    prec: 24
  }, {
    month: "November",
    avgT: 129,
    minT: 62,
    maxT: 196,
    prec: 64
  }, {
    month: "December",
    avgT: 960,
    minT: 34,
    maxT: 157,
    prec: 76
  }];

  valueText: string;
  public totalSenderExpired = 0;
  public totalSmsWaitApprove = 0;
  public thisAccount;
  public isAdmin: boolean = false;

  public settingsFilterSender = {};
  public selectedSenderID = [];
  public dataSender = [];
  public dataSmsByPhone = [];

  public phone = "";
  public pagination: Pagination = new Pagination();

  constructor(private dataService: DataService,
    private authService: AuthService,
    private utilityService: UtilityService) {
    this.settingsFilterSender = {
      text: "Chọn thương hiệu",
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: "Tìm kiếm",
      noDataLabel: "Không có dữ liệu"
    };
  }

  ngOnInit() {
    this.loadListSenderName();
    this.getSmsWaitApprove();
    this.getSMSError();
    this.getAccountLogin();
    if(!this.isAdmin){
      this.getSenderExpired();
      this.getAccountExpiredQuota();
      this.getAccountNew();
    }
    this.getSmsPartner();
    this.getSmsTelco();
    this.getSmsGroupSender();
  }

  // bind data account
  //#region account
  async getAccountLogin() {
    let result = await this.dataService.getAsync('/api/account/GetInfoAccountLogin');
    let roleAccess = result.data[0].ROLE_ACCESS;
    if (roleAccess == 50)
      this.isAdmin = true;
    else
      this.isAdmin = false;
  }

  //#region sender
  async loadListSenderName() {
    this.dataSender = [];
    this.selectedSenderID = [];
    let response = await this.dataService.getAsync('/api/SenderName/GetSenderNameByAccountLogin');
    for (let index in response.data) {
      this.dataSender.push({ "id": response.data[index].ID, "itemName": response.data[index].NAME });
    }
  }
  //#endregion

  //#region load sms list by phone
  public async searchSms(form) {
    this.phone = form.phone.trim();
    this.getListSms();
  }

  async getListSms() {
    this.dataSmsByPhone = [];
    // if (this.phone != undefined && this.phone != null && this.phone != ""){
    let response = await this.dataService.getAsync('/api/sms/FindSmsByPhone?pageIndex=' + this.pagination.pageIndex +
      '&pageSize=' + this.pagination.pageSize + '&phone=' + this.phone +
      '&sender_name=' + (this.selectedSenderID.length > 0 ? this.selectedSenderID[0].itemName : "") +
      '&tu_ngay=&den_ngay=');
    this.loadData(response);
    // }
  }

  loadData(response?: any) {
    if (response) {
      this.dataSmsByPhone = response.data;
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

  customizeLabel(arg) {
    return arg.valueText + " (" + arg.percentText + ")";
  }

  customizeLabelPieChart(point) {
    return point.argumentText + ": " + point.valueText + "%";
  }

  onPointClick(e) {
    e.target.select();
  }

  temperatureCustomizeText() {
    return this.valueText + " SMS";
  }

  precipitationCustomizeText() {
    return this.valueText + " SMS";
  }

  /**
   * async getSenderExpired
   */
  public async getSenderExpired() {
    let response = await this.dataService.getAsync('/api/SenderName/GetSenderExpiredTime/');
    if (response)
      this.totalSenderExpired = response.pagination.TotalRows;
  }

  // get tin can duyet
  public async getSmsWaitApprove() {
    let response = await this.dataService.getAsync('/api/CampaignDetail/GetSmsWaitApprove?accountID=' +
      this.authService.currentUserValue.ACCOUNT_ID);
    let result = response.data;
    this.totalSmsWaitApprove = 0;
    if (result != undefined && result != null) {
      if (result.length > 0)
        this.totalSmsWaitApprove = (result[0].SUM_SMS != undefined && result[0].SUM_SMS != null && result[0].SUM_SMS != "") ? result[0].SUM_SMS : 0;
    }
  }

  // get tin nhan loi
  async getSMSError() {
    let response: any = await this.dataService.getAsync('/api/sms/GetSmsError?pageIndex=1&pageSize=99999999&account_id=&sender_name=&sms_content=&phone=&sms_type=&viettel=&vina=&mobi=&vnMobile=&gtel=&sfone=&tu_ngay=&den_ngay=&partner_code=&receive_result=');
    if (response) {
      this.smsErr = response.data.length;
    }
  }

  // get khach moi
  async getAccountNew() {
    let response: any = await this.dataService.getAsync('/api/account/GetAccountNew?pageIndex=1&pageSize=999999');
    if (response) {
      this.newCustomer = response.data.length;
    }
  }

  // get tai khoan sap het quota
  async getAccountExpiredQuota() {
    let response: any = await this.dataService.getAsync('/api/account/GetAccountExpiredQuota');
    if (response) {
      this.accountExpiredQuota = response.data.length;
    }
  }

  //#region bieu do so sanh san luong sms 3 thang gan nhat giua cac doi tac
  public async getSmsPartner() {
    let response: any = await this.dataService.getAsync('/api/sms/StatisticSmsPartner');
    let result = response.data;
    for (let i in result) {
      this.grossProductData.push({
        state: result[i].PARTNER_NAME, year2017: result[i].SUM_MONTH_OLD2,
        year2018: result[i].SUM_MONTH_OLD1, year2019: result[i].SUM_MONTH_NOW
      });
    }
    this.month_now = result[0].MONTH_NOW;
    this.month_old1 = result[0].MONTH_OLD1;
    this.month_old2 = result[0].MONTH_OLD2;
  }
  //#endregion

  //#region bieu do so sanh san luong sms 3 thang gan nhat giua cac nha mang
  public async getSmsTelco() {
    let response: any = await this.dataService.getAsync('/api/sms/StatisticSmsTelco');
    let result = response.data;
    for (let i in result) {
      this.grossSmsTelco.push({
        state: result[i].TELCO, monthOld2: result[i].SUM_MONTH_OLD2,
        monthOld1: result[i].SUM_MONTH_OLD1, monthNow: result[i].SUM_MONTH_NOW
      });
    }
  }
  //#endregion

  //#region bieu do san luong tin theo nhom thuong hieu
  public async getSmsGroupSender() {
    let response: any = await this.dataService.getAsync('/api/sms/StatisticSmsGroupSenderTelco');
    let result = response.data;
    for (let i in result) {
      this.grossSmsGroupSender.push({
        state: result[i].CODE, viettel: result[i].SUM_VIETTEL, gpc: result[i].SUM_GPC,
        vms: result[i].SUM_VMS, vnm: result[i].SUM_VNM, gtel: result[i].SUM_GTEL
      });
    }
  }
  //#endregion
}
