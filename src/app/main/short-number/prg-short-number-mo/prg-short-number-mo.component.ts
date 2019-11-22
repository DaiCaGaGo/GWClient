import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../../core/services/data.service';
import { Pagination } from '../../../core/models/pagination';
import { BsModalService, BsModalRef, ModalDirective } from 'ngx-bootstrap/modal';
import { NotificationService } from '../../../core/services/notification.service';
import { UtilityService } from '../../../core/services/utility.service';
import { ActivatedRoute } from '@angular/router';
import { Role } from 'src/app/core/models/role';

@Component({
  selector: 'app-prg-short-number-mo',
  templateUrl: './prg-short-number-mo.component.html',
  styleUrls: ['./prg-short-number-mo.component.css']
})

export class PrgShortNumberMoComponent implements OnInit {
  @ViewChild('createNewModal', { static: false }) public createNewModal: ModalDirective;
  public dataPrgShortNumberMO;
  public dataPrgShortNumberMT;
  public pagination: Pagination = new Pagination();
  public arrIdCheckedDelete: string[] = [];
  public isCheckedDelete: boolean = false;
  public role: Role = new Role();

  constructor(
    private utilityService: UtilityService,
    private activatedRoute: ActivatedRoute,
    private dataService: DataService) {
    this.activatedRoute.data.subscribe(data => {
      this.utilityService.getRole(data.MENU_CODE).then((response) => {
        if (response) this.role = response;
      })
    });
  }

  ngOnInit() {
    this.getDataPrgShortNumber();
  }

  pageChanged(event: any): void {
    this.isCheckedDelete = false;
    this.arrIdCheckedDelete = [];
    this.setPageIndex(event.page);
  }

  changePageSize(size) {
    this.pagination.pageSize = size;
    this.pagination.pageIndex = 1;
    this.getDataPrgShortNumber();
  }

  setPageIndex(pageNo: number): void {
    this.pagination.pageIndex = pageNo;
    this.getDataPrgShortNumber();
  }

  getDataPrgShortNumber() {
    this.dataService.get('/api/prgshortnumbermo')
      .subscribe((response: any) => {
        this.loadData(response);
      }, error => {
        console.log(error)
      });
  }

  loadData(response?: any) {
    if (response) {
      this.dataPrgShortNumberMO = response.data;
      if ('pagination' in response) {
        this.pagination.pageSize = response.pagination.PageSize;
        this.pagination.totalRow = response.pagination.TotalRows;
      }
    }
  }

  async showConfirmPRGMT(prgmtMO_ID) {
    let respone = await this.dataService.getAsync('/api/prgshortnumbermt/GetPrgShortNumberMtByMoId?moid=' + prgmtMO_ID);
    this.dataPrgShortNumberMT = respone.data;
    this.createNewModal.show();
  }

  exportExcelPrgShortNumber() {

  }

  exportPRG_MO(PRG_MO) {

  }
}
