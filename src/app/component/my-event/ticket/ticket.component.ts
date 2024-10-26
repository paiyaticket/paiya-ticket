import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { TableModule } from 'primeng/table';
import { TicketCreateComponent } from "./ticket-create/ticket-create.component";
import { CardModule } from 'primeng/card';
import { EventService } from '../../../service/event.service';
import { Event } from '../../../models/event';
import { utcDateToZonedDateTime } from '../../../utils/date-util';
import { Observable } from 'rxjs';
import { Ticket } from '../../../models/ticket';
import { TicketListComponent } from "./ticket-list/ticket-list.component";

@Component({
  selector: 'app-ticket',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    SidebarModule,
    CardModule,
    TicketCreateComponent,
    TicketListComponent
],
  templateUrl: './ticket.component.html',
  styleUrl: './ticket.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TicketComponent {

    @Input()
    eventId !: string;
    event !: Event;
    createTicketSidebarVisible: boolean = false;

    constructor(private eventService: EventService) { }

    ngOnInit(): void {
        this.eventService.findById(this.eventId).subscribe(event => {
            this.event = event;
        });
    }

    showCreateTicketSidebar() {
        this.createTicketSidebarVisible = true;
    }

    hideCreateTicketSidebar() {
        this.createTicketSidebarVisible = false;
    }


}
