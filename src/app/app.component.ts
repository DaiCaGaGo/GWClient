import { Component } from '@angular/core';
import { UtilityService } from './core/services/utility.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  constructor(private utilityService: UtilityService) {
    this.utilityService.setLanguageCurrent();
    this.utilityService.setBootstrapTheme();
  }
}
