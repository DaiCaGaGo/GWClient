import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../../core/services/data.service';
import { Pagination } from '../../../core/models/pagination';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NotificationService } from '../../../core/services/notification.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Role } from 'src/app/core/models/role';
import { UtilityService } from 'src/app/core/services/utility.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-account-fee',
  templateUrl: './account-fee.component.html',
  styleUrls: ['./account-fee.component.css']
})
export class AccountFeeComponent implements OnInit {
  @ViewChild('confirmDeleteModal', { static: false }) public confirmDeleteModal: ModalDirective;
  @ViewChild('createNewModal', { static: false }) public createNewModal: ModalDirective;
  @ViewChild('editAccountModal', { static: false }) public editAccountModal: ModalDirective;
  @ViewChild('confirmDeleteMultiModal', { static: false }) public confirmDeleteMultiModal: ModalDirective;

  public dataAccountFee;
  public formEditAccountFee: FormGroup;
  public pagination: Pagination = new Pagination();
  public account_id: number = 0;
  public accountFeeId;
  public Fee_Code;

  public dataCombobox = [];
  public settingsFilter = {};
  public selectedItemCombobox = [];
  // public settingsFilterAccount = {};
  // public dataAccount = [];
  // public selectedAccountID = [];

  public fee_code: string = "";
  public fee_name: string = "";
  public role: Role = new Role();

  constructor(
    private dataService: DataService,
    private activatedRoute: ActivatedRoute,
    private notificationService: NotificationService,
    private utilityService: UtilityService,
    private authService: AuthService) {

    this.activatedRoute.data.subscribe(data => {
      this.utilityService.getRole(data.MENU_CODE).then((response) => {
        if (response) this.role = response;
      })
    });

    this.formEditAccountFee = new FormGroup({
      tranid: new FormControl(),
      comboboxAccountedit: new FormControl(),
      fee_code: new FormControl(),
      fee_name: new FormControl(),
      fee: new FormControl(),
      don_vi_tinh: new FormControl(),
      dlvr: new FormControl(),
      dlvrURL: new FormControl(),
      emailReport: new FormControl()
    });

    this.settingsFilter = {
      text: this.utilityService.translate("global.choose_account"),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate("global.search"),
      noDataLabel: this.utilityService.translate("global.no_data")
    };
  }

  ngOnInit() {
    this.bindDataAccount();
    this.getDataAccountFee();
  }

  //#region load data account
  public async bindDataAccount() {
    let result = await this.dataService.getAsync('/api/account/GetInfoAccountLogin');
    let is_admin = result.data[0].IS_ADMIN;
    if (is_admin != null && is_admin == 1) {
      let listAccount: any = await this.dataService.getAsync('/api/account');
      for (let index in listAccount.data) {
        this.dataCombobox.push({ "id": listAccount.data[index].ACCOUNT_ID, "itemName": listAccount.data[index].USER_NAME });
      }
    }
    else {
      let listAccount = await this.dataService.getAsync('/api/account/GetLisAccountParentAndChild?account_id=' +
        this.authService.currentUserValue.ACCOUNT_ID);
      for (let index in listAccount.data) {
        this.dataCombobox.push({ "id": listAccount.data[index].ACCOUNT_ID, "itemName": listAccount.data[index].USER_NAME });
      }
      if (this.dataCombobox.length == 1) {
        this.selectedItemCombobox.push({ "id": this.dataCombobox[0].id, "itemName": this.dataCombobox[0].itemName });
      }
      else
        this.selectedItemCombobox.push({ "id": 0, "itemName": "Chọn tài khoản" });
    }
  }

  onItemSelect() {
    this.getDataAccountFee();
  }

  OnItemDeSelect() {
    this.getDataAccountFee();
  }
  //#endregion

  //#region load data and paging
  setPageIndex(pageNo: number): void {
    this.pagination.pageIndex = pageNo;
    this.getDataAccountFee();
  }

  pageChanged(event: any): void {
    this.setPageIndex(event.page);
  }

  changePageSize(size) {
    this.pagination.pageSize = size;
    this.pagination.pageIndex = 1;
    this.getDataAccountFee();
  }

  getDataAccountFee() {
    let accountId = this.selectedItemCombobox != null && this.selectedItemCombobox.length > 0 ? this.selectedItemCombobox[0].id : "";
    this.dataService.get('/api/accountfee/GetListPaging?pageIndex=' + this.pagination.pageIndex +
      '&pageSize=' + this.pagination.pageSize + '&account_id=' + accountId +
      '&fee_code=' + this.fee_code + '&fee_name=' + this.fee_name)
      .subscribe((response: any) => {
        this.loadData(response);
      }, error => {
        console.log(error)
      });
  }

