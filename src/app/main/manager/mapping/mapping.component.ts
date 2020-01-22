import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective, BsModalService, idLocale } from 'ngx-bootstrap';
import { DataService } from 'src/app/core/services/data.service';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from 'src/app/core/services/notification.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { Pagination } from 'src/app/core/models/pagination';
import { FormGroup, FormControl } from '@angular/forms';
import { Role } from 'src/app/core/models/role';

@Component({
  selector: 'app-mapping',
  templateUrl: './mapping.component.html',
  styleUrls: ['./mapping.component.css']
})
export class MappingComponent implements OnInit {

  @ViewChild('showModalCreate', { static: false }) public showModalCreate: ModalDirective;
  @ViewChild('showModalUpdate', { static: false }) public showModalUpdate: ModalDirective;
  @ViewChild('confirmDeleteModal', { static: false }) public confirmDeleteModal: ModalDirective;

  public pagination: Pagination = new Pagination();
  public formEditMapping: FormGroup;
  public role: Role = new Role();
  public dataSenderMapping = [];
  public dataSender = [];
  public dataTelco = [];
  public dataType = [];
  public dataPartner = [];
  public dataSenderGroup = [];
  public settingsFilterSender = {};
  public settingsFilterType = {};
  public settingsFilterPartner = {};
  public settingsFilterTelco = {};

  public selectedItemComboboxSender = [];
  public selectedItemComboboxType = [];
  public selectedItemComboboxTelco = [];
  public selectedItemComboboxPartner = [];
  public selectedItemComboboxPartnerViettel = [];
  public selectedItemComboboxPartnerGPC = [];
  public selectedItemComboboxPartnerVMS = [];
  public selectedItemComboboxPartnerVNM = [];
  public selectedItemComboboxPartnerGtel = [];

  public partnerSenderId;
  public senderName: string = "";

  public settingsFilterAccountFilter = {}
  public settingsFilterAccount = {};
  public dataAccount = [];
  public selectedAccountID = [];
  public selectedAccountFilter = []

  public settingsFilterSenderEdit = {}
  public settingsFilterTypeEdit = {}
  public settingsFilterTelcoEdit = {}

  public selectedSenderFilter = []
  public selectedServiceTypeFilter = []

  public checkActiveViettel = true
  public checkActiveGPC = true
  public checkActiveVMS = true
  public checkActiveVNM = true
  public checkActiveGtel = true

  constructor(
    private dataService: DataService,
    modalService: BsModalService,
    private activatedRoute: ActivatedRoute,
    private notificationService: NotificationService,
    private utilityService: UtilityService) {
    modalService.config.backdrop = 'static';

    this.activatedRoute.data.subscribe(data => {
      this.utilityService.getRole(data.MENU_CODE).then((response) => {
        if (response) this.role = response;
      })
    });

    this.settingsFilterAccountFilter = {
      text: this.utilityService.translate("global.choose_account"),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate("global.search"),
      noDataLabel: this.utilityService.translate("global.no_data"),
      showCheckbox: false
    };

    this.settingsFilterAccount = {
      text: this.utilityService.translate("global.choose_account"),
      singleSelection: false,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate("global.search"),
      noDataLabel: this.utilityService.translate("global.no_data"),
    };

    this.settingsFilterSender = {
      text: this.utilityService.translate("global.choose_sender"),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate("global.search"),
      noDataLabel: this.utilityService.translate("global.no_data"),
      showCheckbox: false
    };

    this.settingsFilterType = {
      text: this.utilityService.translate("global.choose_servicetype"),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate("global.search"),
      noDataLabel: this.utilityService.translate("global.no_data"),
      showCheckbox: false
    };

    this.settingsFilterPartner = {
      text: this.utilityService.translate("global.choose_port"),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate("global.search"),
      noDataLabel: this.utilityService.translate("global.no_data"),
      showCheckbox: false
    };

    this.settingsFilterTelco = {
      text: this.utilityService.translate("global.choose_telco"),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate("global.search"),
      noDataLabel: this.utilityService.translate("global.no_data"),
      showCheckbox: false
    };

    this.settingsFilterSenderEdit = {
      text: this.utilityService.translate("global.choose_sender"),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate("global.search"),
      noDataLabel: this.utilityService.translate("global.no_data"),
      showCheckbox: false,
      disabled: true
    };

    this.settingsFilterTypeEdit = {
      text: this.utilityService.translate("global.choose_servicetype"),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate("global.search"),
      noDataLabel: this.utilityService.translate("global.no_data"),
      showCheckbox: false,
      disabled: true
    };

    this.settingsFilterTelcoEdit = {
      text: this.utilityService.translate("global.choose_telco"),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate("global.search"),
      noDataLabel: this.utilityService.translate("global.no_data"),
      showCheckbox: false,
      disabled: true
    };

    this.formEditMapping = new FormGroup({
      id: new FormControl(),
      accountID: new FormControl(),
      partner: new FormControl(),
      sender: new FormControl(),
      type: new FormControl(),
      telco: new FormControl(),
      active: new FormControl(),
      maintainingFee: new FormControl(),
      orderTamp: new FormControl(),
      order: new FormControl(),
      timeReset: new FormControl()
    });

    this.dataType.push({ id: "", itemName: this.utilityService.translate("global.choose_servicetype") });
    this.dataType.push({ id: "CSKH", itemName: "CSKH" });
    this.dataType.push({ id: "QC", itemName: "QC" });
  }

