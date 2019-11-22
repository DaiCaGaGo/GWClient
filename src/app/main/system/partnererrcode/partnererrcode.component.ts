import { Component, OnInit, ViewChild } from '@angular/core';
import { Pagination } from 'src/app/core/models/pagination';
import { FormGroup, FormControl } from '@angular/forms';
import { DataService } from 'src/app/core/services/data.service';
import { BsModalService, ModalDirective } from 'ngx-bootstrap';
import { NotificationService } from 'src/app/core/services/notification.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { Role } from 'src/app/core/models/role';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-partnererrcode',
  templateUrl: './partnererrcode.component.html',
  styleUrls: ['./partnererrcode.component.css']
})
export class PartnererrcodeComponent implements OnInit {
  @ViewChild('showModalCreate', { static: false }) public showModalCreate: ModalDirective;
  @ViewChild('showModalUpdate', { static: false }) public showModalUpdate: ModalDirective;
  @ViewChild('confirmDeleteMultiModal', { static: false }) public confirmDeleteMultiModal: ModalDirective;

  public dataPartner = [];
  public dataPrErrCode = [];
  public pagination: Pagination = new Pagination();
  public errCodeId;
  public err_Code;
  public partnerId: string = '';
  public txtErrCode: string = '';
  public txtErrMessage: string = '';
  public isCheckedDelete: boolean = false;
  public fromPartner: boolean = false;
  public arrIdCheckedDelete: string[] = [];
  public arrIdDelete: string[] = [];
  public arrErrCode: string[] = [];
  public settingsFilterPartner = {};
  public selectedItemComboboxPartner = [];
  public selectedItemComboboxPartnerModal = [];
  public isDisableNumRetry = true;
  public formEditPartnerErrCode: FormGroup;
  public role: Role = new Role();

  constructor(
    private dataService: DataService,
    private modalService: BsModalService,
    private activatedRoute: ActivatedRoute,
    private notificationService: NotificationService,
    private utilityService: UtilityService) {
    modalService.config.backdrop = 'static';

    this.activatedRoute.data.subscribe(data => {
      this.utilityService.getRole(data.MENU_CODE).then((response) => {
        if (response) this.role = response;
      })
    });

    this.formEditPartnerErrCode = new FormGroup({
      id: new FormControl(),
      enableRetry: new FormControl(),
      errCode: new FormControl(),
      errMessage: new FormControl(),
      sourceType: new FormControl(),
      slPartnerErrCode: new FormControl(),
      isDone: new FormControl(),
      errDescription: new FormControl(),
      numRetry: new FormControl(),
    });

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
    this.getData();
    this.getDataPartner();
  }

  //#region load partner
  async getDataPartner() {
    this.selectedItemComboboxPartnerModal = [{ "id": 0, "itemName": this.utilityService.translate("global.choose_partner") }];
    let response: any = await this.dataService.getAsync('/api/partner')
    for (let index in response.data) {
      this.dataPartner.push({ "id": response.data[index].ID, "itemName": response.data[index].PARTNER_NAME });
    }
  }

  onItemSelectPartner() {
    this.getData();
  }
  //#endregion

  //#region load data and paging
  async getData() {
    this.partnerId = this.selectedItemComboboxPartner.length != 0 && this.selectedItemComboboxPartner[0].id != 0 ? this.selectedItemComboboxPartner[0].id : "";
    let response: any = await this.dataService.getAsync('/api/partnererrorcode/GetPartnerErrCodePaging?pageIndex=' +
      this.pagination.pageIndex + '&pageSize=' + this.pagination.pageSize +
      "&partnerId=" + this.partnerId + "&errCode=" + this.txtErrCode + "&errMessage=" + this.txtErrMessage)
    this.loadData(response);
    this.arrIdDelete = [];
  }

