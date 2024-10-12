import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { TimelineModule } from 'primeng/timeline';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { TimeSlot } from '../../../../../models/time-slot';

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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgendaListComponent implements OnChanges {

    @Input() timeSlots : TimeSlot[] = [];
    @Output() timeSlotRemoved = new EventEmitter<TimeSlot>();



    ngOnInit() : void{
        // console.log(this.timeSlots);
    }

    ngOnChanges(changes : SimpleChanges){
        console.log(changes['timeSlots'].currentValue);
        this.timeSlots = changes['timeSlots'].currentValue;
    }

    removeTimeSlot(timeSlot : TimeSlot){
        this.timeSlotRemoved.emit(timeSlot);
    }

}
