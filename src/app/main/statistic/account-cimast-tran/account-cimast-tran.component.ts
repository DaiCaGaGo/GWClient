import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../../core/services/data.service';
import { Pagination } from '../../../core/models/pagination';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NotificationService } from '../../../core/services/notification.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { UtilityService } from 'src/app/core/services/utility.service';

@Component({
  selector: 'app-account-cimast-tran',
  templateUrl: './account-cimast-tran.component.html',
  styleUrls: ['./account-cimast-tran.component.css']
})

export class AccountCimastTranComponent implements OnInit {
  @ViewChild('confirmDeleteModal', { static: false }) public confirmDeleteModal: ModalDirective;
  @ViewChild('createNewModal', { static: false }) public createNewModal: ModalDirective;
  @ViewChild('editAccountModal', { static: false }) public editAccountModal: ModalDirective;
  @ViewChild('confirmDeleteMultiModal', { static: false }) public confirmDeleteMultiModal: ModalDirective;

  public dataAccountCimastTran;
  public formEditAccountCimastTran: FormGroup;
  public pagination: Pagination = new Pagination();
  public itemList1 = [];
  public itemList2 = [];
  public idDelete: string[] = [];
  public selectedItems1 = [];
  public selectedItems2 = [];
  public settingsSingle = {};
  public dataCombobox = [];
  public selectedItemCombobox = [];
  public settingsFilter = {};
  public arrIdCheckedDelete: string[] = [];
  public isCheckedDelete: boolean = false;
  public accountid: number = 0;
  public amt: number;
  public vol: number;
  public accountCimasTranId;
  public tx_Num;
  public arrIdDelete: string[] = [];
  public curren_date_fillter;
  public tx_num_fillter;
  public amt_fillter: number;;
  public status_tran_fillter: number;
  public servicename_fillter;
  public vol_fillter: number;
  public description_fillter;
  public selectedServicename = [];
  public dataServicename = [];
  public settingsFilterService = {};
  public settingsAddService = {};
  public settingsEditService = {};
  constructor(
    private dataService: DataService,
    private utilityService: UtilityService,
    private notificationService: NotificationService) {
    this.settingsSingle = {
      singleSelection: true
    };
    this.settingsFilterService = {
      text: "Chọn loại dịch vụ",
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: "Tìm kiếm loại dịch vụ",
      noDataLabel: "Không có dữ liệu"
    };
    this.settingsAddService = {
      text: "Chọn loại dịch vụ",
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: "Chọn loại dịch vụ",
      noDataLabel: "Không có dữ liệu"
    };
    this.settingsEditService = {
      text: "Chọn loại dịch vụ",
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: "Chọn loại dịch vụ",
      noDataLabel: "Không có dữ liệu"
    };
    this.settingsFilter = {
      text: "Chọn tài khoản",
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: "Tìm kiếm",
      noDataLabel: "Không có dữ liệu"
    };
    this.formEditAccountCimastTran = new FormGroup({
      tranid: new FormControl(),
      comboboxAccountedit: new FormControl(),
      tx_date: new FormControl(),
      tx_num: new FormControl(),
      vol: new FormControl(),
      amt: new FormControl(),
      status_tran: new FormControl(),
      servicename: new FormControl(),
      description: new FormControl(),
      dlvr: new FormControl(),
      dlvrURL: new FormControl(),
      emailReport: new FormControl()
    });
    this.bindDataToCombobox();
  }

  public async bindDataToCombobox() {
    let response: any = await this.dataService.getAsync('/api/account');
    for (let index in response.data) {
      this.dataCombobox.push({ "id": response.data[index].ACCOUNT_ID, "itemName": response.data[index].USER_NAME });
    }
  }

  ngOnInit() {
    this.getDataAccountCimastTran();
    this.bindDataService();
  }

  onItemSelect(item: any) {
    console.log(item);
    console.log(this.selectedItems1);
  }

  OnItemDeSelect(item: any) {
    console.log(item);
    console.log(this.selectedItems2);
  }

  onSelectAll(items: any) {
    console.log(items);
  }

  onDeSelectAll(items: any) {
    console.log(items);
  }

  setPageIndex(pageNo: number): void {
    this.pagination.pageIndex = pageNo;
    this.getDataAccountCimastTran();
  }

  pageChanged(event: any): void {
    this.isCheckedDelete = false;
    this.arrIdCheckedDelete = [];
    this.setPageIndex(event.page);
  }

  changePageSize(size) {
    this.pagination.pageSize = size;
    this.pagination.pageIndex = 1;
    this.getDataAccountCimastTran();
  }

