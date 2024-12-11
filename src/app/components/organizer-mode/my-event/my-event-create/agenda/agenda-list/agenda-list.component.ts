import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { TimelineModule } from 'primeng/timeline';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { TimeSlot } from '@models/time-slot';

@Component({
  selector: 'app-agenda-list',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    TimelineModule,
    AvatarModule,
    AvatarGroupModule
  ],
  templateUrl: './agenda-list.component.html',
  styleUrl: './agenda-list.component.scss',
  changeDetection: ChangeDetectionStrategy.Default
})
export class AgendaListComponent implements OnChanges {

    @Input() timeSlots : TimeSlot[] = [];
    @Output() timeSlotRemoved = new EventEmitter<number>();
    @Output() timeSlotUpdated = new EventEmitter<any>();



    ngOnChanges(changes : SimpleChanges){
        this.timeSlots = changes['timeSlots'].currentValue;
        this.timeSlots = this.timeSlots.sort((a, b) => a.startTime! - b.startTime!);
    }

    removeTimeSlot(timeSlot : TimeSlot){
        let index = this.timeSlots.indexOf(timeSlot);
        this.timeSlotRemoved.emit(index);
    }

    updateTimeSlot(timeSlot : TimeSlot){
        console.log('update time slot');
        this.timeSlotUpdated.emit({timeSlot : timeSlot, index : this.timeSlots.indexOf(timeSlot)});
    }


    displayTimeslotDates(timeSlot : TimeSlot) : string{
        if(timeSlot.startTime === undefined || timeSlot.endTime === undefined){
            return '';
        }
        let startTime = new Date(timeSlot.startTime);
        let endTime = new Date(timeSlot.endTime);
        return startTime?.getHours() + ':' + startTime?.getUTCMinutes().toString().padStart(2, '0') + 
                ' - ' + endTime?.getHours() + ':' + endTime?.getUTCMinutes().toString().padStart(2, '0');
    }

}
