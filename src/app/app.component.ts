import { Component, OnInit, AfterViewInit } from '@angular/core';
import { PreloaderService, ThemeService } from './_services';

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
