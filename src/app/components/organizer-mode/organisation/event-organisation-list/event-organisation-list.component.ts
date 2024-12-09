import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { TableModule } from 'primeng/table';
import { PanelModule } from 'primeng/panel';
import { EventOrganizer } from '../../../../models/event-organizer';
import { User } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { SidebarModule } from 'primeng/sidebar';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
    selector: 'app-event-organisation-list',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule, 
        CardModule,
        PanelModule,
        TableModule,
        ChipModule,
        SidebarModule,
        SkeletonModule
    ],
    templateUrl: './event-organisation-list.component.html',
    styleUrl: './event-organisation-list.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventOrganisationListComponent implements OnInit{

    @Input()
    eventOrganizerList : EventOrganizer[] | null = [];
    @Output()
    onUpdate : EventEmitter<string> = new EventEmitter<string>();
    @Output()
    onDelete : EventEmitter<EventOrganizer> = new EventEmitter<EventOrganizer>();

    user : User | null | undefined;
    
    eventOrganizerList$ !: Observable<EventOrganizer[]>;
    skeletonList : number[] = [1,2,3,4];


    constructor () {}

    
    ngOnInit(): void{
    }

    ngOnChanges(changes  : SimpleChanges){
        if(changes['eventOrganizerList']){
            this.eventOrganizerList = changes['eventOrganizerList'].currentValue;
        }
    }

    update(eventOrganizer : EventOrganizer){
        this.onUpdate.emit(eventOrganizer.id);
    }

    delete(eventOrganizer : EventOrganizer){
        this.onDelete.emit(eventOrganizer);
    }
}
