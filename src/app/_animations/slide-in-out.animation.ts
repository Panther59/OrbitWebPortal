import { trigger, transition, style, animate } from '@angular/animations';

export const slideInOut = trigger('slideInOut', [
  transition(':enter', [
    style({transform: 'translateX(-100%)'}),
    animate('0.4s ease-out', style({transform: 'translateX(0%)'}))
  ]),
  transition(':leave', [
    animate('0.2s ease-in', style({transform: 'translateX(-100%)'}))
  ])
]);
