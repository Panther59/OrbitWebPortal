import { Component } from '@angular/core';
import { SettingsService } from 'app/_services';

@Component({
  selector: 'app-branding',
  template: `
    <span class="d-md-inline toolBarBrand">
      <button
        type="button"
        *ngIf="isDark"
        mat-button
        class="nav-button"
        [routerLinkActive]="['active']"
        routerLink="#"
      >
        <div class="brand-button">
          <div class="navbar-brand" style="display: inline-flex">
            <img
              class="under"
              alt="innerorbit.white.png"
              src="assets/images/innerorbit.white.png"
              width="40"
              height="40"
            />
            <img
              class="myHomeIcon"
              alt="outerorbit.white.png"
              src="assets/images/outerorbit.white.png"
              width="40"
              height="40"
              style="position: absolute"
            />
            <img
              class="oppositeRotateSlow"
              alt="outerorbit.white.png"
              src="assets/images/outerorbit.white.png"
              width="40"
              height="40"
              style="position: absolute"
            />
          </div>
          <span class="brand-name">Orbit</span>
        </div>
      </button>

      <button
        type="button"
        *ngIf="!isDark"
        mat-button
        class="nav-button"
        [routerLinkActive]="['active']"
        routerLink="#"
      >
        <div class="brand-button">
          <div class="navbar-brand" style="display: inline-flex">
            <img
              class="under"
              alt="innerorbit.black.png"
              src="assets/images/innerorbit.black.png"
              width="40"
              height="40"
            />
            <img
              class="myHomeIcon"
              alt="outerorbit.black.png"
              src="assets/images/outerorbit.black.png"
              width="40"
              height="40"
              style="position: absolute"
            />
            <img
              class="oppositeRotateSlow"
              alt="outerorbit.black.png"
              src="assets/images/outerorbit.black.png"
              width="40"
              height="40"
              style="position: absolute"
            />
          </div>
          <span class="brand-name">Orbit</span>
        </div>
      </button>
    </span>
  `,
  styles: [
    `
      .brand-logo {
        width: 30px;
        height: 30px;
      }
    `,
  ],
})
export class BrandingComponent {
  isDark = true;
  constructor(private settingsService: SettingsService){
    this.isDark = settingsService.getOptions().theme === 'dark';
    settingsService.notify.subscribe(x => this.isDark = x.theme === 'dark');
  }
}
