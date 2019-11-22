import { Injectable } from '@angular/core';
import { HttpRequest, HttpHeaders, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()

export class JwtInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthService) { }

    // gắn token/authorize vào tất cả các request đến API
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let currentUser = this.authenticationService.currentUserValue;
        if (currentUser && currentUser.TOKEN) {
            const headers = new HttpHeaders({
                'Authorization': `Bearer ${currentUser.TOKEN}`
            });
            request = request.clone({ headers });
        }
        return next.handle(request);
    }
}