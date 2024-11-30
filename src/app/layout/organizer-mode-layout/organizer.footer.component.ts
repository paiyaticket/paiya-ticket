import {Component} from '@angular/core';
import {OrganizerLayoutService} from "./service/organizer.layout.service";
import { CommonModule } from '@angular/common';

@Component({
    selector: 'organizer-footer',
    templateUrl: './organizer.footer.component.html',
    standalone: true,
    imports: [
        CommonModule,
    ]
})
export class OrganizerFooterComponent {

    constructor(public layoutService: OrganizerLayoutService) {}

    get colorScheme(): string {
        return this.layoutService.config().colorScheme;
    }
}
