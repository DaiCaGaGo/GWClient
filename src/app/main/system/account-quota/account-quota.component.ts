import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from 'src/app/core/services/data.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { ModalDirective, TabHeadingDirective } from 'ngx-bootstrap';
import { NotificationService } from 'src/app/core/services/notification.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { Role } from 'src/app/core/models/role';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-account-quota',
  templateUrl: './account-quota.component.html',
  styleUrls: ['./account-quota.component.css']
})
export class AccountQuotaComponent implements OnInit {
  @ViewChild('createAccountCimastTransModel', { static: false }) public createAccountCimastTransModel: ModalDirective;
  @ViewChild('viewAccountCimastTransModel', { static: false }) public viewAccountCimastTransModel: ModalDirective;

  public dataAccountCimast;

  public settingsFilterAccount = {};
  public dataAccount = [];
  public selectedAccountID = [];

  public selectedSmsType = [];
  public dataSmsType = [];
  public settingsFilterSmsType = {};

  public selectedInputType = [];
  public dataInputType = [];
  public settingsFilterInputType = {};

  public isInputMoney: boolean = true;
  public changeAmt = 0;
  public changeSms = 0;
  public valueAmt = 0;
  public valueSms = 0;
  public moneypay = 0;

  public accountViewQuota = 0;
  public serviceNameViewQuota = "";
  public dataQuotaHistory = [];

  public description_reset: string = "";
  public role: Role = new Role();

