import { Component, ViewChild, OnInit } from '@angular/core';
import { DataService } from '../../../core/services/data.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AuthService } from 'src/app/core/services/auth.service';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
  selector: 'app-account-menu',
  templateUrl: './account-menu.component.html',
  styleUrls: ['./account-menu.component.css']
})

export class AccountMenuComponent implements OnInit {
  @ViewChild('confirmEditPermissionModal', { static: false }) public confirmEditPermissionModal: ModalDirective;

  public listAccount;
  public dataAccountMenu;
  public account_id;

  constructor(private dataService: DataService,
    private authService: AuthService,
    private notificationService: NotificationService) { }

  public async ngOnInit() {
    this.loadListAccount();
  }

  async loadListAccount() {
    let getData = await this.dataService.getAsync('/api/account')
    if (getData.err_code == 0) {
      this.listAccount = getData.data;
      if (this.listAccount != null) {
        this.account_id = this.listAccount[0].ACCOUNT_ID;
        this.getListAccountMenu();
      }
    }
  }

  //#region load data
  async getListAccountMenu() {
    // let response = await this.dataService.getAsync('/api/accountmenu/GetPermissionAccountMenu?account_id=' + this.account_id)
    let response = await this.dataService.getAsync('/api/accountmenu/GetPermissionAccount?account_id=' + this.account_id);
    if (response.err_code == 0) this.loadDataMenuRole(response);
  }

  loadDataMenuRole(response?: any) {
    if (response) {
      this.dataAccountMenu = response.data;
    }
  }
  //#endregion

  //#region change checked column
  checkAllView(isChecked) {
    for (let index in this.dataAccountMenu) {
      if (isChecked) {
        if (this.dataAccountMenu[index].ACCOUNT_MENU_ID == null)
          this.dataAccountMenu[index].IS_VIEW_ROLE = 1;
        else
          this.dataAccountMenu[index].IS_VIEW = 1;
      }
      else {
        if (this.dataAccountMenu[index].ACCOUNT_MENU_ID == null)
          this.dataAccountMenu[index].IS_VIEW_ROLE = 0;
        else
          this.dataAccountMenu[index].IS_VIEW = 0;
      }
    }
  }
  checkAllAdd(isChecked) {
    for (let index in this.dataAccountMenu) {
      if (isChecked) {
        if (this.dataAccountMenu[index].ACCOUNT_MENU_ID == null)
          this.dataAccountMenu[index].IS_ADD_ROLE = 1;
        else
          this.dataAccountMenu[index].IS_ADD = 1;
      }
      else {
        if (this.dataAccountMenu[index].ACCOUNT_MENU_ID == null)
          this.dataAccountMenu[index].IS_ADD_ROLE = 0;
        else this.dataAccountMenu[index].IS_ADD = 0;
      }
    }
  }
  checkAllEdit(isChecked) {
    for (let index in this.dataAccountMenu) {
      if (isChecked) {
        if (this.dataAccountMenu[index].ACCOUNT_MENU_ID == null)
          this.dataAccountMenu[index].IS_EDIT_ROLE = 1;
        else
          this.dataAccountMenu[index].IS_EDIT = 1;
      }
      else {
        if (this.dataAccountMenu[index].ACCOUNT_MENU_ID == null)
          this.dataAccountMenu[index].IS_EDIT_ROLE = 0;
        else this.dataAccountMenu[index].IS_EDIT = 0;
      }
    }
  }
  checkAllDel(isChecked) {
    for (let index in this.dataAccountMenu) {
      if (isChecked) {
        if (this.dataAccountMenu[index].ACCOUNT_MENU_ID == null)
          this.dataAccountMenu[index].IS_DEL_ROLE = 1;
        else
          this.dataAccountMenu[index].IS_DEL = 1;
      }
      else {
        if (this.dataAccountMenu[index].ACCOUNT_MENU_ID == null)
          this.dataAccountMenu[index].IS_DEL_ROLE = 0;
        else this.dataAccountMenu[index].IS_DEL = 0;
      }
    }
  }

