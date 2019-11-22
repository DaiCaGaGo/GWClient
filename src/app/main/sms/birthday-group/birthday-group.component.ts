import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from 'src/app/core/services/data.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { Pagination } from 'src/app/core/models/pagination';
import { ModalDirective } from 'ngx-bootstrap';
import { NotificationService } from 'src/app/core/services/notification.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-birthday-group',
  templateUrl: './birthday-group.component.html',
  styleUrls: ['./birthday-group.component.css']
})
export class BirthdayGroupComponent implements OnInit {
  @ViewChild('createNewModal', { static: false }) public createNewModal: ModalDirective
  @ViewChild('timer', { static: false }) public timer
  @ViewChild('contentSMS', { static: false }) public contentSMS
  @ViewChild('editThisModal', { static: false }) public editThisModal: ModalDirective
  @ViewChild('confirmDeleteModal', { static: false }) public confirmDeleteModal: ModalDirective

  public settingsFilterAccount = {};
  public dataAccount = [];
  public selectedAccountID = [];
  public selectedDetailAccountID = [];

  public selectedSenderName = [];
  public dataSender = [];
  public settingsFilterSender = {};

  public groupName = "";
  public dataGroup;
  public pagination: Pagination = new Pagination();

  public dayBefore = "";
  public contentSample = "";

  public formEdit: FormGroup;
  public groupID;

  public dataChooseColumn = []
  public selectedColumn = []
  public settingsFilterColumn = {}

  constructor(private dataService: DataService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private utilityService: UtilityService) {

    this.formEdit = new FormGroup({
      id: new FormControl(),
      accountID: new FormControl(),
      senderID: new FormControl(),
      groupName: new FormControl(),
      dayBefore: new FormControl(),
      timer: new FormControl(),
      contentSample: new FormControl(),
      columnID: new FormControl()
    });

    this.settingsFilterAccount = {
      text: this.utilityService.translate("global.choose_account"),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate("global.search"),
      noDataLabel: this.utilityService.translate("global.no_data")
    }

    this.settingsFilterSender = {
      text: this.utilityService.translate("global.choose_sender"),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate("global.search"),
      noDataLabel: this.utilityService.translate("global.no_data")
    }

    this.settingsFilterColumn = {
      text: this.utilityService.translate("sms_birthday.select_content"),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate("global.search"),
      noDataLabel: this.utilityService.translate("global.no_data")
    }
  }

  ngOnInit() {
    this.bindDataAccount();
    this.loadComboboxColumn()
  }

