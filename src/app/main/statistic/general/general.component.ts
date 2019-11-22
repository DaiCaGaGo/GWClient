import { Component, OnInit } from '@angular/core';
import { Pagination } from 'src/app/core/models/pagination';
import { AuthService } from 'src/app/core/services/auth.service';
import { DataService } from 'src/app/core/services/data.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css']
})
export class GeneralComponent implements OnInit {

  public dataGeneral = [];
  public dataSender = [];
  public settingsFilterSender = {};
  public selectedItemComboboxSender = [];
  public dataPartner = [];
  public settingsFilterPartner = {};
  public selectedItemComboboxPartner = [];
  public dataType = [];
  public settingsFilterType = {};
  public selectedItemComboboxType = [];
  public fromDate: string = "";
  public toDate: string = "";
  public timeFrom: string = '';
  public timeTo: string = '';

  public roleAccess = 0;
  public isPartner: boolean = false;
  public viettel: boolean = false;
  public mobiphone: boolean = false;
  public vinaphone: boolean = false;
  public vietnameMobile: boolean = false;
  public gtel: boolean = false;
  public sfone: boolean = false;
  public pagination: Pagination = new Pagination();

  constructor(private authService: AuthService,
    private dataService: DataService,
    private utilityService: UtilityService,
    private notificationService: NotificationService) {

    this.settingsFilterSender = {
      text: "Chọn thương hiệu",
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: "Tìm kiếm",
      noDataLabel: "Không có dữ liệu"
    };

    this.settingsFilterPartner = {
      text: "Chọn cổng",
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: "Tìm kiếm",
      noDataLabel: "Không có dữ liệu"
    };

    this.settingsFilterType = {
      text: "Chọn loại tin",
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: "Tìm kiếm",
      noDataLabel: "Không có dữ liệu"
    };
  }

  ngOnInit() {
    this.getInfoAccountLogin();
    this.bindDataSender();
    this.bindDataPartner();
    this.bindDataType();
    this.getData();
    this.fromDate = (this.timeFrom == '') ? '' : this.utilityService.formatDateToString(this.timeFrom, "yyyyMMdd");
  }

  async getInfoAccountLogin() {
    let result = await this.dataService.getAsync('/api/account/GetInfoAccountLogin');
    this.roleAccess = result.data[0].ROLE_ACCESS;
    if (this.roleAccess == 50)
      this.isPartner = true;
    else
      this.isPartner = false;
  }

  //#region load data general
  async getData() {
    let senderName = this.selectedItemComboboxSender.length != 0 && this.selectedItemComboboxSender[0].itemName != "" ? this.selectedItemComboboxSender[0].itemName : "";
    let partnerName = "";
    if (this.roleAccess == 50 && this.selectedItemComboboxPartner.length != 0 && this.selectedItemComboboxPartner[0].itemName != "")
      partnerName = this.selectedItemComboboxPartner[0].itemName;
    this.fromDate = this.timeFrom != "" ? this.utilityService.formatDateToString(this.timeFrom, "yyyyMMdd") : "";
    this.toDate = this.timeTo != "" ? this.utilityService.formatDateToString(this.timeTo, "yyyyMMdd") : "";
    let type = this.selectedItemComboboxType.length != 0 && this.selectedItemComboboxType[0].id != 0 ? this.selectedItemComboboxType[0].id : "";
    let telco = (this.viettel == true ? "viettel," : "") + (this.mobiphone == true ? "vms," : "") +
      (this.vinaphone == true ? "gpc," : "") + (this.vietnameMobile == true ? "vnm," : "") + (this.gtel == true ? "gtel," : "") +
      (this.sfone == true ? "sfone" : "");
    let response: any = await this.dataService.getAsync('/api/Sms/StatisticSmsGeneral?senderName=' + senderName + "&partnerName=" + partnerName +
      "&fromDate=" + this.fromDate + "&toDate=" + this.toDate + "&smsType=" + type + "&telco=" + telco)
    this.loadData(response);
  }
  //#endregion

