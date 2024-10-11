import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { TimelineModule } from 'primeng/timeline';
import { ButtonModule } from 'primeng/button';
import { TimeSlot } from '../../../../../models/time-slot';

@Component({
  selector: 'app-agenda-list',
  standalone: true,
  imports: [
    CommonModule,
    TimelineModule,
    ButtonModule
  ],
  templateUrl: './agenda-list.component.html',
  styleUrl: './agenda-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgendaListComponent {

    @Input() timeSlots : TimeSlot[] | undefined;
    @Output() timeSlotRemoved = new EventEmitter<TimeSlot>();



    ngOnInit(){
        console.log(this.timeSlots);
    }

}
