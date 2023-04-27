import { MediaMatcher } from '@angular/cdk/layout';
import { Inject, Injectable, Optional } from '@angular/core';
import { currentTheme, refreshTheme } from 'devextreme/viz/themes';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { AppDirectionality, SettingsService } from '.';
import { DOCUMENT } from '@angular/common';
import { AppSettings } from 'app/_models';
import { Direction, Directionality } from '@angular/cdk/bidi';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  defaultThemeMode = 'light';
  private htmlElement!: HTMLHtmlElement;
  options = this.settings.getOptions();
  constructor(
    private mediaMatcher: MediaMatcher,
    private settings: SettingsService,
    @Optional() @Inject(DOCUMENT) private document: Document,
    @Inject(Directionality) public dir: AppDirectionality    ){
      this.htmlElement = this.document.querySelector('html')!;
      this.settings.notify.subscribe(x => {
        this.applyTheme();
      });
  }
  themeModeChanged = new BehaviorSubject(this.getTheme());

  getTheme(): string {
    if (this.options.theme === 'auto') {
      // Check whether the browser support `prefers-color-scheme`
      if (this.mediaMatcher.matchMedia('(prefers-color-scheme)').media !== 'not all') {
        const isSystemDark = this.mediaMatcher.matchMedia('(prefers-color-scheme: dark)').matches;
        // Set theme to dark if `prefers-color-scheme` is dark. Otherwise, set it to light.
        return isSystemDark ? 'dark' : 'light';
      } else {
        // If the browser does not support `prefers-color-scheme`, set the default to light.
        return this.defaultThemeMode;
      }
    } else {
      return this.options.theme;
    }
  }

  applyTheme() {
    const theme = this.getTheme();
    if (theme === 'dark') {
      this.htmlElement.classList.add('theme-dark');
      this.applyDxTheme('dark');
    } else {
      this.htmlElement.classList.remove('theme-dark');
      this.applyDxTheme('light');
    }

    this.toggleDirection(this.options.dir);

  }

  applyDxTheme(mode?: string) {
    const themeMarker = 'dx.theme.blue.';
    mode = mode || this.defaultThemeMode;
    const theme = themeMarker + mode;

    for (const index in document.styleSheets) {
      const styleSheet = document.styleSheets[index],
        href = styleSheet.href;
      if (href) {
        const themeMarkerPosition = href.indexOf(themeMarker);
        if (themeMarkerPosition >= 0) {
          const startPosition = themeMarkerPosition + themeMarker.length,
            endPosition = href.indexOf('.', startPosition),
            fileNamePart = href.substring(startPosition, endPosition);
          styleSheet.disabled = fileNamePart != mode;
        }
      }
    }

    currentTheme(theme);
    refreshTheme();
    this.themeModeChanged.next(mode);
  }

  toggleDirection(dir: Direction) {
    this.dir.value = dir;
    this.document.body.dir = this.dir.value;
  }

}
