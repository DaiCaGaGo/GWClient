import { Component, OnInit, ViewChild, DebugNode } from '@angular/core';
import { ModalDirective, BsModalService } from 'ngx-bootstrap';
import { Pagination } from 'src/app/core/models/pagination';
import { FormGroup, FormControl } from '@angular/forms';
import { DataService } from 'src/app/core/services/data.service';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from 'src/app/core/services/notification.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { Role } from 'src/app/core/models/role';

@Component({
  selector: 'app-package',
  templateUrl: './package.component.html',
  styleUrls: ['./package.component.css']
})
export class PackageComponent implements OnInit {

  @ViewChild('showModalCreate', { static: false }) public showModalCreate: ModalDirective;
  @ViewChild('showModalUpdate', { static: false }) public showModalUpdate: ModalDirective;
  @ViewChild('confirmDeleteModal', { static: false }) public confirmDeleteModal: ModalDirective;

  public dataPackage = [];
  public dataAccount = [];
  public pagination: Pagination = new Pagination();
  public id;
  public packageName;
  public slAccount: string = '';
  public inPackageName: string = '';
  public dataFrom: string = '';
  public dataTo: string = '';
  public amt: string = '';
  public dateUse;
  public role: Role = new Role();

  public formEditPackage: FormGroup;
  public settingsFilterAccount = {};
  public settingsFilterAccountEdit = {};
  public selectedAccount = [];
  public selectedAccountCreate = [];

  constructor(
    private dataService: DataService,
    private modalService: BsModalService,
    private notificationService: NotificationService,
    private utilityService: UtilityService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute) {
    modalService.config.backdrop = 'static';

    this.activatedRoute.data.subscribe(data => {
      this.utilityService.getRole(data.MENU_CODE).then((response) => {
        if(response) this.role = response;
      })
    });

    this.settingsFilterAccount = {
      text: "Chọn tài khoản",
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: "Tìm kiếm",
      noDataLabel: "Không có dữ liệu"
    };

    this.settingsFilterAccountEdit = {
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      disabled: true
    };

    this.formEditPackage = new FormGroup({
      id: new FormControl(),
      account: new FormControl(),
      packageName: new FormControl(),
      dataFrom: new FormControl(),
      dataTo: new FormControl(),
      amt: new FormControl(),
      dateUse: new FormControl()
    });

    this.dataAccount.push({"id": "", "itemName": "Tất cả"});
  }

  async ngOnInit() {
    await this.getDataAccount();
    await this.getData();
  }