  public async bindDataService() {
    let response: any = await this.dataService.getAsync('/api/sysvar/GetSysvarByGroup?var_group=SMS_TYPE');
    for (let i in response.data) {
      this.dataServicename.push({ "id": response.data[i].VAR_VALUE, "itemName": response.data[i].VAR_NAME });
    }
    // if (this.dataServicename.length > 0)
    //   this.selectedServicename.push({ "id": this.dataServicename[0].id, "itemName": this.dataServicename[0].itemName });
  }


  getDataAccountCimastTran() {
    this.dataService.get('/api/accountcimasttran/GetListPaging?pageIndex=' + this.pagination.pageIndex + '&pageSize=' + this.pagination.pageSize)
      .subscribe((response: any) => {
        this.loadData(response);
      }, error => {
        console.log(error)
      });
  }

  loadData(response?: any) {
    if (response) {
      this.dataAccountCimastTran = response.data;
      if ('pagination' in response) {
        this.pagination.pageSize = response.pagination.PageSize;
        this.pagination.totalRow = response.pagination.TotalRows;
      }
    }
  }

  createaccountCimastTran(accountcimasttran) {
    if (accountcimasttran.comboboxAccount.length == 0) {
      this.notificationService.displayErrorMessage("Bạn phải chọn tài khoản");
      return;
    }
    if (accountcimasttran.SERVICENAME.length == 0) {
      this.notificationService.displayErrorMessage("Bạn phải chọn loại dịch vụ");
      return;
    }
    debugger
    let ACCOUNT_ID = accountcimasttran.comboboxAccount[0].id;
    let _DATE = accountcimasttran.TX_DATE;
    let TX_DATE = "";
    if (_DATE != null && _DATE != "")
      TX_DATE = this.utilityService.formatDateToString(_DATE, "yyyyMMdd");
    let TX_NUM = accountcimasttran.TX_NUM;
    let AMT = accountcimasttran.AMT;
    let STATUS_TRAN = accountcimasttran.STATUS_TRAN;
    let SERVICENAME = accountcimasttran.SERVICENAME[0].id;
    let VOL = accountcimasttran.VOL;
    let DESCRIPTION = accountcimasttran.DESCRIPTION;
    if (TX_NUM == "") {
      this.notificationService.displayWarnMessage("Bạn phải nhập mã giao dịch");
      return;
    }
    if (STATUS_TRAN == "") {
      this.notificationService.displayWarnMessage("Bạn phải chọn trạng thái");
      return;
    }
    if (SERVICENAME == "") {
      this.notificationService.displayWarnMessage("Bạn phải chọn loại dịch vụ");
      return;
    }
    debugger
    this.dataService.post('/api/accountcimasttran', { ACCOUNT_ID, TX_DATE, TX_NUM, AMT, STATUS_TRAN, SERVICENAME, VOL, DESCRIPTION })
      .subscribe((response: any) => {
        if (response.err_code == 0) {
          this.getDataAccountCimastTran();
          this.createNewModal.hide();
          this.notificationService.displaySuccessMessage("Thêm mới thành công");
        }
        else {
          this.notificationService.displayErrorMessage("Thêm mới thất bại");
        }
      }, error => {
        console.log(error);
        this.notificationService.displayErrorMessage("Thêm mới thất bại");
      });
  }

  showConfirmEditAccount(tranid) {
    this.dataService.get('/api/accountcimasttran/' + tranid)
      .subscribe((response: any) => {
        if (response.err_code == 0) {
          let dataAccountCimast = response.data[0];
          this.formEditAccountCimastTran = new FormGroup({
            tranid: new FormControl(tranid),
            comboboxAccountedit: new FormControl([{ "id": dataAccountCimast.ACCOUNT_ID, "itemName": dataAccountCimast.USER_NAME }]),
            tx_date: new FormControl(dataAccountCimast.TX_DATE),
            tx_num: new FormControl(dataAccountCimast.TX_NUM),
            amt: new FormControl(dataAccountCimast.AMT),
            vol: new FormControl(dataAccountCimast.VOL),
            status_tran: new FormControl(dataAccountCimast.STATUS_TRAN),
            servicename: new FormControl([{ "id": dataAccountCimast.SERVICENAME, "itemName": dataAccountCimast.SERVICENAME }]),
            description: new FormControl(dataAccountCimast.DESCRIPTION)
          });
          debugger
          this.editAccountModal.show();
        } else {
          this.notificationService.displayErrorMessage(response.err_message);
        }
      })
  }

