import { Component, OnInit, ViewChild } from '@angular/core';
import { AppConst } from 'src/app/core/common/app.constants';
import { DataService } from '../../../core/services/data.service';
import { Pagination } from '../../../core/models/pagination';
import { BsModalService, BsModalRef, ModalDirective } from 'ngx-bootstrap/modal';
import { NotificationService } from '../../../core/services/notification.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { UtilityService } from '../../../core/services/utility.service';
import { Role } from 'src/app/core/models/role';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-account-vendor',
  templateUrl: './account-vendor.component.html',
  styleUrls: ['./account-vendor.component.css']
})

export class AccountVendorComponent implements OnInit {
  @ViewChild('confirmDeleteModal', { static: false }) public confirmDeleteModal: ModalDirective;
  @ViewChild('createAccountModal', { static: false }) public createAccountModal: ModalDirective;
  @ViewChild('confirmDeleteMultiModal', { static: false }) public confirmDeleteMultiModal: ModalDirective;
  @ViewChild('editAccountModal', { static: false }) public editAccountModal: ModalDirective;
  @ViewChild('uploadImage', { static: false }) public uploadImage;
  @ViewChild('importExcel', { static: false }) public importExcel;

  public formEditAccountVendor: FormGroup;
  public dataAccount;
  public modalRef: BsModalRef;
  public pagination: Pagination = new Pagination();
  public paginationImport: Pagination = new Pagination();
  public userNameAcount;
  public accountVendorId;
  public urlImageUpload;

  public dataImportExcel = [];
  public dataImportExcelPaging = [];
  public arrKeys = [];

  public arrIdDelete: string[] = [];
  public isCheckedDelete: boolean = false;
  public arrIdCheckedDelete: string[] = [];
  public defaultAccountName: string = "";

  public itemList1 = [];
  public selectedItems1 = [];
  public settingsSingle = {};

  public dataCombobox = [];
  public selectedItemCombobox = [];
  public settingsFilter = {};

  public role: Role = new Role();

  constructor(
    private dataService: DataService,
    private modalService: BsModalService,
    private activatedRoute: ActivatedRoute,
    private notificationService: NotificationService,
    private utilityService: UtilityService) {
    this.modalService.config.backdrop = 'static';  

    this.activatedRoute.data.subscribe(data => {
      this.utilityService.getRole(data.MENU_CODE).then((response) => {
        if (response) this.role = response;
      })
    });

    this.formEditAccountVendor = new FormGroup({
      accountId: new FormControl(),
      userName: new FormControl(),
      fullName: new FormControl()
    });

    this.itemList1 = [
      { "id": 1, "itemName": "luan1" },
      { "id": 2, "itemName": "luan2" },
      { "id": 3, "itemName": "luan3" },
      { "id": 4, "itemName": "luan4" },
      { "id": 5, "itemName": "luan5" },
      { "id": 6, "itemName": "luan6" }
    ];

    this.bindDataToCombobox();

    this.selectedItems1 = [
      { "id": 1, "itemName": "Chọn gì đi" }];

    this.settingsSingle = {
      singleSelection: true
    };

    this.settingsFilter = {
      text: "Chọn gì đi",
      maxHeight: 300,
      showCheckbox: true,
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate('global.search'),
      noDataLabel: this.utilityService.translate('global.no_data_found')
    };
  }

  public async bindDataToCombobox() {
    this.selectedItemCombobox = [{ "id": 1, "itemName": "Danh sách Account" }];
    let response: any = await this.dataService.getAsync('/api/account');
    for (let index in response.data) {
      this.dataCombobox.push({ "id": response.data[index].ACCOUNT_ID, "itemName": response.data[index].USER_NAME });
    }
  }

  ngOnInit() {
    this.getDataAccountVendor();
  }

  onItemSelect(item: any) {
    console.log(item);
    console.log(this.selectedItems1);
  }

  onItemDeSelect(item: any) {
    console.log(item);
    console.log(this.selectedItemCombobox);
  }

  public onSubmitSearch(form) {
    let data = form.controls;
    let ACCOUNT_ID = data.comboboxAccount.value[0].id;
    let USER_NAME = data.comboboxAccount.value[0].itemName;
  }

  public async getDataAccountVendor() {
    let response: any = await this.dataService.getAsync('/api/account/GetListPaging?pageIndex=' + this.pagination.pageIndex + '&pageSize=' + this.pagination.pageSize);
    this.loadData(response);
    this.arrIdDelete = [];
  }

