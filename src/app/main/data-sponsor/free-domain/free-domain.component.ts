import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { Pagination } from 'src/app/core/models/pagination';
import { Role } from 'src/app/core/models/role';
import { AuthService } from 'src/app/core/services/auth.service';
import { DataService } from 'src/app/core/services/data.service';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from 'src/app/core/services/notification.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { FormGroup, FormControl } from '@angular/forms';
import { async } from 'q';

@Component({
  selector: 'app-free-domain',
  templateUrl: './free-domain.component.html',
  styleUrls: ['./free-domain.component.css']
})
export class FreeDomainComponent implements OnInit {

  @ViewChild('showModalCreate', { static: false }) public showModalCreate: ModalDirective;
  @ViewChild('showModalUpdate', { static: false }) public showModalUpdate: ModalDirective;
  @ViewChild('showModalDelete', { static: false }) public showModalDelete: ModalDirective;
  @ViewChild('viewDomainDetailModal', { static: false }) public viewDomainDetailModal: ModalDirective;
  @ViewChild('uploadFile', { static: false }) public uploadFile;

  public dataDomain;
  public dataDomainDetail = [];
  public domain = "";
  public status;
  public ip = "";
  public beginDate = "";
  public endDate = "";
  public id;
  public isAdmin: boolean = false;
  public checkShowDetail: boolean = false;
  public loading: boolean = false;
  public packageName_detail;
  public roleAccess = 0;
  public notification;

  public settingsFilterAccount = {};
  public dataAccount = [];
  public selectedAccountID = [];

  public selectedPackageDomain = [];
  public dataPackageDomain = [];
  public settingsFilterPackageDomain = {};

  public selectedAccountIDCreate = [];
  public selectedAccountCreate = [];
  public selectedPackageDomainCreate = [];
  public selectedPackageDomainEdit = [];

  public formEditDomain: FormGroup;
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