  loadData(response?: any) {
    if (response) {
      this.dataGeneral = response.data;
      if ('pagination' in response) {
        this.pagination.pageSize = response.pagination.PageSize;
        this.pagination.totalRow = response.pagination.TotalRows;
      }
    }
  }

  //#region sender
  async bindDataSender() {
    if (this.roleAccess == 50) {
      let response: any = await this.dataService.getAsync('/api/SenderName')
      for (let index in response.data) {
        this.dataSender.push({ "id": response.data[index].ID, "itemName": response.data[index].NAME });
      }
      if (this.dataSender.length == 1)
        this.selectedItemComboboxSender.push({ "id": this.dataSender[0].id, "itemName": this.dataSender[0].itemName });
    }
    else {
      let response: any = await this.dataService.getAsync('/api/SenderName/GetSenderNameByAccountID?account_id=' + this.authService.currentUserValue.ACCOUNT_ID)
      for (let index in response.data) {
        this.dataSender.push({ "id": response.data[index].ID, "itemName": response.data[index].NAME });
      }
      if (this.dataSender.length == 1)
        this.selectedItemComboboxSender.push({ "id": this.dataSender[0].id, "itemName": this.dataSender[0].itemName });
    }
  }

  onItemSelectSender() {
    this.getData();
  }

  OnItemDeSelectSender() {
    this.getData();
  }
  //#endregion

  //#region partner
  public async bindDataPartner() {
    let response = await this.dataService.getAsync('/api/Partner');
    for (let i in response.data) {
      this.dataPartner.push({ "id": response.data[i].PARTNER_CODE, "itemName": response.data[i].PARTNER_NAME });
    }
    if (this.dataPartner.length == 1)
        this.selectedItemComboboxPartner.push({ "id": this.dataPartner[0].id, "itemName": this.dataPartner[0].itemName });
  }

  onItemSelectPartner() {
    this.getData();
  }

  OnItemDeSelectPartner() {
    this.getData();
  }
  //#endregion

  //#region smsType
  public async bindDataType() {
    let response: any = await this.dataService.getAsync('/api/sysvar/GetSysvarByGroup?var_group=SMS_TYPE');
    for (let i in response.data) {
      this.dataType.push({ "id": response.data[i].VAR_VALUE, "itemName": response.data[i].VAR_NAME });
    }
  }

  onItemSelectSmsType() {
    this.getData();
  }

  OnItemDeSelectSmsType() {
    this.getData();
  }
  //#endregion

  //#region search
  onChangeFromDate(event) {
    this.fromDate = this.utilityService.formatDateToString(event, "yyyyMMdd");
    this.getData();
  }

  onChangeToDate(event) {
    console.log(event);
    this.toDate = this.utilityService.formatDateToString(event, "yyyyMMdd");
    this.getData();
  }
  //#endregion

  public async exportGeneral() {
    //   let accoutId = this.selectedAccountID != null && this.selectedAccountID.length > 0 ? this.selectedAccountID[0].id : "";
    //   let result: boolean = await this.dataService.getFileExtentionSmsErrorAsync('/api/FileExtention/ExportExcelSmsError', accoutId
    //     , (this.selectedSenderID.length > 0 ? this.selectedSenderID[0].itemName : ""), this.smsContent, this.phone
    //     , (this.selectedSmsType.length > 0 ? this.selectedSmsType[0].id : ""), (this.viettel == true ? "VIETTEL" : "")
    //     , (this.vinaphone == true ? "GPC" : ""), (this.mobiphone == true ? "VMS" : ""), (this.vietnameMobile == true ? "VNM" : "")
    //     , (this.gtel == true ? "GTEL" : ""), (this.sfone == true ? "SFONE" : ""), this.fromDate, this.toDate
    //     , (this.selectedPartnerID.length > 0 ? this.selectedPartnerID[0].id : ""), (this.selectedSmsStatus.length > 0 ? this.selectedSmsStatus[0].id : "")
    //     , "SmsError");
    //   if (result) {
    //     this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("120"));
    //   }
    //   else {
    //     this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("125"));
    //   }
  }
}
