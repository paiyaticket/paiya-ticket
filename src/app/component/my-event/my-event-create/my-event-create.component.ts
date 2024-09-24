import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Auth, getAuth, User } from '@angular/fire/auth';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
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
import { COUNTRIES } from '../../../data/countries-old.data';
import { EditorModule } from 'primeng/editor';
import { CardModule } from 'primeng/card';
import { GalleriaModule } from 'primeng/galleria';
import { ChipsModule } from 'primeng/chips';
import { VenueType } from '../../../enumerations/venueType';
import { Event } from '../../../models/event';
import { UserData } from '../../../models/user-data';
import { EventService } from '../../../service/event.service';

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
        PanelModule,
        EditorModule,
        CardModule,
        GalleriaModule,
        ChipsModule
    ],
    templateUrl: './my-event-create.component.html',
    styleUrl: './my-event-create.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class MyEventCreateComponent implements OnInit {

    // TODO : donner la possibilité à l'utilisateur de préciser le FUSEAU HORRAIRE de l'evènement;
    // TODO : donner la possibilité à l'utilisateur de préciser la LANGUE de l'evènement;
    // TODO : donner la possibilité à l'utilisateur de télécharger 3 photos de couverture pour son evènement.

    auth : Auth | undefined;
    eventForm !: FormGroup;
    selectedEventType : EventType | undefined = EventType.SINGLE_EVENT;
    selectedVenueType : VenueType | undefined = VenueType.FACE_TO_FACE;
    messages!: Message[];
    countries : Country[] = COUNTRIES;
    currentUser : User | null = null;
    multipleEventsMessage : string = $localize `Vous définirez les dates dans la prochaine étape. Remplissez les autres champs et continuez.`;
    eventTypeOptions : any[] = [
        {'label' : $localize `Evènement Unique`, 'value' : EventType.SINGLE_EVENT, 'description' : $localize `Évènement qui ne se deroule qu'une seule fois`},
        {'label' : $localize `Evènement recurrent`, 'value' : EventType.RECURRING_EVENT, 'description' : $localize `Événement qui se deroule plusieurs fois`}
    ];
    venueTypeOptions : any[] = [
        {'label' : $localize `Lieu`, 'value' : VenueType.FACE_TO_FACE},
        {'label' : $localize `Évènement en ligne`, 'value' : VenueType.VIRTUAL}
    ];

    constructor(private router : Router, private eventService : EventService){}

    ngOnInit(): void {
        this.auth = getAuth();
        this.currentUser = this.auth?.currentUser;

        this.messages = [{ severity: 'info', detail: this.multipleEventsMessage }];

        this.eventForm = new FormGroup({
            title : new FormControl<string | undefined>('', [Validators.required]),
            eventType : new FormControl<EventType | undefined>(EventType.SINGLE_EVENT),
            venueType : new FormControl<VenueType | undefined>(VenueType.FACE_TO_FACE),
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
            }),
            onlineAdresse : new FormGroup({
                onlinePlatform : new FormControl<string | undefined>(undefined),
                link : new FormControl<string | undefined>(undefined),
            }),
            eventOrganizer : new FormControl<EventOrganizer | undefined>(undefined),
            cashAccounts : new FormControl<CashAccount[] | undefined>([]),
        }, {validators : [laterDateValidator]})
    }

    onEventTypeChange(event: any){
        this.selectedEventType = event.value;
    }

    onVenueTypeChange(event: any){
        this.selectedVenueType = event.value;
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
        let event : Event = this.eventForm.value as Event;
        
        event.date = this.eventForm.get('date')?.value?.toISOString().split('T')[0];
        event.startTime = this.eventForm.get('startTime')?.value?.toISOString().split('T')[1].split('.')[0];
        event.endTime = this.eventForm.get('endTime')?.value?.toISOString().split('T')[1].split('.')[0];
        event.timeZone = (this.eventForm.get('timeZone')?.value) ? this.eventForm.get('timeZone')?.value : Intl.DateTimeFormat().resolvedOptions().timeZone;
        event.owner = (this.currentUser?.email) ? this.currentUser?.email : undefined;

        // this.goToEventListPage();
        this.eventService.create(event).subscribe((event) => console.log(event));
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

    get venueType(){
        return this.eventForm.get('venueType');
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
