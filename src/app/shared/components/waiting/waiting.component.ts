import { Component, OnInit, Input } from '@angular/core';
import { ThemeService } from 'app/_services';

@Component({
  moduleId: module.id,
  selector: 'waiting',
  styleUrls: ['waiting.component.scss'],
  templateUrl: 'waiting.component.html',
})
export class WaitingComponent {
  backgroundDark = true;
  constructor(themeService: ThemeService) {
    this.backgroundDark = themeService.getTheme() === 'dark';
    themeService.themeModeChanged.subscribe(x => (this.backgroundDark = x === 'dark'));
  }

  @Input() message = '';
}
