import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective, BsModalService } from 'ngx-bootstrap';
import { Pagination } from 'src/app/core/models/pagination';
import { FormGroup, FormControl } from '@angular/forms';
import { DataService } from 'src/app/core/services/data.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { Role } from 'src/app/core/models/role';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sender-group',
  templateUrl: './sender-group.component.html',
  styleUrls: ['./sender-group.component.css']
})
export class SenderGroupComponent implements OnInit {

  @ViewChild('showModalCreate', { static: false }) public showModalCreate: ModalDirective;
  @ViewChild('showModalUpdate', { static: false }) public showModalUpdate: ModalDirective;
  @ViewChild('confirmDeleteMultiModal', { static: false }) public confirmDeleteMultiModal: ModalDirective;

  public dataSenderGroup;
  public pagination: Pagination = new Pagination();
  public code;
  public groupCode: string = '';
  public groupName: string = '';
  public isCheckedDelete: boolean = false;
  public arrIdCheckedDelete: string[] = [];
  public arrIdDelete: string[] = [];
  public arrCode: string[] = [];
  public formEditSenderGroup: FormGroup;
  public role: Role = new Role();

  constructor(
    private dataService: DataService,
    modalService: BsModalService,
    private activatedRoute: ActivatedRoute,
    private notificationService: NotificationService,
    private utilityService: UtilityService) {
    modalService.config.backdrop = 'static';

    this.activatedRoute.data.subscribe(data => {
      this.utilityService.getRole(data.MENU_CODE).then((response) => {
        if (response) this.role = response;
      })
    });

    this.formEditSenderGroup = new FormGroup({
      id: new FormControl(),
      inGroupCode: new FormControl(),
      inGroupName: new FormControl(),
    });
  }

  ngOnInit() {
    this.getData();
  }

  async getData() {
    let response: any = await this.dataService.getAsync('/api/sendergroup/GetSenderGroupPaging?pageIndex=' + this.pagination.pageIndex + '&pageSize=' +
      this.pagination.pageSize + "&code=" + this.groupCode + "&name=" + this.groupName)
    this.loadData(response);
    this.arrIdDelete = [];
  }

  loadData(response?: any) {
    if (response) {
      this.dataSenderGroup = response.data;
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

  // create sender group
  async createSenderGroup(item) {
    let senderGr = item.value;
    let CODE = senderGr.inGroupCode;
    if (CODE === '' || CODE === null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-50"));
      return;
    }
    let NAME = senderGr.inGroupName;
    if (NAME === '' || NAME === null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-49"));
      return;
    }
    let response: any = await this.dataService.postAsync('/api/sendergroup', { CODE, NAME })
    if (response.err_code == 0) {
      this.getData();
      item.reset();
      this.showModalCreate.hide();
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("100"));
    }
    else if (response.err_code == -19) {
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("-19"));
    }
    else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
    }
  }

  // show update modal
  async confirmUpdateModal(id) {
    let response: any = await this.dataService.getAsync('/api/sendergroup/' + id)
    if (response.err_code == 0) {
      let dataSenderGr = response.data[0];
      this.formEditSenderGroup = new FormGroup({
        id: new FormControl(id),
        inGroupCode: new FormControl(dataSenderGr.CODE),
        inGroupName: new FormControl(dataSenderGr.NAME)
      });
      this.showModalUpdate.show();
    } else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
    }
  }

  // update sender group
  async editSenderGroup() {
    let formData = this.formEditSenderGroup.controls;
    let ID = formData.id.value;
    let CODE = formData.inGroupCode.value;
    if (CODE === '' || CODE === null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-50"));
      return;
    }
    let NAME = formData.inGroupName.value;
    if (NAME === '' || NAME === null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-49"));
      return;
    }
    let response: any = await this.dataService.putAsync('/api/sendergroup/' + ID, { CODE, NAME })
    if (response.err_code == 0) {
      this.getData();
      this.showModalUpdate.hide();
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("300"));
    }
    else if (response.err_code == 103) {
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("103"));
    } 
    else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
    }
  }

  // delete
  async confirmDelete(id) {
    let response: any = await this.dataService.deleteAsync('/api/sendergroup/' + id + "?pageIndex=" + this.pagination.pageIndex + '&pageSize=' + this.pagination.pageSize)
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
    let listParameter = "code=" + this.groupCode + ",name=" + this.groupName
    let result: boolean = await this.dataService.getFileExtentionParameterAsync("/api/FileExtention/ExportExcelParameter",
      "SenderGroup", listParameter, "SenderGroup")
    if (result) {
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("120"));
    }
    else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("125"));
    }
  }

  checkAllDelete(isChecked) {
    this.isCheckedDelete = isChecked;
    if (this.isCheckedDelete) {
      for (let index in this.dataSenderGroup) {
        let id = this.dataSenderGroup[index].ID;
        let code = this.dataSenderGroup[index].CODE;
        const indexId: number = this.arrIdCheckedDelete.indexOf(id);
        if (indexId === -1) {
          this.arrIdCheckedDelete.push(id);
          this.arrCode.push(code);
        }
      }
    } else {
      this.arrIdCheckedDelete = [];
      this.arrCode = [];
    }
  }

  checkRowDelete(isChecked, id, code) {
    const index: number = this.arrIdCheckedDelete.indexOf(id);
    if (index !== -1) {
      if (!isChecked) {
        this.arrIdCheckedDelete.splice(index, 1);
        this.arrCode.splice(index, 1);
      }
    }
    else if (isChecked) {
      this.arrIdCheckedDelete.push(id);
      this.arrCode.push(code);
    }

    if (this.arrIdCheckedDelete.length == 0) {
      this.isCheckedDelete = false;
    }
  }

  confirmDeleteMulti() {
    if (this.arrCode.length > 0) {
      this.code = this.arrCode.join(",");
      this.confirmDeleteMultiModal.show();
    }
    else{
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-85"))
    }
  }

  deleteMulti() {
    for (let index in this.arrIdCheckedDelete) {
      this.confirmDelete(this.arrIdCheckedDelete[index]);
    }
    this.arrCode = [];
    this.arrIdCheckedDelete = [];
    this.confirmDeleteMultiModal.hide();
  }
}
