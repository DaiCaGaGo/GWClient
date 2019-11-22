import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { DataService } from 'src/app/core/services/data.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-change-pass',
  templateUrl: './change-pass.component.html',
  styleUrls: ['./change-pass.component.css']
})
export class ChangePassComponent implements OnInit {
  @ViewChild("modalChangePass", { static: true }) public modalChangePass: ModalDirective;
  public loading: boolean = false;

  constructor(private dataService: DataService,
    private authService: AuthService,
    private notificationService: NotificationService) { }

  ngOnInit() {
  }

  async changePass(form) {
    this.loading = true;
    if (form.value.oldPassword == '') {
      this.notificationService.displayWarnMessage("Chưa nhập mật khẩu cũ");
      return;
    }

    if (form.value.newPassword == '') {
      this.notificationService.displayWarnMessage("Chưa nhập mật khẩu mới");
      return;
    }
    else if (form.value.newPassword.length < 6) {
      this.notificationService.displayWarnMessage("Mật khẩu phải nhiều hơn 6 ký tự");
      return;
    }
    else if (form.value.newPassword == form.value.oldPassword) {
      this.notificationService.displayWarnMessage("Mật khẩu mới phải khác mật khẩu cũ");
      return;
    }

    if (form.value.rePassword == '') {
      this.notificationService.displayWarnMessage("Chưa nhập lại mật khẩu mới");
      return;
    }
    else if (form.value.newPassword != form.value.rePassword) {
      this.notificationService.displayWarnMessage("Nhập lại mật khẩu mới không trùng khớp");
      return;
    }

    let response: any = await this.dataService.postAsync('/api/auth/ChangePass?oldPassword=' + form.value.oldPassword + '&newPassword=' + form.value.newPassword);
    if (response) {
      if (response.err_code == 0) {
        this.notificationService.displayConfirmDialog("Đổi mật khẩu thành công, quý khách vui lòng đăng nhập lại!", () => {
          this.loading = false;
          form.reset();
          this.authService.logout();
        });
      }
      else {
        this.notificationService.displayErrorMessage(response.err_message);
      }
    }

    this.loading = false;
  }
}
