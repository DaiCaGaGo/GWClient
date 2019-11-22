import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective, BsModalService } from 'ngx-bootstrap';
import { Pagination } from 'src/app/core/models/pagination';
import { FormGroup, FormControl } from '@angular/forms';
import { DataService } from 'src/app/core/services/data.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { AppConst } from 'src/app/core/common/app.constants';
import { UtilityService } from 'src/app/core/services/utility.service';

@Component({
  selector: 'app-telco',
  templateUrl: './telco.component.html',
  styleUrls: ['./telco.component.css']
})
export class TelcoComponent implements OnInit {

  @ViewChild('showModalCreate', { static: false }) public showModalCreate: ModalDirective;
  @ViewChild('showModalUpdate', { static: false }) public showModalUpdate: ModalDirective;
  @ViewChild('confirmDeleteMultiModal', { static: false }) public confirmDeleteMultiModal: ModalDirective;

  public dataTelco;
  public pagination: Pagination = new Pagination();
  public telCode;
  public inTelCode: string = '';
  public inTelName: string = '';
  public isCheckedDelete: boolean = false;
  public arrIdCheckedDelete: string[] = [];
  public arrIdDelete: string[] = [];
  public arrTelCode: string[] = [];
  public formEditTelco: FormGroup;

  constructor(
    private dataService: DataService,
    private modalService: BsModalService,
    private notificationService: NotificationService,
    private utilityService: UtilityService,
    private authService: AuthService) {
    modalService.config.backdrop = 'static';

    this.formEditTelco = new FormGroup({
      id: new FormControl(),
      telCode: new FormControl(),
      telName: new FormControl(),
      phoneHeader: new FormControl()
    });
  }

  ngOnInit() {
    this.getData();
  }

  async getData() {
    let response: any = await this.dataService.getAsync('/api/telco/GetTelcoPaging?pageIndex=' + this.pagination.pageIndex + '&pageSize=' +
      this.pagination.pageSize + "&telCode=" + this.inTelCode + "&telName=" + this.inTelName)
    this.loadData(response); 
    this.arrIdDelete = [];
  }

  loadData(response?: any) {
    if (response) {
      this.dataTelco = response.data;
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

  // create telco
  async createTelco(item) {
    let senderGr = item.value;
    let TEL_CODE = senderGr.telCode;
    if (TEL_CODE === '' || TEL_CODE === null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-17"));
      return;
    }
    let TEL_NAME = senderGr.telName;
    if (TEL_NAME === '' || TEL_NAME === null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-18"));
      return;
    }
    let PHONE_HEADER = senderGr.phoneHeader;
    if (PHONE_HEADER === '' || PHONE_HEADER === null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-51"));
      return;
    }
    let response: any = await this.dataService.postAsync('/api/telco', { TEL_CODE, TEL_NAME, PHONE_HEADER })
    if (response.err_code == 0) {
      this.getData();
      item.reset();
      this.showModalCreate.hide();
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("100"));
    }
    else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("-19"));
    }
  }

  // show update modal
  async confirmUpdateModal(id) {
    let response: any = await this.dataService.getAsync('/api/telco/' + id)
    if (response.err_code == 0) {
      let dataSenderGr = response.data[0];
      this.formEditTelco = new FormGroup({
        id: new FormControl(id),
        telCode: new FormControl(dataSenderGr.TEL_CODE),
        telName: new FormControl(dataSenderGr.TEL_NAME),
        phoneHeader: new FormControl(dataSenderGr.PHONE_HEADER)
      });
      this.showModalUpdate.show();
    } else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
    }
  }

  // update telco
  async editTelco() {
    let formData = this.formEditTelco.controls;
    let ID = formData.id.value;
    let TEL_CODE = formData.telCode.value;
    if (TEL_CODE === '' || TEL_CODE === null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-17"));
      return;
    }
    let TEL_NAME = formData.telName.value;
    if (TEL_NAME === '' || TEL_NAME === null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-18"));
      return;
    }
    let PHONE_HEADER = formData.phoneHeader.value;
    if (PHONE_HEADER === '' || PHONE_HEADER === null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-51"));
      return;
    }
    let response: any = await this.dataService.putAsync('/api/telco/' + ID, { TEL_CODE, TEL_NAME, PHONE_HEADER })
    if (response.err_code == 0) {
      this.getData();
      this.showModalUpdate.hide();
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("300"));
    } else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("103"));
    }
  }

  // delete
  async confirmDelete(id) {
    let response: any = await this.dataService.deleteAsync('/api/telco/' + id + "?pageIndex=" + this.pagination.pageIndex + '&pageSize=' + this.pagination.pageSize)
    if (response.err_code == 0) {
      this.loadData(response);
      this.confirmDeleteMultiModal.hide();
      this.arrIdDelete.push(id);
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("200"));
    }
    else if(response.err_code == 103){
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("103"));
    }
    else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
    }
  }

  checkAllDelete(isChecked) {
    this.isCheckedDelete = isChecked;
    if (this.isCheckedDelete) {
      for (let index in this.dataTelco) {
        let id = this.dataTelco[index].ID;
        let telCode = this.dataTelco[index].TEL_CODE;
        const indexId: number = this.arrIdCheckedDelete.indexOf(id);
        if (indexId === -1) {
          this.arrIdCheckedDelete.push(id);
          this.arrTelCode.push(telCode);
        }
      }
    } else {
      this.arrIdCheckedDelete = [];
      this.arrTelCode = [];
    }
  }

  checkRowDelete(isChecked, id, telCode) {
    const index: number = this.arrIdCheckedDelete.indexOf(id);
    if (index !== -1) {
      if (!isChecked) {
        this.arrIdCheckedDelete.splice(index, 1);
        this.arrTelCode.splice(index, 1);
      }
    }
    else if (isChecked) {
      this.arrIdCheckedDelete.push(id);
      this.arrTelCode.push(telCode);
    }

    if (this.arrIdCheckedDelete.length == 0) {
      this.isCheckedDelete = false;
    }
  }

  confirmDeleteMulti() {
    if (this.arrTelCode.length > 0) {
      this.telCode = this.arrTelCode.join(",");
      this.confirmDeleteMultiModal.show();
    }
  }

  deleteMulti() {
    for (let index in this.arrIdCheckedDelete) {
      this.confirmDelete(this.arrIdCheckedDelete[index]);
    }
    this.arrIdCheckedDelete = [];
      this.arrTelCode = [];
    this.confirmDeleteMultiModal.hide();
  }
}
