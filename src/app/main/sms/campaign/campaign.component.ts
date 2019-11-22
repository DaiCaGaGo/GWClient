import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective, BsModalService } from 'ngx-bootstrap';
import { Pagination } from 'src/app/core/models/pagination';
import { FormGroup, FormControl } from '@angular/forms';
import { DataService } from 'src/app/core/services/data.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-campaign',
  templateUrl: './campaign.component.html',
  styleUrls: ['./campaign.component.css']
})
export class CampaignComponent implements OnInit {
  @ViewChild('confirmApproveModal', { static: false }) public confirmApproveModal: ModalDirective;
  @ViewChild('confirmApproveStatusModal', { static: false }) public confirmApproveStatusModal: ModalDirective;
  @ViewChild('confirmDeleteModal', { static: false }) public confirmDeleteModal: ModalDirective;
  @ViewChild('editContentCampaignModel', { static: false }) public editContentCampaignModel: ModalDirective;
  @ViewChild('uploadExcelModal', { static: false }) public uploadExcelModal;
  @ViewChild('uploadFile', { static: false }) public uploadFile;

  public dataCampaign;
  public pagination: Pagination = new Pagination();

  public settingsFilterAccount = {};
  public dataAccount = [];
  public selectedAccountID = [];

  public settingsFilterSender = {};
  public dataSender = [];
  public selectedSenderID = [];

  public settingsFilterCampaignStatus = {};
  public dataCampaignStatus = [];
  public selectedCampaignStatusID = [];

  public campaignID;
  public formEditContent: FormGroup;

  public numberChar: string = '0';
  public numberSMS: string = '0';

  public listHeader = [];
  public dataImport = [];

  public fromDate: string = "";
  public toDate: string = "";
  public minDate: Date;
  public timeFrom: Date = new Date();
  public timeTo: Date = new Date();

  public reasonContent = "";
  public loading: boolean = false;

  public selectedSmsType = [];
  public dataSmsType = [];
  public settingsFilterSmsType = {};

  constructor(
    private dataService: DataService,
    private modalService: BsModalService,
    private notificationService: NotificationService,
    private authService: AuthService,
    private utilityService: UtilityService,
    private activatedRoute: ActivatedRoute) {
    modalService.config.backdrop = 'static';

    this.formEditContent = new FormGroup({
      id: new FormControl(),
      smsType: new FormControl(),
      contentOld: new FormControl(),
      contentNew: new FormControl(),
      timeSchedule: new FormControl()
    });

    this.settingsFilterAccount = {
      text: "Chọn tài khoản",
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: "Tìm kiếm",
      noDataLabel: "Không có dữ liệu"
    };

    this.settingsFilterSender = {
      text: "Chọn thương hiệu",
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: "Tìm kiếm",
      noDataLabel: "Không có dữ liệu"
    };

    this.settingsFilterCampaignStatus = {
      text: "Chọn trạng thái",
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: "Tìm kiếm",
      noDataLabel: "Không có dữ liệu"
    };

    this.settingsFilterSmsType = {
      text: "Chọn loại tin nhắn",
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: "Tìm kiếm",
      noDataLabel: "Không có dữ liệu"
    };

    this.minDate = new Date();
    this.minDate.setDate(this.minDate.getDate());
  }

  ngOnInit() {
    if (this.activatedRoute.snapshot.queryParamMap.get('redirectFrom') && this.activatedRoute.snapshot.queryParamMap.get('redirectFrom') == 'home') {
      this.timeFrom = this.utilityService.formatDateTempalte(this.activatedRoute.snapshot.queryParamMap.get('currentDate'));
    }
    this.fromDate = this.utilityService.formatDateToString(this.timeFrom, "yyyyMMdd");
    this.toDate = this.utilityService.formatDateToString(this.timeTo, "yyyyMMdd");

    this.getDataAccount();
    this.bindDataSmsType();
    this.loadCampaignStatus();
    this.getData();
  }

  //#region load data and paging

  async getData() {
    this.dataCampaign = [];
    let acocuntID = "";
    if (this.selectedAccountID.length > 0) acocuntID = this.selectedAccountID[0].id;
    let response: any = await this.dataService.getAsync('/api/campaign/GetCampaignPaging?pageIndex=' +
      this.pagination.pageIndex + '&pageSize=' + this.pagination.pageSize + "&accountId=" + acocuntID + 
      '&smsType=' + (this.selectedSmsType.length > 0 ? this.selectedSmsType[0].id : "") +
      '&senderName=' + (this.selectedSenderID.length > 0 ? this.selectedSenderID[0].itemName : "") +
      '&status=' + (this.selectedCampaignStatusID.length > 0 ? this.selectedCampaignStatusID[0].id : "") +
      '&fromDate=' + this.fromDate + '&toDate=' + this.toDate);
    this.loadData(response);
  }