  ngOnInit() {
    this.getDataAccount()
    this.getDataSender();
    this.getDataPartner();
    this.getData();
  }

  //#region load data account
  public async getDataAccount() {
    this.dataAccount = []
    this.dataAccount.push({ "id": "", "itemName": "Chọn tài khoản" });
    let response: any = await this.dataService.getAsync('/api/account');
    for (let index in response.data) {
      this.dataAccount.push({ "id": response.data[index].ACCOUNT_ID, "itemName": response.data[index].USER_NAME });
    }
  }

  onItemSelectAccount() {
    this.getData();
  }
  //#endregion

  async getData() {
    this.dataSenderMapping = []
    let response: any = await this.dataService.getAsync('/api/partnersender/GetPartnerSenderPaging?pageIndex=' +
      this.pagination.pageIndex + '&pageSize=' + this.pagination.pageSize +
      "&accountID=" + (this.selectedAccountFilter.length > 0 ? this.selectedAccountFilter[0].id : "") +
      "&senderID=" + (this.selectedSenderFilter.length > 0 ? this.selectedSenderFilter[0].id : "") +
      "&type=" + (this.selectedServiceTypeFilter.length > 0 ? this.selectedServiceTypeFilter[0].id : ""))
    this.loadData(response);
  }

  loadData(response?: any) {
    if (response) {
      this.dataSenderMapping = response.data;
      if ('pagination' in response) {
        this.pagination.pageSize = response.pagination.PageSize;
        this.pagination.totalRow = response.pagination.TotalRows;
      }
    }
  }

  async getDataSender() {
    this.dataSender = []
    this.dataSender.push({ "id": "", "itemName": this.utilityService.translate("global.choose_sender") });
    let response: any = await this.dataService.getAsync('/api/sendername')
    if (response)
      for (let index in response.data) {
        this.dataSender.push({ "id": response.data[index].ID, "itemName": response.data[index].NAME });
      }
  }

  onItemSelectSender() {
    this.getData()
  }

  onItemSelectServiceType() {
    this.getData()
  }

  async getDataPartner() {
    this.dataPartner.push({ "id": "", "itemName": this.utilityService.translate("global.choose_port") });
    let response: any = await this.dataService.getAsync('/api/partner')
    if (response)
      for (let index in response.data) {
        this.dataPartner.push({ "id": response.data[index].ID, "itemName": response.data[index].PARTNER_NAME });
      }
  }

