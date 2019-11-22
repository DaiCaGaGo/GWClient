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

import { ShortNumberComponent } from './short-number.component';
import { PrgShortNumberComponent } from './prg-short-number/prg-short-number.component';
import { PrgShortNumberMoComponent } from './prg-short-number-mo/prg-short-number-mo.component';

defineLocale(AppConst.LANGUAGE_VI, viLocale);

export const shortNumberRoutes: Routes = [{
  path: '', component: ShortNumberComponent, children: [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'prg-short-number', component: PrgShortNumberComponent, data: { MENU_CODE: 'PRG_SHORT_NUMBER' },canActivate: [AuthGuard] },
    { path: 'prg-short-number-mo', component: PrgShortNumberMoComponent, data: { MENU_CODE: 'PRG_SHORT_NUMBER_MO' }, canActivate: [AuthGuard] }
  ]
}];

@NgModule({
  declarations: [
    ShortNumberComponent,
    PrgShortNumberMoComponent,
    PrgShortNumberComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    AngularMultiSelectModule,
    PaginationModule.forRoot(),
    TabsModule.forRoot(),
    BsDatepickerModule.forRoot(),
    ModalModule.forRoot(),
    RouterModule.forChild(shortNumberRoutes),
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

export class ShortNumberModule {
  constructor(private bsLocaleService: BsLocaleService, private trans: TranslateService) {
    this.bsLocaleService.use(this.trans.defaultLang);
  }
}
