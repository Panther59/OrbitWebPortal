import { Component, OnInit } from '@angular/core';
import { UserRole } from 'app/_models';
import { PermissionsService } from 'app/_services/apis/permissions.services';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss'],
})
export class ViewerComponent implements OnInit {
  loading = false;
  roles: UserRole[] = [];
  constructor(private permissionsService: PermissionsService) {}
  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.permissionsService.getAll().subscribe({
      next: data => {
        this.roles = data;
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        console.error(error);
      },
    });
  }
}
