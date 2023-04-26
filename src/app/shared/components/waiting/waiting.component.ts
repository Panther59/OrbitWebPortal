import { Component, OnInit, Input } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'waiting',
    styleUrls: ['waiting.component.scss'],
    templateUrl: 'waiting.component.html'
})

export class WaitingComponent {

    @Input() backgroundDark = false;
    @Input() message = '';
}
