import { Component, ViewChild, OnInit } from '@angular/core';
import { DataService } from 'src/app/core/services/data.service';
import { Menu } from '../../../core/models/menu';
import { NotificationService } from 'src/app/core/services/notification.service';
import { DxDataGridComponent } from 'devextreme-angular';
import { MainComponent } from '../../main.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})

export class MenuComponent implements OnInit {
  @ViewChild("treeGridMenu", { static: false }) treeGrid: DxDataGridComponent;

  public lookupDataMenu: any = [];
  public dataMenu: Object = [];
  public keysExpand: string[] = [];
  public columnChooserModes = [{
    key: "dragAndDrop",
    name: "Kéo thả ở đây"
  }, {
    key: "select",
    name: "Select"
  }];

  constructor(private dataService: DataService,
    private notificationService: NotificationService,
    private mainComponent: MainComponent) {
  }

  async ngOnInit() {
    await this.loadDataMenu();
    this.settingTreeGrid();
  }

  public async loadDataMenu() {
    this.dataMenu = [];
    let response: any = await this.dataService.getAsync("/api/menu");
    this.dataMenu = response.data;
    this.lookupDataMenu = [{ ID: "", MENU_NAME: "Menu chính" }];
    for (let index in this.dataMenu) {
      if (this.dataMenu[index].PARENT_ID == null) {
        this.lookupDataMenu.push(this.dataMenu[index]);
      }
    }
  }

  public onToolbarPreparing(e) {
    e.toolbarOptions.items.unshift({
      location: 'after',
      widget: 'dxButton',
      options: {
        icon: 'plus',
        text: 'Thêm menu',
        onClick: this.addNewRow.bind(this)
      }
    });

    e.toolbarOptions.items.unshift({
      location: 'after',
      widget: 'dxButton',
      options: {
        icon: 'expand',
        text: 'Mở rộng',
        onClick: () => {
          this.keysExpand = [];
          for (let i in this.dataMenu) {
            const index: number = this.keysExpand.indexOf(this.dataMenu[i].ID);
            if (index == -1) this.keysExpand.push(this.dataMenu[i].ID);
          }
        }
      }
    });

    e.toolbarOptions.items.unshift({
      location: 'after',
      widget: 'dxButton',
      options: {
        icon: 'collapse',
        text: 'Thu gọn',
        onClick: () => {
          this.keysExpand = [];
        }
      }
    });
  }

  settingTreeGrid() {
    this.treeGrid.noDataText = "Không có dữ liệu";

    this.treeGrid.editing.texts.confirmDeleteMessage = "Bạn có xác nhận xóa menu này?";
    this.treeGrid.editing.texts.saveRowChanges = "Xác nhận";
    this.treeGrid.editing.texts.cancelRowChanges = "Hủy bỏ";
    this.treeGrid.editing.texts.confirmDeleteTitle = "Thông báo";

    this.treeGrid.filterRow.operationDescriptions.contains = "Chứa trong";
    this.treeGrid.filterRow.operationDescriptions.notContains = "Không chứa trong";
    this.treeGrid.filterRow.operationDescriptions.startsWith = "Bắt đầu bằng";
    this.treeGrid.filterRow.operationDescriptions.endsWith = "Kết thúc bằng";
    this.treeGrid.filterRow.operationDescriptions.equal = "Trùng khớp giá trị tìm kiếm";
    this.treeGrid.filterRow.operationDescriptions.notEqual = "Không trùng khớp giá trị tìm kiếm";

    this.treeGrid.columnChooser.emptyPanelText = "Kéo thả các cột vào đây";
    this.treeGrid.columnChooser.title = "Thay đổi số lượng cột";
    this.treeGrid.sorting.ascendingText = "Sắp xếp từ A-Z";
    this.treeGrid.sorting.descendingText = "Sắp xếp từ Z-A";
    this.treeGrid.sorting.clearText = "Reset mặc định";
  }

  public addNewRow() {
    this.treeGrid.instance.addRow();
  }

  public cellPrepared(e) {
    if (e.column.command === "edit") {
      let addLink = e.cellElement.querySelector(".dx-link-add");

      if (addLink) {
        addLink.remove();
      }
    }
  }

  public editorPreparing(e) {
    if (e.dataField === "PARENT_ID" && e.row.data.ID === 1) {
      e.editorOptions.disabled = true;
      e.editorOptions.value = null;
    }
  }

  public initNewRow(e) {
    e.data.PARENT_ID = "Menu chính";
  }

  public rowInserting(e) {
  }

  public async rowInserted(e) {
    let itemMenu = e.data;
    let parentId = itemMenu.PARENT_ID;
    let isActive: number = (itemMenu.IS_ACTIVE == true) ? 1 : 0;

    let menu: Menu = new Menu(
      itemMenu.MENU_NAME,
      itemMenu.MENU_NAME_EN,
      itemMenu.MENU_CODE,
      itemMenu.ORD_NUMBER,
      parentId,
      itemMenu.MENU_PATH,
      itemMenu.MENU_ICON,
      isActive);

    let response: any = await this.dataService.postAsync('/api/menu', menu);
    if (response) {
      if (response.err_code == 0) {
        this.notificationService.displaySuccessMessage(response.err_message);
        if (parentId == '') {
          this.loadDataMenu();
        }
        this.mainComponent.loadMenuIndex();
      }
      else {
        this.notificationService.displayErrorMessage(response.err_message);
        this.loadDataMenu();
      }
    }
  }

  public rowRemoving(e) {

  }

  public async rowRemoved(e) {
    let response: any = await this.dataService.deleteAsync('/api/menu/' + e.data.ID);
    if (response) {
      if (response.err_code == 0) {
        this.notificationService.displaySuccessMessage(response.err_message);
        this.mainComponent.loadMenuIndex();
      }
      else {
        this.notificationService.displayErrorMessage(response.err_message);
        this.loadDataMenu();
      }
    }
  }

  public async rowUpdated(e) {
    let itemMenu = e.data;

    let menu: Menu = new Menu(
      itemMenu.MENU_NAME,
      itemMenu.MENU_NAME_EN,
      itemMenu.MENU_CODE,
      itemMenu.ORD_NUMBER,
      itemMenu.PARENT_ID,
      itemMenu.MENU_PATH,
      itemMenu.MENU_ICON,
      (itemMenu.IS_ACTIVE == true) ? 1 : 0);

    let response: any = await this.dataService.putAsync('/api/menu/' + itemMenu.ID, menu);
    if (response) {
      if (response.err_code == 0) {
        this.notificationService.displaySuccessMessage(response.err_message);
        this.mainComponent.loadMenuIndex();
      }
      else {
        this.notificationService.displayErrorMessage(response.err_message);
        this.loadDataMenu();
      }
    }
  }
}
