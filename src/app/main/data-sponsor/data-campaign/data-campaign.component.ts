import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective, BsModalService } from 'ngx-bootstrap';
import { Pagination } from 'src/app/core/models/pagination';
import { DataService } from 'src/app/core/services/data.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-data-campaign',
  templateUrl: './data-campaign.component.html',
  styleUrls: ['./data-campaign.component.css']
})
export class DataCampaignComponent implements OnInit {

  @ViewChild('viewDataCampaignDetailModal', { static: false }) public viewDataCampaignDetailModal: ModalDirective;

  public dataCampaign = [];
  public dataCampaignDetail = [];
  public dataAccount = [];
  public id;
  public notification;
  public data_campaign_id;
  public slAccount: string = '';
  public fromDate: string = '';
  public toDate: string = '';
  public roleAccess = 0;
  public checkShowDetail: boolean = false;
  public pagination: Pagination = new Pagination();
  public pageIndex: number;
  public pageSize;
  public totalRow: number;
  public totalPage: number;
  public isAdmin: boolean = false;

  public settingsFilterAccount = {};
  public selectedAccount = [];

  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private modalService: BsModalService,
    private notificationService: NotificationService,
    private utilityService: UtilityService) {
    modalService.config.backdrop = 'static';

    this.settingsFilterAccount = {
      text: "Chọn tài khoản",
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: "Tìm kiếm",
      noDataLabel: "Không có dữ liệu"
    };

    this.pageIndex = 1;
    this.pageSize = 5;
    this.totalRow = 0;
    this.totalPage = 0;
  }

  async ngOnInit() {
    await this.bindDataAccount();
    await this.getData();
    await this.checkRegData();
  }

  // check register result data
  async checkRegData() {
    await this.dataService.getAsync('/api/DataSponsor/CheckRegData');
  }

  // bind data account
  //#region account
  async bindDataAccount() {
    let result = await this.dataService.getAsync('/api/account/GetInfoAccountLogin');
    this.roleAccess = result.data[0].ROLE_ACCESS;
    if (this.roleAccess == 50) {
      let response: any = await this.dataService.getAsync('/api/account');
      for (let index in response.data) {
        this.dataAccount.push({ "id": response.data[index].ACCOUNT_ID, "itemName": response.data[index].USER_NAME });
      }
      this.isAdmin = true;
    }
    else {
      this.isAdmin = false;
      let response = await this.dataService.getAsync('/api/account/GetLisAccountParentAndChild?account_id=' +
        this.authService.currentUserValue.ACCOUNT_ID);
      for (let index in response.data) {
        this.dataAccount.push({ "id": response.data[index].ACCOUNT_ID, "itemName": response.data[index].USER_NAME });
      }
      if (this.dataAccount.length == 1) {
        this.selectedAccount.push({ "id": this.dataAccount[0].id, "itemName": this.dataAccount[0].itemName });
      }
      else
        this.selectedAccount.push({ "id": "", "itemName": "Chọn tài khoản" });
    }
  }

  // bind data to grid
  async getData() {
    let account = this.selectedAccount.length != 0 && this.selectedAccount[0].id != "" ? this.selectedAccount[0].id : "";
    let response: any = await this.dataService.getAsync('/api/DataCampaign/GetDataCampaignPaging?pageIndex=' + this.pagination.pageIndex +
      "&pageSize=" + this.pagination.pageSize + "&account_id=" + account + "&from_date=" + this.fromDate + "&to_date=" + this.toDate + 
      "&isAdmin=" + this.isAdmin)
    this.loadData(response);
  }

  loadData(response?: any) {
    if (response) {
      this.dataCampaign = response.data;
      if ('pagination' in response) {
        this.pagination.pageSize = response.pagination.PageSize;
        this.pagination.totalRow = response.pagination.TotalRows;
      }
    }
  }

  async getDataDetail() {
    let account = this.selectedAccount.length != 0 && this.selectedAccount[0].id != "" ? this.selectedAccount[0].id : "";
    let response: any = await this.dataService.getAsync('/api/DataSms/GetDataSmsPaging?pageIndex=' + this.pageIndex +
      "&pageSize=" + this.pageSize + "&account_id=" + account + "&data_campaign_id=" + this.data_campaign_id + "&from_date=" + this.fromDate + "&to_date=" + this.toDate
      + "&phone=&sms_content=");
    this.loadDataDetail(response);
  }

  loadDataDetail(response?: any) {
    if (response) {
      this.dataCampaignDetail = response.data;
      if ('pagination' in response) {
        this.pageSize = response.pagination.PageSize;
        this.totalRow = response.pagination.TotalRows;
      }
    }
  }

  onChangeFromDate(event) {
    this.fromDate = this.utilityService.formatDateToString(event, "yyyyMMddHHmmss");
    this.getData();
  }

  onChangeToDate(event) {
    this.toDate = this.utilityService.formatDateToString(event, "yyyyMMddHHmmss");
    this.getData();
  }

  setPageIndex(pageNo: number): void {
    this.pagination.pageIndex = pageNo;
    this.getData();
  }

  pageChanged(event: any): void {
    this.setPageIndex(event.page);
  }

  changePageSize(size) {
    this.pagination.pageSize = size;
    this.pagination.pageIndex = 1;
    this.getData();
  }

  setPageIndexDetail(pageNo: number): void {
    this.pageIndex = pageNo;
    this.getDataDetail();
  }

  pageChangedDetail(event: any): void {
    this.setPageIndexDetail(event.page);
  }

  changePageSizeDetail(size) {
    this.pageSize = size;
    this.pageIndex = 1;
    this.getDataDetail();
  }

  //#region view lich su cap tin
  async showConfirmViewDetail(id) {
    this.data_campaign_id = id;
    let account = this.selectedAccount.length != 0 && this.selectedAccount[0].id != "" ? this.selectedAccount[0].id : "";
    let response: any = await this.dataService.getAsync('/api/DataSms/GetDataSmsPaging?pageIndex=' + this.pageIndex +
      "&pageSize=" + this.pageSize + "&account_id=" + account + "&data_campaign_id=" + this.data_campaign_id + "&from_date=" + this.fromDate + "&to_date=" + this.toDate
      + "&phone=&sms_content=");
    if (response.err_code == 0) {
      if (response.data != null && response.data.length > 0) {
        this.checkShowDetail = true;
        this.dataCampaignDetail = response.data;
        this.loadDataDetail(response);
      }
      else {
        this.notification = "Không có số điện thoại nào";
        this.checkShowDetail = false;
      }
    }
    this.viewDataCampaignDetailModal.show();
  }
  //#endregion

  async exportExcel() {
    let result: boolean = await this.dataService.getFileExtentionDataCampaignDetailAsync("/api/FileExtention/ExportDataCampaignDetail",
      this.data_campaign_id, "DataCampaignDetail");
    if (result) {
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("120"));
    }
    else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("125"));
    }
  }
}
