import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsService } from '@core';
import { AuthService, User } from '@core/authentication';
import { debounceTime, tap } from 'rxjs/operators';

@Component({
  selector: 'app-user',
  template: `
    <button class="r-full" mat-button [matMenuTriggerFor]="menu">
      <img
        *ngIf="user.picture"
        matButtonIcon
        class="avatar r-full"
        [src]="user.picture"
        width="24"
        alt="avatar"
      />
      <div *ngIf="!user.picture" class="avatar r-full circle">
        <div class="initials">{{ user.initial }}</div>
      </div>
      <span class="m-x-8">{{ user.name }}</span>
    </button>

    <mat-menu #menu="matMenu">
      <button routerLink="/profile/overview" mat-menu-item>
        <mat-icon>account_circle</mat-icon>
        <span>{{ 'profile' | translate }}</span>
      </button>
      <button routerLink="/profile/settings" mat-menu-item>
        <mat-icon>edit</mat-icon>
        <span>{{ 'edit_profile' | translate }}</span>
      </button>
      <button mat-menu-item (click)="restore()">
        <mat-icon>restore</mat-icon>
        <span>{{ 'restore_defaults' | translate }}</span>
      </button>
      <button mat-menu-item (click)="logout()">
        <mat-icon>exit_to_app</mat-icon>
        <span>{{ 'logout' | translate }}</span>
      </button>
    </mat-menu>
  `,
  styles: [
    `
      .avatar {
        width: 24px;
        height: 24px;
      }

      .circle {
        border-radius: 50%;
        width: 24px;
        height: 24px;
        display: inline-table;
        justify-content: center;
        align-items: center;
        background-color: gray;
      }
      .initials {
        color: #ffffff;
        font-size: 12px;
        line-height: 24px;
        letter-spacing: 0.2625px;
      }
    `,
  ],
})
export class UserComponent implements OnInit {
  user!: User;

  constructor(
    private router: Router,
    private auth: AuthService,
    private cdr: ChangeDetectorRef,
    private settings: SettingsService
  ) {}

  ngOnInit(): void {
    this.auth
      .user()
      .pipe(
        tap(user => (this.user = user)),
        debounceTime(10)
      )
      .subscribe(() => this.cdr.detectChanges());
  }

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/auth/login');
  }

  restore() {
    this.settings.reset();
    window.location.reload();
  }
}