  //#region load data account
  public async bindDataAccount() {
    let result = await this.dataService.getAsync('/api/account/GetInfoAccountLogin');
    let is_admin = result.data[0].IS_ADMIN;
    if (is_admin != null && is_admin == 1) {
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
        this.selectedAccountID.push({ "id": this.dataAccount[0].id, "itemName": this.dataAccount[0].itemName });
      }
      else
        this.selectedAccountID.push({ "id": 0, "itemName": this.utilityService.translate("global.choose_account") });
    }
    if (this.selectedAccountID.length > 0) {
      this.bindDataSender(this.selectedAccountID[0].id);
    }
    this.loadDataGrid();
  }

  onItemSelect() {
    this.bindDataSender(this.selectedAccountID[0].id);
    this.loadDataGrid();
  }

  OnItemDeSelect() {
    this.selectedAccountID = []
    this.selectedSenderName = []
    this.loadDataGrid();
  }
  //#endregion

  //#region load data sender
  public async bindDataSender(accountID) {
    this.dataSender = [];
    this.selectedSenderName = [];
    if (accountID != null && accountID != undefined && accountID > 0) {
      let response: any = await this.dataService.getAsync('/api/SenderName/GetSenderByAccountAndType?accountID=' +
        accountID + "&smsType=CSKH")
      for (let index in response.data) {
        this.dataSender.push({ "id": response.data[index].ID, "itemName": response.data[index].NAME });
      }
    }
  }

  onItemSelectSender() {
    this.loadDataGrid();
  }
  //#endregion

  //#region load data and paging
  public async loadDataGrid() {
    this.dataGroup = []
    let response: any = await this.dataService.getAsync('/api/SmsBirthdayGroup/GetSmsBirthdayGroupFilter?pageIndex=' +
      this.pagination.pageIndex + '&pageSize=' + this.pagination.pageSize +
      '&accountId=' + (this.selectedAccountID.length > 0 ? this.selectedAccountID[0].id : "") +
      '&senderId=' + (this.selectedSenderName.length > 0 ? this.selectedSenderName[0].id : "") +
      '&groupName=' + this.groupName)
    if (response.err_code == 0) this.loadData(response)
  }

  loadData(response?: any) {
    if (response) {
      this.dataGroup = response.data;
      if ('pagination' in response) {
        this.pagination.pageSize = response.pagination.PageSize;
        this.pagination.totalRow = response.pagination.TotalRows;
      }
    }
  }

  setPageIndex(pageNo: number): void {
    this.pagination.pageIndex = pageNo;
    this.loadDataGrid();
  }

  pageChanged(event: any): void {
    this.setPageIndex(event.page);
  }

  changePageSize(size) {
    this.pagination.pageSize = size;
    this.pagination.pageIndex = 1;
    this.loadDataGrid();
  }
  //#endregion

  //#region search data
  searchData(form) {
    this.groupName = form.groupName.trim()
    this.loadDataGrid()
  }
  //#endregion

  //#region create
  showFormCreate() {
    this.groupName = ""
    this.selectedDetailAccountID = []
    this.selectedSenderName = []
    this.dayBefore = ""
    this.contentSample = ""
    this.createNewModal.show()
  }

  onItemSelectDetailAccount() {
    if (this.selectedDetailAccountID.length > 0)
      this.bindDataSender(this.selectedDetailAccountID[0].id)
  }

  public async createDetail(form) {
    let detail = form.value;
    if (this.selectedDetailAccountID.length == 0) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-63"))
      return
    }
    let ACCOUNT_ID = this.selectedDetailAccountID[0].id

    if (this.selectedSenderName.length == 0) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-44"))
      return
    }
    let SENDER_ID = this.selectedSenderName[0].id

    let GROUP_NAME = detail.groupName.trim()
    if (GROUP_NAME == "" || GROUP_NAME == undefined) {
      this.notificationService.displayWarnMessage("Bạn phải nhập tên nhóm cần gửi tin!")
      return
    }

    let DAY_BEFORE = detail.dayBefore != undefined && detail.dayBefore != "" ? detail.dayBefore : "";

    let HOUR_SEND = this.timer.nativeElement.value
    if (HOUR_SEND == "" || HOUR_SEND == undefined) {
      this.notificationService.displayWarnMessage("Bạn phải hẹn giờ gửi tin!")
      return
    }

    let CONTENT_SAMPLE = this.contentSMS.nativeElement.value;
    if (CONTENT_SAMPLE == "" || CONTENT_SAMPLE == undefined) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-91"))
      return
    }

    let response: any = await this.dataService.postAsync('/api/SmsBirthdayGroup', {
      ACCOUNT_ID, SENDER_ID, GROUP_NAME, DAY_BEFORE, HOUR_SEND, CONTENT_SAMPLE
    })
    if (response.err_code == 0) {
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("100"));
      this.closeFormCreate()
      this.loadDataGrid()
    }
    else this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
  }

  closeFormCreate() {
    this.groupName = ""
    this.selectedDetailAccountID = []
    this.selectedSenderName = []
    this.dayBefore = ""
    this.contentSample = ""
    this.createNewModal.hide()
  }
  //#endregion

  //#region edit
  public async showConfirmEdit(id) {
    let response: any = await this.dataService.getAsync('/api/SmsBirthdayGroup/' + id)
    if (response.err_code == 0) {
      if (response.data.length > 0) {
        let data = response.data[0];
        // this.contentSMS.nativeElement.value = data.CONTENT_SAMPLE
        this.formEdit = new FormGroup({
          id: new FormControl(id),
          accountID: new FormControl(data.ACCOUNT_ID),
          senderID: new FormControl(data.SENDER_ID),
          groupName: new FormControl(data.GROUP_NAME),
          dayBefore: new FormControl(data.DAY_BEFORE),
          timer: new FormControl(data.HOUR_SEND),
          contentSample: new FormControl(data.CONTENT_SAMPLE),
          columnID: new FormControl([{ "id": "", "itemName": this.utilityService.translate("sms_birthday.select_content") }])
        });
        this.editThisModal.show()
      }
      else this.notificationService.displayErrorMessage(this.utilityService.translate("global.no_data"));
    }
    else {
      this.notificationService.displayErrorMessage(response.err_message);
    }
  }

  public async editData() {
    let detail = this.formEdit.controls;
    let ID = detail.id.value;

    let GROUP_NAME = detail.groupName.value
    if (GROUP_NAME == "" || GROUP_NAME == undefined) {
      this.notificationService.displayWarnMessage("Bạn phải nhập tên nhóm cần gửi tin!")
      return
    }

    let ACCOUNT_ID = detail.accountID.value
    let SENDER_ID = detail.senderID.value

    let HOUR_SEND = detail.timer.value
    if (HOUR_SEND == "" || HOUR_SEND == undefined) {
      this.notificationService.displayWarnMessage("Bạn phải hẹn giờ gửi tin!")
      return
    }

    let DAY_BEFORE = detail.dayBefore.value != undefined ? detail.dayBefore.value : null

    let CONTENT_SAMPLE = detail.contentSample.value
    if (CONTENT_SAMPLE == "" || CONTENT_SAMPLE == undefined) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-91"))
      return
    }

    let response: any = await this.dataService.putAsync('/api/SmsBirthdayGroup/' + ID, {
      ACCOUNT_ID, SENDER_ID, GROUP_NAME, HOUR_SEND, DAY_BEFORE, CONTENT_SAMPLE
    });
    if (response.err_code == 0) {
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("300"));
      this.editThisModal.hide();
      this.loadDataGrid();
    } else {
      this.notificationService.displayErrorMessage(response.err_message);
    }
  }
  //#endregion

  //#region delete
  showConfirmDelete(id) {
    this.groupID = id;
    this.confirmDeleteModal.show();
  }

  public async delete(id) {
    let response: any = await this.dataService.deleteAsync('/api/SmsBirthdayGroup/' + id)
    if (response.err_code == 0) {
      this.confirmDeleteModal.hide();
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("200"));
      this.loadDataGrid();
    }
    else if (response.err_code == 103) this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("103"));
    else {
      this.notificationService.displayErrorMessage(response.err_message);
    }
  }
  //#endregion

  //#region chen noi dung tuy bien
  loadComboboxColumn() {
    this.dataChooseColumn = [];
    this.dataChooseColumn.push({ "id": "[name]", "itemName": "Tên" })
    this.dataChooseColumn.push({ "id": "[fullname]", "itemName": "Họ và tên" })
    this.dataChooseColumn.push({ "id": "[phone]", "itemName": "Số điện thoại" })
    this.dataChooseColumn.push({ "id": "[danhxung]", "itemName": "Danh xưng" })
  }

  onItemSelectColumn() {
    this.contentSMS.nativeElement.focus();
    let startString = this.contentSMS.nativeElement.value.substr(0, this.contentSMS.nativeElement.selectionStart);
    let endString = this.contentSMS.nativeElement.value.substr(this.contentSMS.nativeElement.selectionStart,
      this.contentSMS.nativeElement.value.length);
    if (this.selectedColumn.length > 0) {
      this.contentSample = startString.trim() + " " + this.selectedColumn[0].id + " " + endString.trim();
    }
    this.selectedColumn = []
  }

  onItemSelectColumnEdit() {
    let detail = this.formEdit.controls;
    let content = detail.contentSample.value
    this.contentSMS.nativeElement.value = content
    let startString = this.contentSMS.nativeElement.value.substr(0, this.contentSMS.nativeElement.selectionStart);
    let endString = this.contentSMS.nativeElement.value.substr(this.contentSMS.nativeElement.selectionStart,
      this.contentSMS.nativeElement.value.length);
    if (detail.columnID.value.length > 0) {
      this.contentSample = startString.trim() + " " + detail.columnID.value[0].id + " " + endString.trim();
    }
    this.selectedColumn = []
  }
  //#endregion

}
