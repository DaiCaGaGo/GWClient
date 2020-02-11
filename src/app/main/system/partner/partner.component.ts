import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective, BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Pagination } from 'src/app/core/models/pagination';
import { HttpClient } from '@angular/common/http';
import { DataService } from 'src/app/core/services/data.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { AppConst } from 'src/app/core/common/app.constants';
import { Partner } from 'src/app/core/models/partner';
import { AuthService } from 'src/app/core/services/auth.service';
import { FormGroup, FormControl } from '@angular/forms';
import { PartnerProductComponent } from '../partner-product/partner-product.component';
import { PartnererrcodeComponent } from '../partnererrcode/partnererrcode.component';
import { UtilityService } from 'src/app/core/services/utility.service';
import { Role } from 'src/app/core/models/role';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-partner',
  templateUrl: './partner.component.html',
  styleUrls: ['./partner.component.css']
})

export class PartnerComponent implements OnInit {
  @ViewChild('createPartnerModal', { static: false }) public createPartnerModal: ModalDirective;
  @ViewChild('confirmUpdatePartnerModal', { static: false }) public confirmUpdatePartnerModal: ModalDirective;
  @ViewChild('confirmDeleteMultiModal', { static: false }) public confirmDeleteMultiModal: ModalDirective;
  @ViewChild('modalViewDetail', { static: false }) public modalViewDetail: ModalDirective;
  @ViewChild('componentPartnerProduct', { static: false }) public componentPartnerProduct: PartnerProductComponent;
  @ViewChild('componentPartnerErrCode', { static: false }) public componentPartnerErrCode: PartnererrcodeComponent;

  public dataPartner;
  public dataPartnerErrCode;
  public dataPartnerProduct;
  public dataPartnerSender;
  public modalRef: BsModalRef;
  public pagination: Pagination = new Pagination();
  public partnerName;
  public partnerId;
  public errCodeId;
  public err_Code;
  public productId;
  public productName;
  public requestHTTP: string = '';
  public requestSMPP: string = '';
  public partnerModel: Partner;
  public partnerEdit: Partner;
  public txtPrName: string = '';
  public txtErrCode: string = '';
  public txtErrMessage: string = '';
  public fromDate: string = '';
  public toDate: string = '';
  public isCheckedDelete: boolean = false;
  public arrIdCheckedDelete: string[] = [];
  public arrPartnerName: string[] = [];
  public arrIdDelete: string[] = [];
  public formEditPartner: FormGroup;
  public role: Role = new Role();

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

