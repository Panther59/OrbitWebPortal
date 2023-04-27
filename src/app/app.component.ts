import { Directionality } from '@angular/cdk/bidi';
import { MediaMatcher } from '@angular/cdk/layout';
import { DOCUMENT } from '@angular/common';
import { Component, OnInit, AfterViewInit, Inject, Optional } from '@angular/core';
import { AppSettings } from './_models';
import { AppDirectionality, PreloaderService, SettingsService, ThemeService } from './_services';
import { currentTheme, refreshTheme } from 'devextreme/viz/themes';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit, AfterViewInit {
  constructor(
    private preloader: PreloaderService,
    private themeService: ThemeService,
  ) {
    this.themeService.applyTheme();
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.preloader.hide();
  }
}
