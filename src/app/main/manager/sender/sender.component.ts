import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective, BsModalService } from 'ngx-bootstrap';
import { Pagination } from 'src/app/core/models/pagination';
import { FormGroup, FormControl } from '@angular/forms';
import { DataService } from 'src/app/core/services/data.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { Role } from 'src/app/core/models/role';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sender',
  templateUrl: './sender.component.html',
  styleUrls: ['./sender.component.css']
})
export class SenderComponent implements OnInit {

  @ViewChild('showModalCreate', { static: false }) public showModalCreate: ModalDirective;
  @ViewChild('showModalUpdate', { static: false }) public showModalUpdate: ModalDirective;
  @ViewChild('showModalThread', { static: false }) public showModalThread: ModalDirective;
  @ViewChild('confirmDeleteMultiModal', { static: false }) public confirmDeleteMultiModal: ModalDirective;
  @ViewChild('confirmDeleteModal', { static: false }) public confirmDeleteModal: ModalDirective

  public dataSender;
  public dataSenderGroup = [];
  public pagination: Pagination = new Pagination();
  public name;
  public inSenderGroup: string = '';
  public inSenderName: string = '';
  public isCheckedDelete: boolean = false;
  public arrIdCheckedDelete: string[] = [];
  public arrIdDelete: string[] = [];
  public arrName: string[] = [];
  public formEditSenderName: FormGroup;
  public fillterTemp: boolean;
  public isDisableTemp = true;

  public timeStart: Date = new Date();
  public timeExpired: Date = new Date();
  public timeExpiredVTL: Date = new Date();
  public timeExpiredGPC: Date = new Date();
  public timeExpiredVMS: Date = new Date();
  public timeExpiredVNM: Date = new Date();
  public timeExpiredGTEL: Date = new Date();

  public settingsFilterSenderGroup = {};
  public settingsFilterSenderGroupModal = {};
  public selectedItemComboboxSenderGroup = [];
  public selectedItemComboboxSenderGroupVTL = [];
  public selectedItemComboboxSenderGroupGPC = [];
  public selectedItemComboboxSenderGroupVMS = [];
  public selectedItemComboboxSenderGroupVNM = [];
  public selectedItemComboboxSenderGroupGTEL = [];
  public selectedItemComboboxSenderGroupSFONE = [];
  public role: Role = new Role();

  public senderThreadID;
  public senderThreadName;
  public dataPartnerSender = [];

  public settingsFilterTelco = {};
  public dataTelco = [];
  public selectedTelco = [];

  public settingsFilterPartner = {};
  public dataPartner = []
  public selectedPartner = []

  public feeInMonth;
  public isActive = false;
  public orderReal = "";
  public orderTmp = "";
  public timeReset = "";
  public idPartnerSender = 0;
  public isShowAdd = true;
  public isShowEdit = false;
  public isCheckFillter = 0;
  public senderDelete
  public senderNameDelete = ""

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

    this.formEditSenderName = new FormGroup({
      id: new FormControl(),
      iSenderName: new FormControl(),
      senderGrVTL: new FormControl(),
      senderNameVTL: new FormControl(),
      senderGrGPC: new FormControl(),
      senderNameGPC: new FormControl(),
      senderGrVMS: new FormControl(),
      senderNameVMS: new FormControl(),
      description: new FormControl(),
      fillterTemp: new FormControl(),
      tempContent: new FormControl(),
      senderGrVNM: new FormControl(),
      senderNameVNM: new FormControl(),
      senderGrSFONE: new FormControl(),
      senderNameSFONE: new FormControl(),
      senderGrDDMBILE: new FormControl(),
      //senderNameDDMBILE: new FormControl(),
      senderGrGTEL: new FormControl(),
      senderNameGTEL: new FormControl(),
      fromDate: new FormControl(),
      expiredDate: new FormControl(),
      expiredDateVIETTEL: new FormControl(),
      expiredDateGPC: new FormControl(),
      expiredDateVMS: new FormControl(),
      expiredDateVNM: new FormControl(),
      expiredDateGTEL: new FormControl()
    });

