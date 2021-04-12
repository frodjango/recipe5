import { Component, Input, EventEmitter, Output } from '@angular/core';

// Extract from auth.component.html
//
// <app-alert [message]="error" *ngIf="error" (close)="onHandleError()"></app-alert>
//
// error in a component property of auth.component.
//
// We want to receive this property as an '@Input' for our alert.component.

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent {
  // Angular Custom Property Binding Using @Input Decorator - see comments above
  @Input() message: string;
  // We want to communicate 'out' the fact that an event occured on this html component
  // and it need to be reported to the component makeing use of this <app-alert>
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
}
