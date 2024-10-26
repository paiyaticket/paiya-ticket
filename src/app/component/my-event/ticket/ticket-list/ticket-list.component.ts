import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Ticket } from '../../../../models/ticket';
import { TicketService } from '../../../../service/ticket.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    TableModule,
    CardModule
  ],
  templateUrl: './ticket-list.component.html',
  styleUrl: './ticket-list.component.scss',
  changeDetection: ChangeDetectionStrategy.Default
})
export class TicketListComponent {

    @Input({required: true})
    eventId : string | undefined;

    tickets : Ticket[] = [];

    constructor(private ticketService : TicketService) { }

    ngOnInit(): void {
        if(this.eventId)
        this.ticketService.findByEventId(this.eventId).subscribe(tickets => {
            this.tickets = tickets;
        });
    }

}
