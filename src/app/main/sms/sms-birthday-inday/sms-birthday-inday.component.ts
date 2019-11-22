import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/core/services/data.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { Pagination } from 'src/app/core/models/pagination';
import { UtilityService } from 'src/app/core/services/utility.service';

@Component({
  selector: 'app-sms-birthday-inday',
  templateUrl: './sms-birthday-inday.component.html',
  styleUrls: ['./sms-birthday-inday.component.css']
})
export class SmsBirthdayIndayComponent implements OnInit {

  public dataCustomer

  public settingsFilterAccount = {};
  public dataAccount = [];
  public selectedAccountID = [];

  public settingsFilterGroupID = {}
  public selectedGroupID = []
  public dataGroup = []
  public phone = ""

  public pagination: Pagination = new Pagination()

  constructor(private dataService: DataService,
    private authService: AuthService,
    private utilityService: UtilityService) {
    this.settingsFilterAccount = {
      text: this.utilityService.translate("global.choose_account"),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate("global.search"),
      noDataLabel: this.utilityService.translate("global.no_data")
    }

    this.settingsFilterGroupID = {
      text: this.utilityService.translate("customers.select_group"),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate("global.search"),
      noDataLabel: this.utilityService.translate("global.no_data")
    }
  }

  ngOnInit() {
    this.bindDataAccount();
    this.loadGroup();
    this.loadDataGrid()
  }

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
      }
      else
        this.selectedAccountID.push({ "id": 0, "itemName": this.utilityService.translate("global.choose_account") });
    }
    this.loadDataGrid()
  }

  onItemSelect() {
    this.loadGroup()
    this.loadDataGrid()
  }
  //#endregion

  //#region load group
  public async loadGroup() {
    this.dataGroup = []
    this.selectedGroupID = []
    if (this.selectedAccountID.length > 0) {
      let response: any = await this.dataService.getAsync('/api/SmsBirthdayGroup/GetSmsBirthdayGroupByAccountID?accountId=' +
        this.selectedAccountID[0].id);
      if (response.err_code == 0) {
        for (let index in response.data) {
          this.dataGroup.push({ "id": response.data[index].ID, "itemName": response.data[index].GROUP_NAME });
        }
        if (this.dataGroup.length > 0)
          this.selectedGroupID.push({ "id": this.dataGroup[0].id, "itemName": this.dataGroup[0].itemName })
      }
    }
    this.loadDataGrid()
  }

  onItemSelectGroup() {
    this.loadDataGrid()
  }
  //#endregion

  //#region search
  searchData(form) {
    this.phone = form.phone.trim()
    this.loadDataGrid()
  }

  public async loadDataGrid() {
    this.dataCustomer = []
    if (this.selectedAccountID.length > 0) {
      let response: any = await this.dataService.getAsync('/api/SmsBirthday/GetListFillterPaging?pageIndex=' +
        this.pagination.pageIndex + '&pageSize=' + this.pagination.pageSize +
        '&accountID=' + this.selectedAccountID[0].id +
        '&groupID=' + (this.selectedGroupID.length > 0 ? this.selectedGroupID[0].id : "") +
        '&phone=' + this.phone)
      if (response.err_code == 0) this.loadData(response)
    }
  }

  loadData(response?: any) {
    if (response) {
      this.dataCustomer = response.data;
      if ('pagination' in response) {
        this.pagination.pageSize = response.pagination.PageSize;
        this.pagination.totalRow = response.pagination.TotalRows;
      }
    }
  }

  setPageIndex(pageNo: number): void {
    this.pagination.pageIndex = pageNo;
    this.loadDataGrid();
  }

  pageChanged(event: any): void {
    this.setPageIndex(event.page);
  }

  changePageSize(size) {
    this.pagination.pageSize = size;
    this.pagination.pageIndex = 1;
    this.loadDataGrid();
  }
  //#endregion

}
