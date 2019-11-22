import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../../core/services/data.service';
import { Pagination } from 'src/app/core/models/pagination';
import { BsModalService, ModalDirective } from 'ngx-bootstrap';
import { AuthService } from 'src/app/core/services/auth.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Role } from 'src/app/core/models/role';
import { UtilityService } from 'src/app/core/services/utility.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-account-sender',
  templateUrl: './account-sender.component.html',
  styleUrls: ['./account-sender.component.css']
})
export class AccountSenderComponent implements OnInit {
  @ViewChild('createModal', { static: false }) public createModal: ModalDirective;
  @ViewChild('confirmDeleteModal', { static: false }) public confirmDeleteModal: ModalDirective;
  @ViewChild('editModal', { static: false }) public editModal: ModalDirective;

  public formEdit: FormGroup;
  public account_id: string = "";
  public sender_id;
  public service_type: String = "";

  public dataAccountSender;
  public listSenderNotInAccount;
  public listSender;
  public lstPartner;
  public pagination: Pagination = new Pagination();

  public settingsFilterAccount = {};
  public settingsFilterAccountEdit = {}
  public dataAccount = [];
  public selectedAccountFilter = [];
  public selectedAccountID = []

  public settingsFilterSender = {};
  public settingsFilterSenderEdit = {};
  public selectedSenderID = [];
  public selectedSenderFilter = []
  public dataSender = [];

  public dataPartner = [];
  public settingsFilterPartner = {};
  public selectedPartnerVTL = [];
  public selectedPartnerVNM = [];
  public selectedPartnerGPC = [];
  public selectedPartnerGtel = [];
  public selectedPartnerSfone = [];
  public selectedPartnerVMS = [];
  public selectedPartnerDDMB = [];

  public dataServiceType = [];
  public selectedServiceType = [];
  public settingsFilterServiceType = {};
  public settingsFilterServiceTypeEdit = {}

  public role: Role = new Role();

  constructor(private dataService: DataService,
    private modalService: BsModalService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private notificationService: NotificationService,
    private utilityService: UtilityService) {
    modalService.config.backdrop = 'static';

    this.activatedRoute.data.subscribe(data => {
      this.utilityService.getRole(data.MENU_CODE).then((response) => {
        if (response) this.role = response;
      })
    });

    this.formEdit = new FormGroup({
      accountID: new FormControl,
      senderID: new FormControl(),
      senderName: new FormControl(),
      partner_vtl: new FormControl(),
      partner_gpc: new FormControl(),
      partner_vms: new FormControl(),
      partner_vnm: new FormControl(),
      partner_sfone: new FormControl(),
      partner_gtel: new FormControl(),
      partner_ddmobile: new FormControl(),
      serviceType: new FormControl()
    });

    this.settingsFilterAccount = {
      text: "Chọn tài khoản",
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: "Tìm kiếm",
      noDataLabel: "Không có dữ liệu"
    };
    this.bindDataAccount();

    this.settingsFilterSender = {
      text: "Chọn thương hiệu",
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: "Tìm kiếm",
      noDataLabel: "Không có dữ liệu"
    };
    this.settingsFilterPartner = {
      text: "Chọn đối tác",
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: "Tìm kiếm",
      noDataLabel: "Không có dữ liệu"
    };

    this.settingsFilterServiceType = {
      text: "Chọn loại dịch vụ",
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: "Tìm kiếm",
      noDataLabel: "Không có dữ liệu"
    };

    this.settingsFilterServiceTypeEdit = {
      text: "Chọn loại dịch vụ",
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      disabled: true,
      searchPlaceholderText: "Tìm kiếm",
      noDataLabel: "Không có dữ liệu"
    };

    this.settingsFilterAccountEdit = {
      text: "Chọn tài khoản",
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      disabled: true,
      searchPlaceholderText: "Tìm kiếm",
      noDataLabel: "Không có dữ liệu"
    };
    this.settingsFilterSenderEdit = {
      text: "Chọn thương hiệu",
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      disabled: true,
      searchPlaceholderText: "Tìm kiếm",
      noDataLabel: "Không có dữ liệu"
    };
  }

