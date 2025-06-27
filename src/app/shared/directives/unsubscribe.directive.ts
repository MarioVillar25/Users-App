import { Directive, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Directive({
  selector: '[appUnsubscribe]',
  standalone: true
})
export class UnsubscribeDirective implements OnDestroy {
  protected readonly _destroy$ = new Subject<boolean>();

  ngOnDestroy() {
    this._destroy$.next(true);
    this._destroy$.complete();
  }
}
