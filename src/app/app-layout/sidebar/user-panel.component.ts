import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'app/_models';
import { AuthService } from 'app/_services';

@Component({
  selector: 'app-user-panel',
  template: `
    <div class="matero-user-panel">
      <img
        *ngIf="user.picture"
        class="matero-user-panel-avatar"
        [src]="user.picture"
        alt="picture"
        width="64"
      />
      <div *ngIf="!user.picture" class="matero-user-panel-initials-circle">
        <div class="matero-user-panel-initials">{{ user.initial }}</div>
      </div>
      <h4 class="matero-user-panel-name">{{ user.name }}</h4>
      <h5 class="matero-user-panel-email">{{ user.email }}</h5>
      <div class="matero-user-panel-icons">
        <button
          mat-icon-button
          routerLink="/profile/overview"
          matTooltip="{{ 'profile' | translate }}"
        >
          <mat-icon class="icon-18">account_circle</mat-icon>
        </button>
        <button
          mat-icon-button
          routerLink="/profile/settings"
          matTooltip="{{ 'edit_profile' | translate }}"
        >
          <mat-icon class="icon-18">edit</mat-icon>
        </button>
        <button mat-icon-button (click)="logout()" matTooltip="{{ 'logout' | translate }}">
          <mat-icon class="icon-18">exit_to_app</mat-icon>
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./user-panel.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class UserPanelComponent implements OnInit {
  user!: User;

  constructor(private router: Router, private auth: AuthService) {}

  ngOnInit(): void {
    this.auth.user().subscribe(user => (this.user = user));
  }

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/auth/login');
  }
}
