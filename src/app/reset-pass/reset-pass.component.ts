import { Component, OnInit } from '@angular/core';
import { UtilityService } from '../core/services/utility.service';
import { DataService } from '../core/services/data.service';
import { NotificationService } from '../core/services/notification.service';

@Component({
  selector: 'app-reset-pass',
  templateUrl: './reset-pass.component.html',
  styleUrls: ['./reset-pass.component.css']
})
export class ResetPassComponent implements OnInit {
  public loading: boolean = false;

  constructor(private utilityService: UtilityService,
    private dataService: DataService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit() {
  }

  public changeLanguage(lang) {
    this.utilityService.changeLanguageCurrent(lang);
  }

  public async resetPass(form) {
    this.loading = true;

    if (form.value.email == '' || !this.utilityService.IsEmailValidated(form.value.email)) {
      this.notificationService.displayWarnMessage("Email không hợp lệ");
      this.loading = false;
      return;
    }

    let response: any = await this.dataService.postAsync('/api/auth/ResetPass?email=' + form.value.email);
    if (response) {
      if (response.err_code == 0) {
        this.notificationService.displayConfirmDialog("Reset password thành công, hệ thống sẽ gửi lại password mới qua email " + form.value.email + " cho quý khách.", () => {
          this.loading = false;
          form.reset();
        });
      }
      else {
        this.notificationService.displayErrorMessage(response.err_message);
      }
    }
    this.loading = false;
  }
}
