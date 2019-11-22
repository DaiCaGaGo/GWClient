import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../../core/services/data.service';
import { Pagination } from '../../../core/models/pagination';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NotificationService } from '../../../core/services/notification.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { UtilityService } from 'src/app/core/services/utility.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { Role } from 'src/app/core/models/role';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-phone-blacklist',
  templateUrl: './phone-blacklist.component.html',
  styleUrls: ['./phone-blacklist.component.css']
})

export class PhoneBlacklistComponent implements OnInit {
  @ViewChild('confirmDeleteModal', { static: false }) public confirmDeleteModal: ModalDirective;
  @ViewChild('createNewModal', { static: false }) public createNewModal: ModalDirective;
  @ViewChild('editThisModal', { static: false }) public editThisModal: ModalDirective;
  @ViewChild('confirmDeleteMultiModal', { static: false }) public confirmDeleteMultiModal: ModalDirective;

  public dataPhoneBlacklist;
  public formEditPhoneBlacklist: FormGroup;
  public pagination: Pagination = new Pagination();
  public idDelete: string[] = [];
  public settingsFilter = {};
  public dataCombobox = [];
  public arrIdCheckedDelete: string[] = [];
  public isCheckedDelete: boolean = false;
  public accountid: number = 0;
  public PhoneBlacklistId;
  public selectedItemCombobox = [];
  // public phoneblacklists;
  public iPhonenumber: string = '';
  public role: Role = new Role();

  public selectedSmsType = [];
  public dataSmsType = [];
  public settingsFilterSmsType = {};
  public phoneDelete: string = ""

  constructor(
    private dataService: DataService,
    private activatedRoute: ActivatedRoute,
    private notificationService: NotificationService,
    private authService: AuthService,
    private utilityService: UtilityService) {

    this.activatedRoute.data.subscribe(data => {
      this.utilityService.getRole(data.MENU_CODE).then((response) => {
        if (response) this.role = response;
      })
    });

    this.formEditPhoneBlacklist = new FormGroup({
      id: new FormControl(),
      comboboxAccountedit: new FormControl(),
      servicename: new FormControl(),
      phonenumber: new FormControl()
    });

    // this.settingsSingle = {
    //   singleSelection: true
    // };
    this.settingsFilter = {
      text: "Chọn tài khoản",
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: "Tìm kiếm",
      noDataLabel: "Không có dữ liệu"
    };

    this.settingsFilterSmsType = {
      text: "Chọn loại dịch vụ",
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: "Tìm kiếm",
      noDataLabel: "Không có dữ liệu"
    };
  }
  ngOnInit() {
    this.bindDataAccount();
    this.bindDataSmsType();
    this.getDataPhoneBlacklist();
  }

  //#region load service type
  public async bindDataSmsType() {
    let response: any = await this.dataService.getAsync('/api/sysvar/GetSysvarByGroup?var_group=SMS_TYPE');
    for (let i in response.data) {
      this.dataSmsType.push({ "id": response.data[i].VAR_VALUE, "itemName": response.data[i].VAR_NAME });
    }
    this.getDataPhoneBlacklist();
  }

  onItemSelectSmsType() {
    this.getDataPhoneBlacklist();
  }
  //#endregion

  //#region load data account
  public async bindDataAccount() {
    let result = await this.dataService.getAsync('/api/account/GetInfoAccountLogin');
    let is_admin = result.data[0].IS_ADMIN;
    if (is_admin != null && is_admin == 1) {
      let response: any = await this.dataService.getAsync('/api/account');
      for (let index in response.data) {
        this.dataCombobox.push({ "id": response.data[index].ACCOUNT_ID, "itemName": response.data[index].USER_NAME });
      }
    }
    else {
      let response = await this.dataService.getAsync('/api/account/GetLisAccountParentAndChild?account_id=' +
        this.authService.currentUserValue.ACCOUNT_ID);
      for (let index in response.data) {
        this.dataCombobox.push({ "id": response.data[index].ACCOUNT_ID, "itemName": response.data[index].USER_NAME });
      }
      if (this.dataCombobox.length == 1)
        this.selectedItemCombobox.push({ "id": this.dataCombobox[0].id, "itemName": this.dataCombobox[0].itemName });
      else
        this.selectedItemCombobox.push({ "id": 0, "itemName": "Chọn tài khoản" });
    }
  }

  onItemSelect() {
    this.getDataPhoneBlacklist();
  }
  //#endregion

  //#region load data and paging
  setPageIndex(pageNo: number): void {
    this.pagination.pageIndex = pageNo;
    this.getDataPhoneBlacklist();
  }

  pageChanged(event: any): void {
    this.isCheckedDelete = false;
    this.arrIdCheckedDelete = [];
    this.setPageIndex(event.page);
  }

  changePageSize(size) {
    this.pagination.pageSize = size;
    this.pagination.pageIndex = 1;
    this.getDataPhoneBlacklist();
  }

