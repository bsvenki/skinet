import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-pager',
    templateUrl: './pager.component.html',
    styleUrls: ['./pager.component.scss'],
    standalone: false
})
export class PagerComponent {
 @Input() totalCount?: number;
 @Input() pageSize?: number;
 @Output() pageChanged = new EventEmitter<number>();

 // Note event name - on pager** changed
 onPagerChanged(event: any){
  this.pageChanged.emit(event.page);
 }

}
