import { Component, ElementRef, ViewChild } from '@angular/core';
import { ParticipantLayoutService } from './service/participant.layout.service';
import { ParticipantMenuComponent } from './participant.menu.component';

@Component({
    selector: 'participant-sidebar',
    templateUrl: './participant.sidebar.component.html',
    standalone: true,
    imports: [
        ParticipantMenuComponent
    ]
})
export class ParticipantSidebarComponent {

    @ViewChild('menuContainer') menuContainer!: ElementRef;
    constructor(public layoutService: ParticipantLayoutService, public el: ElementRef) {}

}