  loadData(response?: any) {
    if (response) {
      this.dataPrErrCode = response.data;
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

  confirmShowModalCreate() {
    this.showModalCreate.show();
    if (!this.fromPartner)
      this.selectedItemComboboxPartnerModal = [{ "id": 0, "itemName": this.utilityService.translate("global.choose_partner") }];
    else
      this.selectedItemComboboxPartnerModal = this.selectedItemComboboxPartner;
  }

  // create partner error code
  async createPartnerErrCode(item) {
    let partnerErrCode = item.value;
    let dataSelect = item.controls;
    let PARTNER_ID = dataSelect.slPartner.value[0].id;
    if (PARTNER_ID === '' || PARTNER_ID === null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-33"));
      return;
    }
    let ERROR_CODE = partnerErrCode.errCode;
    if (ERROR_CODE === '' || ERROR_CODE === null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-41"));
      return;
    }
    let ERROR_MESAGE = partnerErrCode.errMessage;
    let ENABLE_RETRY = partnerErrCode.enableRetry == true ? "1" : "0";
    let IS_DONE = partnerErrCode.isDone == true ? "1" : "0";
    let ERROR_SOURE = partnerErrCode.sourceType;
    if (ERROR_SOURE === '' || ERROR_SOURE === null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-42"));
      return;
    }
    let ERROR_DESCRIPTION = partnerErrCode.errDescription;
    let NUM_RETRY = "0";
    if (!this.isDisableNumRetry) {
      NUM_RETRY = partnerErrCode.numRetry;
      if (NUM_RETRY == null || NUM_RETRY == "0") {
        this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-43"));
        return;
      }
    }
    let response: any = await this.dataService.postAsync('/api/partnererrorcode', { PARTNER_ID, ERROR_CODE, ERROR_MESAGE, ERROR_DESCRIPTION, IS_DONE, ERROR_SOURE, ENABLE_RETRY, NUM_RETRY })
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
      this.notificationService.displayErrorMessage(response.err_message);
    }
  }

  // show update modal
  async confirmUpdateModal(id) {
    let response: any = await this.dataService.getAsync('/api/partnererrorcode/' + id)
    if (response.err_code == 0) {
      let dataPartnerErrCode = response.data[0];
      this.formEditPartnerErrCode = new FormGroup({
        id: new FormControl(id),
        slPartnerErrCode: new FormControl([{ "id": dataPartnerErrCode.PARTNER_ID, "itemName": dataPartnerErrCode.PARTNER_NAME }]),
        errCode: new FormControl(dataPartnerErrCode.ERROR_CODE),
        errMessage: new FormControl(dataPartnerErrCode.ERROR_MESAGE),
        sourceType: new FormControl(dataPartnerErrCode.ERROR_SOURE),
        enableRetry: new FormControl(dataPartnerErrCode.ENABLE_RETRY == "1" ? true : false),
        isDone: new FormControl(dataPartnerErrCode.IS_DONE == "1" ? true : false),
        errDescription: new FormControl(dataPartnerErrCode.ERROR_DESCRIPTION),
        numRetry: new FormControl(dataPartnerErrCode.NUM_RETRY)
      });
      this.showModalUpdate.show();
    } else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
    }
  }