  public async getDataAccountVendorAll() {
    let response: any = await this.dataService.getAsync('/api/account/?pageIndex=' + this.pagination.pageIndex + '&pageSize=' + this.pagination.pageSize);
    this.loadData(response);
  }

  loadData(response?: any) {
    if (response) {
      this.dataAccount = response.data;
      if ('pagination' in response) {
        this.pagination.pageSize = response.pagination.PageSize;
        this.pagination.totalRow = response.pagination.TotalRows;
      }
    }
  }

  pageChanged(event: any): void {
    this.isCheckedDelete = false;
    this.arrIdCheckedDelete = [];
    this.pagination.pageIndex = event.page;
    this.getDataAccountVendor();
  }

  changePageSize(size) {
    this.pagination.pageSize = size;
    this.getDataAccountVendor();
    const timer: ReturnType<typeof setTimeout> = setTimeout(() => {
      this.pagination.pageIndex = 1;
    }, 1);
  }

  public async createAccountVendor(form) {
    let account = form.value;
    let USER_NAME = account.userName;
    let PASSWORD = account.password;
    let FULL_NAME = account.fullName;
    let PHONE = account.phone;
    let SKYPE = account.skype;
    let PAYMENT_TYPE = account.paymentType;
    let IS_ADMIN = account.isAdmin == true ? 1 : 0;
    let IS_ACTIVE = account.isActive == true ? 1 : 0;

    if (USER_NAME === '' || USER_NAME === null) {
      this.notificationService.displayWarnMessage("Chưa nhập tên tài khoản !");
      return;
    }
    if (PASSWORD === '' || PASSWORD === null) {
      this.notificationService.displayWarnMessage("Chưa nhập password !");
      return;
    }
    if (FULL_NAME === '' || FULL_NAME === null) {
      this.notificationService.displayWarnMessage("Chưa nhập họ tên !");
      return;
    }

    let response: any = await this.dataService.postAsync('/api/account', { USER_NAME, PASSWORD, FULL_NAME, PHONE, SKYPE, PAYMENT_TYPE, IS_ADMIN, IS_ACTIVE });
    if (response.err_code == 0) {
      this.getDataAccountVendor();
      form.reset();
      this.createAccountModal.hide();
      this.notificationService.displaySuccessMessage("Tạo tài khoản thành công");
    }
    else {
      this.notificationService.displayErrorMessage("Tạo tài khoản thất bại");
    }
  }

  showConfirmDeleteAccount(accountId, userName) {
    this.accountVendorId = accountId;
    this.userNameAcount = userName;
    this.confirmDeleteModal.show();
  }