  async getDataTelco() {
    this.dataTelco.push({ "id": "", "itemName": this.utilityService.translate("global.choose_telco") });
    let response: any = await this.dataService.getAsync('/api/telco')
    if (response)
      for (let index in response.data) {
        this.dataTelco.push({ "id": response.data[index].TEL_CODE, "itemName": response.data[index].TEL_NAME });
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

  // create mapping
  async createMapping(item) {
    let detail = item.value;
    let combobox = item.controls;

    if (this.selectedAccountID.length == 0) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-63"));
      return;
    }

    if (this.selectedItemComboboxSender.length == 0 || this.selectedItemComboboxSender[0].id == "") {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-22"));
      return;
    }
    let senderId = combobox.sender.value[0].id;
    let senderName = combobox.sender.value[0].itemName;

    if (this.selectedItemComboboxType.length == 0) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-20"));
      return;
    }
    let type = combobox.type.value[0].id;
    let listPartnerSender = [];
    let strTelco = "";

    // phân luồng viettel
    if (this.selectedItemComboboxPartnerViettel.length > 0) {
      let response: any = await this.dataService.getAsync('/api/partnersender/GetPSBySenderTypeTelco?sender=' +
        senderId + '&type=' + type + '&telco=VIETTEL');

      if (response != null && response.data.length > 0) {
        strTelco = "Viettel";
      }
      else {
        let portViettel = combobox.partnerViettel.value[0].id;
        let telco = "VIETTEL";
        let maintainingFeeViettel = detail.maintainingFeeViettel;
        let orderViettel = detail.orderViettel;
        let orderTampViettel = detail.orderTampViettel;
        let timeResetViettel = detail.timeResetViettel;
        let activeViettel = detail.activeViettel == true ? "1" : "0";
        listPartnerSender.push({
          SENDER_ID: senderId, SMS_TYPE: type, TEL_CODE: telco, PARTNER_ID: portViettel,
          PARTNER_NAME: combobox.partnerViettel.value[0].itemName,
          FEE_IN_MONTH: maintainingFeeViettel, ORDER_REAL: orderViettel, ORDER_TMP: orderTampViettel,
          TIME_RESET: timeResetViettel, ACTIVE: activeViettel, SENDER_NAME: senderName
        });
      }
    }
    debugger
    // phân luồng vina
    if (this.selectedItemComboboxPartnerGPC.length > 0) {
      let response: any = await this.dataService.getAsync('/api/partnersender/GetPSBySenderTypeTelco?sender=' +
        senderId + '&type=' + type + '&telco=GPC');
      if (response != null && response.data.length > 0) {
        strTelco = "Vina";
      }
      else {
        let portGPC = combobox.partnerGPC.value[0].id;
        let telco = "GPC";
        let maintainingFeeGPC = detail.maintainingFeeGPC;
        let orderGPC = detail.orderGPC;
        let orderTampGPC = detail.orderTampGPC;
        let timeResetGPC = detail.timeResetGPC;
        let activeGPC = detail.activeGPC == true ? "1" : "0";
        listPartnerSender.push({
          SENDER_ID: senderId, SMS_TYPE: type, TEL_CODE: telco, PARTNER_ID: portGPC, FEE_IN_MONTH: maintainingFeeGPC,
          PARTNER_NAME: combobox.partnerGPC.value[0].itemName,
          ORDER_REAL: orderGPC, ORDER_TMP: orderTampGPC, TIME_RESET: timeResetGPC, ACTIVE: activeGPC, SENDER_NAME: senderName
        });
      }
    }

    // phân luồng mobi
    if (this.selectedItemComboboxPartnerVMS.length != 0 && this.selectedItemComboboxPartnerVMS[0].id != "") {
      let response: any = await this.dataService.getAsync('/api/partnersender/GetPSBySenderTypeTelco?sender=' +
        senderId + '&type=' + type + '&telco=VMS');
      if (response != null && response.data.length > 0) {
        strTelco = "Mobi";
      }
      else {
        let portVMS = combobox.partnerVMS.value[0].id;
        let telco = "VMS";
        let maintainingFeeVMS = detail.maintainingFeeVMS;
        let orderVMS = detail.orderVMS;
        let orderTampVMS = detail.orderTampVMS;
        let timeResetVMS = detail.timeResetVMS;
        let activeVMS = detail.activeVMS == true ? "1" : "0";
        listPartnerSender.push({
          SENDER_ID: senderId, SMS_TYPE: type, TEL_CODE: telco, PARTNER_ID: portVMS, FEE_IN_MONTH: maintainingFeeVMS,
          PARTNER_NAME: combobox.partnerVMS.value[0].itemName,
          ORDER_REAL: orderVMS, ORDER_TMP: orderTampVMS, TIME_RESET: timeResetVMS, ACTIVE: activeVMS, SENDER_NAME: senderName
        });
      }
    }

    // phân luồng vietnam mobile
    if (this.selectedItemComboboxPartnerVNM.length != 0 && this.selectedItemComboboxPartnerVNM[0].id != "") {
      let response: any = await this.dataService.getAsync('/api/partnersender/GetPSBySenderTypeTelco?sender=' +
        senderId + '&type=' + type + '&telco=VNM');
      if (response != null && response.data.length > 0) {
        strTelco = "VNMobile";
      }
      else {
        let portVNM = combobox.partnerVNM.value[0].id;
        let telco = "VNM";
        let maintainingFeeVNM = detail.maintainingFeeVNM;
        let orderVNM = detail.orderVNM;
        let orderTampVNM = detail.orderTampVNM;
        let timeResetVNM = detail.timeResetVNM;
        let activeVNM = detail.activeVNM == true ? "1" : "0";
        listPartnerSender.push({
          SENDER_ID: senderId, SMS_TYPE: type, TEL_CODE: telco, PARTNER_ID: portVNM, FEE_IN_MONTH: maintainingFeeVNM,
          PARTNER_NAME: combobox.partnerVNM.value[0].itemName,
          ORDER_REAL: orderVNM, ORDER_TMP: orderTampVNM, TIME_RESET: timeResetVNM, ACTIVE: activeVNM, SENDER_NAME: senderName
        });
      }
    }

    // phân luồng gtel
    if (this.selectedItemComboboxPartnerGtel.length != 0 && this.selectedItemComboboxPartnerGtel[0].id != "") {
      let response: any = await this.dataService.getAsync('/api/partnersender/GetPSBySenderTypeTelco?sender=' +
        senderId + '&type=' + type + '&telco=GTEL');
      if (response != null && response.data.length > 0) {
        strTelco = "Gtel";
      }
      else {
        let portGtel = combobox.partnerGtel.value[0].id;
        let telco = "GTEL";
        let maintainingFeeGtel = detail.maintainingFeeGtel;
        let orderGtel = detail.orderGtel;
        let orderTampGtel = detail.orderTampGtel;
        let timeResetGtel = detail.timeResetGtel;
        let activeGtel = detail.activeGtel == true ? "1" : "0";
        listPartnerSender.push({
          SENDER_ID: senderId, SMS_TYPE: type, TEL_CODE: telco, PARTNER_ID: portGtel, FEE_IN_MONTH: maintainingFeeGtel,
          PARTNER_NAME: combobox.partnerGtel.value[0].itemName,
          ORDER_REAL: orderGtel, ORDER_TMP: orderTampGtel, TIME_RESET: timeResetGtel, ACTIVE: activeGtel, SENDER_NAME: senderName
        });
      }
    }
    let strAccount = ""
    for (let i = 0; i < this.selectedAccountID.length; i++) {
      if (i == 0) strAccount = this.selectedAccountID[i].id
      else strAccount += "," + this.selectedAccountID[i].id
    }

    if (listPartnerSender.length > 0 || strAccount != "") {
      let response: any = await this.dataService.postAsync('/api/partnersender/InsertListPartnerSender?strAccount=' + strAccount +
        "&senderID=" + senderId + "&senderName=" + senderName + "&serviceType=" + type, listPartnerSender);

      if (response.err_code == 0) {
        this.getData();
        item.reset();
        this.showModalCreate.hide();
        this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("100"));
      }
      else if (response.err_code == -19) {
        this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-19"));
      }
      else {
        this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
      }
    }
    if (strTelco != "") {
      this.notificationService.displayWarnMessage("Mạng " + strTelco + " đã được cấu hình. Vui lòng kiểm tra lại.");
      return
    }
  }

  // show update modal
  async confirmUpdateModal(id, senderID, serviceName) {
    debugger
    let response: any = await this.dataService.getAsync('/api/partnersender/' + id)
    if (response.err_code == 0) {
      let dataSenderMap = response.data[0];

      let accountSender: any = await this.dataService.getAsync('/api/AccountSenderMapping/GetByAccountBySenderAndServiceType?sender_id=' +
        senderID + "&serviceName=" + serviceName)
      let resAccount = accountSender.data
      let chooseAccount = [];
      if (resAccount.length > 0) {
        for (let i = 0; i < resAccount.length; i++) {
          chooseAccount.push({ "id": resAccount[i].ACCOUNT_ID, "itemName": resAccount[i].USER_NAME })
        }
      }
      // else chooseAccount = [{ "id": "", "itemName": "Chọn tài khoản" }]

      this.formEditMapping = new FormGroup({
        id: new FormControl(id),
        accountID: new FormControl(chooseAccount),
        sender: new FormControl([{ "id": dataSenderMap.SENDER_ID, "itemName": dataSenderMap.SENDER_NAME }]),
        type: new FormControl([{ "id": dataSenderMap.SMS_TYPE, "itemName": dataSenderMap.SMS_TYPE }]),
        telco: new FormControl([{ "id": dataSenderMap.TEL_CODE, "itemName": dataSenderMap.TEL_NAME }]),
        partner: new FormControl([{ "id": dataSenderMap.PARTNER_ID, "itemName": dataSenderMap.PARTNER_NAME }]),
        maintainingFee: new FormControl(dataSenderMap.FEE_IN_MONTH),
        orderTamp: new FormControl(dataSenderMap.ORDER_TMP),
        order: new FormControl(dataSenderMap.ORDER_REAL),
        timeReset: new FormControl(dataSenderMap.TIME_RESET),
        active: new FormControl(dataSenderMap.ACTIVE)
      });
      this.showModalUpdate.show();
    } else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
    }
  }

  // update sender name
  async editMapping() {
    let formData = this.formEditMapping.controls;
    let ID = formData.id.value;

    if (formData.accountID.value.length == 0) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-63"));
      return;
    }
    let strAccount = "";
    for (let i = 0; i < formData.accountID.value.length; i++) {
      if (i == 0) strAccount = formData.accountID.value[i].id
      else strAccount += "," + formData.accountID.value[i].id
    }

    if (formData.sender.value.length == 0) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-22"));
      return;
    }
    let SENDER_ID = formData.sender.value[0].id;
    let SENDER_NAME = formData.sender.value[0].itemName

    let SMS_TYPE = formData.type.value[0].id;
    if (SMS_TYPE == null || SMS_TYPE == "") {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-20"));
      return;
    }

    let TEL_CODE = formData.telco.value[0].id;
    if (TEL_CODE == null || TEL_CODE == "") {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-40"));
      return;
    }

    let PARTNER_ID = formData.partner.value[0].id;
    if (PARTNER_ID == null || PARTNER_ID == "") {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-33"));
      return;
    }

    let FEE_IN_MONTH = formData.maintainingFee.value;
    let ORDER_REAL = formData.order.value;
    let ORDER_TMP = formData.orderTamp.value;
    let TIME_RESET = formData.timeReset.value;
    let ACTIVE = formData.active.value == true ? "1" : "0";

    let response: any = await this.dataService.putAsync('/api/PartnerSender/UpdatePartnerSender?id=' + ID +
      '&strAccount=' + strAccount, {
      SENDER_ID, SENDER_NAME, SMS_TYPE, TEL_CODE, PARTNER_ID, FEE_IN_MONTH, ORDER_REAL, ORDER_TMP, TIME_RESET, ACTIVE
    })
    if (response.err_code == 0) {
      this.getData();
      this.showModalUpdate.hide();
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("300"));
    } else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
    }
  }

  showConfirmDelete(id, sender) {
    this.partnerSenderId = id;
    this.senderName = sender;
    this.confirmDeleteModal.show();
  }

  // delete
  async confirmDelete(id) {
    let response: any = await this.dataService.deleteAsync('/api/partnersender/' + id + "?pageIndex=" + this.pagination.pageIndex + '&pageSize=' + this.pagination.pageSize)
    if (response.err_code == 0) {
      this.getData();
      this.confirmDeleteModal.hide();
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("200"));
    }
    else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
    }
  }

  async exportExcel() {
    let listParameter = "accountID=" + (this.selectedAccountFilter.length > 0 ? this.selectedAccountFilter[0].id : "") +
      ",senderID=" + (this.selectedSenderFilter.length > 0 ? this.selectedSenderFilter[0].id : "") +
      ",type=" + (this.selectedServiceTypeFilter.length > 0 ? this.selectedServiceTypeFilter[0].id : "")
    let result: boolean = await this.dataService.getFileExtentionParameterAsync("/api/FileExtention/ExportExcelParameter",
      "PartnerSender", listParameter, "PartnerSender")
    if (result) {
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("120"));
    }
    else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("125"));
    }
  }

  confimShowModalCreate() {
    this.showModalCreate.show();
  }
}
