import { trigger, transition, style, query, animateChild, animate, group } from '@angular/animations';

export const slideInAnimation = trigger('routeAnimations', [
  transition('dashboard => faq', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
      }),
    ]),
    query(':enter', [style({ left: '100%', opacity: 0 })]),
    query(':leave', animateChild()),
    group([
      query(':leave', [animate('800ms ease-out', style({ left: '-100%', opacity: 0 }))]),
      query(':enter', [animate('800ms ease-out', style({ left: 0, opacity: '100%'}))]),
    ]),
    query(':enter', animateChild()),
  ]),
  transition('faq => dashboard', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
      }),
    ]),
    query(':enter', [style({ left: '-100%', opacity: '0' })]),
    query(':leave', animateChild()),
    group([
      query(':leave', [animate('800ms ease-out', style({ left: '100%', opacity: 0 }))]),
      query(':enter', [animate('800ms ease-out', style({ left: 0, opacity: '100%' }))]),
    ]),
    query(':enter', animateChild()),
  ]),
]);
