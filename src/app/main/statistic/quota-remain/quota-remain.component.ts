import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/core/services/data.service';
import { BsModalService } from 'ngx-bootstrap';
import { NotificationService } from 'src/app/core/services/notification.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { Pagination } from 'src/app/core/models/pagination';

@Component({
  selector: 'app-quota-remain',
  templateUrl: './quota-remain.component.html',
  styleUrls: ['./quota-remain.component.css']
})
export class QuotaRemainComponent implements OnInit {

  public dataAccount = [];
  public dataSender = [];
  public quota = [];
  public slAccount: string = '';
  public slSender: string = '';
  public inFromDate: string = '';
  public inToDate: string = '';
  public settingsFilterAccount = {};
  public selectedItemComboboxAccount = [];
  public settingsFilterSender = {};
  public selectedItemComboboxSender = [];
  public pagination: Pagination = new Pagination();

  constructor(private dataService: DataService,
    private modalService: BsModalService,
    private notificationService: NotificationService,
    private authService: AuthService,
    private utilityService: UtilityService) {
    modalService.config.backdrop = 'static';

    this.settingsFilterAccount = {
      text: "Chọn tài khoản",
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      disabled: false,
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
  }

  ngOnInit() {
    this.getData();
    this.getDataAccount();
    this.getDataSender();
  }

  async getData() {
    this.slAccount = this.selectedItemComboboxAccount.length != 0 && this.selectedItemComboboxAccount[0].id != 0 ? this.selectedItemComboboxAccount[0].id : "";
    this.slSender = this.selectedItemComboboxSender.length != 0 && this.selectedItemComboboxSender[0].id != 0 ? this.selectedItemComboboxSender[0].id : "";
    let response: any = await this.dataService.getAsync('/api/sms/GetQuotaRemain?pageIndex=' + this.pagination.pageIndex + '&pageSize=' +
      this.pagination.pageSize + "&account_id=" + this.slAccount + "&sender_id=" + this.slSender +
      "&from_date=" + this.inFromDate + "&to_date=" + this.inToDate)
    this.loadData(response);
  }

  async getDataAccount() {
    this.selectedItemComboboxAccount = [{ "id": 0, "itemName": "Chọn tài khoản" }];
    let response: any = await this.dataService.getAsync('/api/account')
    for (let index in response.data) {
      this.dataAccount.push({ "id": response.data[index].ACCOUNT_ID, "itemName": response.data[index].USER_NAME });
    }
  }

  async getDataSender() {
    this.selectedItemComboboxSender = [{ "id": 0, "itemName": "Chọn thương hiệu" }];
    let accountId = this.selectedItemComboboxAccount.length != 0 && this.selectedItemComboboxAccount[0].id != 0 ? this.selectedItemComboboxAccount[0].id : "";
    let response: any = await this.dataService.getAsync('/api/AccountSenderMapping/GetByAccountOrSender?account_id=' + accountId)
    for (let index in response.data) {
      this.dataSender.push({ "id": response.data[index].SENDER_ID, "itemName": response.data[index].SENDER_NAME });
    }
  }

  loadData(response?: any) {
    if (response) {
      this.quota = response.data;
      if ('pagination' in response) {
        this.pagination.pageSize = response.pagination.PageSize;
        this.pagination.totalRow = response.pagination.TotalRows;
      }
    }
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

  changeAccount(item: any) {
    this.dataSender = [];
    this.getDataSender();
  }

  deSelectAccount() {
    this.dataSender = [];
  }

  async exportExcel() {
    let result: boolean = await this.dataService.getFileExtentionAsync("/api/FileExtention/ExportExcel", "QuotaRemain");
    if (result) {
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("120"));
    }
    else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("125"));
    }
  }
}
