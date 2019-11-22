import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../../core/services/data.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AuthService } from 'src/app/core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { HttpClient } from '@angular/common/http'

@Component({
  selector: 'app-role-menu',
  templateUrl: './role-menu.component.html',
  styleUrls: ['./role-menu.component.css']
})
export class RoleMenuComponent implements OnInit {
  @ViewChild('confirmEditPermissionModal', { static: false }) public confirmEditPermissionModal: ModalDirective;

  public dataMenuRole;
  public listRole;
  public role_id;

  public dataMenuRoleEdit: Object = [];

  constructor(private dataService: DataService,
    private notificationService: NotificationService,
    private authService: AuthService,
    private http: HttpClient) { }

  ngOnInit() {
    this.loadListRole();
  }

  async loadListRole() {
    let response = await this.dataService.getAsync('/api/accessrole/');
    if (response.err_code == 0) {
      this.listRole = response.data;
      if (this.listRole != null) {
        this.role_id = this.listRole[0].ID;
        this.getListMenuRole();
      }
    }
  }

  async getListMenuRole() {
    let response = await this.dataService.getAsync('/api/menurole/GetPermissionMenuRole?role_id=' + this.role_id);
    if (response.err_code == 0) this.loadDataMenuRole(response);
  }

  loadDataMenuRole(response?: any) {
    if (response) {
      this.dataMenuRole = response.data;
      this.dataMenuRoleEdit = response.data;
    }
  }

  //#region check header checkbox
  checkAllViewRole(isChecked) {
    for (let index in this.dataMenuRole) {
      if (isChecked) {
        this.dataMenuRoleEdit[index].IS_VIEW = 1;
      }
      else this.dataMenuRoleEdit[index].IS_VIEW = 0;
    }
  }
  checkAllAddRole(isChecked) {
    for (let index in this.dataMenuRole) {
      if (isChecked) {
        this.dataMenuRoleEdit[index].IS_ADD = 1;
      }
      else this.dataMenuRoleEdit[index].IS_ADD = 0;
    }
  }
  checkAllEditRole(isChecked) {
    for (let index in this.dataMenuRole) {
      if (isChecked) {
        this.dataMenuRoleEdit[index].IS_EDIT = 1;
      }
      else this.dataMenuRoleEdit[index].IS_EDIT = 0;
    }
  }
  checkAllDelRole(isChecked) {
    for (let index in this.dataMenuRole) {
      if (isChecked) {
        this.dataMenuRoleEdit[index].IS_DEL = 1;
      }
      else this.dataMenuRoleEdit[index].IS_DEL = 0;
    }
  }
  //#endregion

  //#region change permission
  checkRowViewRole(isChecked, index) {
    if (isChecked) {
      this.dataMenuRoleEdit[index].IS_VIEW = 1;
    }
    else {
      this.dataMenuRoleEdit[index].IS_VIEW = 0;
    }
  }
  checkRowAddRole(isChecked, index) {
    if (isChecked) {
      this.dataMenuRoleEdit[index].IS_ADD = 1;
    }
    else {
      this.dataMenuRoleEdit[index].IS_ADD = 0;
    }
  }
  checkRowEditRole(isChecked, index) {
    if (isChecked) {
      this.dataMenuRoleEdit[index].IS_EDIT = 1;
    }
    else {
      this.dataMenuRoleEdit[index].IS_EDIT = 0;
    }
  }
  checkRowDelRole(isChecked, index) {
    if (isChecked) {
      this.dataMenuRoleEdit[index].IS_DEL = 1;
    }
    else {
      this.dataMenuRoleEdit[index].IS_DEL = 0;
    }
  }
  //#endregion

  confirmEditPermission() {
    this.confirmEditPermissionModal.show();
  }

  public async editPermissionMenuRole() {
    let success = 0;
    let error = 0;
    for (let index in this.dataMenuRoleEdit) {
      let ROLE_ID = this.role_id;
      let MENU_ID = this.dataMenuRoleEdit[index].MENU_ID;
      let ID = this.dataMenuRoleEdit[index].ID;
      let IS_VIEW = this.dataMenuRoleEdit[index].IS_VIEW;
      let IS_ADD = this.dataMenuRoleEdit[index].IS_ADD;
      let IS_EDIT = this.dataMenuRoleEdit[index].IS_EDIT;
      let IS_DEL = this.dataMenuRoleEdit[index].IS_DEL;
      let CREATE_USER = this.authService.currentUserValue.USER_NAME;
      let EDIT_USER = this.authService.currentUserValue.USER_NAME;
      if (ID == null || ID == 0) {
        //insert
        if ((IS_ADD != 0 && IS_ADD != null) || (IS_EDIT != 0 && IS_EDIT != null) ||
          (IS_DEL != 0 && IS_DEL != null) || (IS_VIEW != 0 && IS_VIEW != null)) {
          let dataInsert = await this.dataService.postAsync('/api/menurole', { ROLE_ID, MENU_ID, IS_VIEW, IS_ADD, IS_EDIT, IS_DEL, CREATE_USER });
          if (dataInsert.err_code == 0) {
            success++;
          }
          else {
            error++;
          }
        }
      }
      else {
        //update
        let dataUpdate = await this.dataService.putAsync('/api/menurole/' + ID, { ROLE_ID, MENU_ID, IS_VIEW, IS_ADD, IS_EDIT, IS_DEL, EDIT_USER });
        if (dataUpdate.err_code == 0) {
          success++;
        } else {
          error++;
        }
      }
    }

    if (success > 0) this.notificationService.displaySuccessMessage("Cập nhật thành công!");
    if (error > 0) this.notificationService.displaySuccessMessage("Có " + error + " bản ghi không được cập nhật");
    this.confirmEditPermissionModal.hide();
    this.getListMenuRole();
  }

  onChangeRole(roleID) {
    console.log(roleID);
    this.role_id = roleID;
    this.getListMenuRole();
  }
}
