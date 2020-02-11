import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective, BsModalService } from 'ngx-bootstrap';
import { Pagination } from 'src/app/core/models/pagination';
import { FormGroup, FormControl } from '@angular/forms';
import { DataService } from 'src/app/core/services/data.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { Role } from 'src/app/core/models/role';
import { UtilityService } from 'src/app/core/services/utility.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sms-template',
  templateUrl: './sms-template.component.html',
  styleUrls: ['./sms-template.component.css']
})
export class SmsTemplateComponent implements OnInit {

  @ViewChild('showModalCreate', { static: false }) public showModalCreate: ModalDirective;
  @ViewChild('showModalUpdate', { static: false }) public showModalUpdate: ModalDirective;
  @ViewChild('confirmDeleteModal', { static: false }) public confirmDeleteModal: ModalDirective;

  public dataSMSTemp;
  public dataSenderName = [];
  public pagination: Pagination = new Pagination();
  public id;
  public tempName;
  public slSender: string = '';
  // public slSmsType: string = '';
  public inTempName: string = '';
  // public inTempContent: string = '';
  public formEditSmsTemplate: FormGroup;
  public settingsFilterSender = {};
  public selectedItemComboboxSender = [];
  public role: Role = new Role();

  public selectedSmsType = [];
  public dataSmsType = [];
  public settingsFilterSmsType = {};

  constructor(
    private dataService: DataService,
    private modalService: BsModalService,
    private activatedRoute: ActivatedRoute,
    private notificationService: NotificationService,
    private utilityService: UtilityService,
    private authService: AuthService) {
    modalService.config.backdrop = 'static';

    this.activatedRoute.data.subscribe(data => {
      this.utilityService.getRole(data.MENU_CODE).then((response) => {
        if (response) this.role = response;
      })
    });

    this.settingsFilterSender = {
      text: "Chọn thương hiệu",
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: "Tìm kiếm",
      noDataLabel: "Không có dữ liệu"
    };

    this.formEditSmsTemplate = new FormGroup({
      id: new FormControl(),
      slSender: new FormControl(),
      tempName: new FormControl(),
      slSmsType: new FormControl(),
      tempContent: new FormControl()
    });

    this.settingsFilterSmsType = {
      text: "Chọn loại tin nhắn",
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: "Tìm kiếm",
      noDataLabel: "Không có dữ liệu"
    };
  }

  ngOnInit() {
    this.getDataSenderName();
    this.bindDataSmsType();
    this.getData();
  }

  //#region load sender
  public async getDataSenderName() {
    this.selectedItemComboboxSender = [];
    this.dataSenderName = [];
    let accountID = this.authService.currentUserValue.ACCOUNT_ID
    let response: any = await this.dataService.getAsync('/api/SenderName/GetSenderNameByAccountID?account_id=' + accountID)
    for (let index in response.data) {
      this.dataSenderName.push({ "id": response.data[index].ID, "itemName": response.data[index].NAME });
    }
    if (this.dataSenderName.length == 1)
      this.selectedItemComboboxSender.push({ "id": this.dataSenderName[0].id, "itemName": this.dataSenderName[0].itemName });
  }

  onItemSelectSender() {
    this.getData();
  }
  //#endregion

  //#region load sms type
  public async bindDataSmsType() {
    this.dataSmsType = [];
    this.selectedSmsType = [];
    let response: any = await this.dataService.getAsync('/api/sysvar/GetSysvarByGroup?var_group=SMS_TYPE');
    for (let i in response.data) {
      this.dataSmsType.push({ "id": response.data[i].VAR_VALUE, "itemName": response.data[i].VAR_NAME });
    }
  }
  onItemSelectSmsType() {
    this.getData();
  }
  //#endregion

  //#region load data
  async getData() {
    let accountID = this.authService.currentUserValue.ACCOUNT_ID
    let sender_id = this.selectedItemComboboxSender.length > 0 ? this.selectedItemComboboxSender[0].id : "";
    let response: any = await this.dataService.getAsync('/api/smstemplate/GetSmsTemplatePaging?pageIndex=' + this.pagination.pageIndex +
      "&pageSize=" + this.pagination.pageSize + "&accountID=" + accountID +
      "&senderId=" + sender_id + "&tempName=" + this.inTempName +
      "&smsType=" + (this.selectedSmsType.length > 0 ? this.selectedSmsType[0].id : ""))
    this.loadData(response);
    // if (response.err_code == 0) this.dataSMSTemp = response.data
  }