  getDataPhoneBlacklist() {
    this.dataService.get('/api/phoneblacklist/GetListPaging?pageIndex=' + this.pagination.pageIndex +
      '&pageSize=' + this.pagination.pageSize +
      "&account_id=" + (this.selectedItemCombobox.length > 0 ? this.selectedItemCombobox[0].id : "") +
      '&service_name=' + (this.selectedSmsType.length > 0 ? this.selectedSmsType[0].id : "") +
      "&phone=" + this.iPhonenumber)
      .subscribe((response: any) => {
        this.loadData(response);
      });
  }

  loadData(response?: any) {
    if (response) {
      this.dataPhoneBlacklist = response.data;
      if ('pagination' in response) {
        this.pagination.pageSize = response.pagination.PageSize;
        this.pagination.totalRow = response.pagination.TotalRows;
      }
    }
  }
  //#endregion

  //#region them moi
  createPhoneBlacklist(phoneblacklists) {
    let item = phoneblacklists.value;
    if (item.account.length == 0) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-63"));
      return;
    }
    let ACCOUNT_ID: number = item.account[0].id;

    let SERVICENAME = item.serviceType.length > 0 ? item.serviceType[0].id : "";
    if (SERVICENAME == "") {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-61"));
      return;
    }
    let PHONENUMBER = item.phone;
    if (PHONENUMBER == null || PHONENUMBER == "") {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-62"));
      return;
    }
    this.dataService.post('/api/phoneblacklist', { ACCOUNT_ID, SERVICENAME, PHONENUMBER })
      .subscribe((response: any) => {
        if (response.err_code == 0) {
          this.createNewModal.hide();
          this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("100"));
          this.selectedItemCombobox = []
          this.selectedSmsType = []
          this.iPhonenumber = ""
          this.getDataPhoneBlacklist();
        }
        else if (response.err_code == -89) this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("-89"))
        else if (response.err_code == -19) {
          this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("-19"));
        }
        else {
          this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
        }
      });
  }
  //#endregion

  //#region edit
  showConfirmEditPhoneBlacklist(id) {
    this.editThisModal.show();
    this.dataService.get('/api/phoneblacklist/' + id)
      .subscribe((response: any) => {
        if (response.err_code == 0) {
          let dataPhoneBlacklist = response.data[0];
          this.formEditPhoneBlacklist = new FormGroup({
            id: new FormControl(id),
            comboboxAccountedit: new FormControl([{ "id": dataPhoneBlacklist.ACCOUNT_ID, "itemName": dataPhoneBlacklist.USER_NAME }]),
            servicename: new FormControl([{ "id": dataPhoneBlacklist.SERVICENAME, "itemName": dataPhoneBlacklist.SERVICENAME }]),
            phonenumber: new FormControl(dataPhoneBlacklist.PHONENUMBER)
          });
        } else {
          this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("103"));
        }
      })
  }

  editPhoneBlacklist() {
    let formData = this.formEditPhoneBlacklist.controls;
    let ID = formData.id.value;
    if (formData.comboboxAccountedit.value.length == 0) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-63"));
      return;
    }
    let ACCOUNT_ID = formData.comboboxAccountedit.value[0].id
    let SERVICENAME = formData.servicename.value.length > 0 ? formData.servicename.value[0].id : "";
    if (SERVICENAME == "") {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-61"));
      return;
    }
    let PHONENUMBER = formData.phonenumber.value;
    if (PHONENUMBER == null || PHONENUMBER == "" || PHONENUMBER == undefined) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-62"));
      return;
    }

    this.dataService.put('/api/phoneblacklist/' + ID, {
      ACCOUNT_ID, SERVICENAME, PHONENUMBER
    })
      .subscribe((response: any) => {
        if (response.err_code == 0) {
          this.getDataPhoneBlacklist();
          this.editThisModal.hide();
          this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("300"));
        } else if (response.err_code == -89)
          this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("-89"));
        else
          this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
      });
  }
  //#endregion

  //#region delete
  showConfirmDeletePhoneBlacklist(id, phonenumber) {
    this.PhoneBlacklistId = id;
    this.phoneDelete = phonenumber;
    this.confirmDeleteModal.show();
  }

  deletePhoneBlacklist(id) {
    this.dataService.delete('/api/phoneblacklist/' + id)
      .subscribe((response: any) => {
        if (response.err_code == 0) {
          this.confirmDeleteModal.hide();
          this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("200"));
          this.getDataPhoneBlacklist();
        }
        else {
          this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
        }
      });
  }
  //#endregion

  async exportExcel() {
    let listParameter = "accountID=" + (this.selectedItemCombobox.length > 0 ? this.selectedItemCombobox[0].id : "") +
      ",serviceName=" + (this.selectedSmsType.length > 0 ? this.selectedSmsType[0].id : "") +
      ",phone=" + this.iPhonenumber
    let result: boolean = await this.dataService.getFileExtentionParameterAsync("/api/FileExtention/ExportExcelParameter",
      "PhoneBlackList", listParameter, "PhoneBlackList")
    if (result) {
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("120"));
    }
    else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("125"));
    }
  }
}



