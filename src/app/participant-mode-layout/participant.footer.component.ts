import {Component} from '@angular/core';
import {ParticipantLayoutService} from "./service/participant.layout.service";
import { CommonModule } from '@angular/common';

@Component({
    selector: 'participant-footer',
    templateUrl: './participant.footer.component.html',
    standalone: true,
    imports: [
        CommonModule,
    ]
})
export class ParticipantFooterComponent {

    constructor(public layoutService: ParticipantLayoutService) {}

    get colorScheme(): string {
        return this.layoutService.config().colorScheme;
    }
}
