import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AuthService } from 'src/app/core/services/auth.service';
import { User } from 'src/app/core/models/user';
import { Pagination } from 'src/app/core/models/pagination';
import { DataService } from 'src/app/core/services/data.service';

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.css']
})
export class AccountInfoComponent implements OnInit {
  @ViewChild("modalAccountInfo", { static: true }) public modalAccountInfo: ModalDirective;
  public user: User = this.authService.currentUserValue;
  public pagination: Pagination = new Pagination();
  public dataLog = [];

  constructor(private authService: AuthService, private dataService: DataService) { }

  ngOnInit() {
  }

  async loadDataLog() {
    let response: any = await this.dataService.getAsync("/api/account/GetLogAsync?pageIndex=" + this.pagination.pageIndex + "&pageSize=" + this.pagination.pageSize);
    if (response) {
      this.dataLog = response.data;
      if ('pagination' in response) {
        this.pagination.pageSize = response.pagination.PageSize;
        this.pagination.totalRow = response.pagination.TotalRows;
      }
    }
  }

  async pageChanged(event: any) {
    this.pagination.pageIndex = event.page;
    await this.loadDataLog();
  }

  async changePageSize(size) {
    this.pagination.pageSize = size;
    await this.loadDataLog();
    const timer: ReturnType<typeof setTimeout> = setTimeout(() => {
      this.pagination.pageIndex = 1;
    }, 1);
  }
}
