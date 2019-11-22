import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { Role } from 'src/app/core/models/role';
import { AuthService } from 'src/app/core/services/auth.service';
import { DataService } from 'src/app/core/services/data.service';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from 'src/app/core/services/notification.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { Pagination } from 'src/app/core/models/pagination';

@Component({
  selector: 'app-data-cimast',
  templateUrl: './data-cimast.component.html',
  styleUrls: ['./data-cimast.component.css']
})
export class DataCimastComponent implements OnInit {

  @ViewChild('createDataCimastModal', { static: false }) public createDataCimastModal: ModalDirective;
  @ViewChild('viewDataAccountCimastTransModal', { static: false }) public viewDataAccountCimastTransModal: ModalDirective;

  public dataAccountCimast;
  public dataQuotaHistory = [];
  public total_amt_telco = 0;
  public total_amt_system = 0;
  public total_amt_system_remain = 0;
  public totalAmt = 0;
  public description = "";
  public isAdmin: boolean = false;
  public checkUserLogin: boolean = false;

  public settingsFilterAccount = {};
  public dataAccount = [];
  public selectedAccountID = [];

  public selectedAccountCreate = [];
  public selectedTypeCreate = [];

  public selectedType = [];
  public dataType = [];
  public settingsFilterType = {};

  public selectedSupplier = [];
  public dataSupplier = [];
  public settingsFilterSupplier = {};

  public pagination: Pagination = new Pagination();
  public role: Role = new Role();

  constructor(private authService: AuthService,
    private dataService: DataService,
    private activatedRoute: ActivatedRoute,
    private notificationService: NotificationService,
    private utilityService: UtilityService) {

    this.activatedRoute.data.subscribe(data => {
      this.utilityService.getRole(data.MENU_CODE).then((response) => {
        if (response) this.role = response;
      })
    });

    this.settingsFilterAccount = {
      text: "Chọn tài khoản",
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: "Tìm kiếm",
      noDataLabel: "Không có dữ liệu",
      showCheckbox: false
    };

    this.settingsFilterType = {
      text: "Chọn loại",
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: "Tìm kiếm",
      noDataLabel: "Không có dữ liệu",
      showCheckbox: false
    };

    this.settingsFilterSupplier = {
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: "Tìm kiếm",
      noDataLabel: "Không có dữ liệu",
      showCheckbox: false
    };

    this.dataType.push({ id: "DATA_SPONSOR", itemName: "DATA_SPONSOR" });
    this.dataType.push({ id: "DATA_CODE", itemName: "DATA_CODE" });

    this.dataSupplier.push({ id: "viettel", itemName: "VIETTEL" });
    this.dataSupplier.push({ id: "vms", itemName: "MOBI PHONE" });
    this.dataSupplier.push({ id: "gpc", itemName: "VINA PHONE" });
  }

  async ngOnInit() {
    await this.bindDataAccount();
    await this.getDataTotal();
  }

  // get total data
  async getDataTotal() {
    let result: any = await this.dataService.getAsync('/api/DataSponsor/GetDataSponsorBalance');
    if (result != null && result.data.length > 0) {
      this.total_amt_telco = Math.round(result.data[0].TOTAL_REMAIN);
    }

    let account = this.selectedAccountID.length != 0 && this.selectedAccountID[0].id != "" ? this.selectedAccountID[0].id : "";
    let response: any = await this.dataService.getAsync('/api/DataCimast/GetDataAccount?isAdmin=' + this.isAdmin + '&account_id=' + account);
    if (response != null && response.data.length > 0) {
      this.total_amt_system = Math.round(response.data[0].TOTAL_AMT);
      this.total_amt_system_remain = Math.round(response.data[0].TOTAL_REMAIN);
    }else{
      this.total_amt_system = 0;
      this.total_amt_system_remain = 0;
    }
  }

  //#region account
  public async bindDataAccount() {
    let result = await this.dataService.getAsync('/api/account/GetInfoAccountLogin');
    let roleAccess = result.data[0].ROLE_ACCESS;
    if (roleAccess == 50) {
      let response: any = await this.dataService.getAsync('/api/account');
      for (let index in response.data) {
        this.dataAccount.push({ "id": response.data[index].ACCOUNT_ID, "itemName": response.data[index].USER_NAME });
      }
      this.isAdmin = true;
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
        this.selectedAccountID.push({ "id": 0, "itemName": "Chọn tài khoản" });
      this.isAdmin = false;
    }
    this.getDataAccountCimast();
  }

  onItemSelect() {
    this.getDataAccountCimast();
  }

  OnItemDeSelect() {
    this.getDataAccountCimast();
  }

  onItemSelectCreate(){
    if(this.selectedAccountCreate.length > 0 && this.selectedAccountCreate[0].id == this.authService.currentUserValue.ACCOUNT_ID){
      this.checkUserLogin = true;
    }
    else{
      this.checkUserLogin = false;
    }
  }

  //#endregion

