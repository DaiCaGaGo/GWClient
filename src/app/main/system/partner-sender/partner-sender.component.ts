import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective, BsModalService } from 'ngx-bootstrap';
import { Pagination } from 'src/app/core/models/pagination';
import { DataService } from 'src/app/core/services/data.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { Role } from 'src/app/core/models/role';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-partner-sender',
  templateUrl: './partner-sender.component.html',
  styleUrls: ['./partner-sender.component.css']
})
export class PartnerSenderComponent implements OnInit {

  public dataPartnerSender = [];

  public dataPartner = [];
  public settingsFilterPartner = {};
  public selectedPartner = [];

  public dataSender = [];
  public selectedSenderName = [];
  public settingsFilterSenderName = {};

  public pagination: Pagination = new Pagination();

  public role: Role = new Role();

  constructor(
    private dataService: DataService,
    private modalService: BsModalService,
    private activatedRoute: ActivatedRoute,
    private utilityService: UtilityService) {
    modalService.config.backdrop = 'static';

    this.activatedRoute.data.subscribe(data => {
      this.utilityService.getRole(data.MENU_CODE).then((response) => {
        if (response) this.role = response;
      })
    });

    this.settingsFilterPartner = {
      text: "Chọn đối tác",
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      disabled: false,
      searchPlaceholderText: "Tìm kiếm",
      noDataLabel: "Không có dữ liệu"
    };

    this.settingsFilterSenderName = {
      text: "Chọn thương hiệu",
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      disabled: false,
      searchPlaceholderText: "Tìm kiếm",
      noDataLabel: "Không có dữ liệu"
    };
  }

  ngOnInit() {
    this.getDataPartner();
    this.getDataSender();
    this.getData();
  }
  //#region load data sender
  async getDataSender() {
    this.selectedSenderName = [];
    this.dataSender = [];
    let response: any = await this.dataService.getAsync('/api/sendername')
    this.dataSender = [];
    if (response)
      for (let index in response.data) {
        this.dataSender.push({ "id": response.data[index].ID, "itemName": response.data[index].NAME });
      }
  }

  OnItemSelectSender() {
    this.getData();
  }

  OnItemDeSelectSendner() {
    this.getData();
  }
  //#endregion

  //#region load partner
  async getDataPartner() {
    this.selectedPartner = [];
    this.dataPartner = [];
    let response: any = await this.dataService.getAsync('/api/partner')
    if (response)
      for (let index in response.data) {
        this.dataPartner.push({ "id": response.data[index].ID, "itemName": response.data[index].PARTNER_NAME });
      }
  }

  OnItemSelectPartner() {
    this.getData();
  }

  OnItemDeSelectPartner() {
    this.getData();
  }
  //#endregion

  //#region load data table
  async getData() {
    let response: any = await this.dataService.getAsync('/api/partnersender/GetSenderTelcoByPartnerAndSender?pageIndex=' + this.pagination.pageIndex +
      '&pageSize=' + this.pagination.pageSize +
      "&partner_id=" + (this.selectedPartner.length > 0 ? this.selectedPartner[0].id : "") +
      "&sender_id=" + (this.selectedSenderName.length > 0 ? this.selectedSenderName[0].id : ""))
    this.loadData(response);
  }

  loadData(response?: any) {
    if (response) {
      this.dataPartnerSender = response.data;
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

  public convertStringDate(text: string): string {
    let value = "";
    let nam = "", thang = "", ngay = "";
    if (text != "" && text != null && text != undefined) {
      nam = text.substring(0, 4);
      thang = text.substring(4, 6);
      ngay = text.substring(6, 8);
      value = ngay + "/" + thang + "/" + nam;
    }
    return value;
  }
}