  // update partner error code
  async editPartnerErrCode() {
    let formData = this.formEditPartnerErrCode.controls;
    let ID = formData.id.value;
    let PARTNER_ID = formData.slPartnerErrCode.value[0].id;
    if (PARTNER_ID === '' || PARTNER_ID === null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-33"));
      return;
    }
    let ERROR_CODE = formData.errCode.value;
    if (ERROR_CODE === '' || ERROR_CODE === null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-41"));
      return;
    }
    let ERROR_MESAGE = formData.errMessage.value;
    let ENABLE_RETRY = formData.enableRetry.value == true ? "1" : "0";
    let IS_DONE = formData.isDone.value == true ? "1" : "0";
    let ERROR_SOURE = formData.sourceType.value;
    let ERROR_DESCRIPTION = formData.errDescription.value;
    let NUM_RETRY = "0";
    if (!this.isDisableNumRetry) {
      NUM_RETRY = formData.numRetry.value;
      if (NUM_RETRY == null || NUM_RETRY == "0") {
        this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-43"));
        return;
      }
    }
    let response: any = await this.dataService.putAsync('/api/partnererrorcode/' + ID, { PARTNER_ID, ERROR_CODE, ERROR_MESAGE, ERROR_DESCRIPTION, IS_DONE, ERROR_SOURE, ENABLE_RETRY, NUM_RETRY })
    if (response.err_code == 0) {
      if (!this.fromPartner)
        this.selectedItemComboboxPartnerModal = [{ "id": 0, "itemName": this.utilityService.translate("global.choose_partner") }];
      else
        this.selectedItemComboboxPartnerModal = this.selectedItemComboboxPartner;
      this.getData();
      this.showModalUpdate.hide();
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("300"));
    } else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
    }
  }

  checkEnableRetry(checked: boolean) {
    if (checked)
      this.isDisableNumRetry = false;
    else
      this.isDisableNumRetry = true;
  }

  // delete
  async confirmDelete(errCodeId) {
    if (!this.fromPartner) {
      let response: any = await this.dataService.deleteAsync('/api/partnererrorcode/' + errCodeId + "?pageIndex=" + this.pagination.pageIndex + '&pageSize=' + this.pagination.pageSize)
      if (response.err_code == 0) {
        this.loadData(response);
        this.confirmDeleteMultiModal.hide();
        this.arrIdDelete.push(errCodeId);
        this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("200"));
      }
      else if (response.err_code == 103) {
        this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("103"));
      }
      else {
        this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
      }
    } else {
      let response: any = await this.dataService.deleteAsync('/api/partnererrorcode/DeletePartnerErrCodeInPartnerDetail?id=' + errCodeId + "&partnerId=" + this.selectedItemComboboxPartner[0].id + "&pageIndex=" + this.pagination.pageIndex + '&pageSize=' + this.pagination.pageSize)
      if (response.err_code == 0) {
        this.loadData(response);
        if (!this.fromPartner)
          this.selectedItemComboboxPartnerModal = [{ "id": 0, "itemName": this.utilityService.translate("global.choose_partner") }];
        else
          this.selectedItemComboboxPartnerModal = this.selectedItemComboboxPartner;
        this.confirmDeleteMultiModal.hide();
        this.arrIdDelete.push(errCodeId);
        this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("200"));
      }
      else if (response.err_code == 103) {
        this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("103"));
      }
      else {
        this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
      }
    }
  }

  async exportExcel() {
    let listParameter = "partnerID=" + (this.selectedItemComboboxPartner.length > 0 ? this.selectedItemComboboxPartner[0].id : "") +
      ",errCode=" + this.txtErrCode + ",errMessage=" + this.txtErrMessage
    let result: boolean = await this.dataService.getFileExtentionParameterAsync("/api/FileExtention/ExportExcelParameter",
      "PartnerErrCode", listParameter, "PartnerErrorCode")
    if (result) {
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("120"));
    }
    else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("125"));
    }
  }

  checkAllDelete(isChecked) {
    this.isCheckedDelete = isChecked;
    if (this.isCheckedDelete) {
      for (let index in this.dataPrErrCode) {
        let id = this.dataPrErrCode[index].ID;
        let errCode = this.dataPrErrCode[index].ERROR_CODE;
        const indexId: number = this.arrIdCheckedDelete.indexOf(id);
        if (indexId === -1) {
          this.arrIdCheckedDelete.push(id);
          this.arrErrCode.push(errCode);
        }
      }
    } else {
      this.arrIdCheckedDelete = [];
      this.arrErrCode = [];
    }
  }

  checkRowDelete(isChecked, id, errCode) {
    const index: number = this.arrIdCheckedDelete.indexOf(id);
    if (index !== -1) {
      if (!isChecked) {
        this.arrIdCheckedDelete.splice(index, 1);
        this.arrErrCode.splice(index, 1);
      }
    }
    else if (isChecked) {
      this.arrIdCheckedDelete.push(id);
      this.arrErrCode.push(errCode);
    }

    if (this.arrIdCheckedDelete.length == 0) {
      this.isCheckedDelete = false;
    }
  }

  confirmDeleteMultiPartnerErrCode() {
    if (this.arrErrCode.length > 0) {
      this.err_Code = this.arrErrCode.join(",");
      this.confirmDeleteMultiModal.show();
    }
  }

  deleteMultiPartnerErrCode() {
    for (let index in this.arrIdCheckedDelete) {
      this.confirmDelete(this.arrIdCheckedDelete[index]);
    }
    this.arrIdCheckedDelete = [];
    this.arrErrCode = [];
    this.confirmDeleteMultiModal.hide();
  }
}
