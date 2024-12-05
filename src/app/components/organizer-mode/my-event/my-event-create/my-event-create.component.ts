import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Auth, getAuth, User } from '@angular/fire/auth';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { EventOrganizer } from '@models/event-organizer';
import { CashAccount } from '@models/cash-account';
import { SelectButtonModule } from 'primeng/selectbutton';
import { EventType } from '@enumerations/event-type';
import { CalendarModule } from 'primeng/calendar';
import { MessagesModule } from 'primeng/messages';
import { Message } from 'primeng/api/message';
import { laterDateValidator } from '@validators/laterDateValidator';
import { PanelModule } from 'primeng/panel';
import { COUNTRIES } from '@datas/countries.data';
import { EditorModule } from 'primeng/editor';
import { CardModule } from 'primeng/card';
import { GalleriaModule } from 'primeng/galleria';
import { ChipsModule } from 'primeng/chips';
import { VenueType } from '@enumerations/venueType';
import { EventService } from '@services/event.service';
import { Subscription } from 'rxjs';
import { FilePondModule } from 'ngx-filepond';
import { ImageCover } from '@models/image-cover';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { TimeSlot } from '@models/time-slot';
import { Question } from '@models/question';
import { AgendaCreateComponent } from './agenda/agenda-create/agenda-create.component';
import { SidebarModule } from 'primeng/sidebar';
import { AgendaListComponent } from './agenda/agenda-list/agenda-list.component';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { FaqCreateComponent } from './faq/faq-create/faq-create.component';
import { FaqListComponent } from './faq/faq-list/faq-list.component';
import { EventOrganizerService } from '@services/event-organizer.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
// @ts-ignore
import { Country } from '@models/country';
// @ts-ignore
import { Event } from '@models/event';
import { ImageCoverComponent } from './image-cover/image-cover.component';
import * as _ from 'lodash-es';







@Component({
    selector: 'app-my-event-create',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
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
        ChipsModule,
        FilePondModule,
        DialogModule,
        SidebarModule,
        AgendaCreateComponent,
        AgendaListComponent,
        FaqCreateComponent,
        FaqListComponent,
        AvatarModule,
        AvatarGroupModule,
        InputGroupModule,
        InputGroupAddonModule
    ],
    templateUrl: './my-event-create.component.html',
    styleUrl: './my-event-create.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [DialogService]
})
export class MyEventCreateComponent implements OnInit, OnDestroy {

    visible: boolean = false;
    displayAgendaForm : boolean = false;
    displayFaqForm : boolean = false;
    eventSubscription : Subscription | undefined;
    createEventSubscription : Subscription | undefined;
    updateEventSubscription : Subscription | undefined;
    auth : Auth | undefined;
    eventForm !: FormGroup;
    selectedEventType : EventType | undefined = EventType.SINGLE_EVENT;
    selectedVenueType : VenueType | undefined = VenueType.FACE_TO_FACE;
    showGalleriaPlaceholder : boolean = true;
    defaultImage : ImageCover | undefined;
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

    @Input() eventId : string | undefined;
    @ViewChild("agendaList") agendaList : AgendaListComponent | undefined;

    ref: DynamicDialogRef | undefined;
    