  ngOnInit() {
    this.bindDataSender();
    this.bindDataPartner();
    this.dataServiceType.push({ id: "CSKH", itemName: "CSKH" });
    this.dataServiceType.push({ id: "QC", itemName: "QC" });
    this.selectedServiceType.push({ "id": this.dataServiceType[0].id, "itemName": this.dataServiceType[0].itemName })
  }

  //#region load partner
  public async bindDataPartner() {
    let response = await this.dataService.getAsync('/api/Partner');
    for (let i in response.data) {
      this.dataPartner.push({ "id": response.data[i].PARTNER_CODE, "itemName": response.data[i].PARTNER_NAME });
    }
  }
  //#endregion

  //#region load Account
  public async bindDataAccount() {
    let result = await this.dataService.getAsync('/api/account/GetInfoAccountLogin');
    let is_admin = result.data[0].IS_ADMIN;
    if (is_admin != null && is_admin == 1) {
      let response: any = await this.dataService.getAsync('/api/account');
      for (let index in response.data) {
        this.dataAccount.push({ "id": response.data[index].ACCOUNT_ID, "itemName": response.data[index].USER_NAME });
      }
      if (response.data.length > 0) {
        this.getListAccountSender();
      }
    }
    else {
      let response = await this.dataService.getAsync('/api/account/GetLisAccountParentAndChild?account_id=' +
        this.authService.currentUserValue.ACCOUNT_ID);
      for (let index in response.data) {
        this.dataAccount.push({ "id": response.data[index].ACCOUNT_ID, "itemName": response.data[index].USER_NAME });
      }
      if (this.dataAccount.length == 1)
        this.selectedAccountFilter.push({ "id": this.dataAccount[0].id, "itemName": this.dataAccount[0].itemName });
      else
        this.selectedAccountFilter.push({ "id": 0, "itemName": "Chọn tài khoản" });
    }
  }


  onItemSelect() {
    this.getListAccountSender();
  }

  OnItemDeSelect() {
    this.getListAccountSender();
  }

  changeSelectAccount() {
    this.getPartnerFromPartnerSender();
  }

  changeSelectSenderCreate(){
    this.getPartnerFromPartnerSender();
  }
  //#endregion

  //#region  load sender by account
  public async bindDataSender() {
    this.dataSender = []
    this.dataSender.push({ "id": "", "itemName": "Chọn thương hiệu" });
    let response: any = await this.dataService.getAsync('/api/sendername')
    if (response)
      for (let index in response.data) {
        this.dataSender.push({ "id": response.data[index].ID, "itemName": response.data[index].NAME });
      }
  }

  changeSelectSender() {
    this.getListAccountSender()
  }

  changeDeSelectSender() {
    this.getListAccountSender()
  }
  //#endregion

  //#region load data and pagging
  async getListAccountSender() {
    let response: any = await this.dataService.getAsync('/api/SenderName/GetSenderByAcount?pageIndex=' +
      this.pagination.pageIndex + '&pageSize=' + this.pagination.pageSize +
      "&account_id=" + (this.selectedAccountFilter.length > 0 ? this.selectedAccountFilter[0].id : "") +
      "&sender_id=" + (this.selectedSenderFilter.length > 0 ? this.selectedSenderFilter[0].id : ""));
    this.loadDataAccountSender(response);
  }

  loadDataAccountSender(response?: any) {
    if (response) {
      this.dataAccountSender = response.data;
      if ('pagination' in response) {
        this.pagination.pageSize = response.pagination.PageSize;
        this.pagination.totalRow = response.pagination.TotalRows;
      }
    }
  }

  setPageIndex(pageNo: number): void {
    this.pagination.pageIndex = pageNo;
    this.getListAccountSender();
  }

  pageChanged(event: any): void {
    this.setPageIndex(event.page);
  }

  changePageSize(size) {
    this.pagination.pageSize = size;
    this.pagination.pageIndex = 1;
    this.getListAccountSender();
  }
  //#endregion

  //#region create new account-sender
  changeSelectServiceType(){
    this.getPartnerFromPartnerSender();
  }