    // partner
    this.formEditPartner = new FormGroup({
      id: new FormControl(),
      partnerCode: new FormControl(),
      partnerName: new FormControl(),
      userAPI: new FormControl(),
      userSMPP: new FormControl(),
      userAPIQC: new FormControl(),
      passwordAPI: new FormControl(),
      passwordSMPP: new FormControl(),
      passwordAPIQC: new FormControl(),
      requestHTTP: new FormControl(),
      UrlHttpCskh1: new FormControl(),
      smppIp_1: new FormControl(),
      APIQC_1: new FormControl(),
      requestSMPP: new FormControl(),
      UrlHttpCskh2: new FormControl(),
      smppPort_1: new FormControl(),
      APIQC_2: new FormControl(),
      endcodeCSKH: new FormControl(),
      UrlHttpCskh3: new FormControl(),
      smppIp_2: new FormControl(),
      APIQC_3: new FormControl(),
      endcodeQC: new FormControl(),
      emailReceive: new FormControl(),
      smppPort_2: new FormControl(),
      description: new FormControl(),
    });
  }

  ngOnInit() {
    this.getDataPartner();
  }

  async getDataPartner() {
    let response: any = await this.dataService.getAsync('/api/partner/GetPartnerPaging?pageIndex=' + this.pagination.pageIndex + '&pageSize=' +
      this.pagination.pageSize + "&partner_name=" + this.txtPrName)
    this.loadData(response);
    this.arrIdDelete = [];
  }

  loadData(response?: any) {
    if (response) {
      this.dataPartner = response.data;
      if ('pagination' in response) {
        this.pagination.pageSize = response.pagination.PageSize;
        this.pagination.totalRow = response.pagination.TotalRows;
      }
    }
  }

  setPageIndex(pageNo: number): void {
    this.pagination.pageIndex = pageNo;
    this.getDataPartner();
  }

  pageChanged(event: any): void {
    this.isCheckedDelete = false;
    this.arrIdCheckedDelete = [];
    this.setPageIndex(event.page);
  }

  changePageSize(size) {
    this.pagination.pageSize = size;
    this.pagination.pageIndex = 1;
    this.getDataPartner();
  }

  // onchanged HTTP
  valueChangedHTTP(event: any) {
    let total = 100;
    this.requestHTTP = "0";
    this.requestHTTP = event.target.value;
    if (Number(this.requestHTTP) > 100) {
      this.requestHTTP = "100";
    }
    this.requestSMPP = (total - Number(this.requestHTTP)).toString();
  }

  // onchanged SMPP
  valueChangedSMPP(event: any) {
    let total = 100;
    this.requestSMPP = "0";
    this.requestSMPP = event.target.value;
    if (Number(this.requestSMPP) > 100) {
      this.requestSMPP = "100";
    }
    this.requestHTTP = (total - Number(this.requestSMPP)).toString();
  }

  // create partner
  async createPartner(form) {
    let user = this.authService.currentUserValue;
    let partner = form.value;
    if (partner.partnerName === '' || partner.partnerName === null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-32"));
      return;
    }
    if (partner.partnerCode === '' || partner.partnerCode === null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-72"));
      return;
    }
    this.partnerModel = new Partner(
      partner.partnerCode,
      partner.partnerName,
      partner.description,
      partner.requestHTTP,
      partner.requestSMPP,
      partner.UrlHttpCskh1,
      partner.UrlHttpCskh2,
      partner.UrlHttpCskh3,
      partner.userAPI,
      partner.passwordAPI,
      partner.endcodeCSKH == true ? "1" : "0",
      partner.smppIp_1,
      partner.smppPort_1,
      partner.smppIp_2,
      partner.smppPort_2,
      partner.userSMPP,
      partner.passwordSMPP,
      partner.APIQC_1,
      partner.APIQC_2,
      partner.APIQC_3,
      partner.userAPIQC,
      partner.passwordAPIQC,
      partner.endcodeQC == true ? "1" : "0",
      partner.emailReceive,
      user.USER_NAME);
    let response: any = await this.dataService.postAsync('/api/partner', this.partnerModel)
    if (response.err_code == 0) {
      this.getDataPartner();
      form.reset();
      this.createPartnerModal.hide();
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("100"));
    }
    else if (response.err_code == -19) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-19"));
    }
    else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
    }
  }

  // update partner
  async showConfirmEditPartner(id) {

    let response: any = await this.dataService.getAsync('/api/partner/' + id)
    if (response.err_code == 0) {
      let dataPartner = response.data[0];
      this.formEditPartner = new FormGroup({
        id: new FormControl(id),
        partnerCode: new FormControl(dataPartner.PARTNER_CODE),
        partnerName: new FormControl(dataPartner.PARTNER_NAME),
        userAPI: new FormControl(dataPartner.HTTP_USER_CSKH),
        userSMPP: new FormControl(dataPartner.SMPP_USER),
        userAPIQC: new FormControl(dataPartner.HTTP_USER_QC),
        passwordAPI: new FormControl(dataPartner.HTTP_PASS_CSKH),
        passwordSMPP: new FormControl(dataPartner.SMPP_PASS),
        passwordAPIQC: new FormControl(dataPartner.HTTP_PASS_QC),
        requestHTTP: new FormControl(dataPartner.REQUEST_BY_HTTP),
        UrlHttpCskh1: new FormControl(dataPartner.URL_HTTP_1_CSKH),
        smppIp_1: new FormControl(dataPartner.SMPP_IP_1),
        APIQC_1: new FormControl(dataPartner.URL_HTTP_1_QC),
        requestSMPP: new FormControl(dataPartner.REQUEST_BY_SMPP),
        UrlHttpCskh2: new FormControl(dataPartner.URL_HTTP_2_CSKH),
        smppPort_1: new FormControl(dataPartner.SMPP_PORT_1),
        APIQC_2: new FormControl(dataPartner.URL_HTTP_2_QC),
        endcodeCSKH: new FormControl(dataPartner.HTTP_ENCODE_CSKH),
        UrlHttpCskh3: new FormControl(dataPartner.URL_HTTP_3_CSKH),
        smppIp_2: new FormControl(dataPartner.SMPP_IP_2),
        APIQC_3: new FormControl(dataPartner.URL_HTTP_3_QC),
        endcodeQC: new FormControl(dataPartner.HTTP_ENCODE_QC),
        emailReceive: new FormControl(dataPartner.RECEIVE_EMAIL_QC),
        smppPort_2: new FormControl(dataPartner.SMPP_PORT_2),
        description: new FormControl(dataPartner.DESCRIPTION)
      });
      this.confirmUpdatePartnerModal.show();
    } else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
    }
  }

  async editPartnerForm() {
    let formData = this.formEditPartner.controls;
    let ID = formData.id.value;
    let PARTNER_NAME = formData.partnerName.value;
    if (PARTNER_NAME === '' || PARTNER_NAME === null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-32"));
      return;
    }
    let PARTNER_CODE = formData.partnerCode.value;
    if (PARTNER_CODE === '' || PARTNER_CODE === null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-72"));
      return;
    }
    let HTTP_USER_CSKH = formData.userAPI.value;
    let SMPP_USER = formData.userSMPP.value;
    let HTTP_USER_QC = formData.userAPIQC.value;
    let HTTP_PASS_CSKH = formData.passwordAPI.value;
    let SMPP_PASS = formData.passwordSMPP.value;
    let HTTP_PASS_QC = formData.passwordAPIQC.value;
    let REQUEST_BY_HTTP = formData.requestHTTP.value;
    let URL_HTTP_1_CSKH = formData.UrlHttpCskh1.value;
    let SMPP_IP_1 = formData.smppIp_1.value;
    let URL_HTTP_1_QC = formData.APIQC_1.value;
    let REQUEST_BY_SMPP = formData.requestSMPP.value;
    let URL_HTTP_2_CSKH = formData.UrlHttpCskh2.value;
    let SMPP_PORT_1 = formData.smppPort_1.value;
    let URL_HTTP_2_QC = formData.APIQC_2.value;
    let HTTP_ENCODE_CSKH = formData.endcodeCSKH.value == true ? "1" : "0";
    let URL_HTTP_3_CSKH = formData.UrlHttpCskh3.value;
    let SMPP_IP_2 = formData.smppIp_2.value;
    let URL_HTTP_3_QC = formData.APIQC_3.value;
    let HTTP_ENCODE_QC = formData.endcodeQC.value == true ? "1" : "0";
    let RECEIVE_EMAIL_QC = formData.emailReceive.value;
    let SMPP_PORT_2 = formData.smppPort_2.value;
    let DESCRIPTION = formData.description.value;

    let response: any = await this.dataService.putAsync('/api/partner/' + ID, {
      PARTNER_CODE, PARTNER_NAME, HTTP_USER_CSKH, SMPP_USER, HTTP_USER_QC
      , HTTP_PASS_CSKH, SMPP_PASS, HTTP_PASS_QC, REQUEST_BY_HTTP, URL_HTTP_1_CSKH, SMPP_IP_1, URL_HTTP_1_QC
      , REQUEST_BY_SMPP, URL_HTTP_2_CSKH, SMPP_PORT_1, URL_HTTP_2_QC, HTTP_ENCODE_CSKH, URL_HTTP_3_CSKH, SMPP_IP_2
      , URL_HTTP_3_QC, HTTP_ENCODE_QC, RECEIVE_EMAIL_QC, SMPP_PORT_2, DESCRIPTION
    })
    if (response.err_code == 0) {
      this.getDataPartner();
      this.confirmUpdatePartnerModal.hide();
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("300"));
    }
    else if (response.err_code == 103) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("103"));
    }
    else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
    }
  }

  checkAllDelete(isChecked) {
    this.isCheckedDelete = isChecked;
    if (this.isCheckedDelete) {
      for (let index in this.dataPartner) {
        let id = this.dataPartner[index].ID;
        let partName = this.dataPartner[index].ID;
        const indexId: number = this.arrIdCheckedDelete.indexOf(id);
        if (indexId === -1) {
          this.arrIdCheckedDelete.push(id);
          this.arrPartnerName.push(partName);
        }
      }
    } else {
      this.arrIdCheckedDelete = [];
      this.arrPartnerName = [];
    }
  }

  checkRowDelete(isChecked, id, partnerName) {
    const index: number = this.arrIdCheckedDelete.indexOf(id);
    if (index !== -1) {
      if (!isChecked) {
        this.arrIdCheckedDelete.splice(index, 1);
        this.arrPartnerName.splice(index, 1);
      }
    }
    else if (isChecked) {
      this.arrIdCheckedDelete.push(id);
      this.arrPartnerName.push(partnerName);
    }

    if (this.arrIdCheckedDelete.length == 0) {
      this.isCheckedDelete = false;
    }
  }

  confirmDeleteMulti() {
    if (this.arrPartnerName.length > 0) {
      this.partnerName = this.arrPartnerName.join(", ");
      this.confirmDeleteMultiModal.show();
    }
  }

  deleteMulti() {
    for (let index in this.arrIdCheckedDelete) {
      this.deletePartner(this.arrIdCheckedDelete[index]);
    }
    this.arrIdCheckedDelete = [];
    this.arrPartnerName = [];
    this.confirmDeleteMultiModal.hide();
  }

  async deletePartner(id) {
    let response: any = await this.dataService.deleteAsync('/api/partner/' + id + "?pageIndex=" + this.pagination.pageIndex + '&pageSize=' + this.pagination.pageSize)
    if (response.err_code == 0) {
      this.loadData(response);
      this.confirmDeleteMultiModal.hide();
      this.arrIdDelete.push(id);
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("200"));
    }
    else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
    }
  }

  async exportExcel() {
    let listParameter = "partner_name=" + + this.txtPrName
    let result: boolean = await this.dataService.getFileExtentionParameterAsync("/api/FileExtention/ExportExcelParameter",
      "Partner", listParameter, "PartnerList")
    if (result) {
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("120"));
    }
    else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("125"));
    }
  }

  showModalViewDetail(partnerId, partnerName) {
    this.componentPartnerProduct.settingsFilterPartner = { disabled: true };
    this.componentPartnerProduct.selectedItemComboboxPartner = [{ "id": partnerId, "itemName": partnerName }];
    this.componentPartnerProduct.selectedItemComboboxPartnerModal = [{ "id": partnerId, "itemName": partnerName }];
    this.componentPartnerProduct.fromPartner = true;
    this.componentPartnerProduct.getData();

    this.componentPartnerErrCode.settingsFilterPartner = { disabled: true };
    this.componentPartnerErrCode.selectedItemComboboxPartner = [{ "id": partnerId, "itemName": partnerName }];
    this.componentPartnerErrCode.selectedItemComboboxPartnerModal = [{ "id": partnerId, "itemName": partnerName }];
    this.componentPartnerErrCode.fromPartner = true;
    this.componentPartnerErrCode.getData();

    this.modalViewDetail.show();
  }
}
