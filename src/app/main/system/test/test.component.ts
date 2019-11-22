import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { UtilityService } from 'src/app/core/services/utility.service';
import { Role } from 'src/app/core/models/role';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
  public role: Role = new Role();
  constructor(private activatedRoute: ActivatedRoute, private utilityService: UtilityService) { }

  ngOnInit() {
    this.activatedRoute.data.subscribe(data => {
      this.utilityService.getRole(data.MENU_CODE).then((response) => {
        if (response) this.role = response;
      })
    });
  }
}