  public async createAddModal() {
    this.selectedPartnerVTL = [];
    this.selectedPartnerDDMB = [];
    this.selectedPartnerGPC = [];
    this.selectedPartnerGtel = [];
    this.selectedPartnerSfone = [];
    this.selectedPartnerVMS = [];
    this.selectedPartnerVNM = [];

    this.createModal.show();
    if (this.dataAccount.length > 0) {
      this.selectedAccountID = [];
      this.selectedAccountID.push({ "id": this.dataAccount[0].id, "itemName": this.dataAccount[0].itemName });
      this.getPartnerFromPartnerSender();
    }
  }
  public async createSender(form) {
    let ACCOUNT_ID = form.accountID[0].id;
    let SENDER_ID = form.senderID[0].id;
    if (ACCOUNT_ID == "" || ACCOUNT_ID == 0 || SENDER_ID == "" || SENDER_ID == 0) {
      this.notificationService.displayErrorMessage("Tài khoản hoặc thương hiệu không được trống!");
      return;
    }

    let SENDER_NAME = form.senderID[0].itemName;
    if (SENDER_NAME == "") {
      this.notificationService.displayErrorMessage("Tên thương hiệu không tồn tại!");
      return;
    }

    let SERVICE_NAME = this.selectedServiceType.length > 0 ? this.selectedServiceType[0].id : "";
    if (SERVICE_NAME == "") {
      this.notificationService.displayErrorMessage("Loại dịch vụ không được trống!");
      return;
    }

    let PARTNER_CODE_VTL = form.partner_vtl.length > 0 ? form.partner_vtl[0].id : "";
    let PARTNER_CODE_VNM = form.partner_vnm.length > 0 ? form.partner_vnm[0].id : "";
    let PARTNER_CODE_GPC = form.partner_gpc.length > 0 ? form.partner_gpc[0].id : "";
    let PARTNER_CODE_GTEL = form.partner_gtel.length > 0 ? form.partner_gtel[0].id : "";
    let PARTNER_CODE_VMS = form.partner_vms.length > 0 ? form.partner_vms[0].id : "";
    let PARTNER_CODE_SFONE = form.partner_sfone.length > 0 ? form.partner_sfone[0].id : "";
    let PARTNER_CODE_DDMBLE = form.partner_ddmobile.length > 0 ? form.partner_ddmobile[0].id : "";

    let CREATE_USER = this.authService.currentUserValue.USER_NAME;
    let dataInsert = await this.dataService.postAsync('/api/AccountSenderMapping', {
      ACCOUNT_ID, SENDER_ID, SENDER_NAME, SERVICE_NAME,
      PARTNER_CODE_VTL, PARTNER_CODE_GPC, PARTNER_CODE_VMS, PARTNER_CODE_VNM, PARTNER_CODE_SFONE,
      PARTNER_CODE_GTEL, PARTNER_CODE_DDMBLE, CREATE_USER
    });
    if (dataInsert.err_code == 0) {
      this.createModal.hide();
      this.getListAccountSender();
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("100"));
    }
    else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage(dataInsert.err_code));
    }
  }
  closeFormCreate() {
    this.createModal.hide();
    this.selectedAccountID = [];
    this.getListAccountSender();
  }
  //#endregion

  //#region  load partner by sender
  public async getPartnerFromPartnerSender() {
    this.selectedPartnerVTL = [];
    this.selectedPartnerGPC = [];
    this.selectedPartnerVMS = [];
    this.selectedPartnerVNM = [];
    this.selectedPartnerGtel = [];
    if (this.selectedSenderID.length > 0 && this.selectedServiceType.length > 0) {
      let response: any = await this.dataService.getAsync('/api/AccountSenderMapping/GetPartnerFormPartnerSender?sender_id=' +
        this.selectedSenderID[0].id + '&sms_type=' + this.selectedServiceType[0].id);
      let partner = response.data;
      if (partner.length > 0) {
        if (partner[0].PARTNER_CODE_VTL != undefined && partner[0].PARTNER_CODE_VTL != "")
          this.selectedPartnerVTL.push({ "id": partner[0].PARTNER_CODE_VTL, "itemName": partner[0].PARTNER_CODE_VTL });
        if (partner[0].PARTNER_CODE_GPC != undefined && partner[0].PARTNER_CODE_GPC != "")
          this.selectedPartnerGPC.push({ "id": partner[0].PARTNER_CODE_GPC, "itemName": partner[0].PARTNER_CODE_GPC });
        if (partner[0].PARTNER_CODE_VMS != undefined && partner[0].PARTNER_CODE_VMS != "")
          this.selectedPartnerVMS.push({ "id": partner[0].PARTNER_CODE_VMS, "itemName": partner[0].PARTNER_CODE_VMS });
        if (partner[0].PARTNER_CODE_VNM != undefined && partner[0].PARTNER_CODE_VNM != "")
          this.selectedPartnerVNM.push({ "id": partner[0].PARTNER_CODE_VNM, "itemName": partner[0].PARTNER_CODE_VNM });
        if (partner[0].PARTNER_CODE_GTEL != undefined && partner[0].PARTNER_CODE_GTEL != "")
          this.selectedPartnerGtel.push({ "id": partner[0].PARTNER_CODE_GTEL, "itemName": partner[0].PARTNER_CODE_GTEL });
      }
    }
  }
  //#endregion

  //#region edit data
  async showFormEdit(accountID, senderID, serviceType) {
    let dataEdit = await this.dataService.getAsync('/api/AccountSenderMapping/GetByAccountAndSender?account_id=' +
      accountID + "&sender_id=" + senderID + "&serviceType=" + serviceType);
    if (dataEdit.err_code == 0) {
      let dataAccountSender = dataEdit.data[0];
      this.formEdit = new FormGroup({
        accountID: new FormControl([{ "id": dataAccountSender.ACCOUNT_ID, "itemName": dataAccountSender.USER_NAME }]),
        senderID: new FormControl([{ "id": dataAccountSender.SENDER_ID, "itemName": dataAccountSender.SENDER_NAME }]),
        senderName: new FormControl(dataAccountSender.SENDER_NAME),
        partner_vtl: new FormControl(dataAccountSender.PARTNER_CODE_VTL != "" ?
          [{ "id": dataAccountSender.PARTNER_CODE_VTL, "itemName": dataAccountSender.PARTNER_CODE_VTL }] :
          [{ "id": "", "itemName": "Chọn đối tác" }]),
        partner_gpc: new FormControl(dataAccountSender.PARTNER_CODE_GPC != "" ?
          [{ "id": dataAccountSender.PARTNER_CODE_GPC, "itemName": dataAccountSender.PARTNER_CODE_GPC }] :
          [{ "id": "", "itemName": "Chọn đối tác" }]),
        partner_vms: new FormControl(dataAccountSender.PARTNER_CODE_VMS != "" ?
          [{ "id": dataAccountSender.PARTNER_CODE_VMS, "itemName": dataAccountSender.PARTNER_CODE_VMS }] :
          [{ "id": "", "itemName": "Chọn đối tác" }]),
        partner_vnm: new FormControl(dataAccountSender.PARTNER_CODE_VNM != "" ?
          [{ "id": dataAccountSender.PARTNER_CODE_VNM, "itemName": dataAccountSender.PARTNER_CODE_VNM }] :
          [{ "id": "", "itemName": "Chọn đối tác" }]),
        partner_sfone: new FormControl(dataAccountSender.PARTNER_CODE_SFONE != "" ?
          [{ "id": dataAccountSender.PARTNER_CODE_SFONE, "itemName": dataAccountSender.PARTNER_CODE_SFONE }] :
          [{ "id": "", "itemName": "Chọn đối tác" }]),
        partner_gtel: new FormControl(dataAccountSender.PARTNER_CODE_GTEL != "" ?
          [{ "id": dataAccountSender.PARTNER_CODE_GTEL, "itemName": dataAccountSender.PARTNER_CODE_GTEL }] :
          [{ "id": "", "itemName": "Chọn đối tác" }]),
        partner_ddmobile: new FormControl(dataAccountSender.PARTNER_CODE_DDMBLE != "" ?
          [{ "id": dataAccountSender.PARTNER_CODE_DDMBLE, "itemName": dataAccountSender.PARTNER_CODE_DDMBLE }] :
          [{ "id": "", "itemName": "Chọn đối tác" }]),
        serviceType: new FormControl(dataAccountSender.SERVICE_NAME != "" ?
          [{ "id": dataAccountSender.SERVICE_NAME, "itemName": dataAccountSender.SERVICE_NAME }] :
          [{ "id": "", "itemName": "Chọn loại dịch vụ" }])
      });
      this.editModal.show();
    } else {
      this.notificationService.displayErrorMessage(dataEdit.err_message);
    }
  }

  async editData() {
    let formData = this.formEdit.controls;

    let ACCOUNT_ID = formData.accountID.value[0].id;
    let SENDER_ID = formData.senderID.value[0].id;
    let SENDER_NAME = formData.senderID.value[0].itemName;
    let SERVICE_NAME = formData.serviceType.value[0].id;
    let PARTNER_CODE_VTL = formData.partner_vtl.value.length > 0 ? formData.partner_vtl.value[0].id : "";
    let PARTNER_CODE_GPC = formData.partner_gpc.value.length > 0 ? formData.partner_gpc.value[0].id : "";
    let PARTNER_CODE_VMS = formData.partner_vms.value.length > 0 ? formData.partner_vms.value[0].id : "";
    let PARTNER_CODE_VNM = formData.partner_vnm.value.length > 0 ? formData.partner_vnm.value[0].id : "";
    let PARTNER_CODE_SFONE = formData.partner_sfone.value.length > 0 ? formData.partner_sfone.value[0].id : "";
    let PARTNER_CODE_GTEL = formData.partner_gtel.value.length > 0 ? formData.partner_gtel.value[0].id : "";
    let PARTNER_CODE_DDMBLE = formData.partner_ddmobile.value.length > 0 ? formData.partner_ddmobile.value[0].id : "";
    let EDIT_USER = this.authService.currentUserValue.USER_NAME;

    let dataMap = await this.dataService.getAsync('/api/AccountSenderMapping/GetByAccountAndSender?account_id=' +
      ACCOUNT_ID + "&sender_id=" + SENDER_ID + "&serviceType=" + SERVICE_NAME);
    let id_map = dataMap.data[0].ID;

    let dataEdit = await this.dataService.putAsync('/api/AccountSenderMapping/' + id_map, {
      ACCOUNT_ID, SENDER_ID, SENDER_NAME, SERVICE_NAME,
      PARTNER_CODE_VTL, PARTNER_CODE_GPC, PARTNER_CODE_VMS, PARTNER_CODE_VNM, PARTNER_CODE_SFONE,
      PARTNER_CODE_GTEL, PARTNER_CODE_DDMBLE, EDIT_USER
    });
    if (dataEdit.err_code == 0) {
      this.getListAccountSender();
      this.editModal.hide();
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("300"));
    } else {
      this.notificationService.displayErrorMessage(dataEdit.err_message);
    }
  }
  //#endregion

  //#region xóa dữ liệu
  showConfirmDelete(accountid, senderid, serviceType) {
    this.account_id = accountid;
    this.sender_id = senderid;
    this.service_type = serviceType
    debugger
    this.confirmDeleteModal.show();
  }

  deleteAccountSender(accountID, senderID, serviceType) {
    debugger
    this.account_id = accountID;
    this.sender_id = senderID
    this.dataService.delete('/api/AccountSenderMapping/DeleteAccountSenderMappingByAccountAndSender?account_id=' +
      this.account_id + '&sender_id=' + this.sender_id + "&serviceType=" + serviceType)
      .subscribe((response: any) => {
        if (response.err_code == 0) {
          this.confirmDeleteModal.hide();
          this.notificationService.displaySuccessMessage("Xóa thành công");
          this.getListAccountSender();
        }
        else {
          this.notificationService.displayErrorMessage("Xóa thất bại");
        }
      }, error => {
        console.log(error);
        this.notificationService.displayErrorMessage("Có lỗi xảy ra!");
      });
  }
  //#endregion

}
