import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormGroup, FormControl } from '@angular/forms';
import { DataService } from 'src/app/core/services/data.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { UtilityService } from 'src/app/core/services/utility.service';

@Component({
  selector: 'app-sender-expired',
  templateUrl: './sender-expired.component.html',
  styleUrls: ['./sender-expired.component.css']
})
export class SenderExpiredComponent implements OnInit {
  @ViewChild('showModalUpdate', { static: false }) public showModalUpdate: ModalDirective;

  public dataSender;
  public dataSenderGroup = [];

  public formEditSenderName: FormGroup;
  public fillterTemp: boolean;
  public isDisableTemp = true;

  public settingsFilterSenderGroup = {};
  public settingsFilterSenderGroupModal = {};
  public selectedItemComboboxSenderGroup = [];
  public selectedItemComboboxSenderGroupVTL = [];
  public selectedItemComboboxSenderGroupGPC = [];
  public selectedItemComboboxSenderGroupVMS = [];
  public selectedItemComboboxSenderGroupVNM = [];
  public selectedItemComboboxSenderGroupGTEL = [];
  public selectedItemComboboxSenderGroupSFONE = [];

  constructor(private dataService: DataService,
    private notificationService: NotificationService,
    private utilityService: UtilityService) {

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
      text: "Chọn nhóm thương hiệu",
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: "Tìm kiếm",
      noDataLabel: "Không có dữ liệu"
    };

   }

  ngOnInit() {
    this.getSenderExpired();
    this.getDataSenderGroup();
  }

  public async getSenderExpired() {
    let response = await this.dataService.getAsync('/api/SenderName/GetSenderExpiredTime/');
    this.dataSender = response.data;
  }

   //#region load group sender
   async getDataSenderGroup() {
    this.selectedItemComboboxSenderGroup.push({ "id": "", "itemName": "Chọn nhóm thương hiệu" });
    this.selectedItemComboboxSenderGroupVTL.push({ "id": "", "itemName": "Chọn nhóm thương hiệu" });
    this.selectedItemComboboxSenderGroupGPC.push({ "id": "", "itemName": "Chọn nhóm thương hiệu" });
    this.selectedItemComboboxSenderGroupVMS.push({ "id": "", "itemName": "Chọn nhóm thương hiệu" });
    this.selectedItemComboboxSenderGroupVNM.push({ "id": "", "itemName": "Chọn nhóm thương hiệu" });
    this.selectedItemComboboxSenderGroupGTEL.push({ "id": "", "itemName": "Chọn nhóm thương hiệu" });
    this.selectedItemComboboxSenderGroupSFONE.push({ "id": "", "itemName": "Chọn nhóm thương hiệu" });
    let response: any = await this.dataService.getAsync('/api/sendergroup')
    if (response)
      for (let index in response.data) {
        this.dataSenderGroup.push({ "id": response.data[index].ID, "itemName": response.data[index].NAME });
      }
  }
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

  //#region sửa thời gian hết hạn sender
  public async confirmUpdateModal(id) {
    let response: any = await this.dataService.getAsync('/api/sendername/' + id)
    if (response.err_code == 0) {
      let dataSender = response.data[0];
      let templateFilter = (dataSender.FILLTER_TEMPLATE != undefined && dataSender.FILLTER_TEMPLATE != "") ? dataSender.FILLTER_TEMPLATE : "";
      if (templateFilter != "") this.isDisableTemp = false; else this.isDisableTemp = true;
      this.formEditSenderName = new FormGroup({
        id: new FormControl(id),
        iSenderName: new FormControl(dataSender.NAME),
        description: new FormControl(dataSender.DESCRIPTION),
        senderGrVTL: new FormControl((dataSender.SENDER_GROUP_VTL != undefined && dataSender.SENDER_GROUP_VTL != "") ? [{ "id": dataSender.SENDER_GROUP_VTL, "itemName": dataSender.SENDER_GROUP_VTL_NAME }] : []),
        senderGrGPC: new FormControl((dataSender.SENDER_GROUP_GPC != undefined && dataSender.SENDER_GROUP_GPC != "") ? [{ "id": dataSender.SENDER_GROUP_GPC, "itemName": dataSender.SENDER_GROUP_GPC_NAME }] : []),
        senderGrVMS: new FormControl((dataSender.SENDER_GROUP_VMS != undefined && dataSender.SENDER_GROUP_VMS != "") ? [{ "id": dataSender.SENDER_GROUP_VMS, "itemName": dataSender.SENDER_GROUP_VMS_NAME }] : []),
        senderGrVNM: new FormControl((dataSender.SENDER_GROUP_VNM != undefined && dataSender.SENDER_GROUP_VNM != "") ? [{ "id": dataSender.SENDER_GROUP_VNM, "itemName": dataSender.SENDER_GROUP_VNM_NAME }] : []),
        senderGrGTEL: new FormControl((dataSender.SENDER_GROUP_GTEL != undefined && dataSender.SENDER_GROUP_GTEL != "") ? [{ "id": dataSender.SENDER_GROUP_GTEL, "itemName": dataSender.SENDER_GROUP_GTEL_NAME }] : []),
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

    let SENDER_NAME_VTL = formData.senderNameVTL.value;
    let SENDER_NAME_GPC = formData.senderNameGPC.value;
    let SENDER_NAME_VMS = formData.senderNameVMS.value;
    let SENDER_NAME_VNM = formData.senderNameVNM.value;
    let SENDER_NAME_GTEL = formData.senderNameGTEL.value;
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

    let EXPIRED_TIME_VTL = (formData.expiredDateVIETTEL.value != undefined && formData.expiredDateVIETTEL.value != "" && formData.expiredDateVIETTEL.value != "Invalid Date") ? this.utilityService.formatDateToString(formData.expiredDateVIETTEL.value, "yyyyMMdd") : "";
    let EXPIRED_TIME_GPC = (formData.expiredDateGPC.value != undefined && formData.expiredDateGPC.value != "" && formData.expiredDateGPC.value != "Invalid Date") ? this.utilityService.formatDateToString(formData.expiredDateGPC.value, "yyyyMMdd") : "";
    let EXPIRED_TIME_VMS = (formData.expiredDateVMS.value != undefined && formData.expiredDateVMS.value != "" && formData.expiredDateVMS.value != "Invalid Date") ? this.utilityService.formatDateToString(formData.expiredDateVMS.value, "yyyyMMdd") : "";
    let EXPIRED_TIME_VNM = (formData.expiredDateVNM.value != undefined && formData.expiredDateVNM.value != "" && formData.expiredDateVNM.value != "Invalid Date") ? this.utilityService.formatDateToString(formData.expiredDateVNM.value, "yyyyMMdd") : "";
    let EXPIRED_TIME_GTEL = (formData.expiredDateGTEL.value != undefined && formData.expiredDateGTEL.value != "" && formData.expiredDateGTEL.value != "Invalid Date") ? this.utilityService.formatDateToString(formData.expiredDateGTEL.value, "yyyyMMdd") : "";

    let response: any = await this.dataService.putAsync('/api/sendername/' + ID, {
      NAME, DESCRIPTION, SENDER_GROUP_VTL, SENDER_GROUP_GPC, SENDER_GROUP_VMS, SENDER_GROUP_VNM, SENDER_GROUP_GTEL,
      FILLTER_TEMPLATE, SENDER_NAME_VTL, SENDER_NAME_GPC, SENDER_NAME_VMS, SENDER_NAME_VNM, SENDER_NAME_GTEL,
      EXPIRED_TIME, EXPIRED_TIME_VTL, EXPIRED_TIME_GPC, EXPIRED_TIME_VMS, EXPIRED_TIME_VNM, EXPIRED_TIME_GTEL
    });
    if (response.err_code == 0) {
      this.getSenderExpired();
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
}
