import { Component, OnInit, ViewChild } from '@angular/core';
import { AppConst } from 'src/app/core/common/app.constants';
import { DataService } from '../../../core/services/data.service';
import { Pagination } from '../../../core/models/pagination';
import { BsModalService, BsModalRef, ModalDirective } from 'ngx-bootstrap';
import { NotificationService } from '../../../core/services/notification.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { FormGroup, FormControl } from '@angular/forms';
import { RoleMenuComponent } from '../role-menu/role-menu.component';
import { UtilityService } from 'src/app/core/services/utility.service';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent implements OnInit {
  @ViewChild('confirmDeleteModal', { static: false }) public confirmDeleteModal: ModalDirective;
  @ViewChild('createRoleModal', { static: false }) public createRoleModal: ModalDirective;
  @ViewChild('editRoleModal', { static: false }) public editRoleModal: ModalDirective;
  @ViewChild('phanQuyenModal', { static: false }) public phanQuyenModal: ModalDirective;
  @ViewChild('roleMenuComponent', { static: false }) public roleMenu: RoleMenuComponent;

  public dataRole;
  public modalRef: BsModalRef;
  public pagination: Pagination = new Pagination();
  public roleName;
  public roleID;
  public formEditRole: FormGroup;

  constructor(
    private modalService: BsModalService,
    private dataService: DataService,
    private notificationService: NotificationService,
    private authService: AuthService,
    private utilityService: UtilityService) {
    modalService.config.backdrop = 'static';
    this.formEditRole = new FormGroup({
      id: new FormControl(),
      roleName: new FormControl(),
      roleDescription: new FormControl()
    });
  }

  ngOnInit() {
    this.pagination.pageSize = 10;
    this.getDataRole();
  }

  //#region load data and paging
  async getDataRole() {
    let response = await this.dataService.getAsync('/api/AccessRole/GetAccessRolePaging?pageIndex=' + 
    this.pagination.pageIndex + '&pageSize=' + this.pagination.pageSize)
    if (response.err_code == 0) this.loadData(response);
  }

  loadData(response?: any) {
    if (response) {
      this.dataRole = response.data;
      if ('pagination' in response) {
        this.pagination.pageSize = response.pagination.PageSize;
        this.pagination.totalRow = response.pagination.TotalRows;
      }
    }
  }

  setPageIndex(pageNo: number): void {
    this.pagination.pageIndex = pageNo;
    this.getDataRole();
  }

  pageChanged(event: any): void {
    this.setPageIndex(event.page);
  }

  changePageSize(size) {
    this.pagination.pageSize = size;
    this.pagination.pageIndex = 1;
    this.getDataRole();
  }
  //#endregion

  async createRole(role) {

    let ROLE_NAME = role.roleName;
    let ROLE_DESCRIPTION = role.roleDescription;
    let CREATE_USER = this.authService.currentUserValue.USER_NAME;
    if (ROLE_NAME == "") {
      this.notificationService.displayErrorMessage("Bạn phải nhập tên nhóm quyền!");
      return;
    }
    let dataInsert = await this.dataService.postAsync('/api/accessrole', { ROLE_NAME, ROLE_DESCRIPTION, CREATE_USER });
    if (dataInsert.err_code == 0) {
      this.getDataRole();
      this.createRoleModal.hide();
      this.roleMenu.loadListRole();
      this.notificationService.displaySuccessMessage("Tạo nhóm quyền thành công");
    }
    else {
      this.notificationService.displayErrorMessage("Tạo nhóm quyền thất bại");
    }
  }

  showConfirmDeleteRole(id, name) {
    this.roleID = id;
    this.roleName = name;
    this.confirmDeleteModal.show();
  }

  async deleteRole(role_id) {
    this.roleID = role_id;
    let dataDelete = await this.dataService.deleteAsync('/api/accessrole/' + role_id + "?pageIndex=" + this.pagination.pageIndex +
      '&pageSize=' + this.pagination.pageSize)
    if (dataDelete.err_code == 0) {
      this.loadData(dataDelete);
      this.confirmDeleteModal.hide();
      this.notificationService.displaySuccessMessage("Xóa nhóm quyền thành công");
    }
    else {
      this.notificationService.displayErrorMessage("Xóa nhóm quyền thất bại");
    }
  }

  async exportExcelRole() {
    let result: boolean = await this.dataService.getFileExtentionAsync("/api/FileExtention/ExportExcel",
      "AccessRole","AccessRole")
    if (result) {
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("120"));
    }
    else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("125"));
    }
  }

  showConfirmEditRole(roleID) {
    this.dataService.get('/api/accessRole/' + roleID)
      .subscribe((response: any) => {
        if (response.err_code == 0) {
          let dataAccount = response.data[0];
          this.formEditRole = new FormGroup({
            id: new FormControl(roleID),
            roleName: new FormControl(dataAccount.ROLE_NAME),
            roleDescription: new FormControl(dataAccount.ROLE_DESCRIPTION),
          });
          this.editRoleModal.show();
        } else {
          this.notificationService.displayErrorMessage(response.err_message);
        }
      })
  }

  editRole() {
    let formData = this.formEditRole.controls;
    let ID = formData.id.value;
    let ROLE_NAME = formData.roleName.value;
    let ROLE_DESCRIPTION = formData.roleDescription.value;
    let EDIT_USER = this.authService.currentUserValue.USER_NAME;
    if (ROLE_NAME == "") {
      this.notificationService.displayErrorMessage("Bạn phải nhập tên nhóm quyền!");
      return;
    }
    this.dataService.put('/api/accessRole/' + ID, { ROLE_NAME, ROLE_DESCRIPTION, EDIT_USER })
      .subscribe((response: any) => {
        if (response.err_code == 0) {
          this.getDataRole();
          this.editRoleModal.hide();
          this.notificationService.displaySuccessMessage("Sửa nhóm quyền thành công");
        } else {
          this.notificationService.displayErrorMessage(response.err_message);
        }
      });
  }

  showPhanQuyen(id) {
    this.roleMenu.role_id = id;
    this.roleMenu.getListMenuRole();
    this.phanQuyenModal.show();
  }
}
