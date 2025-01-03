import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, SimpleChanges, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { TicketCreateComponent } from "./ticket-create/ticket-create.component";
import { CardModule } from 'primeng/card';
import { EventService } from '@services/event.service';
// @ts-ignore
import { Event } from '@models/event';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
// @ts-ignore
import { Ticket } from '@models/ticket';
import { TicketListComponent } from "./ticket-list/ticket-list.component";
import { TicketService } from '@services/ticket.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-ticket',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        SidebarModule,
        CardModule,
        ToastModule,
        TicketCreateComponent,
        TicketListComponent,
        ConfirmDialogModule
        ],
    templateUrl: './ticket.component.html',
    styleUrl: './ticket.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicketComponent {
    @Input()
    eventId !: string;
    createTicketSidebarVisible: boolean = false;
    event : Event | undefined;
    tickets !: Ticket[];
    selectedTicket : Ticket | undefined;
    eventSubscription$ : Observable<Event> | undefined;




    constructor(
        private eventService: EventService, 
        private ticketService : TicketService,
        private messageService : MessageService,
        private confirmationService : ConfirmationService,
        private cdRef : ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.eventSubscription$ = this.eventService.findById(this.eventId);
    }

    ngOnChanges(changes : SimpleChanges){
        if(changes['eventId'].currentValue){
            this.ticketService.findByEventId(changes['eventId'].currentValue).subscribe(tickets => {
                this.tickets = tickets;
                this.cdRef.detectChanges();
            });
        }
    }

    showCreateTicketSidebar() {
        this.createTicketSidebarVisible = true;
    }

    hideCreateTicketSidebar(ticket : Ticket) {
        this.createTicketSidebarVisible = false;
        if(ticket)
        this.refreshTicketListAfterCreateOrUpdate(ticket);
    }

    refreshTicketListAfterCreateOrUpdate(ticket : Ticket){
        if(this.selectedTicket && this.selectedTicket.id === ticket.id){
            // happens when a ticket is updated
            this.tickets = this.tickets.map(t => (ticket.id === t.id) ? ticket : t)
            this.messageService.add({ 
                icon: 'pi pi-pencil',
                severity: 'success', 
                summary: $localize`Ticket mis à jour avec succès`, 
                detail: $localize`${this.selectedTicket.code} - ${this.selectedTicket.label}`
            });
            this.selectedTicket = undefined;
        } else {
            // happens when a ticket is created
            this.tickets = this.tickets.concat(ticket);
            this.messageService.add({ 
                icon: 'pi pi-check',
                severity: 'success', 
                summary: $localize`Ticket enregistré avec succès`, 
                detail: $localize`${ticket.code} - ${ticket.label}`
            });
        }
        this.cdRef.detectChanges();
    }

    displayMessageAfterCreateOrUpdate(ticket : Ticket){
        if(this.selectedTicket){
            // happens when a ticket is updated
            this.messageService.add({ 
                icon: 'pi pi-pencil',
                severity: 'success', 
                summary: $localize`Ticket mis à jour avec succès`, 
                detail: $localize`${this.selectedTicket.code} - ${this.selectedTicket.label}`
            });
            
        } else {
            // happens when a ticket is created
            this.messageService.add({ 
                icon: 'pi pi-check',
                severity: 'success', 
                summary: $localize`Ticket enregistré avec succès`, 
                detail: $localize`${ticket.code} - ${ticket.label}`
            });
        }
    }
    
    handleTicketEdition(ticket : Ticket){
        this.selectedTicket = ticket;
        this.showCreateTicketSidebar();
    }
    
    handleTicketDeletion(ticket : Ticket){
        this.confirmDeletion(ticket);
    }

    confirmDeletion(ticket : Ticket) {
        this.confirmationService.confirm({
            header: $localize `Etes-vous sur(e)?`,
            message: $localize `Je confirme que je veux suprimer le ticket "${ticket.code} - ${ticket.label}".`,
            accept: () => this.deleteTicket(ticket),
            reject: () => {}
        });
    }

    deleteTicket(ticket : Ticket){
        this.ticketService.delete(ticket.id).subscribe(() => {
            this.tickets = this.tickets.filter(t => t.id !== ticket.id);
            this.messageService.add({ 
                icon: 'pi pi-trash',
                severity: 'success', 
                summary: $localize`Ticket supprimé avec succès`, 
                detail: $localize`${ticket.code} - ${ticket.label}`
            });
            this.cdRef.detectChanges();
        });
    }


} 