  loadData(response?: any) {
    if (response) {
      this.dataAccountFee = response.data;
      if ('pagination' in response) {
        this.pagination.pageSize = response.pagination.PageSize;
        this.pagination.totalRow = response.pagination.TotalRows;
      }
    }
  }
  //#endregion

  createaccountFee(accountfee) {
    let ACCOUNT_ID = accountfee.comboboxAccount.length > 0 ? accountfee.comboboxAccount[0].id : "";
    if (ACCOUNT_ID == "") {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-63"));
      return;
    }
    let FEE_CODE = accountfee.FEE_CODE;
    let FEE_NAME = accountfee.FEE_NAME;
    let FEE = accountfee.FEE;
    let DON_VI_TINH = accountfee.DON_VI_TINH;
    this.dataService.post('/api/accountfee', { ACCOUNT_ID, FEE_CODE, FEE_NAME, FEE, DON_VI_TINH })
      .subscribe((response: any) => {
        if (response.err_code == 0) {
          this.getDataAccountFee();
          this.createNewModal.hide();
          this.notificationService.displaySuccessMessage("Thêm mới thành công");
        }
        else {
          this.notificationService.displayErrorMessage("Thêm mới thất bại");
        }
      }, error => {
        console.log(error);
        this.notificationService.displayErrorMessage("Thêm mới thất bại");
      });
  }

  showConfirmEditAccountfee(feeid) {
    this.dataService.get('/api/accountfee/' + feeid)
      .subscribe((response: any) => {
        if (response.err_code == 0) {
          let dataAccountFee = response.data[0];
          this.formEditAccountFee = new FormGroup({
            feeid: new FormControl(feeid),
            comboboxAccountedit: new FormControl([{ "id": dataAccountFee.ACCOUNT_ID, "itemName": dataAccountFee.USER_NAME }]),
            fee_code: new FormControl(dataAccountFee.FEE_CODE),
            fee_name: new FormControl(dataAccountFee.FEE_NAME),
            fee: new FormControl(dataAccountFee.FEE),
            don_vi_tinh: new FormControl(dataAccountFee.DON_VI_TINH)
          });
          this.editAccountModal.show();
        } else {
          this.notificationService.displayErrorMessage(response.err_message);
        }
      })
  }

  editAccountFee() {
    let formData = this.formEditAccountFee.controls;
    let FEE_ID = formData.feeid.value;

    let ACCOUNT_ID = formData.comboboxAccountedit.value.length > 0 ? formData.comboboxAccountedit.value[0].id : ""
    if (ACCOUNT_ID == "") {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-63"));
      return;
    }

    let FEE_CODE = formData.fee_code.value;
    let FEE_NAME = formData.fee_name.value;
    let FEE = formData.fee.value;
    let DON_VI_TINH = formData.don_vi_tinh.value;
    this.dataService.put('/api/accountfee/' + FEE_ID, { ACCOUNT_ID, FEE_CODE, FEE_NAME, FEE, DON_VI_TINH })
      .subscribe((response: any) => {
        if (response.err_code == 0) {
          this.getDataAccountFee();
          this.editAccountModal.hide();
          this.notificationService.displaySuccessMessage(response.err_message);
        } else {
          this.notificationService.displayErrorMessage(response.err_message);
        }
      }, error => {
        console.log(error);
        this.notificationService.displayErrorMessage("Sửa thất bại")
      });
  }

  showConfirmDeleteAccountFee(feeid, fee_code) {
    this.accountFeeId = feeid;
    this.Fee_Code = fee_code;
    this.confirmDeleteModal.show();
  }

  deleteAccountFee(feeid) {
    this.accountFeeId = feeid;
    this.dataService.delete('/api/accountfee/' + feeid + "?pageIndex=" + this.pagination.pageIndex + '&pageSize=' + this.pagination.pageSize)
      .subscribe((response: any) => {
        if (response.err_code == 0) {
          this.confirmDeleteModal.hide();
          this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("200"));
          this.getDataAccountFee();
        }
        else {
          this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
        }
      });
  }

  public async exportExcelaccountfee() {
    let result: boolean = await this.dataService.getFileExtentionAsync("/api/FileExtention/ExportExcel", "Account_Fee");
    if (result) {
      this.notificationService.displaySuccessMessage("Export thành công");
    }
    else {
      this.notificationService.displayErrorMessage("Export file lỗi");
    }
  }
}