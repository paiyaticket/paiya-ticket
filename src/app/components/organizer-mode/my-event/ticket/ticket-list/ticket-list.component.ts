import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
// @ts-ignore
import { Ticket } from '../../../../../models/ticket';
import { TicketService } from '../../../../../services/ticket.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { environment } from '../../../../../../environments/environment';

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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TicketListComponent {

    @Input() tickets : Ticket[] = [];

    @Output()
    ticketEdited = new EventEmitter<Ticket>();

    @Output()
    ticketDeleted = new EventEmitter<Ticket>();

    currency : string = environment.instanceParams.currency;


    constructor(private ticketService : TicketService) { }

    ngOnInit(): void {
    }

    ngOnChanges(changes : SimpleChanges){
    }

    ngOnDestroy(): void {
    }

    editTicket(ticket : Ticket){
        this.ticketEdited.emit(ticket);
    }

    deleteTicket(ticket : Ticket){
        this.ticketDeleted.emit(ticket);
    }
}
