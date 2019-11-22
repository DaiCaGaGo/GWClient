import { Injectable } from '@angular/core';
import { UtilityService } from '../services/utility.service';

declare var alertify: any;

@Injectable()
export class NotificationService {
  private notifier: any = alertify;
  constructor(private utilityService: UtilityService) {
    alertify.defaults = {
      autoReset: true,
      basic: false,
      closable: true,
      closableByDimmer: true,
      frameless: false,
      maintainFocus: true,
      maximizable: true,
      modal: true,
      movable: true,
      moveBounded: false,
      overflow: true,
      padding: true,
      pinnable: true,
      pinned: true,
      preventBodyShift: false,
      resizable: true,
      startMaximized: false,
      transition: 'pulse',

      notifier: {
        delay: 5,
        position: 'top-right',
        closeButton: false
      },

      glossary: {
        title: 'Xác nhận',
        ok: 'Đồng ý',
        cancel: this.utilityService.translate("Hủy")
      },

      theme: {
        input: 'ajs-input',
        ok: 'ajs-ok',
        cancel: 'ajs-cancel'
      }
    };
  }

  displaySuccessMessage(message: string) {
    if (message) {
      this.notifier.success(message);
    }
  }

  displayErrorMessage(message: string) {
    if (message) {
      this.notifier.error(message);
    }
  }

  displayWarnMessage(message: string) {
    if (message) {
      this.notifier.warning(message);
    }
  }

  displayConfirmDialog(message: string, functionCallback: () => any) {
    this.notifier.confirm(message, (e) => {
      if (e) {
        functionCallback();
      } else {
      }
    });
  }
}
