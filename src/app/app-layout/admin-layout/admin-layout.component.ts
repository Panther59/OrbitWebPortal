import {
  Component,
  OnDestroy,
  ViewChild,
  HostBinding,
  Inject,
  Optional,
  ViewEncapsulation,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { BreakpointObserver, MediaMatcher } from '@angular/cdk/layout';
import { Directionality } from '@angular/cdk/bidi';
import { MatSidenav, MatSidenavContent } from '@angular/material/sidenav';

import { AppDirectionality, SettingsService, ThemeService } from 'app/_services';
import { AppSettings } from 'app/_models';
import { currentTheme, refreshTheme } from 'devextreme/viz/themes';

const MOBILE_MEDIAQUERY = 'screen and (max-width: 599px)';
const TABLET_MEDIAQUERY = 'screen and (min-width: 600px) and (max-width: 959px)';
const MONITOR_MEDIAQUERY = 'screen and (min-width: 960px)';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AdminLayoutComponent implements OnDestroy {
  @ViewChild('sidenav', { static: true }) sidenav!: MatSidenav;
  @ViewChild('content', { static: true }) content!: MatSidenavContent;

  options = this.settings.getOptions();
  actualTheme = '';
  private layoutChangesSubscription = Subscription.EMPTY;

  get isOver(): boolean {
    return this.isMobileScreen;
  }

  private isMobileScreen = false;

  @HostBinding('class.matero-content-width-fix') get contentWidthFix() {
    return (
      this.isContentWidthFixed &&
      this.options.navPos === 'side' &&
      this.options.sidenavOpened &&
      !this.isOver
    );
  }

  private isContentWidthFixed = true;

  @HostBinding('class.matero-sidenav-collapsed-fix') get collapsedWidthFix() {
    return (
      this.isCollapsedWidthFixed &&
      (this.options.navPos === 'top' || (this.options.sidenavOpened && this.isOver))
    );
  }

  private isCollapsedWidthFixed = false;

  constructor(
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private settings: SettingsService,
    private themeService: ThemeService,
  ) {
    this.layoutChangesSubscription = this.breakpointObserver
      .observe([MOBILE_MEDIAQUERY, TABLET_MEDIAQUERY, MONITOR_MEDIAQUERY])
      .subscribe(state => {
        // SidenavOpened must be reset true when layout changes
        this.options.sidenavOpened = true;

        this.isMobileScreen = state.breakpoints[MOBILE_MEDIAQUERY];
        this.options.sidenavCollapsed = state.breakpoints[TABLET_MEDIAQUERY];
        this.isContentWidthFixed = state.breakpoints[MONITOR_MEDIAQUERY];
      });

    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(e => {
      if (this.isOver) {
        this.sidenav.close();
      }
      this.content.scrollTo({ top: 0 });
    });

    this.themeService.themeModeChanged.subscribe(x => this.actualTheme = x);
  }

  ngOnDestroy() {
    this.layoutChangesSubscription.unsubscribe();
  }

  toggleCollapsed() {
    this.isContentWidthFixed = false;
    this.options.sidenavCollapsed = !this.options.sidenavCollapsed;
    this.resetCollapsedState();
  }

  // TODO: Trigger when transition end
  resetCollapsedState(timer = 400) {
    setTimeout(() => this.settings.setOptions(this.options), timer);
  }

  onSidenavClosedStart() {
    this.isContentWidthFixed = false;
  }

  onSidenavOpenedChange(isOpened: boolean) {
    this.isCollapsedWidthFixed = !this.isOver;
    this.options.sidenavOpened = isOpened;
    this.settings.setOptions(this.options);
  }

  // Demo purposes only

}