  constructor(private authService: AuthService,
    private dataService: DataService,
    private activatedRoute: ActivatedRoute,
    private notificationService: NotificationService,
    private utilityService: UtilityService) {

    this.activatedRoute.data.subscribe(data => {
      this.utilityService.getRole(data.MENU_CODE).then((response) => {
        if (response) this.role = response;
      })
    });

    this.settingsFilterAccount = {
      text: "Chọn tài khoản",
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

    this.settingsFilterInputType = {
      text: "Chọn loại tin nhắn",
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: "Tìm kiếm",
      noDataLabel: "Không có dữ liệu"
    };
  }

  ngOnInit() {
    this.bindDataAccount();
    this.bindDataSmsType();
    this.bindDataInputType();
  }

  //#region account
  public async bindDataAccount() {
    let result = await this.dataService.getAsync('/api/account/GetInfoAccountLogin');
    let roleAccess = result.data[0].ROLE_ACCESS;
    if (roleAccess == 50) {
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
    }
    this.getListAccountCimast();
  }

  onItemSelect() {
    this.getListAccountCimast();
  }

  OnItemDeSelect() {
    this.getListAccountCimast();
  }

  //#endregion

  //#region load loai dich vu
  public async bindDataSmsType() {
    let response: any = await this.dataService.getAsync('/api/sysvar/GetSysvarByGroup?var_group=SMS_TYPE');
    for (let i in response.data) {
      this.dataSmsType.push({ "id": response.data[i].VAR_VALUE, "itemName": response.data[i].VAR_NAME });
    }
    if (this.dataSmsType.length > 0) this.selectedSmsType.push({ "id": this.dataSmsType[0].id, "itemName": this.dataSmsType[0].itemName });
  }
  //#endregion

  //#region load loai nhap dau vao
  public async bindDataInputType() {
    this.dataInputType = [];
    this.dataInputType.push({ "id": 1, "itemName": "Nhập số tiền" });
    this.dataInputType.push({ "id": 2, "itemName": "Nhập số tin" });
    if (this.dataInputType.length > 0) this.selectedInputType.push({ "id": this.dataInputType[0].id, "itemName": this.dataInputType[0].itemName });
  }

  onItemSelectInputType() {
    if (this.selectedInputType.length > 0) {
      if (this.selectedInputType[0].id == 1) this.isInputMoney = true;
      else this.isInputMoney = false;
    }
    else this.isInputMoney = false;
  }

  OnItemDeSelectInputType() {
    this.isInputMoney = false;
  }
  //#endregion

  //#region Load data
  public async getListAccountCimast() {
    if (this.selectedAccountID.length > 0) {
      let response = await this.dataService.getAsync('/api/AccountCimast/GetAccountCimastByAccountID?accountID=' + this.selectedAccountID[0].id);
      if (response.err_code == 0) {
        this.dataAccountCimast = response.data;
      }
    }
    else {
      this.dataAccountCimast = [];
    }
  }
  //#endregion

  //#region them giao dich tin
  openFormCapTin() {
    this.description_reset = "";
    this.valueAmt = 0;
    this.changeAmt = 0;
    this.valueSms = 0;
    this.changeSms = 0;
    this.moneypay = 0;
    this.createAccountCimastTransModel.show();
  }

  public async createAccountCimastTrans(trans) {
    let ACCOUNT_ID = trans.accountID.length > 0 ? trans.accountID[0].id : "";
    let SERVICENAME = trans.smsType.length > 0 ? trans.smsType[0].id : "";
    let TYPE_BYE = trans.inputType.length > 0 ? trans.inputType[0].id : "";
    let dateNow: Date = new Date();
    let TX_DATE = this.utilityService.formatDateToString(dateNow, "yyyyMMdd");

    if (ACCOUNT_ID == "") {
      this.notificationService.displayWarnMessage("Bạn phải chọn tài khoản!");
      return;
    }
    if (SERVICENAME == "") {
      this.notificationService.displayWarnMessage("Bạn phải chọn loại dịch vụ!");
      return;
    }
    if (TYPE_BYE == "") {
      this.notificationService.displayWarnMessage("Bạn phải chọn loại đầu vào (số tiền hay số tin)!");
      return;
    }

    let AMT = 0;
    let VOL = 0;
    let AMT_PAY = 0;
    if (TYPE_BYE == 1) {
      AMT = trans.amtBye_money;
      VOL = trans.volBye_money;
      AMT_PAY = trans.amt_pay;

      AMT = AMT == undefined ? 0 : AMT;
      VOL = VOL == undefined ? 0 : VOL;
      AMT_PAY = AMT_PAY == undefined ? 0 : AMT_PAY;
      if (AMT == 0 && AMT_PAY == 0) {
        this.notificationService.displayWarnMessage("Bạn phải nhập số tiền khách hàng mua hoặc đã trả!");
        return;
      }
    }
    else if (TYPE_BYE == 2) {
      VOL = trans.volBye_sms;
      AMT = trans.amtBye_sms;
      AMT_PAY = trans.amt_pay1;

      AMT = AMT == undefined ? 0 : AMT;
      VOL = VOL == undefined ? 0 : VOL;
      AMT_PAY = AMT_PAY == undefined ? 0 : AMT_PAY;
      if (VOL == 0 || VOL == undefined) {
        this.notificationService.displayWarnMessage("Bạn phải nhập số tin khách hàng mua!");
        return;
      }
    }

    let vol_new = VOL;
    let amt_new = AMT;

    let DESCRIPTION = trans.description;
    let STATUS_TRAN = 0;

    let detail = await this.dataService.postAsync('/api/AccountCimastTran', {
      ACCOUNT_ID, TX_DATE, SERVICENAME, TYPE_BYE, VOL, AMT, DESCRIPTION, STATUS_TRAN, AMT_PAY
    });
    if (detail.err_code == 0) {
      //#region udpate account_cimast
      let quotaAccount = await this.dataService.getAsync('/api/AccountCimast/GetAccountCimastByAccountService?accountID=' +
        ACCOUNT_ID + '&serviceName=' + SERVICENAME);
      if (quotaAccount.err_code == 0) {
        let quota = quotaAccount.data;
        if (quota.length > 0) {
          let VOL_old = quota[0].VOL;
          let VOL_IN_old = quota[0].IN_VOL;
          let AMT_IN_old = quota[0].IN_AMT;
          let DEBIT_AMT_old = quota[0].DEBIT_AMT;

          let vol_update = vol_new + VOL_old;
          let IN_VOL = vol_new + VOL_IN_old;
          let IN_AMT = amt_new + AMT_IN_old;
          let DEBIT_AMT = DEBIT_AMT_old + (AMT - AMT_PAY);
          VOL = vol_update;
          let response = await this.dataService.putAsync('/api/AccountCimast/' + quota[0].CI_ID, {
            ACCOUNT_ID, TX_DATE, VOL, IN_AMT, IN_VOL, SERVICENAME, DEBIT_AMT
          });
        }
        else {
          let IN_AMT = VOL;
          let OUT_AMT = 0;
          let IN_VOL = VOL;
          let OUT_VOL = 0;
          let DEBIT_AMT = AMT - AMT_PAY;
          let response = await this.dataService.postAsync('/api/AccountCimast', {
            ACCOUNT_ID, TX_DATE, VOL, IN_AMT, OUT_AMT, IN_VOL, OUT_VOL, SERVICENAME, DEBIT_AMT
          });
        }
      }
      //#endregion
      this.notificationService.displaySuccessMessage("Cấp tin thành công!");
      this.getListAccountCimast();
      this.createAccountCimastTransModel.hide();
    }
    else {
      this.notificationService.displayErrorMessage(detail.err_message);
      return;
    }
    //-----------------

  }

  closeFormCreate() {
    this.getListAccountCimast();
    this.createAccountCimastTransModel.hide();
  }
  //#endregion

  //#region change
  changeAmtNumber(atm) {
    if (atm != "" && atm > 0) {
      this.changeAmt = Math.round(atm / 550);
    }
    else this.changeAmt = 0;
  }

  changeSmsNumber(sms) {
    if (sms != "" && sms > 0) {
      this.changeSms = sms * 200;
    }
    else this.changeSms = 0;
  }
  //#endregion

  //#region view lich su cap tin
  public async showConfirmViewHis(accountID, serviceName) {
    this.serviceNameViewQuota = serviceName;
    let response = await this.dataService.getAsync('/api/AccountCimastTran/GetByAccountService?accountID=' +
      accountID + '&serviceName=' + serviceName);
    if (response.err_code == 0) {
      this.dataQuotaHistory = response.data;
      if (this.dataQuotaHistory.length > 0)
        this.accountViewQuota = response.data[0].USER_NAME;
      else this.accountViewQuota = 0;
    }
    this.viewAccountCimastTransModel.show();
  }

  closeFormHis() {
    this.viewAccountCimastTransModel.hide();
  }
  //#endregion
}