  public async deleteAccountVendor(accountId) {
    this.accountVendorId = accountId;
    let response: any = await this.dataService.deleteAsync('/api/account/' + accountId + "?pageIndex=" + this.pagination.pageIndex + '&pageSize=' + this.pagination.pageSize);
    if (response.err_code == 0) {
      this.confirmDeleteModal.hide();
      this.arrIdDelete.push(accountId);
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("200"));
    }
    else {
      this.notificationService.displayErrorMessage("Xóa tài khoản thất bại");
    }
  }

  checkAllDelete(isChecked) {
    this.isCheckedDelete = isChecked;
    if (this.isCheckedDelete) {
      for (let index in this.dataAccount) {
        let accountId = this.dataAccount[index].ACCOUNT_ID;
        const indexId: number = this.arrIdCheckedDelete.indexOf(accountId);
        if (indexId === -1) {
          this.arrIdCheckedDelete.push(accountId);
        }
      }
    } else {
      this.arrIdCheckedDelete = [];
    }
  }

  checkRowDelete(isChecked, accountId) {
    const index: number = this.arrIdCheckedDelete.indexOf(accountId);
    if (index !== -1) {
      if (!isChecked) {
        this.arrIdCheckedDelete.splice(index, 1);
      }
    }
    else if (isChecked) {
      this.arrIdCheckedDelete.push(accountId);
    }

    if (this.arrIdCheckedDelete.length == 0) {
      this.isCheckedDelete = false;
    }
  }

  confirmDeleteMultiAccount() {
    if (this.arrIdCheckedDelete.length > 0) {
      this.userNameAcount = this.arrIdCheckedDelete.join(", ");
      this.confirmDeleteMultiModal.show();
    }
  }

  deleteMultiAccount() {
    for (let index in this.arrIdCheckedDelete) {
      this.deleteAccountVendor(this.arrIdCheckedDelete[index]);
    }
    this.arrIdCheckedDelete = [];
    this.confirmDeleteMultiModal.hide();
  }

  public async showConfirmEditAccount(accountId) {
    let response: any = await this.dataService.getAsync('/api/account/' + accountId);
    if (response.err_code == 0) {
      let dataAccount = response.data[0];
      this.formEditAccountVendor = new FormGroup({
        accountId: new FormControl(accountId),
        userName: new FormControl(dataAccount.USER_NAME),
        fullName: new FormControl(dataAccount.FULL_NAME)
      });
      this.editAccountModal.show();
    } else {
      this.notificationService.displayErrorMessage(response.err_message);
    }
  }

  public async editAccountVendor() {
    let formData = this.formEditAccountVendor.controls;

    let ACCOUNT_ID = formData.accountId.value;
    let USER_NAME = formData.userName.value;
    let FULL_NAME = formData.fullName.value;

    if (USER_NAME === '' || USER_NAME === null) {
      this.notificationService.displayWarnMessage("Chưa nhập tên tài khoản !");
      return;
    }
    if (FULL_NAME === '' || FULL_NAME === null) {
      this.notificationService.displayWarnMessage("Chưa nhập họ tên !");
      return;
    }

    let response: any = await this.dataService.putAsync('/api/account/' + ACCOUNT_ID, { ACCOUNT_ID, USER_NAME, FULL_NAME });
    if (response.err_code == 0) {
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("300"));
      this.getDataAccountVendor();
      this.editAccountModal.hide();
    } else {
      this.notificationService.displayErrorMessage(response.err_message);
    }
  }

  public async exportExcelAccountVendor() {
    let result: boolean = await this.dataService.getFileExtentionAsync("/api/FileExtention/ExportExcel", "Account");
    if (result) {
      this.notificationService.displaySuccessMessage("Export thành công");
    }
    else {
      this.notificationService.displayErrorMessage("Export file lỗi");
    }
  }

  public async submitUploadImage() {
    let file = this.uploadImage.nativeElement;
    if (file.files.length > 0) {
      let response: any = await this.dataService.postFileAsync(null, file.files);
      if (response) {
        this.urlImageUpload = AppConst.BASE_API + response.data;
        this.notificationService.displaySuccessMessage("Upload ảnh thành công");
      }
      else {
        this.notificationService.displayErrorMessage("Upload ảnh không thành công");
      }
    }
  }

  public async submitImportExcel() {
    let file = this.importExcel.nativeElement;
    if (file.files.length > 0) {
      let response: any = await this.dataService.importExcelAsync(null, file.files);
      if (response) {
        this.dataImportExcel = response.data;
        this.arrKeys = response.arr_fields;
        this.getDataImport(response.data);
        this.notificationService.displaySuccessMessage("Import file excel thành công");
      }
      else {
        this.notificationService.displayErrorMessage("Import file excel không thành công");
      }
    }
  }

  pageChangedImport(event: any): void {
    this.paginationImport.pageIndex = event.page;
    this.getDataImport();
  }

  changePageSizeImport(size) {
    this.paginationImport.pageSize = size;
    this.paginationImport.pageIndex = 1;
    this.getDataImport();

    const timer: ReturnType<typeof setTimeout> = setTimeout(() => {
      this.paginationImport.pageIndex = 1;
    }, 1);
  }

  getDataImport(data?: any) {
    if (this.paginationImport.pageSize != 'ALL') {
      this.dataImportExcelPaging = [];
      data = (data == null) ? this.dataImportExcel : data;
      this.paginationImport.totalRow = data.length;
      this.paginationImport.totalPage = this.utilityService.formatNumberTotalPage(this.paginationImport.totalRow / this.paginationImport.pageSize);
      let beginItem: number = (this.paginationImport.pageIndex - 1) * this.paginationImport.pageSize;

      let dataPaging: any = []; 
      for (let index in data) {
        if (Number(index) >= beginItem && Number(index) < (beginItem + Number(this.paginationImport.pageSize))) {
          dataPaging.push(data[index]);
        }
      }
      this.dataImportExcelPaging = dataPaging;
    }
    else {
      this.dataImportExcelPaging = this.dataImportExcel;
    }
  }

  async exportExcelTemplate() {
    let result: boolean = await this.dataService.getFileExtentionAsync("/api/FileExtention/ExportExcelTemplate", "Account", "Template_SMS_Customize.xls");
    if (result) {
      this.notificationService.displaySuccessMessage("Xuất template thành công");
    }
    else {
      this.notificationService.displayErrorMessage("Xuất template lỗi");
    }
  }
}
