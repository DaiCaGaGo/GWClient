import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

@Injectable()

export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthService, private notificationService: NotificationService ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err.status === 401) {
                this.authenticationService.logout();
                location.reload();
            }
            if (err.status === 403) {
                this.notificationService.displayErrorMessage("Bạn chưa được cấp quyền cho chức năng này");
            }
            const error = err.error.message || err.statusText;
            return throwError(error);
        }))
    }
}