  loadData(response?: any) {
    if (response) {
      this.dataSMSTemp = response.data;
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
    this.setPageIndex(event.page);
  }

  changePageSize(size) {
    this.pagination.pageSize = size;
    this.pagination.pageIndex = 1;
    this.getData();
  }
  //#endregion

  //#region create new
  async createSMSTemplate(item) {
    let smsTemp = item.value;
    let data = item.controls;
    if (data.slSender.value[0].id == 0) {
      this.notificationService.displayWarnMessage("Thương hiệu không được để trống!");
      return;
    }
    let SENDER_ID = data.slSender.value[0].id;
    let SENDER_NAME = data.slSender.value[0].itemName;
    let TEMP_NAME = smsTemp.tempName;
    if (TEMP_NAME == "" || TEMP_NAME == null) {
      this.notificationService.displayWarnMessage("Tên mẫu không được để trống!");
      return;
    }
    let SMS_TYPE = smsTemp.type.length > 0 ? smsTemp.type[0].id : "";
    let TEMPLATE_CONTENT = smsTemp.tempContent;
    if (TEMPLATE_CONTENT == "" || TEMPLATE_CONTENT == null) {
      this.notificationService.displayWarnMessage("Nội dung không được để trống!");
      return;
    }
    let response: any = await this.dataService.postAsync('/api/smstemplate', {
      SENDER_ID, SENDER_NAME, TEMP_NAME
      , SMS_TYPE, TEMPLATE_CONTENT
    })
    if (response.err_code == 0) {
      item.reset();
      this.selectedSmsType = [];
      this.selectedItemComboboxSender = [];
      this.getData();
      this.showModalCreate.hide();
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("100"));
    }
    else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
    }
  }
  //#endregion

  // show update modal
  async confirmUpdateModal(id) {
    let response: any = await this.dataService.getAsync('/api/smstemplate/' + id)
    if (response.err_code == 0) {
      let dataSmsTemp = response.data[0];
      this.formEditSmsTemplate = new FormGroup({
        id: new FormControl(id),
        slSender: new FormControl([{ "id": dataSmsTemp.ID, "itemName": dataSmsTemp.SENDER_NAME }]),
        tempName: new FormControl(dataSmsTemp.TEMP_NAME),
        slSmsType: new FormControl([{ "id": dataSmsTemp.SMS_TYPE, "itemName": dataSmsTemp.SMS_TYPE }]),
        tempContent: new FormControl(dataSmsTemp.TEMPLATE_CONTENT)
      });
      this.showModalUpdate.show();
    } else {
      this.notificationService.displayErrorMessage(response.err_message);
    }
  }

  // update tin mẫu
  async editSmsTemplate() {
    let formData = this.formEditSmsTemplate.controls;
    let ID = formData.id.value;
    let SENDER_ID = formData.slSender.value[0].id;
    if (SENDER_ID === '' || SENDER_ID === null) {
      this.notificationService.displayWarnMessage("Thương hiệu không được để trống!");
      return;
    }
    let SENDER_NAME = formData.slSender.value[0].itemName;
    let TELCO = "0";
    let TEMP_NAME = formData.tempName.value;
    if (TEMP_NAME == "" || TEMP_NAME == null) {
      this.notificationService.displayWarnMessage("Tên mẫu không được để trống!");
      return;
    }
    let SMS_TYPE = formData.slSmsType.value.length > 0 ? formData.slSmsType.value[0].id : "";
    let TEMPLATE_CONTENT = formData.tempContent.value;
    if (TEMPLATE_CONTENT == "" || TEMPLATE_CONTENT == null) {
      this.notificationService.displayWarnMessage("Nội dung không được để trống!");
      return;
    }
    let response: any = await this.dataService.putAsync('/api/smstemplate/' + ID, {
      SENDER_ID, SENDER_NAME, TELCO
      , TEMP_NAME, SMS_TYPE, TEMPLATE_CONTENT
    })
    if (response.err_code == 0) {
      this.selectedItemComboboxSender = [];
      this.selectedSmsType = [];
      this.showModalUpdate.hide();
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("300"));
      this.getData();
    } else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
    }
  }

  showConfirmDelete(id, tempName) {
    this.id = id;
    this.tempName = tempName;
    this.confirmDeleteModal.show();
  }

  // delete
  async confirmDelete(id) {
    let response: any = await this.dataService.deleteAsync('/api/smstemplate/' + id + "?pageIndex=" + this.pagination.pageIndex + '&pageSize=' + this.pagination.pageSize)
    if (response.err_code == 0) {
      this.loadData(response);
      this.confirmDeleteModal.hide();
      this.notificationService.displaySuccessMessage(response.err_message);
    }
    else {
      this.notificationService.displayErrorMessage(response.err_message);
    }
  }
}
