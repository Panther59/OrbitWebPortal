import { Directionality } from '@angular/cdk/bidi';
import { MediaMatcher } from '@angular/cdk/layout';
import { DOCUMENT } from '@angular/common';
import { Component, OnInit, AfterViewInit, Inject, Optional } from '@angular/core';
import { AppSettings } from './_models';
import { AppDirectionality, PreloaderService, SettingsService } from './_services';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit, AfterViewInit {
  private htmlElement!: HTMLHtmlElement;
  options = this.settings.getOptions();
  constructor(
    private preloader: PreloaderService,
    private mediaMatcher: MediaMatcher,
    private settings: SettingsService,
    @Optional() @Inject(DOCUMENT) private document: Document,
    @Inject(Directionality) public dir: AppDirectionality
  ) {
    this.htmlElement = this.document.querySelector('html')!;
    if (this.options.theme === 'auto') {
      this.setAutoTheme();
    }

    // Initialize project theme with options
    this.receiveOptions(this.options);
  }

  setAutoTheme() {
    // Check whether the browser support `prefers-color-scheme`
    if (this.mediaMatcher.matchMedia('(prefers-color-scheme)').media !== 'not all') {
      const isSystemDark = this.mediaMatcher.matchMedia('(prefers-color-scheme: dark)').matches;
      // Set theme to dark if `prefers-color-scheme` is dark. Otherwise, set it to light.
      this.options.theme = isSystemDark ? 'dark' : 'light';
    } else {
      // If the browser does not support `prefers-color-scheme`, set the default to light.
      this.options.theme = 'light';
    }
  }

  receiveOptions(options: AppSettings): void {
    this.options = options;
    this.settings.setOptions(options);
    this.toggleDarkTheme(options);
    this.toggleDirection(options);
  }

  toggleDarkTheme(options: AppSettings) {
    if (options.theme === 'dark') {
      this.htmlElement.classList.add('theme-dark');
    } else {
      this.htmlElement.classList.remove('theme-dark');
    }
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