  checkRowView(isChecked, index) {
    if (isChecked) {
      if (this.dataAccountMenu[index].ACCOUNT_MENU_ID == null)
      this.dataAccountMenu[index].IS_VIEW_ROLE = 1;
      else this.dataAccountMenu[index].IS_VIEW = 1;
    }
    else {
      if (this.dataAccountMenu[index].ACCOUNT_MENU_ID == null)
      this.dataAccountMenu[index].IS_VIEW_ROLE = 0;
      else this.dataAccountMenu[index].IS_VIEW = 0;
    }
  }
  checkRowAdd(isChecked, index) {
    if (isChecked) {
      if (this.dataAccountMenu[index].ACCOUNT_MENU_ID == null)
      this.dataAccountMenu[index].IS_ADD_ROLE = 1;
      else this.dataAccountMenu[index].IS_ADD = 1;
    }
    else {
      if (this.dataAccountMenu[index].ACCOUNT_MENU_ID == null)
      this.dataAccountMenu[index].IS_ADD_ROLE = 0;
      else this.dataAccountMenu[index].IS_ADD = 0;
    }
  }
  checkRowEdit(isChecked, index) {
    if (isChecked) {
      if (this.dataAccountMenu[index].ACCOUNT_MENU_ID == null)
      this.dataAccountMenu[index].IS_EDIT_ROLE = 1;
      else
      this.dataAccountMenu[index].IS_EDIT = 1;
    }
    else {
      if (this.dataAccountMenu[index].ACCOUNT_MENU_ID == null)
      this.dataAccountMenu[index].IS_EDIT_ROLE = 0;
      else this.dataAccountMenu[index].IS_EDIT = 0;
    }
  }
  checkRowDel(isChecked, index) {
    if (isChecked) {
      if (this.dataAccountMenu[index].ACCOUNT_MENU_ID == null)
      this.dataAccountMenu[index].IS_DEL_ROLE = 1;
      else this.dataAccountMenu[index].IS_DEL = 1;
    }
    else {
      if (this.dataAccountMenu[index].ACCOUNT_MENU_ID == null)
      this.dataAccountMenu[index].IS_DEL_ROLE = 0;
      else this.dataAccountMenu[index].IS_DEL = 0;
    }
  }
  //#endregion

  confirmEditPermission() {
    this.confirmEditPermissionModal.show();
  }

  onChangeAccount(accountID) {
    this.account_id = accountID;
    this.getListAccountMenu();
  }

  public async editPermission() {
    let success = 0;
    let error = 0;
    let ACCOUNT_ID = this.account_id;

    let response = await this.dataService.getAsync('/api/accountmenu/GetPermissionAccount?account_id=' + this.account_id);
    let dataOld = response.data;
    for (let index in this.dataAccountMenu) {
      let MENU_ID = this.dataAccountMenu[index].MENU_ID;
      let ID = this.dataAccountMenu[index].ACCOUNT_MENU_ID;
      let IS_VIEW = this.dataAccountMenu[index].ACCOUNT_MENU_ID == null ? this.dataAccountMenu[index].IS_VIEW_ROLE : this.dataAccountMenu[index].IS_VIEW;
      let IS_ADD = this.dataAccountMenu[index].ACCOUNT_MENU_ID == null ? this.dataAccountMenu[index].IS_ADD_ROLE : this.dataAccountMenu[index].IS_ADD;
      let IS_EDIT = this.dataAccountMenu[index].ACCOUNT_MENU_ID == null ? this.dataAccountMenu[index].IS_EDIT_ROLE : this.dataAccountMenu[index].IS_EDIT;
      let IS_DEL = this.dataAccountMenu[index].ACCOUNT_MENU_ID == null ? this.dataAccountMenu[index].IS_DEL_ROLE : this.dataAccountMenu[index].IS_DEL;

      let CREATE_USER = this.authService.currentUserValue.USER_NAME;
      let EDIT_USER = this.authService.currentUserValue.USER_NAME;

      //#region check change

      let view_old = dataOld[index].ACCOUNT_MENU_ID == null ? dataOld[index].IS_VIEW_ROLE : dataOld[index].IS_VIEW;
      let add_old = dataOld[index].ACCOUNT_MENU_ID == null ? dataOld[index].IS_ADD_ROLE : dataOld[index].IS_ADD;
      let edit_old = dataOld[index].ACCOUNT_MENU_ID == null ? dataOld[index].IS_EDIT_ROLE : dataOld[index].IS_EDIT;
      let del_old = dataOld[index].ACCOUNT_MENU_ID == null ? dataOld[index].IS_DEL_ROLE : dataOld[index].IS_DEL;
      //#endregion

      if (view_old != IS_VIEW || add_old != IS_ADD || edit_old != IS_EDIT || del_old != IS_DEL) {
        if (ID == null || ID == 0 || ID == undefined) {
          let dataInsert = await this.dataService.postAsync('/api/accountmenu', {
            ACCOUNT_ID, MENU_ID, IS_VIEW, IS_ADD, IS_EDIT, IS_DEL, CREATE_USER
          });
          if (dataInsert.err_code == 0) {
            success++;
          }
          else {
            error++;
          }
        }
        else {
          //update
          let dataUpdate = await this.dataService.putAsync('/api/accountmenu/' + ID, { ACCOUNT_ID, MENU_ID, IS_VIEW, IS_ADD, IS_EDIT, IS_DEL, EDIT_USER });
          if (dataUpdate.err_code == 0) {
            success++;
          } else {
            error++;
          }
        }
      }

    }

    if (success > 0) {
      this.notificationService.displaySuccessMessage("Cập nhật thành công " + success + " bản ghi");
    }
    if (error > 0) this.notificationService.displaySuccessMessage("Có " + error + " bản ghi không được cập nhật");
    if (success == 0 && error == 0) this.notificationService.displayWarnMessage("Không có bản ghi nào được cập nhật");
    this.confirmEditPermissionModal.hide();
    this.getListAccountMenu();
  }
}
