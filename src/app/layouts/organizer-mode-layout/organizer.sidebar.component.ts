import { Component, ElementRef, ViewChild } from '@angular/core';
import { OrganizerLayoutService } from './service/organizer.layout.service';
import { OrganizerMenuComponent } from './organizer.menu.component';

@Component({
    selector: 'organizer-sidebar',
    templateUrl: './organizer.sidebar.component.html',
    standalone: true,
    imports: [
        OrganizerMenuComponent
    ]
})
export class OrganizerSidebarComponent {

    @ViewChild('menuContainer') menuContainer!: ElementRef;
    constructor(public layoutService: OrganizerLayoutService, public el: ElementRef) {}

}
