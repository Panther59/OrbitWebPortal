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
  options = this.settings.getOptions();
  constructor(
    private preloader: PreloaderService,
    private mediaMatcher: MediaMatcher,
    private settings: SettingsService,
    private themeService: ThemeService,
    @Optional() @Inject(DOCUMENT) private document: Document,
    @Inject(Directionality) public dir: AppDirectionality
  ) {
    this.receiveOptions(this.options);
  }

  receiveOptions(options: AppSettings): void {
    this.options = options;
    this.settings.setOptions(options);
    this.themeService.applyTheme();
    this.toggleDirection(options);
  }

  toggleDirection(options: AppSettings) {
    this.dir.value = options.dir;
    this.document.body.dir = this.dir.value;
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.preloader.hide();
  }
}
