import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { environment } from '../../../../../environments/environment';
import { CalendarModule } from 'primeng/calendar';
import { laterDateValidator } from '../../../../validators/laterDateValidator';
import { EditorModule } from 'primeng/editor';
import { ToggleButtonChangeEvent, ToggleButtonModule } from 'primeng/togglebutton';
import { TableModule } from 'primeng/table';
import { Ticket } from '../../../../models/ticket';
import { TicketService } from '../../../../service/ticket.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Observable, Subscription } from 'rxjs';

@Component({
    selector: 'app-ticket-create',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        InputTextModule,
        InputTextareaModule,
        FieldsetModule, 
        ButtonModule, 
        DropdownModule,
        InputNumberModule,
        InputGroupModule,
        InputGroupAddonModule,
        CalendarModule,
        InputTextareaModule,
        EditorModule,
        ToggleButtonModule,
        TableModule
    ],
    templateUrl: './ticket-create.component.html',
    styleUrl: './ticket-create.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [MessageService]
})
export class TicketCreateComponent {

    currency : string = environment.instanceParams.currency;


    @Input({required: true})
    eventId !: string;

    @Input({required: false})
    ticket : Ticket | undefined;

    @Output()
    closeSidebar = new EventEmitter<Ticket>();

    ticketForm !: FormGroup;
    saveSubscription : Subscription | undefined;


    constructor(
        private ticketService : TicketService,
    ) { }

    ngOnInit(): void {
        this.ticketForm = new FormGroup({
            code : new FormControl<string | undefined>(undefined, [Validators.required, Validators.maxLength(10)]),
            label : new FormControl<string | undefined>(undefined, [Validators.required, Validators.maxLength(100)]),
            quantity : new FormControl<number | undefined>(1, [Validators.required]),
            price : new FormControl<number | undefined>(undefined, [Validators.required]),
            transactionFeesSupported : new FormControl<boolean>(false),
            startDateOfSales : new FormControl<Date | undefined>(undefined, [Validators.required]),
            endDateOfSales : new FormControl<Date | undefined>(undefined, [Validators.required]),
            minimumTicketQuantityPerOrder : new FormControl<number | undefined>(1),
            maximumTicketQuantityPerOrder : new FormControl<number | undefined>(3),
            details : new FormControl<string | undefined>(undefined, Validators.maxLength(500)),
            refundable : new FormControl<boolean>(false),
            refundPolicy : new FormControl<string | undefined>(undefined, Validators.maxLength(5000)),
        }, {validators : [laterDateValidator]});
    }

    ngOnDestroy(): void {
        if(this.saveSubscription)
        this.saveSubscription.unsubscribe();
    }

    ngOnChanges(changes : SimpleChanges) {
        if(changes['ticket']){
            this.initTicketFormIfPassedAsInput();
        }
    }

    initTicketFormDefaultValues(){
        this.transactionFeesSupported?.setValue(false);
        this.refundable?.setValue(false);
        this.minimumTicketQuantityPerOrder?.setValue(1);
        this.maximumTicketQuantityPerOrder?.setValue(3);
    }

    initTicketFormIfPassedAsInput(){
        console.log(this.ticket)
        if(this.ticket){
            this.ticketForm.patchValue(this.ticket);
            this.startDateOfSales?.setValue(new Date(this.ticket.startDateOfSales!));
            this.endDateOfSales?.setValue(new Date(this.ticket.endDateOfSales!));
            this.transactionFeesSupported?.setValue(this.ticket.transactionFeesSupported);
            this.refundable?.setValue(this.ticket.refundable);
        }
    }

    onRefundableChange(event : ToggleButtonChangeEvent){
        this.refundable?.setValue(event.checked);
    }

    onTransactionFeesSupportedChange(event : ToggleButtonChangeEvent){
        this.transactionFeesSupported?.setValue(event.checked);
    }

    submit(){
        let ticket : Ticket = this.prepareObjectToSubmit();
        (this.ticket) ? this.update(ticket) : this.save(ticket);

        this.ticketForm.reset();
        this.initTicketFormDefaultValues();
        this.closeSidebar.emit(ticket);
    }

    prepareObjectToSubmit() : Ticket{
        let ticket : Ticket = this.ticketForm.value;
        ticket.startDateOfSales = this.ticketForm.get('startDateOfSales')?.value?.toISOString();
        ticket.endDateOfSales = this.ticketForm.get('endDateOfSales')?.value?.toISOString();
        ticket.eventId = this.eventId;
        ticket.id = this.ticket?.id as string;
        return ticket;
    }

    save(ticket : Ticket){
        this.ticketService.save(ticket).subscribe();
    }

    update(ticket : Ticket){
        console.log(ticket);
        this.ticketService.update(ticket).subscribe();
    }

    cancel(){
        this.ticketForm.reset();
        this.initTicketFormDefaultValues();
        this.closeSidebar.emit();
    }





    get code() {
        return this.ticketForm.get('code');
    }

    get label() {
        return this.ticketForm.get('label');
    }

    get quantity() {
        return this.ticketForm.get('quantity');
    }

    get price() {
        return this.ticketForm.get('price');
    }

    get transactionFeesSupported() {
        return this.ticketForm.get('transactionFeesSupported');
    }   

    get startDateOfSales() {
        return this.ticketForm.get('startDateOfSales');
    }

    get endDateOfSales() {
        return this.ticketForm.get('endDateOfSales');
    }

    get minimumTicketQuantityPerOrder() {
        return this.ticketForm.get('minimumTicketQuantityPerOrder');
    }

    get maximumTicketQuantityPerOrder() {
        return this.ticketForm.get('maximumTicketQuantityPerOrder');
    }

    get description() {
        return this.ticketForm.get('description');
    }

    get refundable() {
        return this.ticketForm.get('refundable');
    }

    get refundPolicy() {
        return this.ticketForm.get('refundPolicy');
    }



}