  //#region Load data
  public async getDataAccountCimast() {
    let account = this.selectedAccountID.length != 0 && this.selectedAccountID[0].id != "" ? this.selectedAccountID[0].id : "";
    let type = this.selectedType.length != 0 && this.selectedType[0].id != "" ? this.selectedType[0].id : "";
    let response = await this.dataService.getAsync('/api/DataCimast/GetDataCimastPaging?pageIndex=' + this.pagination.pageIndex + '&pageSize=' +
      this.pagination.pageSize + "&account_id=" + account + "&type=" + type + "&isAdmin=" + this.isAdmin);
    this.loadData(response);
  }
  //#endregion

  loadData(response?: any) {
    if (response) {
      this.dataAccountCimast = response.data;
      if ('pagination' in response) {
        this.pagination.pageSize = response.pagination.PageSize;
        this.pagination.totalRow = response.pagination.TotalRows;
      }
    }
  }

  //#region them giao dich tin
  openFormData() {
    this.clearBox();
    this.createDataCimastModal.show();
  }

  public async createDataCimast(data) {
    let ACCOUNT_ID = data.accountID.length > 0 ? data.accountID[0].id : "";
    let TYPE = data.type.length > 0 ? data.type[0].id : "";
    let SUPPLIER = data.supplier.length > 0 ? data.supplier[0].id : "";
    let DESCRIPTION = data.description;
    let TOTAL_AMT = data.totalAmt;

    if (ACCOUNT_ID == "") {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-68"));
      return;
    }
    if (TYPE == "") {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-67"));
      return;
    }
    if (SUPPLIER == "") {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-73"));
      return;
    }
    if (TOTAL_AMT == 0 || TOTAL_AMT == '') {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-80"));
      return;
    }

    let account: any = await this.dataService.getAsync('/api/DataCimast/GetDataAccount?isAdmin=false&account_id=' + ACCOUNT_ID);
    if (account != null && account.data.length > 0) {
      // update data account cimast
      if (account.data[0].USER_NAME != "admin") {
        //so data cap khong duoc lon hon data tong
        if (TOTAL_AMT > this.total_amt_system_remain) {
          this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("-75") + (this.total_amt_telco - this.total_amt_system));
          return;
        }
      }
      else if (TOTAL_AMT + this.total_amt_system_remain > this.total_amt_telco) {
        this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("-75") + (this.total_amt_telco - this.total_amt_system));
        return;
      }
      let TOTAL_USE = account.data[0].TOTAL_USE;
      let TOTAL_REMAIN = TOTAL_AMT;
      let TOTAL_DATA = 0;

      let response = await this.dataService.putAsync('/api/DataCimast', {
        ACCOUNT_ID, TYPE, SUPPLIER, DESCRIPTION, TOTAL_DATA, TOTAL_USE, TOTAL_REMAIN, TOTAL_AMT
      });
      if (response.err_code == 0) {
        this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("100"));
        this.getDataAccountCimast();
        this.getDataTotal();
        this.createDataCimastModal.hide();
      }
      else {
        this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
        return;
      }
    }
    else {
      // insert data account cimast
      let TOTAL_USE = 0;
      let TOTAL_REMAIN = TOTAL_AMT;
      let TOTAL_DATA = 0;
      if (data.accountID[0].itemName != "admin") {
        // so data cap khong duoc lon hon data tong
        if (TOTAL_AMT > this.total_amt_system_remain) {
          this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("-75") + (this.total_amt_telco - this.total_amt_system));
          return;
        }
      }
      else if (TOTAL_AMT + this.total_amt_system_remain > this.total_amt_telco) {
        this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("-75") + (this.total_amt_telco - this.total_amt_system));
        return;
      }

      let response = await this.dataService.postAsync('/api/DataCimast', {
        ACCOUNT_ID, TYPE, SUPPLIER, DESCRIPTION, TOTAL_DATA, TOTAL_USE, TOTAL_REMAIN, TOTAL_AMT
      });
      if (response.err_code == 0) {
        this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("300"));
        this.getDataAccountCimast();
        this.getDataTotal();
        this.createDataCimastModal.hide();
      }
      else {
        this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
        return;
      }
    }
  }
  //#endregion

  // clear box
  clearBox() {
    this.selectedAccountCreate = [];
    this.selectedTypeCreate = [];
    this.selectedSupplier = [];
    this.selectedTypeCreate.push({ "id": "DATA_SPONSOR", "itemName": "DATA_SPONSOR" });
    this.selectedSupplier.push({ "id": "viettel", "itemName": "VIETTEL" });
    this.totalAmt = 0;
    this.description = "";
  }

  //#region view lich su cap tin
  public async showConfirmViewHis(accountID) {
    let response: any = await this.dataService.getAsync('/api/DataCimast/GetDataCimastTran?account_id=' + accountID);
    if (response.err_code == 0) {
      this.dataQuotaHistory = response.data;
    }
    this.viewDataAccountCimastTransModal.show();
  }
  //#endregion
}
