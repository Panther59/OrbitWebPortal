import { Component, OnInit, Input } from '@angular/core';
import { SettingsService } from '@core';

@Component({
  moduleId: module.id,
  selector: 'waiting',
  styleUrls: ['waiting.component.scss'],
  templateUrl: 'waiting.component.html',
})
export class WaitingComponent {
  backgroundDark = true;
  constructor(settingsService: SettingsService) {
    this.backgroundDark = settingsService.getOptions().theme !== 'light';
  }

  @Input() message = '';
}
