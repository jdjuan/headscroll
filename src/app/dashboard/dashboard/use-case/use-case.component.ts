import { Component, OnInit } from '@angular/core';
import { concat, from, of, timer } from 'rxjs';
import { concatMap, delay, exhaustMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-use-case',
  templateUrl: './use-case.component.html',
  styleUrls: ['./use-case.component.scss'],
})
export class UseCaseComponent implements OnInit {
  instruments = ['guitar', 'piano', 'ukelele', 'accordion', 'harmonica'];
  instrument: string;
  readonly WRITE_SPEED = 200;
  readonly ERASE_SPEED = 150;
  readonly CHANGE_SPEED = 5000;
  constructor() {
    this.instrument = this.instruments.shift();
    this.instruments.push(this.instrument);
  }

  ngOnInit(): void {
    timer(this.CHANGE_SPEED, this.CHANGE_SPEED)
      .pipe(
        exhaustMap(() => {
          const nextInstrument = this.instruments.shift();
          this.instruments.push(nextInstrument);
          return concat(this.erase$(this.instrument), this.write$(nextInstrument));
        })
      )
      .subscribe();
  }

  erase$ = (instrument: string) => {
    return from(instrument).pipe(
      concatMap((letter) => of(letter).pipe(delay(this.ERASE_SPEED))),
      tap(() => (this.instrument = this.instrument.slice(0, -1)))
    );
  }

  write$ = (instrument: any) => {
    return from(instrument).pipe(
      concatMap((letter) => of(letter).pipe(delay(this.WRITE_SPEED))),
      tap((letter) => (this.instrument += letter))
    );
  }
}
