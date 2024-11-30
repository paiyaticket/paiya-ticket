import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { environment } from '../../../../../../environments/environment';
import { CalendarModule } from 'primeng/calendar';
import { laterDateValidator } from '../../../../../validators/laterDateValidator';
import { EditorModule } from 'primeng/editor';
import { ToggleButtonChangeEvent, ToggleButtonModule } from 'primeng/togglebutton';
import { TableModule } from 'primeng/table';
// @ts-ignore
import { Ticket } from '../../../../../models/ticket';
import { TicketService } from '../../../../../service/ticket.service';
import { Subscription } from 'rxjs';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TicketType } from '../../../../../enumerations/ticket-type';
import { MessagesModule } from 'primeng/messages';

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
        TableModule,
        SelectButtonModule,
        MessagesModule
    ],
    templateUrl: './ticket-create.component.html',
    styleUrl: './ticket-create.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
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
    ticketTypeOptions : any[] = [
        {'label' : $localize `Ticket Payant`, 'value' : TicketType.PAID, 'description' : $localize `Créer un ticket pour lequel les gens doivent payer.`},
        {'label' : $localize `Ticket Gratuit`, 'value' : TicketType.FREE, 'description' : $localize `Créer un ticket pour lequel personne n'a à payer.`},
        {'label' : $localize `Ticket à Prix libre (Don)`, 'value' : TicketType.GIFT, 'description' : $localize `Laisser les gens payer le montant qu'ils souhaitent pour leur ticket.`}
    ];


    constructor(
        private ticketService : TicketService,
        private cdRef : ChangeDetectorRef,
    ) { }

    ngOnInit(): void {
        this.ticketForm = new FormGroup({
            code : new FormControl<string | undefined>(undefined, [Validators.required, Validators.maxLength(10)]),
            label : new FormControl<string | undefined>(undefined, [Validators.required, Validators.maxLength(100)]),
            quantity : new FormControl<number | undefined>(1, [Validators.required]),
            ticketType : new FormControl<TicketType>(TicketType.PAID),
            price : new FormControl<number | undefined>(0, [Validators.required]),
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
        this.ticketType?.setValue(TicketType.PAID);
        this.quantity?.setValue(1);
        this.price?.setValue(0)
        this.transactionFeesSupported?.setValue(false);
        this.refundable?.setValue(false);
        this.minimumTicketQuantityPerOrder?.setValue(1);
        this.maximumTicketQuantityPerOrder?.setValue(3);
    }

    initTicketFormIfPassedAsInput(){
        if(this.ticket){
            this.ticketForm.patchValue(this.ticket);
            this.startDateOfSales?.setValue(new Date(this.ticket.startDateOfSales!));
            this.endDateOfSales?.setValue(new Date(this.ticket.endDateOfSales!));
            this.transactionFeesSupported?.setValue(this.ticket.transactionFeesSupported);
            this.refundable?.setValue(this.ticket.refundable);
        }
    }

    onTicketTypeChange(event : any){
        this.ticketType?.setValue(event.value);
        
        if(event.value === TicketType.PAID || event.value === TicketType.GIFT) {
            this.price?.enable();
            this.refundable?.enable();
            this.transactionFeesSupported?.enable();
        }

        if(event.value === TicketType.FREE){
            this.price?.disable();
            this.refundable?.disable();
            this.transactionFeesSupported?.disable();
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

    get ticketType() {
        return this.ticketForm.get('ticketType');
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