    constructor(private route : ActivatedRoute,
                private router : Router, 
                private eventService : EventService,
                private eventOrganizerService : EventOrganizerService,
                private messageService: MessageService,
                private dialogService: DialogService){
                }
    
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
            imageCovers : new FormControl<ImageCover[]>([]),
            videoLink : new FormControl<string | undefined>(undefined),
            summary : new FormControl<string | undefined>('', [Validators.maxLength(150)]),
            description : new FormControl<string | undefined>(undefined),
            publicationDate : new FormControl<string | undefined>(undefined),
            visibility : new FormControl<boolean>(false),
            eventPageLanguage : new FormControl<string | undefined>(undefined),
            startTime : new FormControl<Date | undefined>(undefined, [Validators.required]),
            endTime : new FormControl<Date | undefined>(undefined, [Validators.required]),
            timeZone : new FormControl<Intl.DateTimeFormatOptions['timeZone'] | undefined>(undefined),
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
            cashAccounts : new FormControl<CashAccount[]>(new Array<CashAccount>()),
            agenda : new FormControl<TimeSlot[]>(new Array<TimeSlot>()),
            faq : new FormControl<Question[]>(new Array<Question>()),
        }, {validators : [laterDateValidator]});

        // init event informations if the eventId is passed. 
        this.initEventIfIdIsPassed();

        // init eventOrganizer if organizerId is passed by queryParams.
        this.initOrganizerIfIdIsPassed();

    }

    initEventIfIdIsPassed(){
        if(this.eventId){
            this.eventSubscription = this.eventService.findById(this.eventId).subscribe((event) => {
                event.agenda = this.transformAgendaTimeSlotsIntoZonedDateTime(event.agenda as TimeSlot[], event.timeZone);
                this.eventForm.patchValue(event);
                // ce bout de code pourrait être amélioré en donnant a startTime et endTime le type "string | Date" au lieu 
                // de string uniquement.
                if(event.startTime && event.endTime && event.timeZone){
                    this.eventForm.patchValue({
                        startTime : this.utcDateToZonedDateTime(event.startTime, event.timeZone),
                        endTime : this.utcDateToZonedDateTime(event.endTime, event.timeZone)
                    });
                }
            });
        }
    }

    initOrganizerIfIdIsPassed(){
        let organizerId = this.route.snapshot.queryParamMap.get('organizerId');
        if(organizerId !== null && organizerId !== this.currentUser?.email){
            this.eventOrganizerService.findById(organizerId).subscribe((organizer) => {
                this.eventForm.patchValue({eventOrganizer : organizer});
            });
        } else {
            this.eventOrganizer?.setValue({id : this.currentUser?.email, name : this.currentUser?.displayName});
        }
    }




    /* *********************** */
    //   DEFAULT IMAGE MODAL   //
    /* *********************** */
    showDialog(){
        // open dialog
        this.ref = this.dialogService.open(ImageCoverComponent, { 
            header: 'Charger des images de couverture',
            width: '50vw',
            modal:true,
            closable: false,
            breakpoints: {
                '960px': '75vw',
                '640px': '90vw',
            },
            data: {
                imageCovers : this.imageCovers?.value,
                eventId : this.eventId
            }
        })

        // close dialog
        this.ref.onClose.subscribe((images : ImageCover[]) => {
            if(images){
                this.imageCovers?.setValue(images);
                this.partialUpdateEvent(this.eventForm.value as Event);
            }
        });
    }

    makeImageDefault(index : number){
        let images = this.imageCovers?.value;

        if(images[index]){
            images[index].byDefault = true;
            this.defaultImage = images[index];
            for(let i = 0; i < images.length; i++) {
                if(i !== index){
                    images[i].byDefault = false;
                }
            }
            this.eventForm.patchValue({imageCovers : images});
        }
    }








    /* ***************************** */
    // CHANGEMENT D'ÉTATS DES CHAMPS //
    /* ***************************** */

    onEventTypeChange(event: any){
        this.selectedEventType = event.value;
    }

    onVenueTypeChange(event: any){
        this.selectedVenueType = event.value;
    }

    handleTimeSlotAdded(event : any){
        let tsTab : TimeSlot[] = this.agenda?.value || [];
        tsTab.push(event);
        this.agenda?.setValue(tsTab); 
        if(this.agendaList){
            this.agendaList.timeSlots = tsTab;
        }
        this.displayAgendaForm = false;
    }

    handleTimeSlotRemoved(event : any){
        let tsTab : TimeSlot[] = this.agenda?.value || [];
        let index = tsTab.indexOf(event);
        tsTab.splice(index, 1);
        this.agenda?.setValue(tsTab)
    }


    removeTimeSlot(index : number){
        this.agenda?.value.splice(index, 1);
    }

    removeAgendaSection(){
        return this.agenda?.setValue([]);
    }

    handleQuestionAdded(event : Question){
        let faqTab : Question[] = this.faq?.value || [];
        faqTab.push(event);
        this.faq?.setValue(faqTab);
        this.displayFaqForm = false;
    }


    handleQuestionRemoved(event : Question){
        let faqTab : Question[] = this.faq?.value || [];
        let index = faqTab.indexOf(event);
        faqTab.splice(index, 1);
        this.faq?.setValue(faqTab);
    }

    removeFaqSection(){
        return this.faq?.setValue([]);
    }




    

    
        


    /* ***************************** */
    //        FORM DATA PROCESS      //
    /* ***************************** */
    submit(){
        let event : Event = this.preSubmit();
        if(this.eventId){
            this.updateEvent(event);
        } else {
            this.createEvent(event);
        }
    }

    preSubmit() : Event {
        let event : Event = this.eventForm.value as Event;
        event.agenda = this.transformAgendaTimeSlotsIntoUtcDate(event);
        event.startTime = this.startTime?.value.toISOString();
        event.endTime = this.endTime?.value.toISOString();
        event.timeZone = (this.timeZone?.value) ? this.timeZone?.value : Intl.DateTimeFormat().resolvedOptions().timeZone;
        event.timeZoneOffset = this.startTime?.value.getTimezoneOffset();
        event.owner = (this.currentUser?.email) ? this.currentUser?.email : undefined;
        return event;
    }


    transformAgendaTimeSlotsIntoUtcDate(event : Event) : TimeSlot[]{
        return this.agenda?.value.map((timeSlot : TimeSlot) => {
            if(timeSlot.startTime instanceof Date)
                timeSlot.startTime = timeSlot.startTime.toISOString();
            if(timeSlot.endTime instanceof Date)
                timeSlot.endTime = timeSlot.endTime.toISOString();
            return timeSlot;
        });
    }

    transformAgendaTimeSlotsIntoZonedDateTime(agenda : TimeSlot[], timeZone : string | undefined) : TimeSlot[]{
        if(!timeZone)
            timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        return agenda.map((timeSlot : TimeSlot) => {
            if(timeSlot.startTime)
                timeSlot.startTime = this.utcDateToZonedDateTime(timeSlot.startTime as string, timeZone);
            if(timeSlot.endTime)
                timeSlot.endTime = this.utcDateToZonedDateTime(timeSlot.endTime as string, timeZone);
            return timeSlot;
        });
    }

    partialUpdateEvent(event : Event){
        if(this.eventId){
            event.id = this.eventId;
        }
        this.updateEventSubscription = this.eventService.update(event).subscribe(()=>{
            console.log("Event partialy updated");
        });
    }

    updateEvent(event : Event){
        event.id = this.eventId as string;
        this.updateEventSubscription = this.eventService.update(event).subscribe({
            next : (event) => {
                this.messageService.add({ severity: 'success', summary: $localize`Succès`, detail: $localize`Mise a jour réussie.` });
                // this.reloadPageWithEventId(event.id);
            },
            error : (error) => {
                this.messageService.add({ severity: 'error', summary: $localize`Erreur`, detail: $localize`Un problème est survenu lors de la mise a jour de l'événement.` });
                console.log(error);
            }
        });
    }

    createEvent(event : Event){

        this.createEventSubscription = this.eventService.save(event).subscribe({
            next : (event) => {
                this.messageService.add({ severity: 'success', summary: $localize`Succès`, detail: $localize`Création de l'événement réussie.` });
                this.reloadPageWithEventId(event.id);
            },
            error : (error) => {
                this.messageService.add({ severity: 'error', summary: $localize`Erreur`, detail: $localize`Un problème est survenu lors de la création de l'événement.` });
                console.log(error);
            }
        });
    }


    utcDateToZonedDateTime(utcDate : string, timeZone : string) : Date {
        const zonedDateTime = new Date(utcDate).toLocaleString("en-US" , {timeZone: timeZone});
        return new Date(zonedDateTime);
    }

    /**
     * Reload the page depending on if "eventId" is already presente in he URL.
     * If not, the reload goes to "my-event" URI before going to "my-events/my-event-configuration/eventId"
     * in order to pass "eventId" property to the parent component (myEventConfigurationComponent) input.
     * @param eventId 
     */
    reloadPageWithEventId(eventId : string | undefined){
        if(this.route.snapshot.paramMap.get('eventId') === null){
            this.router.navigate(['my-events']).then(() => {
                this.router.navigate(['my-events','my-event-configuration',eventId,'details']);
            });
        } else{
            this.router.navigate(['my-events','my-event-configuration',eventId,'details']);
        }
    }

    goToEventListPage(){
        this.router.navigate(['../my-events'], {relativeTo: this.route});
    }

    ngOnDestroy(): void {
        if(this.eventSubscription){
            this.eventSubscription.unsubscribe();
        }

        if(this.createEventSubscription){
            this.createEventSubscription.unsubscribe();
        }

        if(this.updateEventSubscription){
            this.updateEventSubscription.unsubscribe();
        }
    }















    /* ******************* */
    //        GETTERS      //
    /* ******************* */
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

    get imageCovers(){
        return this.eventForm.get('imageCovers');
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

    get agenda(){
        return this.eventForm.get('agenda');
    }

    get faq(){
        return this.eventForm.get('faq');
    }


}
