import { NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { AppConst } from 'src/app/core/common/app.constants';
import { AuthGuard } from 'src/app/core/guards/auth.guard';

import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { defineLocale, viLocale, PaginationModule, ModalModule, TabsModule, BsDatepickerModule, BsLocaleService } from 'ngx-bootstrap';
import { DxPieChartModule, DxChartModule } from 'devextreme-angular';

import { HomeComponent } from './home.component';
import { SenderExpiredComponent } from './sender-expired/sender-expired.component';
import { IndexComponent } from './index/index.component';

defineLocale(AppConst.LANGUAGE_VI, viLocale);

export const homeRoutes: Routes = [{
  path: '', component: HomeComponent, children: [
    { path: '', redirectTo: 'index', pathMatch: 'full' },
    { path: 'index', component: IndexComponent, canActivate: [AuthGuard] },
    { path: 'sender-expired', component: SenderExpiredComponent, data: { MENU_CODE: 'SENDER_EXPIRED' }, canActivate: [AuthGuard] }
  ]
}];

@NgModule({
  declarations: [
    HomeComponent,
    SenderExpiredComponent,
    IndexComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    AngularMultiSelectModule,
    DxPieChartModule,
    DxChartModule,
    PaginationModule.forRoot(),
    TabsModule.forRoot(),
    BsDatepickerModule.forRoot(),
    ModalModule.forRoot(),
    RouterModule.forChild(homeRoutes),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: function (http: HttpClient) {
          return new TranslateHttpLoader(http)
        },
        deps: [HttpClient]
      }
    })
  ]
})

export class HomeModule {
  constructor(private bsLocaleService: BsLocaleService, private trans: TranslateService) {
    this.bsLocaleService.use(this.trans.defaultLang);
  }
}
