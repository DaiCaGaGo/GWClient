import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';

import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { defineLocale, viLocale, PaginationModule, ModalModule, TabsModule, BsDatepickerModule, BsLocaleService } from 'ngx-bootstrap';

import { AuthGuard } from './../core/guards/auth.guard';
import { AppConst } from '../core/common/app.constants';

import { MainComponent } from './main.component';
import { AccountInfoComponent } from './home/account-info/account-info.component';
import { ChangePassComponent } from './home/change-pass/change-pass.component';

defineLocale(AppConst.LANGUAGE_VI, viLocale);

export const mainRoutes: Routes = [{
  path: '', component: MainComponent, children: [
    { path: '', redirectTo: 'home/index', pathMatch: 'full' },
    { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomeModule), canActivate: [AuthGuard] },
    { path: 'system', loadChildren: () => import('./system/system.module').then(m => m.SystemModule), canActivate: [AuthGuard] },
    { path: 'manager', loadChildren: () => import('./manager/manager.module').then(m => m.ManagerModule), canActivate: [AuthGuard] },
    { path: 'sms', loadChildren: () => import('./sms/sms.module').then(m => m.SmsModule), canActivate: [AuthGuard] },
    { path: 'statistic', loadChildren: () => import('./statistic/statistic.module').then(m => m.StatisticModule), canActivate: [AuthGuard] },
    { path: 'short-number', loadChildren: () => import('./short-number/short-number.module').then(m => m.ShortNumberModule), canActivate: [AuthGuard] },
    { path: 'data-sponsor', loadChildren: () => import('./data-sponsor/data-sponsor.module').then(m => m.DataSponsorModule), canActivate: [AuthGuard] }
    ]
  }
];

@NgModule({
  declarations: [
    MainComponent,
    AccountInfoComponent,
    ChangePassComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(mainRoutes),
    PaginationModule.forRoot(),
    TabsModule.forRoot(),
    BsDatepickerModule.forRoot(),
    ModalModule.forRoot(),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: function (http: HttpClient) {
          return new TranslateHttpLoader(http)
        },
        deps: [HttpClient]
      }
    })
  ],
  providers: []
})

export class MainModule {
  constructor(private bsLocaleService: BsLocaleService, private trans: TranslateService) {
    this.bsLocaleService.use(this.trans.defaultLang);
  }
}
