import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective, BsModalService } from 'ngx-bootstrap';
import { Pagination } from 'src/app/core/models/pagination';
import { FormGroup, FormControl } from '@angular/forms';
import { DataService } from 'src/app/core/services/data.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { UtilityService } from 'src/app/core/services/utility.service';

@Component({
  selector: 'app-sysvar',
  templateUrl: './sysvar.component.html',
  styleUrls: ['./sysvar.component.css']
})
export class SysvarComponent implements OnInit {

  @ViewChild('showModalCreate', { static: false }) public showModalCreate: ModalDirective;
  @ViewChild('showModalUpdate', { static: false }) public showModalUpdate: ModalDirective;
  @ViewChild('showModalDelete', { static: false }) public showModalDelete: ModalDirective;

  public dataSysVar;
  public pagination: Pagination = new Pagination();
  public varName;
  public id;
  public inVarGroup: string = '';
  public inVarName: string = '';
  public inVarValue: string = '';
  public arrSysVar: string[] = [];
  public formEditSysVar: FormGroup;

  constructor(
    private dataService: DataService,
    private modalService: BsModalService,
    private notificationService: NotificationService,
    private utilityService: UtilityService) {
    this.modalService.config.backdrop = 'static';

    this.formEditSysVar = new FormGroup({
      id: new FormControl(),
      varGroup: new FormControl(),
      varName: new FormControl(),
      varValue: new FormControl(),
      description: new FormControl(),
      orderNum: new FormControl()
    });
  }

  ngOnInit() {
    this.pagination.pageSize = 10;
    this.getData();
  }

  //#region load data and paging
  async getData() {
    let response: any = await this.dataService.getAsync('/api/sysvar/GetSysVarPaging?pageIndex=' + this.pagination.pageIndex + '&pageSize=' +
      this.pagination.pageSize + "&varGroup=" + this.inVarGroup + "&varName=" + this.inVarName + "&varValue=" + this.inVarValue)
    this.loadData(response);
  }

  loadData(response?: any) {
    if (response) {
      this.dataSysVar = response.data;
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

  // create sys var
  async createSysVar(item) {
    let sysvar = item.value;
    let VAR_GROUP = sysvar.varGroup;
    if (VAR_GROUP === '' || VAR_GROUP === null) {
      this.notificationService.displayWarnMessage("Nhóm khai báo không được để trống!");
      return;
    }
    let VAR_NAME = sysvar.varName;
    if (VAR_NAME === '' || VAR_NAME === null) {
      this.notificationService.displayWarnMessage("Tên khai báo không được để trống!");
      return;
    }
    let VAR_VALUE = sysvar.varValue;
    if (VAR_VALUE === '' || VAR_VALUE === null) {
      this.notificationService.displayWarnMessage("Giá trị khai báo không được để trống!");
      return;
    }
    let DESCRIPTION = sysvar.description;
    let ORDER_NUM = sysvar.orderNum;
    let response: any = await this.dataService.postAsync('/api/sysvar', { VAR_GROUP, VAR_NAME, VAR_VALUE, DESCRIPTION, ORDER_NUM })
    if (response.err_code == 0) {
      this.getData();
      item.reset();
      this.showModalCreate.hide();
      this.notificationService.displaySuccessMessage(response.err_message);
    }
    else {
      this.notificationService.displayErrorMessage(response.err_message);
    }
  }

  // show update modal
  async confirmUpdateModal(id) {
    let response: any = await this.dataService.getAsync('/api/sysvar/' + id)
    if (response.err_code == 0) {
      let dataSys = response.data[0];
      this.formEditSysVar = new FormGroup({
        id: new FormControl(id),
        varGroup: new FormControl(dataSys.VAR_GROUP),
        varName: new FormControl(dataSys.VAR_NAME),
        varValue: new FormControl(dataSys.VAR_VALUE),
        description: new FormControl(dataSys.DESCRIPTION),
        orderNum: new FormControl(dataSys.ORDER_NUM)
      });
      this.showModalUpdate.show();
    } else {
      this.notificationService.displayErrorMessage(response.err_message);
    }
  }

  // update sys var
  async editSysVar() {
    let formData = this.formEditSysVar.controls;
    let ID = formData.id.value;
    let VAR_GROUP = formData.varGroup.value;
    if (VAR_GROUP === '' || VAR_GROUP === null) {
      this.notificationService.displayWarnMessage("Nhóm khai báo không được để trống!");
      return;
    }
    let VAR_NAME = formData.varName.value;
    if (VAR_NAME === '' || VAR_NAME === null) {
      this.notificationService.displayWarnMessage("Tên khai báo không được để trống!");
      return;
    }
    let VAR_VALUE = formData.varValue.value;
    if (VAR_VALUE === '' || VAR_VALUE === null) {
      this.notificationService.displayWarnMessage("Giá trị khai báo không được để trống!");
      return;
    }
    let DESCRIPTION = formData.description.value;
    let ORDER_NUM = formData.orderNum.value;
    let response: any = await this.dataService.putAsync('/api/sysvar/' + ID, { VAR_GROUP, VAR_NAME, VAR_VALUE, DESCRIPTION, ORDER_NUM })
    if (response.err_code == 0) {
      this.getData();
      this.showModalUpdate.hide();
      this.notificationService.displaySuccessMessage(response.err_message);
    } else {
      this.notificationService.displayErrorMessage(response.err_message);
    }
  }

  // show modal delete
  showConfirmDelete(id, varName) {
    this.id = id;
    this.varName = varName;
    this.showModalDelete.show();
  }

  // delete
  async confirmDelete(id) {
    let response: any = await this.dataService.deleteAsync('/api/sysvar/' + id + "?pageIndex=" + this.pagination.pageIndex + '&pageSize=' + this.pagination.pageSize)
    if (response.err_code == 0) {
      // this.loadData(response);
      this.getData();
      this.showModalDelete.hide();
      this.notificationService.displaySuccessMessage(response.err_message);
    }
    else {
      this.notificationService.displayErrorMessage(response.err_message);
    }
  }

  async exportExcel() {
    let listParameter = "var_group=" + this.inVarGroup + ",var_name=" + this.inVarName + ",var_value=" + this.inVarValue;
    let result: boolean = await this.dataService.getFileExtentionParameterAsync("/api/FileExtention/ExportExcelParameter",
      "SystemConfig", listParameter, "SysVar")
    if (result) {
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("120"));
    }
    else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("125"));
    }
  }
}