  // bind data account
  async getDataAccount() {
    let result = await this.dataService.getAsync('/api/account/GetInfoAccountLogin');
    let roleAccess = result.data[0].ROLE_ACCESS;
    if (roleAccess == 50) {
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
        this.selectedAccount.push({ "id": this.dataAccount[0].id, "itemName": this.dataAccount[0].itemName });
      }
      else
        this.selectedAccount.push({ "id": 0, "itemName": "Chọn tài khoản" });
    }
  }

  // bind data to grid
  async getData() {
    let account = this.selectedAccount.length != 0 && this.selectedAccount[0].id != "" ? this.selectedAccount[0].id : "";
    let response: any = await this.dataService.getAsync('/api/packageDomain/GetPackageDomainPaging?pageIndex=' + this.pagination.pageIndex +
      "&pageSize=" + this.pagination.pageSize + "&account_id=" + account + "&package_name=" + this.inPackageName.trim())
    this.loadData(response);
  }

  loadData(response?: any) {
    if (response) {
      this.dataPackage = response.data;
      if ('pagination' in response) {
        this.pagination.pageSize = response.pagination.PageSize;
        this.pagination.totalRow = response.pagination.TotalRows;
      }
    }
  }

  onItemSelect() {
    this.getData();
  }

  OnItemDeSelect() {
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

  // create gói cước
  async createPackage(item) {
    let pkCr = item.value;
    let data = item.controls;
    if (data.account.value == null || data.account.value.length == 0) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-68"));
      return;
    }
    let ACCOUNT_ID = data.account.value[0].id;
    let PACKAGE_NAME = pkCr.packageName;
    if (PACKAGE_NAME == "" || PACKAGE_NAME == null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-34"));
      return;
    }
    let DATA_FROM = pkCr.dataFrom;
    if (DATA_FROM == "" || DATA_FROM == null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-82"));
      return;
    }
    // else if (DATA_FROM < 300) {
    //   this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-84"));
    //   return;
    // }
    let DATA_TO = pkCr.dataTo;
    if (DATA_TO == "" || DATA_TO == null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-83"));
      return;
    }
    // else if (DATA_TO < 300) {
    //   this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-84"));
    //   return;
    // }
    if (DATA_FROM.number > DATA_TO.number) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-81"));
      return;
    }
    let DATE_USE = pkCr.dateUse;
    if (DATE_USE == "" || DATE_USE == null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-86"));
      return;
    }
    let TOTAL_AMT = pkCr.amt;
    if (TOTAL_AMT == "" || TOTAL_AMT == null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-80"));
      return;
    }
    let response: any = await this.dataService.postAsync('/api/PackageDomain', {
      ACCOUNT_ID, PACKAGE_NAME, DATA_FROM, DATA_TO, TOTAL_AMT, DATE_USE
    })
    if (response.err_code == 0) {
      this.getData();
      item.reset();
      this.showModalCreate.hide();
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("100"));
    }
    else if (response.err_code == -19) {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("-19"));
      return;
    }
    else if (response.err_code == -10) {
      this.notificationService.displayErrorMessage(response.err_message);
      return;
    }
    else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
      return;
    }
  }

  // show update modal
  async confirmUpdateModal(id) {
    let response: any = await this.dataService.getAsync('/api/PackageDomain/' + id)
    if (response.err_code == 0) {
      let dataSmsTemp = response.data[0];
      this.formEditPackage = new FormGroup({
        id: new FormControl(id),
        account: new FormControl([{ "id": dataSmsTemp.ACCOUNT_ID, "itemName": dataSmsTemp.USER_NAME }]),
        packageName: new FormControl(dataSmsTemp.PACKAGE_NAME),
        dataFrom: new FormControl(dataSmsTemp.DATA_FROM),
        dataTo: new FormControl(dataSmsTemp.DATA_TO),
        amt: new FormControl(dataSmsTemp.TOTAL_AMT),
        dateUse: new FormControl(dataSmsTemp.DATE_USE),
      });
      this.showModalUpdate.show();
    } else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
    }
  }

  // update tin mẫu
  async editPackage() {
    let formData = this.formEditPackage.controls;
    let ID = formData.id.value;
    let ACCOUNT_ID = formData.account.value[0].id;
    if (ACCOUNT_ID === '' || ACCOUNT_ID === null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-68"));
      return;
    }
    let PACKAGE_NAME = formData.packageName.value;
    if (PACKAGE_NAME == "" || PACKAGE_NAME == null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-34"));
      return;
    }
    let DATA_FROM = formData.dataFrom.value;
    if (DATA_FROM == "" || DATA_FROM == null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-82"));
      return;
    }
    else if (DATA_FROM.number < 300) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-84"));
      return;
    }
    let DATA_TO = formData.dataTo.value;
    if (DATA_TO == "" || DATA_TO == null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-83"));
      return;
    }
    else if (DATA_TO.number < 300) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-84"));
      return;
    }
    if (DATA_FROM.number > DATA_TO.number) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-81"));
      return;
    }
    let DATE_USE = formData.dateUse.value;
    if (DATE_USE == "" || DATE_USE == null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-86"));
      return;
    }
    let TOTAL_AMT = formData.amt.value;
    if (TOTAL_AMT == "" || TOTAL_AMT == null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-80"));
      return;
    }
    let response: any = await this.dataService.putAsync('/api/PackageDomain/' + ID, {
      PACKAGE_NAME, DATA_FROM, DATA_TO, TOTAL_AMT, DATE_USE
    })
    if (response.err_code == 0) {
      this.getData();
      this.showModalUpdate.hide();
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("300"));
    }
    else if (response.err_code == 103) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("103"));
    }
    else if (response.err_code == -10) {
      this.notificationService.displayErrorMessage(response.err_message);
      return;
    }
    else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
    }
  }

  showConfirmDelete(id, packageName) {
    this.id = id;
    this.packageName = packageName;
    this.confirmDeleteModal.show();
  }

  // delete
  async confirmDelete(id) {
    let response: any = await this.dataService.deleteAsync('/api/PackageDomain/' + id + "?pageIndex=" + this.pagination.pageIndex + '&pageSize=' + this.pagination.pageSize)
    if (response.err_code == 0) {
      this.getData();
      this.confirmDeleteModal.hide();
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("200"));
    }
    else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
    }
  }
}