  editAccountCimastTran() {
    let formData = this.formEditAccountCimastTran.controls;
    let TRAN_ID = formData.tranid.value;
    let ACCOUNT_ID = formData.comboboxAccountedit.value[0].id;
    let _DATE = formData.tx_date.value;
    let TX_DATE = "";
    if (_DATE != null && _DATE != "")
      TX_DATE = this.utilityService.formatDateToString(_DATE, "yyyyMMdd");
    let TX_NUM = formData.tx_num.value;
    let AMT = formData.amt.value;
    let VOL = formData.vol.value;
    let STATUS_TRAN = formData.status_tran.value;
    //let SERVICENAME = formData.servicename.value;
    let SERVICENAME = formData.servicename.value[0].id;
    let DESCRIPTION = formData.description.value;
    debugger
    this.dataService.put('/api/accountcimasttran/' + TRAN_ID, { ACCOUNT_ID, TX_DATE, TX_NUM, AMT, VOL, STATUS_TRAN, SERVICENAME, DESCRIPTION })
      .subscribe((response: any) => {
        if (response.err_code == 0) {
          debugger
          this.getDataAccountCimastTran();
          this.editAccountModal.hide();
          this.notificationService.displaySuccessMessage(response.err_message);
        } else {
          this.notificationService.displayErrorMessage(response.err_message);
        }
      }, error => {
        console.log(error);
        this.notificationService.displayErrorMessage("Sửa thất bại")
      });
  }

  showConfirmDeleteAccountCimastTran(tranid, tx_num) {
    this.accountCimasTranId = tranid;
    this.tx_Num = tx_num;
    this.confirmDeleteModal.show();
  }

  deleteAccountCimastTran(tranid) {
    this.accountCimasTranId = tranid;
    this.dataService.delete('/api/accountcimasttran/' + tranid + "?pageIndex=" + this.pagination.pageIndex + '&pageSize=' + this.pagination.pageSize)
      .subscribe((response: any) => {
        if (response.err_code == 0) {
          this.confirmDeleteModal.hide();
          this.arrIdDelete.push(tranid);
          this.notificationService.displaySuccessMessage("Xóa thành công");
          this.getDataAccountCimastTran();
        }
        else {
          this.notificationService.displayErrorMessage("Xóa hất bại");
        }
      }, error => {
        console.log(error);
        this.notificationService.displayErrorMessage("Xóa thất bại");
      });
  }

  SearchAccountCimastTran(fillter) {
    debugger
    this.accountid = fillter.comboboxAccountSearch[0].id;
    this.curren_date_fillter = (fillter.curren_date_fillter == undefined) ? '' : fillter.curren_date_fillter;
    this.tx_num_fillter = (fillter.tx_num_fillter == undefined) ? '' : fillter.tx_num_fillter;
    this.amt_fillter = (fillter.amt_fillter == "") ? 0 : fillter.amt_fillter;
    this.status_tran_fillter = (fillter.status_tran_fillter == "") ? 0 : fillter.status_tran_fillter;
    this.servicename_fillter = fillter.servicename_fillter[0].id;
    this.vol_fillter = (fillter.vol_fillter == "") ? 0 : fillter.vol_fillter;
    this.description_fillter = (fillter.description_fillter == undefined) ? '' : fillter.description_fillter;
    debugger
    this.getDataAccountCimastTranFillter();
  }

  async getDataAccountCimastTranFillter() {
    debugger
    let response: any = await this.dataService.getAsync('/api/accountcimasttran/GetAccountCimastTranFillterAndPaging?pageIndex=' + this.pagination.pageIndex
      + '&pageSize=' + this.pagination.pageSize + '&accountid=' + this.accountid + '&curren_date=' + this.curren_date_fillter +
      '&tx_num=' + this.tx_num_fillter + '&amt=' + this.amt_fillter + '&status_tran=' + this.status_tran_fillter
      + '&servicename=' + this.servicename_fillter + '&vol=' + this.vol_fillter + '&description=' + this.description_fillter);
    debugger
    this.loadData(response);
    this.arrIdDelete = [];
  }

  confirmDeleteMultiAccount() {
  }


  public async exportExcelaccountCimastTran() {
    let result: boolean = await this.dataService.getFileExtentionAsync("/api/FileExtention/ExportExcel", "AccountCimastTran");
    if (result) {
      this.notificationService.displaySuccessMessage("Export thành công");
    }
    else {
      this.notificationService.displayErrorMessage("Export file lỗi");
    }
  }






}
