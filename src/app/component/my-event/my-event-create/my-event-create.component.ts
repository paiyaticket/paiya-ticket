import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { PhysicalAddress } from '../../../models/physical-address';
import { OnlineAddress } from '../../../models/online-address';
import { EventOrganizer } from '../../../models/event-organizer';
import { CashAccount } from '../../../models/cash-account';
import { SelectButtonModule } from 'primeng/selectbutton';
import { EventType } from '../../../enumerations/event-type';
import { CalendarModule } from 'primeng/calendar';
import { MessagesModule } from 'primeng/messages';
import { Message } from 'primeng/api/message';
import { laterDateValidator } from '../../../validators/laterDateValidator';
import { PanelModule } from 'primeng/panel';
import { Country } from '../../../models/country';
import { COUNTRIES } from '../../../data/countries.data';

@Component({
    selector: 'app-my-event-create',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        InputTextModule,
        InputTextareaModule,
        InputMaskModule,
        ReactiveFormsModule,
        FieldsetModule, 
        ButtonModule, 
        DropdownModule,
        SelectButtonModule,
        CalendarModule,
        MessagesModule,
        PanelModule
    ],
    templateUrl: './my-event-create.component.html',
    styleUrl: './my-event-create.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class MyEventCreateComponent implements OnInit {

    auth : Auth | undefined;
    eventForm !: FormGroup;
    eventTypeOptions : any[] = [
        {'label' : $localize `Evènement Unique`, 'value' : EventType.SINGLE_EVENT, 'description' : $localize `Évènement qui ne se deroule qu'une seule fois`},
        {'label' : $localize `Evènement recurrent`, 'value' : EventType.RECURRING_EVENT, 'description' : $localize `Événement qui se deroule plusieurs fois`}
    ];

    selectedEventType : EventType | undefined = EventType.SINGLE_EVENT;
    messages!: Message[];
    multipleEventsMessage : string = $localize `Vous définirez les dates dans la prochaine étape. Remplissez les autres champs et continuez.`;
    countries : Country[] = COUNTRIES;


    constructor(private router : Router){}

    ngOnInit(): void {

        this.messages = [{ severity: 'info', detail: this.multipleEventsMessage }];

        this.eventForm = new FormGroup({
            title : new FormControl<string | undefined>('', [Validators.required]),
            eventType : new FormControl<EventType | undefined>(EventType.SINGLE_EVENT),
            eventCategory : new FormControl<string | undefined>(undefined),
            tags : new FormControl<string[]>([]),
            imageCover : new FormControl<string | undefined>(undefined),
            summary : new FormControl<string | undefined>('', [Validators.maxLength(150)]),
            description : new FormControl<string | undefined>(undefined),
            publicationDate : new FormControl<string | undefined>(undefined),
            visibility : new FormControl<boolean>(false),
            eventPageLanguage : new FormControl<string | undefined>(undefined),
            date : new FormControl<Date | undefined>(undefined, [Validators.required]),
            startTime : new FormControl<Date | undefined>(undefined, [Validators.required]),
            endTime : new FormControl<Date | undefined>(undefined, [Validators.required]),
            timeZone : new FormControl<string | undefined>(undefined),
            physicalAddress : new FormGroup({
                location : new FormControl<string | undefined>(undefined, [Validators.required] ),
                locationIndication : new FormControl<string | undefined>(undefined, [Validators.maxLength(300)]),
                street : new FormControl<string | undefined>(undefined),
                streetNumber : new FormControl<string | undefined>(undefined),
                town : new FormControl<string | undefined>(undefined),
                postalCode : new FormControl<string | undefined>(undefined, [Validators.maxLength(15)]),
                country : new FormControl<string | undefined>(undefined),
                state : new FormControl<string | undefined>(undefined),
                longitude : new FormControl<string | undefined>(undefined),
                latitude : new FormControl<string | undefined>(undefined),
            } ),
            onlineAdresse : new FormControl<OnlineAddress | undefined>(undefined),
            eventOrganizer : new FormControl<EventOrganizer | undefined>(undefined),
            cashAccounts : new FormControl<CashAccount[] | undefined>([]),
        }, {validators : [laterDateValidator]})
    }

    onEventTypeChange(event: any){
        this.selectedEventType = event.value;
        console.log(this.selectedEventType);
    }

    onDateSelect(event: Date){
        console.log(event);
    }

    onTimeSelect(event: any){
        console.log(event);
        if(this.eventForm.get('startTime')?.value && this.eventForm.get('endTime')?.value){
            console.log(this.eventForm.getError('laterDate'));
        }
    }


    submit(){
        
    }


    goToEventListPage(){
        this.router.navigate(['/my-events']);
    }

    get title(){
        return this.eventForm.get('title');
    }

    get eventType(){
        return this.eventForm.get('eventType');
    }

    get eventCategory(){
        return this.eventForm.get('eventCategory');
    }

    get tags(){
        return this.eventForm.get('tags');
    }

    get imageCover(){
        return this.eventForm.get('imageCover');
    }

    get summary(){
        return this.eventForm.get('summary');
    }

    get description(){
        return this.eventForm.get('description');
    }

    get publicationDate(){
        return this.eventForm.get('publicationDate');
    }

    get visibility(){
        return this.eventForm.get('visibility');
    }

    get eventPageLanguage(){
        return this.eventForm.get('eventPageLanguage');
    }

    get date(){
        return this.eventForm.get('date');
    }

    get startTime(){
        return this.eventForm.get('startTime');
    }

    get endTime(){
        return this.eventForm.get('endTime');
    }

    get timeZone(){
        return this.eventForm.get('timeZone');
    }

    get physicalAddress(){
        return this.eventForm.get('physicalAddress');
    }

    get location(){
        return this.eventForm.get('location');
    }

    get onlineAdresse(){
        return this.eventForm.get('onlineAdresse');
    }

    get eventOrganizer(){
        return this.eventForm.get('eventOrganizer');
    }

    get cashAccounts(){
        return this.eventForm.get('cashAccounts');
    }


}