    this.formEditDomain = new FormGroup({
      id: new FormControl(),
      accountId: new FormControl(),
      packageDomain: new FormControl(),
      domain: new FormControl(),
      ip: new FormControl(),
      beginDate: new FormControl(),
      endDate: new FormControl(),
      status: new FormControl()
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

    this.settingsFilterPackageDomain = {
      text: "Chọn gói domain",
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: "Tìm kiếm",
      noDataLabel: "Không có dữ liệu",
      showCheckbox: false
    };
  }

  ngOnInit() {
    this.bindDataAccount();
    this.getData();
  }

  //#region account
  async bindDataAccount() {
    let result = await this.dataService.getAsync('/api/account/GetInfoAccountLogin');
    this.roleAccess = result.data[0].ROLE_ACCESS;
    if (this.roleAccess == 50) {
      this.isAdmin = true;
      let response: any = await this.dataService.getAsync('/api/account');
      for (let index in response.data) {
        this.dataAccount.push({ "id": response.data[index].ACCOUNT_ID, "itemName": response.data[index].USER_NAME });
      }
    }
    else {
      this.isAdmin = false;
      let response = await this.dataService.getAsync('/api/account/GetLisAccountParentAndChild?account_id=' +
        this.authService.currentUserValue.ACCOUNT_ID);
      for (let index in response.data) {
        this.dataAccount.push({ "id": response.data[index].ACCOUNT_ID, "itemName": response.data[index].USER_NAME });
      }
      if (this.dataAccount.length == 1) {
        this.selectedAccountID.push({ "id": this.dataAccount[0].id, "itemName": this.dataAccount[0].itemName });
        this.getPackageDomain(this.dataAccount[0].id);
      }
      else
        this.selectedAccountID.push({ "id": "", "itemName": "Chọn tài khoản" });
    }
  }

  onItemSelect() {
    this.dataPackageDomain = [];
    this.getPackageDomain(this.selectedAccountIDCreate[0].id);
    this.getData();
  }

  OnItemDeSelect() {
    this.getData();
  }

  onItemSelectCr() {
    this.dataPackageDomain = [];
    this.getPackageDomain(this.selectedAccountIDCreate[0].id);
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

  //#endregion

  // get package
  async getPackageDomain(accountId) {
    this.selectedPackageDomain = [{ "id": "", "itemName": "Chọn gói" }];
    let response: any = await this.dataService.getAsync('/api/PackageDomain/GetPackageDomainByAccount?account_id=' + accountId)
    for (let index in response.data) {
      this.dataPackageDomain.push({ "id": response.data[index].ID, "itemName": response.data[index].PACKAGE_NAME });
    }
  }

  async getData() {
    let account = this.selectedAccountID.length != 0 && this.selectedAccountID[0].id != "" ? this.selectedAccountID[0].id : "";
    let packageDomain = this.selectedPackageDomain.length != 0 && this.selectedPackageDomain[0].id != "" ? this.selectedPackageDomain[0].id : "";
    let response: any = await this.dataService.getAsync('/api/addon/GetAddonPaging?pageIndex=' + this.pagination.pageIndex +
      "&pageSize=" + this.pagination.pageSize + "&account=" + account + "&packageDomain=" + packageDomain +
      "&domain=" + this.domain + "&ip=" + this.ip)
    this.loadData(response);
  }

  loadData(response?: any) {
    if (response) {
      this.dataDomain = response.data;
      if ('pagination' in response) {
        this.pagination.pageSize = response.pagination.PageSize;
        this.pagination.totalRow = response.pagination.TotalRows;
      }
    }
  }

  //show modal create
  confirmShowModalCreate() {
    this.status = 1;
    this.showModalCreate.show();
  }

  // create
  public async createDomain(data) {
    let ACCOUNT_ID = "";
    if (this.isAdmin)
      ACCOUNT_ID = data.accountID != null && data.accountID.length > 0 ? data.accountID[0].id : "";
    if (this.isAdmin && ACCOUNT_ID == "") {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-68"));
      return;
    }

    let PACKAGE_DOMAIN_ID = data.packageDomainCreate != null && data.packageDomainCreate.length > 0 ? data.packageDomainCreate[0].id : "";
    if (PACKAGE_DOMAIN_ID == "") {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-76"));
      return;
    }

    let STATUS = data.status;
    let DOMAIN = data.domain;
    if (DOMAIN == "") {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-77"));
      return;
    }

    let IP = data.ip;
    if (data.beginDate == "") {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-78"));
      return;
    }
    let BEGIN_DATE = this.utilityService.formatDateToString(data.beginDate, "yyyyMMddHHmmss");
    if (data.endDate == "") {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-79"));
      return;
    }
    let END_DATE = this.utilityService.formatDateToString(data.endDate, "yyyyMMddHHmmss");
    if (BEGIN_DATE > END_DATE) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-35"));
      return;
    }

    let response = await this.dataService.postAsync('/api/Addon', {
      ACCOUNT_ID, PACKAGE_DOMAIN_ID, STATUS, DOMAIN, IP, BEGIN_DATE, END_DATE
    });
    if (response.err_code == 0) {
      //let responseUpload = this.submitUploadFile(response.data[0].ID);
      debugger
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("100"));
      this.clearBox();
      this.getData();
      this.showModalCreate.hide();
    }
    else if (response.err_code == -19) {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("-19"));
      return;
    }
    else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
      return;
    }
  }
  //#endregion

  // show update modal
  async confirmUpdateModal(id) {
    let response: any = await this.dataService.getAsync('/api/Addon/' + id)
    if (response.err_code == 0) {
      let detail = response.data[0];
      this.formEditDomain = new FormGroup({
        id: new FormControl(id),
        accountId: new FormControl([{ "id": detail.ACCOUNT_ID, "itemName": detail.USER_NAME }]),
        packageDomain: new FormControl([{ "id": detail.PACKAGE_DOMAIN_ID, "itemName": detail.PACKAGE_NAME }]),
        domain: new FormControl(detail.DOMAIN),
        ip: new FormControl(detail.IP),
        beginDate: new FormControl(detail.BEGIN_DATE),
        endDate: new FormControl(detail.END_DATE),
        status: new FormControl(detail.STATUS)
      });
      this.showModalUpdate.show();
    } else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
    }
  }

  // update partner product
  async editDomain() {
    let formData = this.formEditDomain.controls;
    let ID = formData.id.value;
    let PACKAGE_DOMAIN_ID = formData.packageDomain.value[0].id;
    if (PACKAGE_DOMAIN_ID === '' || PACKAGE_DOMAIN_ID === null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-76"));
      return;
    }
    let DOMAIN = formData.domain.value;
    if (DOMAIN == "" || DOMAIN == null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-77"));
      return;
    }
    let IP = formData.ip.value;
    let STATUS = formData.status.value;
    if (formData.beginDate.value == "") {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-78"));
      return;
    }
    let BEGIN_DATE = this.utilityService.formatDateToString(formData.beginDate.value, "yyyyMMddHHmmss");

    if (formData.endDate.value == "") {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-79"));
      return;
    }
    let END_DATE = this.utilityService.formatDateToString(formData.endDate.value, "yyyyMMddHHmmss");

    if (BEGIN_DATE > END_DATE) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-35"));
      return;
    }

    let response: any = await this.dataService.putAsync('/api/Addon/' + ID, { PACKAGE_DOMAIN_ID, DOMAIN, IP, BEGIN_DATE, END_DATE, STATUS })
    if (response.err_code == 0) {
      this.getData();
      this.showModalUpdate.hide();
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("300"));
    }
    else if (response.err_code == 103) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("103"));
    }
    else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
    }
  }

  confirmDeleteModal(id) {
    this.id = id;
    this.showModalDelete.show();
  }

  // delete
  async confirmDelete(id) {
    let response: any = await this.dataService.deleteAsync('/api/Addon/' + id)
    if (response.err_code == 0) {
      this.getData();
      this.showModalDelete.hide();
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("200"));
    }
    else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
    }

  }
  // clear box
  clearBox() {
    this.selectedAccountIDCreate = [];
    this.selectedPackageDomainCreate = [];
    this.domain = "";
    this.ip = "";
    this.beginDate = "";
    this.endDate = "";
    this.selectedAccountIDCreate.push({ "id": "", "itemName": "Chọn tài khoản" });
    this.selectedPackageDomainCreate.push({ "id": "", "itemName": "Chọn gói domain" });
  }

  //#region view lich su cap tin
  async showConfirmViewDetail(id) {
    let response: any = await this.dataService.getAsync('/api/Addon/GetAddonDetailByAddonId?addon_id=' + id);
    if (response.err_code == 0) {
      this.dataDomainDetail = response.data;
      if (this.dataDomainDetail != null && this.dataDomainDetail.length > 0) {
        this.packageName_detail = response.data[0].PACKAGE_NAME;
        this.checkShowDetail = true;
      }
      else {
        this.notification = "Không có số điện thoại nào";
        this.checkShowDetail = false;
      }
    }
    this.viewDomainDetailModal.show();
  }
  //#endregion

  async exportExcel() {

  }

  // upload file
  // public async submitUploadFile(id: any) {
  //   this.loading = true;
  //   let file = this.uploadFile.nativeElement;
  //   if (file.files.length > 0) {
  //     let response: any = await this.dataService.importExcelAndSaveDataAsync(null, file.files, id);
  //     if (response) {
  //       if (response == null || response.err_code != 0) {
  //         this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
  //         this.loading = false;
  //         return;
  //       }
  //       // this.uploadExcelModal.hide();
  //       // this.dataPhoneList = [];
  //       // this.bindDataPhoneList();
  //       this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("130"));
  //     }
  //     else {
  //       this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
  //     }
  //   }
  //   this.loading = false;
  // }

  clearData() {
    this.uploadFile.nativeElement.value = "";
  }

  async excelTemplate() {
    let result: boolean = await this.dataService.getFileExtentionAsync("/api/FileExtention/ExportExcelTemplate", "DataSms", "template_add_addon.xlsx");
    if (result) {
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("120"));
    }
    else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("125"));
    }
  }
}