    this.settingsFilterSenderGroup = {
      text: this.utilityService.translate("partner_sender.iSender_grroup"),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate("global.search"),
      noDataLabel: this.utilityService.translate("global.no_data")
    };

    this.settingsFilterTelco = {
      text: this.utilityService.translate("global.choose_telco"),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      disabled: false,
      searchPlaceholderText: this.utilityService.translate("global.search"),
      noDataLabel: this.utilityService.translate("global.no_data")
    };

    this.settingsFilterPartner = {
      text: this.utilityService.translate("global.choose_partner"),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      disabled: false,
      searchPlaceholderText: this.utilityService.translate("global.search"),
      noDataLabel: this.utilityService.translate("global.no_data")
    };
  }

  ngOnInit() {
    this.timeExpired.setFullYear(this.timeExpired.getFullYear() + 1)
    this.timeExpiredVTL.setFullYear(this.timeExpiredVTL.getFullYear() + 1)
    this.timeExpiredGPC.setFullYear(this.timeExpiredGPC.getFullYear() + 1)
    this.timeExpiredVMS.setFullYear(this.timeExpiredVMS.getFullYear() + 1)
    this.timeExpiredVNM.setFullYear(this.timeExpiredVNM.getFullYear() + 1)
    this.timeExpiredGTEL.setFullYear(this.timeExpiredGTEL.getFullYear() + 1)
    if (this.activatedRoute.snapshot.queryParamMap.get('redirectTo') && this.activatedRoute.snapshot.queryParamMap.get('redirectTo') == 'sender_expired') {
      this.getSenderExpired();
    } else {
      this.getData();
    }
    this.getDataSenderGroup();
  }

  public async getSenderExpired() {
    let response = await this.dataService.getAsync('/api/SenderName/GetSenderExpiredTime/');
    if (response) {
      this.loadData(response);
    }
  }

  //#region load data and paging
  async getData() {
    this.inSenderGroup = (this.selectedItemComboboxSenderGroup.length > 0) ? this.selectedItemComboboxSenderGroup[0].id : "";
    let response: any = await this.dataService.getAsync('/api/sendername/GetSenderNamePaging?pageIndex=' + this.pagination.pageIndex + '&pageSize=' +
      this.pagination.pageSize + "&name=" + this.inSenderName.trim() + "&senderGroup=" + this.inSenderGroup)
    this.loadData(response);
    this.arrIdDelete = [];
  }

  loadData(response?: any) {
    if (response) {
      this.dataSender = response.data;
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
    this.isCheckedDelete = false;
    this.arrIdCheckedDelete = [];
    this.setPageIndex(event.page);
  }

  changePageSize(size) {
    this.pagination.pageSize = size;
    this.pagination.pageIndex = 1;
    this.getData();
  }
  //#endregion

  //#region load group sender
  async getDataSenderGroup() {
    this.selectedItemComboboxSenderGroup.push({ "id": "", "itemName": this.utilityService.translate("partner_sender.iSender_grroup") });
    this.selectedItemComboboxSenderGroupVTL.push({ "id": "", "itemName": this.utilityService.translate("partner_sender.iSender_grroup") });
    this.selectedItemComboboxSenderGroupGPC.push({ "id": "", "itemName": this.utilityService.translate("partner_sender.iSender_grroup") });
    this.selectedItemComboboxSenderGroupVMS.push({ "id": "", "itemName": this.utilityService.translate("partner_sender.iSender_grroup") });
    this.selectedItemComboboxSenderGroupVNM.push({ "id": "", "itemName": this.utilityService.translate("partner_sender.iSender_grroup") });
    this.selectedItemComboboxSenderGroupGTEL.push({ "id": "", "itemName": this.utilityService.translate("partner_sender.iSender_grroup") });
    this.selectedItemComboboxSenderGroupSFONE.push({ "id": "", "itemName": this.utilityService.translate("partner_sender.iSender_grroup") });
    let response: any = await this.dataService.getAsync('/api/sendergroup')
    if (response)
      for (let index in response.data) {
        this.dataSenderGroup.push({ "id": response.data[index].ID, "itemName": response.data[index].NAME });
      }
  }
  //#endregion

  //#region  create sender name
  openCreateForm() {
    this.isCheckFillter = 1;
    this.isDisableTemp = false;
    this.timeStart = new Date()
    this.timeExpired = new Date()
    this.timeExpiredVTL = new Date()
    this.timeExpiredGPC = new Date()
    this.timeExpiredVMS = new Date()
    this.timeExpiredVNM = new Date()
    this.timeExpiredGTEL = new Date()

    this.timeExpired.setFullYear(this.timeStart.getFullYear() + 1)
    this.timeExpiredVTL = this.timeExpired
    this.timeExpiredGPC = this.timeExpired
    this.timeExpiredVMS = this.timeExpired
    this.timeExpiredVNM = this.timeExpired
    this.timeExpiredGTEL = this.timeExpired
    this.showModalCreate.show();
  }

  async createSenderName(item) {
    let senderName = item.value;
    let combobox = item.controls;
    let NAME = senderName.iSenderName;
    if (NAME === '' || NAME === null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-44"));
      return;
    }

    let DESCRIPTION = senderName.description;
    let SENDER_GROUP_VTL = (combobox.senderGrVTL.value != undefined &&
      combobox.senderGrVTL.value != null &&
      combobox.senderGrVTL.value != "") ?
      combobox.senderGrVTL.value[0].id : "";
    let SENDER_GROUP_GPC = (combobox.senderGrGPC.value != undefined &&
      combobox.senderGrGPC.value != null &&
      combobox.senderGrGPC.value != "") ?
      combobox.senderGrGPC.value[0].id : "";
    let SENDER_GROUP_VMS = (combobox.senderGrVMS.value != undefined &&
      combobox.senderGrVMS.value != null && combobox.senderGrVMS.value != "") ?
      combobox.senderGrVMS.value[0].id : "";
    let SENDER_GROUP_VNM = (combobox.senderGrVNM.value != undefined &&
      combobox.senderGrVNM.value != null && combobox.senderGrVNM.value != "") ?
      combobox.senderGrVNM.value[0].id : "";
    let SENDER_GROUP_GTEL = (combobox.senderGrGTEL.value != undefined &&
      combobox.senderGrGTEL.value != null && combobox.senderGrGTEL.value != "") ?
      combobox.senderGrGTEL.value[0].id : "";

    let isFillter = senderName.fillterTemp;
    let FILLTER_TEMPLATE = isFillter ? senderName.tempContent : "";

    let SENDER_NAME_VTL = senderName.senderNameVTL != undefined && senderName.senderNameVTL != "" ?
      senderName.senderNameVTL : NAME;
    let SENDER_NAME_GPC = senderName.senderNameGPC != undefined && senderName.senderNameGPC != "" ?
      senderName.senderNameGPC : NAME;
    let SENDER_NAME_VMS = senderName.senderNameVMS != undefined && senderName.senderNameVMS != "" ?
      senderName.senderNameVMS : NAME;
    let SENDER_NAME_VNM = senderName.senderNameVNM != undefined && senderName.senderNameVNM != "" ?
      senderName.senderNameVNM : NAME;
    let SENDER_NAME_GTEL = senderName.senderNameGTEL != undefined && senderName.senderNameGTEL != "" ?
      senderName.senderNameGTEL : NAME;
    // let SENDER_NAME_SFONE = senderName.senderNameSFONE;
    // let SENDER_NAME_DDMBILE = senderName.senderNameDDMBILE;

    let fromDate = senderName.fromDate;
    let expiredDate = senderName.expiredDate;
    let startDate = this.utilityService.formatDateToString(fromDate, "yyyyMMdd");
    let EXPIRED_TIME = this.utilityService.formatDateToString(expiredDate, "yyyyMMdd");

    if (EXPIRED_TIME == "" || EXPIRED_TIME == null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-45"));
      return;
    }

    if (startDate > EXPIRED_TIME) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-46"));
      return;
    }

    let EXPIRED_TIME_VTL = senderName.expiredDateVTL != undefined ?
      this.utilityService.formatDateToString(senderName.expiredDateVTL, "yyyyMMdd") : "";
    let EXPIRED_TIME_GPC = senderName.expiredDateGPC != undefined ?
      this.utilityService.formatDateToString(senderName.expiredDateGPC, "yyyyMMdd") : "";
    let EXPIRED_TIME_VMS = senderName.expiredDateVMS != undefined ?
      this.utilityService.formatDateToString(senderName.expiredDateVMS, "yyyyMMdd") : "";
    let EXPIRED_TIME_VNM = senderName.expiredDateVNM != undefined ?
      this.utilityService.formatDateToString(senderName.expiredDateVNM, "yyyyMMdd") : "";
    let EXPIRED_TIME_GTEL = senderName.expiredDateGTEL != undefined ?
      this.utilityService.formatDateToString(senderName.expiredDateGTEL, "yyyyMMdd") : "";

    let response: any = await this.dataService.postAsync('/api/sendername', {
      NAME, DESCRIPTION, SENDER_GROUP_VTL, SENDER_GROUP_GPC, SENDER_GROUP_VMS, SENDER_GROUP_VNM, SENDER_GROUP_GTEL,
      FILLTER_TEMPLATE,
      SENDER_NAME_VTL, SENDER_NAME_GPC, SENDER_NAME_VMS, SENDER_NAME_VNM, SENDER_NAME_GTEL,
      EXPIRED_TIME, EXPIRED_TIME_VTL, EXPIRED_TIME_GPC, EXPIRED_TIME_VMS, EXPIRED_TIME_VNM, EXPIRED_TIME_GTEL
    });
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
  //#endregion

  //#region update modal
  async confirmUpdateModal(id) {
    let response: any = await this.dataService.getAsync('/api/sendername/' + id)
    if (response.err_code == 0) {
      let dataSender = response.data[0];
      let templateFilter = (dataSender.FILLTER_TEMPLATE != undefined && dataSender.FILLTER_TEMPLATE != "") ? dataSender.FILLTER_TEMPLATE : "";
      if (templateFilter != "") this.isDisableTemp = false; else this.isDisableTemp = true;
      this.formEditSenderName = new FormGroup({
        id: new FormControl(id),
        iSenderName: new FormControl(dataSender.NAME),
        description: new FormControl(dataSender.DESCRIPTION),
        senderGrVTL: new FormControl((dataSender.SENDER_GROUP_VTL != undefined && dataSender.SENDER_GROUP_VTL != "") ?
          [{ "id": dataSender.SENDER_GROUP_VTL, "itemName": dataSender.SENDER_GROUP_VTL_NAME }] : []),
        senderGrGPC: new FormControl((dataSender.SENDER_GROUP_GPC != undefined && dataSender.SENDER_GROUP_GPC != "") ?
          [{ "id": dataSender.SENDER_GROUP_GPC, "itemName": dataSender.SENDER_GROUP_GPC_NAME }] : []),
        senderGrVMS: new FormControl((dataSender.SENDER_GROUP_VMS != undefined && dataSender.SENDER_GROUP_VMS != "") ?
          [{ "id": dataSender.SENDER_GROUP_VMS, "itemName": dataSender.SENDER_GROUP_VMS_NAME }] : []),
        senderGrVNM: new FormControl((dataSender.SENDER_GROUP_VNM != undefined && dataSender.SENDER_GROUP_VNM != "") ?
          [{ "id": dataSender.SENDER_GROUP_VNM, "itemName": dataSender.SENDER_GROUP_VNM_NAME }] : []),
        senderGrGTEL: new FormControl((dataSender.SENDER_GROUP_GTEL != undefined && dataSender.SENDER_GROUP_GTEL != "") ?
          [{ "id": dataSender.SENDER_GROUP_GTEL, "itemName": dataSender.SENDER_GROUP_GTEL_NAME }] : []),
        // senderGrSFONE: new FormControl([{ "id": dataSender.SENDER_GROUP_SFONE, "itemName": dataSender.SENDER_GROUP_SFONE_NAME }]),
        // senderGrDDMBILE: new FormControl(dataSender.SENDER_GROUP_DDMBILE),
        fillterTemp: new FormControl(!this.isDisableTemp ? 1 : 0),
        tempContent: new FormControl(dataSender.FILLTER_TEMPLATE),
        senderNameVTL: new FormControl(dataSender.SENDER_NAME_VTL),
        senderNameGPC: new FormControl(dataSender.SENDER_NAME_GPC),
        senderNameVMS: new FormControl(dataSender.SENDER_NAME_VMS),
        senderNameVNM: new FormControl(dataSender.SENDER_NAME_VNM),
        senderNameSFONE: new FormControl(dataSender.SENDER_NAME_SFONE),
        senderNameDDMBILE: new FormControl(dataSender.SENDER_NAME_DDMBILE),
        senderNameGTEL: new FormControl(dataSender.SENDER_NAME_GTEL),
        fromDate: new FormControl(this.convertStringDate(dataSender.ACTIVE_DATE).toString()),
        expiredDate: new FormControl(this.convertStringDate(dataSender.EXPIRED_TIME).toString()),
        expiredDateVIETTEL: new FormControl((dataSender.EXPIRED_TIME_VTL != undefined && dataSender.EXPIRED_TIME_VTL != "") ?
          this.convertStringDate(dataSender.EXPIRED_TIME_VTL).toString() : ""),
        expiredDateGPC: new FormControl((dataSender.EXPIRED_TIME_GPC != undefined && dataSender.EXPIRED_TIME_GPC != "") ?
          this.convertStringDate(dataSender.EXPIRED_TIME_GPC).toString() : ""),
        expiredDateVMS: new FormControl((dataSender.EXPIRED_TIME_VMS != undefined && dataSender.EXPIRED_TIME_VMS != "") ?
          this.convertStringDate(dataSender.EXPIRED_TIME_VMS).toString() : ""),
        expiredDateVNM: new FormControl((dataSender.EXPIRED_TIME_VNM != undefined && dataSender.EXPIRED_TIME_VNM != "") ?
          this.convertStringDate(dataSender.EXPIRED_TIME_VNM).toString() : ""),
        expiredDateGTEL: new FormControl((dataSender.EXPIRED_TIME_GTEL != undefined && dataSender.EXPIRED_TIME_GTEL != "") ?
          this.convertStringDate(dataSender.EXPIRED_TIME_GTEL).toString() : "")
      });
      this.showModalUpdate.show();
    } else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
    }
  }

  public async editSenderName() {
    let formData = this.formEditSenderName.controls;
    let ID = formData.id.value;
    let NAME = formData.iSenderName.value;
    if (NAME == '' || NAME == null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-44"));
      return;
    }
    let DESCRIPTION = formData.description.value;
    let SENDER_GROUP_VTL = formData.senderGrVTL.value.length > 0 ? formData.senderGrVTL.value[0].id : "";
    let SENDER_GROUP_GPC = formData.senderGrGPC.value.length > 0 ? formData.senderGrGPC.value[0].id : "";
    let SENDER_GROUP_VMS = formData.senderGrVMS.value.length > 0 ? formData.senderGrVMS.value[0].id : "";
    let SENDER_GROUP_VNM = formData.senderGrVNM.value.length > 0 ? formData.senderGrVNM.value[0].id : "";
    let SENDER_GROUP_GTEL = formData.senderGrGTEL.value.length > 0 ? formData.senderGrGTEL.value[0].id : "";

    let isFillter = formData.fillterTemp.value;
    let FILLTER_TEMPLATE = isFillter ? formData.tempContent.value : "";

    let SENDER_NAME_VTL = formData.senderNameVTL.value != undefined && formData.senderNameVTL.value != "" ?
      formData.senderNameVTL.value : NAME;
    let SENDER_NAME_GPC = formData.senderNameGPC.value != undefined && formData.senderNameGPC.value != "" ?
      formData.senderNameGPC.value : NAME;
    let SENDER_NAME_VMS = formData.senderNameVMS.value != undefined && formData.senderNameVMS.value != "" ?
      formData.senderNameVMS.value : NAME;
    let SENDER_NAME_VNM = formData.senderNameVNM.value != undefined && formData.senderNameVNM.value != "" ?
      formData.senderNameVNM.value : NAME;
    let SENDER_NAME_GTEL = formData.senderNameGTEL.value != undefined && formData.senderNameGTEL.value != "" ?
      formData.senderNameGTEL.value : NAME;
    // let SENDER_NAME_SFONE = formData.senderNameSFONE.value;
    // let SENDER_NAME_DDMBILE = formData.senderNameDDMBILE.value;

    let fromDate = formData.fromDate.value;
    let expiredDate = formData.expiredDate.value;
    let startDate = this.utilityService.formatDateToString(fromDate, "yyyyMMdd");
    let EXPIRED_TIME = this.utilityService.formatDateToString(expiredDate, "yyyyMMdd");
    if (EXPIRED_TIME == "" || EXPIRED_TIME == null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-45"));
      return;
    }

    if (startDate > EXPIRED_TIME) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-46"));
      return;
    }

    let EXPIRED_TIME_VTL = (formData.expiredDateVIETTEL.value != undefined &&
      formData.expiredDateVIETTEL.value != "" && formData.expiredDateVIETTEL.value != "Invalid Date") ?
      this.utilityService.formatDateToString(formData.expiredDateVIETTEL.value, "yyyyMMdd") : "";
    let EXPIRED_TIME_GPC = (formData.expiredDateGPC.value != undefined &&
      formData.expiredDateGPC.value != "" && formData.expiredDateGPC.value != "Invalid Date") ?
      this.utilityService.formatDateToString(formData.expiredDateGPC.value, "yyyyMMdd") : "";
    let EXPIRED_TIME_VMS = (formData.expiredDateVMS.value != undefined &&
      formData.expiredDateVMS.value != "" && formData.expiredDateVMS.value != "Invalid Date") ?
      this.utilityService.formatDateToString(formData.expiredDateVMS.value, "yyyyMMdd") : "";
    let EXPIRED_TIME_VNM = (formData.expiredDateVNM.value != undefined &&
      formData.expiredDateVNM.value != "" && formData.expiredDateVNM.value != "Invalid Date") ?
      this.utilityService.formatDateToString(formData.expiredDateVNM.value, "yyyyMMdd") : "";
    let EXPIRED_TIME_GTEL = (formData.expiredDateGTEL.value != undefined &&
      formData.expiredDateGTEL.value != "" && formData.expiredDateGTEL.value != "Invalid Date") ?
      this.utilityService.formatDateToString(formData.expiredDateGTEL.value, "yyyyMMdd") : "";

    let response: any = await this.dataService.putAsync('/api/sendername/' + ID, {
      NAME, DESCRIPTION, SENDER_GROUP_VTL, SENDER_GROUP_GPC, SENDER_GROUP_VMS, SENDER_GROUP_VNM, SENDER_GROUP_GTEL,
      FILLTER_TEMPLATE, SENDER_NAME_VTL, SENDER_NAME_GPC, SENDER_NAME_VMS, SENDER_NAME_VNM, SENDER_NAME_GTEL,
      EXPIRED_TIME, EXPIRED_TIME_VTL, EXPIRED_TIME_GPC, EXPIRED_TIME_VMS, EXPIRED_TIME_VNM, EXPIRED_TIME_GTEL
    });
    if (response.err_code == 0) {
      this.getData();
      this.showModalUpdate.hide();
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("300"));
    } else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
    }
  }
  //#endregion

  //#region enable template 
  checkFillter(event) {
    if (event) this.isDisableTemp = false;
    else this.isDisableTemp = true;

  }
  //#endregion

  //#region delete sender
  async confirmDelete(id, name) {
    this.senderDelete = id
    this.senderNameDelete = name
    this.confirmDeleteModal.show();
  }

  async deleteSender(id) {
    if (id != "undefined") {
      let response = await this.dataService.deleteAsync('/api/sendername/' + id + "?pageIndex=" + this.pagination.pageIndex +
        '&pageSize=' + this.pagination.pageSize);
      if (response.err_code == 0) {
        this.confirmDeleteModal.hide();
        this.loadData(response);
        this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("200"));
      }
      else {
        this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
      }
    }
  }
  //#endregion

  //#region delete multi row
  checkAllDelete(isChecked) {
    this.isCheckedDelete = isChecked;
    if (this.isCheckedDelete) {
      for (let index in this.dataSender) {
        let id = this.dataSender[index].ID;
        let name = this.dataSender[index].NAME;
        const indexId: number = this.arrIdCheckedDelete.indexOf(id);
        if (indexId === -1) {
          this.arrIdCheckedDelete.push(id);
          this.arrName.push(name);
        }
      }
    } else {
      this.arrIdCheckedDelete = [];
      this.arrName = [];
    }
  }

  checkRowDelete(isChecked, id, name) {
    const index: number = this.arrIdCheckedDelete.indexOf(id);
    if (index !== -1) {
      if (!isChecked) {
        this.arrIdCheckedDelete.splice(index, 1);
        this.arrName.splice(index, 1);
      }
    }
    else if (isChecked) {
      this.arrIdCheckedDelete.push(id);
      this.arrName.push(name);
    }

    if (this.arrIdCheckedDelete.length == 0) {
      this.isCheckedDelete = false;
    }
  }

  confirmDeleteMulti() {
    if (this.arrName.length > 0) {
      this.name = this.arrName.join(",");
      this.confirmDeleteMultiModal.show();
    }
    else this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-85"))
  }

  public async deleteMulti() {
    let count = 0, error = 0;
    for (let index in this.arrIdCheckedDelete) {
      let response: any = await this.dataService.deleteAsync('/api/sendername/' + this.arrIdCheckedDelete[index] + "?pageIndex=" + this.pagination.pageIndex + '&pageSize=' + this.pagination.pageSize)
      if (response.err_code == 0) {
        count++;
        this.loadData(response);
        this.confirmDeleteMultiModal.hide();
        this.arrIdDelete.push(this.arrIdCheckedDelete[index]);
      }
      else error++;
    }
    this.confirmDeleteMultiModal.hide();
    if (count > 0)
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("-47") + " (" + count + ")");
    else if (error > 0)
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("-48") + " (" + error + ")");
    this.arrIdCheckedDelete = []
    this.arrName = []
  }
  //#endregion

  //#region export excel
  async exportExcel() {
    let listParameter = "name=" + this.inSenderName + ",senderGroup=" + this.inSenderGroup
    let result: boolean = await this.dataService.getFileExtentionParameterAsync("/api/FileExtention/ExportExcelParameter",
      "SenderName", listParameter, "SenderName")
    if (result) {
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("120"));
    }
    else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("125"));
    }
  }
  //#endregion

  //#region Phân luồng gửi tin
  showFormThreadSms(senderID, senderName) {
    this.senderThreadID = senderID;
    this.senderThreadName = senderName;
    this.getDataPartnerSender(senderID)
    this.getDataTelco()
    this.getDataPartner()
    this.feeInMonth = ""
    this.isActive = true;
    this.orderReal = "";
    this.orderTmp = "";
    this.timeReset = "";
    this.showModalThread.show()
  }

  //#region load data ban dau
  public async getDataPartnerSender(senderID) {
    this.dataPartnerSender = [];
    if (senderID != null && senderID != "" && senderID != undefined) {
      let response: any = await this.dataService.getAsync('/api/PartnerSender/GetPartnerBySender?senderID=' + senderID);
      if (response.err_code == 0)
        this.dataPartnerSender = response.data;
    }
  }

  async getDataTelco() {
    this.selectedTelco = [];
    this.dataTelco = [];
    let response: any = await this.dataService.getAsync('/api/telco')
    if (response)
      for (let index in response.data) {
        this.dataTelco.push({ "id": response.data[index].TEL_CODE, "itemName": response.data[index].TEL_CODE });
      }
  }

  async getDataPartner() {
    this.selectedPartner = [];
    this.dataPartner = [];
    let response: any = await this.dataService.getAsync('/api/partner')
    if (response)
      for (let index in response.data) {
        this.dataPartner.push({ "id": response.data[index].ID, "itemName": response.data[index].PARTNER_NAME });
      }
  }
  //#endregion

  //#region them doi tac - nha mang
  public async createPartnerSender() {
    let TEL_CODE = this.selectedTelco.length > 0 ? this.selectedTelco[0].id : "";
    let PARTNER_ID = this.selectedPartner.length > 0 ? this.selectedPartner[0].id : "";
    let FEE_IN_MONTH = this.feeInMonth;
    let ORDER_REAL = this.orderReal;
    let ORDER_TMP = this.orderTmp;
    let TIME_RESET = this.timeReset;
    let ACTIVE = this.isActive == true ? 1 : 0;
    let SENDER_ID = this.senderThreadID;

    if (TEL_CODE == "") {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-40"));
      return;
    }
    if (PARTNER_ID == "") {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-33"));
      return;
    }

    let response: any = await this.dataService.postAsync('/api/partnersender', {
      PARTNER_ID, TEL_CODE, ACTIVE, SENDER_ID, FEE_IN_MONTH, ORDER_REAL, ORDER_TMP, TIME_RESET
    })
    this.notificationService.displaySuccessMessage(response.err_message);
    this.getDataPartnerSender(SENDER_ID);
  }
  //#endregion

  //#region update partner-sender
  public async viewPartnerSender(partnerSenderID) {
    this.idPartnerSender = partnerSenderID;
    this.selectedTelco = [];
    this.selectedPartner = [];
    if (partnerSenderID != undefined && partnerSenderID != "" && partnerSenderID != null) {
      let response: any = await this.dataService.getAsync('/api/partnersender/' + partnerSenderID);
      if (response.err_code == 0) {
        let detail = response.data[0];
        this.selectedTelco.push({ "id": detail.TEL_CODE, "itemName": detail.TEL_CODE });
        this.selectedPartner.push({ "id": detail.PARTNER_ID, "itemName": detail.PARTNER_NAME });
        this.feeInMonth = detail.FEE_IN_MONTH != null ? detail.FEE_IN_MONTH : "";
        this.isActive = detail.ACTIVE == 1 ? true : false;
        this.orderReal = detail.ORDER_REAL;
        this.orderTmp = detail.ORDER_TMP;
        this.timeReset = detail.TIME_RESET;
        this.isShowAdd = false;
        this.isShowEdit = true;
      }
    }
    else {
      this.isShowAdd = true;
      this.isShowEdit = false;
    }
  }

  public async updatePartnerSender(partnerSenderID) {
    if (partnerSenderID != undefined && partnerSenderID != "" && partnerSenderID != null) {
      let TEL_CODE = this.selectedTelco.length > 0 ? this.selectedTelco[0].id : "";
      let PARTNER_ID = this.selectedPartner.length > 0 ? this.selectedPartner[0].id : "";
      let FEE_IN_MONTH = this.feeInMonth;
      let ORDER_REAL = this.orderReal;
      let ORDER_TMP = this.orderTmp;
      let TIME_RESET = this.timeReset;
      let ACTIVE = this.isActive == true ? 1 : 0;
      let SENDER_ID = this.senderThreadID;

      if (TEL_CODE == "") {
        this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-40"));
        return;
      }
      if (PARTNER_ID == "") {
        this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-33"));
        return;
      }

      let response: any = await this.dataService.putAsync('/api/partnersender/' + partnerSenderID, {
        PARTNER_ID, TEL_CODE, ACTIVE, SENDER_ID, FEE_IN_MONTH, ORDER_REAL, ORDER_TMP, TIME_RESET
      })
      this.notificationService.displaySuccessMessage(response.err_message);
      this.getDataPartnerSender(SENDER_ID);
    }
    else {
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("103"));
    }
    this.resetPartnerSender();
  }

  public resetPartnerSender() {
    this.selectedPartner = [];
    this.selectedTelco = [];
    this.feeInMonth = ""
    this.isActive = true;
    this.orderReal = "";
    this.orderTmp = "";
    this.timeReset = "";
    this.isShowAdd = true;
    this.isShowEdit = false;
  }

  //#endregion

  //#endregion

  //#region common
  public convertStringDate(text: string): string {
    let value = "";
    let nam = "", thang = "", ngay = "";
    if (text != "" && text != null) {
      nam = text.substring(0, 4);
      thang = text.substring(4, 6);
      ngay = text.substring(6, 8);
      value = ngay + "/" + thang + "/" + nam;
    }
    return value;
  }
  //#endregion
}