  loadData(response?: any) {
    if (response) {
      this.dataCampaign = response.data;
      if ('pagination' in response) {
        this.pagination.pageSize = response.pagination.PageSize;
        this.pagination.totalRow = response.pagination.TotalRows;
      }
    }
  }

  pageChanged(event: any): void {
    this.setPageIndex(event.page);
  }
  setPageIndex(pageNo: number): void {
    this.pagination.pageIndex = pageNo;
    this.getData();
  }

  changePageSize(size) {
    this.pagination.pageSize = size;
    this.pagination.pageIndex = 1;
    this.getData();
  }

  //#endregion

  //#region load account
  async getDataAccount() {
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
        this.selectedAccountID.push({ "id": 0, "itemName": "Chọn tài khoản" });
    }
    if (this.selectedAccountID.length > 0 && this.selectedSmsType.length > 0)
      this.getDataSenderName(this.selectedAccountID[0].id, this.selectedSmsType[0].id);
    this.getData();
  }

  onItemSelect() {
    if (this.selectedAccountID.length > 0 && this.selectedSmsType.length > 0)
      this.getDataSenderName(this.selectedAccountID[0].id, this.selectedSmsType[0].id);
    this.getData();
  }

  OnItemDeSelect() {
    this.dataSender = []
    this.getData();
  }
  //#endregion

  //#region load sms type
  public async bindDataSmsType() {
    let response: any = await this.dataService.getAsync('/api/sysvar/GetSysvarByGroup?var_group=SMS_TYPE');
    for (let i in response.data) {
      this.dataSmsType.push({ "id": response.data[i].VAR_VALUE, "itemName": response.data[i].VAR_NAME });
    }
    // if (this.dataSmsType.length > 0)
    //   this.selectedSmsType.push({ "id": this.dataSmsType[0].id, "itemName": this.dataSmsType[0].itemName });
    if (this.selectedAccountID.length > 0 && this.selectedSmsType.length > 0) {
      this.getDataSenderName(this.selectedAccountID[0].id, this.selectedSmsType[0].id);
    }
  }

  onItemSelectSmsType() {
    if (this.selectedAccountID.length > 0 && this.selectedSmsType.length > 0) {
      this.getDataSenderName(this.selectedAccountID[0].id, this.selectedSmsType[0].id);
    }
    else this.dataSender = [];
  }
  //#endregion

  //#region load sender
  async getDataSenderName(accountID, smsType) {
    this.dataSender = [];
    this.selectedSenderID = [];
    if (accountID != null && accountID != undefined && accountID > 0 && smsType != "") {
      let response: any = await this.dataService.getAsync('/api/SenderName/GetSenderByAccountAndType?accountID=' +
        accountID + "&smsType=" + smsType)
      for (let index in response.data) {
        this.dataSender.push({ "id": response.data[index].ID, "itemName": response.data[index].NAME });
      }
      this.getData();
    }
  }
  onItemSelectSender() {
    this.getData();
  }

  OnItemDeSelectSender() {
    this.getData();
  }
  //#endregion

  //#region load campaign status
  loadCampaignStatus() {
    this.dataCampaignStatus = [];
    this.selectedCampaignStatusID = [];
    this.dataCampaignStatus.push({ "id": 0, "itemName": "Chờ duyệt" });
    this.dataCampaignStatus.push({ "id": 1, "itemName": "Chờ kết quả" });
    this.dataCampaignStatus.push({ "id": 2, "itemName": "Hoàn thành" });
    this.dataCampaignStatus.push({ "id": 3, "itemName": "Hủy đơn" });
    this.getData();
  }

  onItemSelectStatus() {
    this.getData();
  }

  OnItemDeSelectStatus() {
    this.selectedCampaignStatusID = [];
    this.getData();
  }
  //#endregion

  //#region duyet tin
  showConfirmApproveSms(id) {
    this.campaignID = id;
    this.confirmApproveModal.show();
  }

  public async approveSms(campaign_id) {
    if (campaign_id != undefined && campaign_id > 0) {
      let respone = await this.dataService.postAsync('/api/sms/ApproveCampaign?campaignID=' + campaign_id);
      if (respone.err_code == 0) this.notificationService.displaySuccessMessage(respone.err_message);
      else this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
    }
    else this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-52"));

    this.confirmApproveModal.hide();
    this.getData();
  }
  //#endregion

  //#region duyet don hang (update trang thai hoan thanh don hang)
  showConfirmApproveSmsStatus(id) {
    this.campaignID = id;
    this.confirmApproveStatusModal.show();
  }

  public async approveStatusCampaign(campaign_id) {
    this.loading = true;
    if (campaign_id != undefined && campaign_id > 0) {
      let respone = await this.dataService.putAsync('/api/Campaign/ApproveStatusCampaign?campaignID=' + campaign_id);
      if (respone.err_code == 0) this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("300"));
      else if (respone.err_code == -1) this.notificationService.displayWarnMessage("Không có bản ghi nào được cập nhật");
      else this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
    }
    else this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-52"));

    this.loading = false;
    this.confirmApproveStatusModal.hide();
    this.getData();
  }
  //#endregion

  //#region xoa đơn hàng chi tiết
  showConfirmDelete(id) {
    this.campaignID = id;
    this.reasonContent = "";
    this.confirmDeleteModal.show();
  }

  public async deleteCampaign(campaign_id) {
    // let data = await this.dataService.deleteAsync('/api/Campaign/DeleteCampaignPaging?id=' + campaign_id +
    //   '&accountID=' + (this.selectedAccountID.length > 0 ? this.selectedAccountID[0].id : "") +
    //   '&pageIndex=' + this.pagination.pageIndex + '&pageSize=' + this.pagination.pageSize);
    // if (data.err_code == 0) {
    //   this.confirmDeleteModal.hide();
    //   this.selectedSenderID = [];
    //   this.getData();
    //   this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("200"));
    // }
    // else {
    //   this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
    // }
    if (this.reasonContent == "") {
      this.notificationService.displayWarnMessage("Bạn phải nhập lý do hủy đơn");
      return;
    }
    let data = await this.dataService.putAsync('/api/Campaign/CancelCampaign?campaignID=' + campaign_id +
      '&description=' + this.reasonContent);
    if (data.err_code == 0) {
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("-88"));
      this.confirmDeleteModal.hide();
      this.getData();
    }
    else this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
  }
  //#endregion

  //#region edit content template
  public async showFormEditContent(campaign_id) {
    let response: any = await this.dataService.getAsync('/api/Campaign/' + campaign_id)
    if (response.err_code == 0) {
      let dataCampaign = response.data[0];
      debugger
      this.formEditContent = new FormGroup({
        id: new FormControl(campaign_id),
        smsType: new FormControl(dataCampaign.SMS_TYPE),
        contentOld: new FormControl(dataCampaign.SMS_TEMPLATE),
        contentNew: new FormControl(""),
        timeSchedule: new FormControl(dataCampaign.TIMESCHEDULE)
      });
      this.editContentCampaignModel.show();
    } else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
    }
  }

  public async editContentSms() {
    let formData = this.formEditContent.controls;
    let ID = formData.id.value;
    let smsType = formData.smsType.value;
    let smsContentOld = formData.contentOld.value;
    let smsContentNew = formData.contentNew.value;
    let time = new Date(); // test cập nhật thời gian gửi, value đang = ""
    time = formData.timeSchedule.value;
    let TIMESCHEDULE = this.utilityService.formatDateToString(time, "yyyyMMddHHmmss");

    if (smsContentNew != undefined && smsContentNew != "") {
      smsContentNew = this.utilityService.removeDiacritics(smsContentNew);
      smsContentNew = this.utilityService.removeSign4VietnameseString(smsContentNew);
    }
    else smsContentNew = smsContentOld;

    if (TIMESCHEDULE == "" || TIMESCHEDULE == undefined) {
      this.notificationService.displayWarnMessage("Thời gian gửi tin không được để trống!");
      return;
    }

    let editCampaign = await this.dataService.putAsync('/api/Campaign/UpdateSmsTemplateCampaign?campaignID=' + ID +
      '&smsContent=' + smsContentNew + '&smsType=' + smsType + '&timeSchedule=' + TIMESCHEDULE);
    if (editCampaign.err_code == 0) {
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("300"));
      this.editContentCampaignModel.hide();
      this.getData();
    }
    else this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
  }
  //#endregion

  //#region change count sms
  countSMS(sms) {
    let smsContent = this.utilityService.removeDiacritics(sms);
    smsContent = this.utilityService.removeSign4VietnameseString(sms);
    let result = "";

    for (var i = 0, len = smsContent.length; i < len; i++) {
      if (smsContent.charCodeAt(i) == 160) {
        result += " ";
      }
      else if (smsContent.charCodeAt(i) <= 127) {
        result += smsContent[i];
      }
    }
    smsContent = result;
    var lengthsms = 0
    for (var k = 0; k < smsContent.length; k++) {
      if (smsContent.charAt(k) == '\\' || smsContent.charAt(k) == '^'
        || smsContent.charAt(k) == '{' || smsContent.charAt(k) == '}' || smsContent.charAt(k) == '['
        || smsContent.charAt(k) == ']' || smsContent.charAt(k) == '|') {
        lengthsms = lengthsms + 2;
      }
      else {
        lengthsms = lengthsms + 1;
      }
    }

    this.numberChar = lengthsms.toString();

    if (lengthsms == 0) {
      this.numberSMS = "0";
    }
    else if (lengthsms < 161) {
      this.numberSMS = "1";
    }
    else if (lengthsms < 307) {
      this.numberSMS = "2";
    }
    else {
      this.numberSMS = "3";
    }
  }
  //#endregion

  //#region change datetime
  onChangeFromDate(event) {
    this.fromDate = this.utilityService.formatDateToString(event, "yyyyMMdd");
    if (this.fromDate > this.toDate) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-35"));
      return;
    }
    this.getData();
  }

  onChangeToDate(event) {
    console.log(event);
    this.toDate = this.utilityService.formatDateToString(event, "yyyyMMdd");
    if (this.fromDate > this.toDate) {
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("-35"));
      return;
    }
    this.getData();
  }
  //#endregion

  public async exportExcel(campaign_id) {
    if (campaign_id != undefined && campaign_id != "") {
      let result: boolean = await this.dataService.getFileExtentionCampaignApproveAsync("/api/FileExtention/ExportExcelCampaignApprove",
        campaign_id, "CampaignApprove");
      if (result) {
        this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("120"));
      }
      else {
        this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("125"));
      }
    }
    else this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("125"));
  }

  //#region trang thai gui tin tu nha mang
  updateStatusSend(campaign_id) {
    this.campaignID = campaign_id;
    this.clearFileUpload();
    this.uploadExcelModal.show();
  }

  clearFileUpload() {
    this.uploadFile.nativeElement.value = "";
  }

  public async exportExcelTemplate() {
    let result: boolean = await this.dataService.getFileExtentionAsync("/api/FileExtention/ExportExcelTemplate", "UpdateStatusSmsPartner", "Template_Update_Status_SMS.xlsx");
    if (result) {
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("120"));
    }
    else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("125"));
    }
  }

  public async UploadFileStatus() {
    this.listHeader = [];
    this.dataImport = [];
    let file = this.uploadFile.nativeElement;
    if (file.files.length > 0) {
      let response: any = await this.dataService.importExcelAsync(null, file.files);
      if (response.err_code == 0) {
        this.listHeader = response.arr_fields;
        this.dataImport = response.data;
        if (this.listHeader.length != 2) {
          this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-53"));
          return;
        }
        if (this.listHeader[0].toLowerCase() != "phone") {
          this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-54"));
          return;
        }
        if (this.listHeader[1].toLowerCase() != "status") {
          this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-55"));
          return;
        }
      }
    }
  }

  public async updateStatusPartner(campaign_id) {
    let countLength = this.listHeader.length;
    if (countLength > 0) {
      if (this.listHeader.length != 2) {
        this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-53"));
        return;
      }
      if (this.listHeader[0].toLowerCase() != "phone") {
        this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-54"));
        return;
      }
      if (this.listHeader[1].toLowerCase() != "status") {
        this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-55"));
        return;
      }
      let listUpdate = [];
      for (let i in this.dataImport) {
        let phone = this.dataImport[i][this.listHeader[0]];
        let result = this.dataImport[i][this.listHeader[1]];
        if (phone != "" && phone != null && phone != undefined) listUpdate.push({ PHONE: phone, RECEIVE_RESULT: result });
      }
      if (listUpdate.length > 0) {
        let respone: any = await this.dataService.putAsync('/api/Sms/UpdateStatusSmsAdsFromPartner?campaign_id=' + campaign_id, listUpdate);
        if (respone.err_code == 0) {
          this.notificationService.displaySuccessMessage(respone.err_message);
        }
        else {
          this.notificationService.displayErrorMessage(respone.err_message);
          return;
        }
      }
      else {
        this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-56"));
      }
      this.uploadExcelModal.hide();
      this.getData();
    }
    else {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-57"));
      return;
    }

  }

  //#endregion

  public convertStringDate(text: string): string {
    let value = "";
    let nam = "", thang = "", ngay = "";
    let gio = "", phut = "", giay = "";
    if (text != "" && text != null && text != undefined) {
      nam = text.substring(0, 4);
      thang = text.substring(4, 6);
      ngay = text.substring(6, 8);
      gio = text.substring(8, 10);
      phut = text.substring(10, 12);
      giay = text.substring(12, 14);
      value = ngay + "/" + thang + "/" + nam + " " + gio + ":" + phut + ":" + giay;
    }
    return value;
  }
}
