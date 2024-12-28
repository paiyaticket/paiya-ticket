import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
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
import { AgendaUpdateComponent } from './agenda/agenda-update/agenda-update.component';
import { OnlinePlatform } from '@enumerations/online-platform';
import { EVENT_CATEGORY_OPTIONS } from '@datas/event-category.data';







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
        AgendaListComponent,
        AgendaCreateComponent,
        AgendaUpdateComponent,
        FaqCreateComponent,
        FaqListComponent,
        AvatarModule,
        AvatarGroupModule,
        InputGroupModule,
        InputGroupAddonModule,
        GalleriaModule,
    ],
    templateUrl: './my-event-create.component.html',
    styleUrl: './my-event-create.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [DialogService]
})
export class MyEventCreateComponent implements OnInit, OnDestroy {

    visible: boolean = false;
    displayAgendaCreateForm : boolean = false;
    displayAgendaUpdateForm : boolean = false;
    timeslotToUpdate : TimeSlot | undefined;
    indexOfTimeslotToUpdate : number | undefined;
    displayFaqForm : boolean = false;
    eventSubscription : Subscription | undefined;
    createEventSubscription : Subscription | undefined;
    updateEventSubscription : Subscription | undefined;
    auth : Auth | undefined;
    eventForm !: FormGroup;
    selectedEventType : EventType | undefined = EventType.SINGLE_EVENT;
    selectedVenueType : VenueType | undefined = VenueType.FACE_TO_FACE;
    galleriaImages : any[] | undefined;
    defaultGalleriaImages : any[] = [
        {
            source: '../../../../../assets/layout/images/galleria/cover1.jpg',
            thumbnail: '../../../../../assets/layout/images/galleria/cover1.jpg',
            alt: 'Description for Image 1',
            title: 'Title 1'
        },
        {
            source: '../../../../../assets/layout/images/galleria/cover2.jpg',
            thumbnail: '../../../../../assets/layout/images/galleria/cover2.jpg',
            alt: 'Description for Image 2',
            title: 'Title 2'
        },
        {
            source: '../../../../../assets/layout/images/galleria/cover3.jpg',
            thumbnail: '../../../../../assets/layout/images/galleria/cover3.jpg',
            alt: 'Description for Image 3',
            title: 'Title 3'
        }
    ];
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
    onlinePlatformOptions : any[] = [
        {'label' : $localize `Discord`, 'value' : OnlinePlatform.DISCORD},
        {'label' : $localize `Google Meet`, 'value' : OnlinePlatform.GOOGLE_MEET},
        {'label' : $localize `Teams`, 'value' : OnlinePlatform.MICROSOFT_TEEMS},
        {'label' : $localize `Slack`, 'value' : OnlinePlatform.SLACK},
        {'label' : $localize `Télégram`, 'value' : OnlinePlatform.TELEGRAM},
        {'label' : $localize `Tiktok`, 'value' : OnlinePlatform.TIKTOK},
        {'label' : $localize `Zoom`, 'value' : OnlinePlatform.ZOOM},
    ];
    eventCategoryOptions : any[] = EVENT_CATEGORY_OPTIONS;

    @Input() eventId : string | undefined;
    @ViewChild("agendaList") agendaList : AgendaListComponent | undefined;
    @ViewChild("agendaForm") agendaForm !: AgendaCreateComponent;


    ref: DynamicDialogRef | undefined;
    
    constructor(private route : ActivatedRoute,
                private router : Router, 
                private cdr : ChangeDetectorRef,
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
            summary : new FormControl<string | undefined>('', [Validators.maxLength(1000)]),
            description : new FormControl<string | undefined>(undefined, Validators.maxLength(10000)),
            publicationDate : new FormControl<string | undefined>(undefined),
            visibility : new FormControl<boolean>(false),
            eventPageLanguage : new FormControl<string | undefined>(undefined),
            startTime : new FormControl<Date | undefined>(undefined, [Validators.required]),
            endTime : new FormControl<Date | undefined>(undefined, [Validators.required]),
            timeZone : new FormControl<Intl.DateTimeFormatOptions['timeZone'] | undefined>(undefined),
            physicalAddress : new FormGroup({
                location : new FormControl<string | undefined>(undefined),
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
            onlineAddress : new FormGroup({
                onlinePlatform : new FormControl<OnlinePlatform | undefined>(undefined),
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
                this.eventForm.patchValue(event);
                if(event.startTime && event.endTime && event.timeZone){
                    this.eventForm.patchValue({
                        startTime : new Date(event.startTime),
                        endTime : new Date(event.endTime)
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
                this.initGalleria();
            }
        });
    }





    /* *********************** */
    //   IMAGE COVER GALLERIA   //
    /* *********************** */

    initGalleria(){
        this.galleriaImages = (this.imageCovers) ? this.imageCovers?.value : this.defaultGalleriaImages;
        return this.galleriaImages;
    }







    /* ***************************** */
    // CHANGEMENT D'ÉTATS DES CHAMPS //
    /* ***************************** */

    onEventTypeChange(event: any){
        this.selectedEventType = event.value;
    }

    onVenueTypeChange(event: any){
        this.selectedVenueType = event.value;
        if(this.selectedVenueType === VenueType.VIRTUAL){
            this.physicalAddress?.reset();
        } else {
            this.onlineAddress?.reset();
        }
    }

    /**
     * Close the agendaForm, Add emited timeslot in agenda array and make a partial update of the Event.
     * @param addedTimeSlot 
     */
    handleTimeSlotAdded(addedTimeSlot : TimeSlot){
        this.agenda?.value.push(addedTimeSlot); 
        let event = this.eventForm.value as Event;
        this.partialUpdateEvent(event, $localize `Agenda mis à jour.`);
        this.displayAgendaCreateForm = false;
        this.cdr.detectChanges();
    }

    showAgendaUpdateForm(event : any){
        this.timeslotToUpdate = event.timeSlot;
        this.indexOfTimeslotToUpdate = event.index;
        this.displayAgendaUpdateForm = true;
        this.cdr.detectChanges();
    }

    showAgendaCreateForm(){
        this.displayAgendaCreateForm = true;
    }

    dismissAgendaCreateForm(){
        this.displayAgendaCreateForm = false;
    }

    dismissAgendaUpdateForm(){
        this.displayAgendaUpdateForm = false;
    }


    handleTimeSlotUpdated(e : any){
        let index : number = e.index;
        let updatedTimeSlot : TimeSlot = e.timeSlot;
        if(this.agenda)
        this.agenda.value[index] = updatedTimeSlot;

        let event = this.eventForm.value as Event;
        this.partialUpdateEvent(event, $localize `Agenda mis à jour.`);
        this.displayAgendaUpdateForm = false;
        this.cdr.detectChanges();
    }

    handleTimeSlotRemoved(removedTimeSlot : TimeSlot){
        let index = this.agenda?.value.indexOf(removedTimeSlot);
        this.agenda?.value.splice(index, 1);
        let event = this.eventForm.value as Event;
        console.log(event);
        this.partialUpdateEvent(event, $localize `Agenda mis à jour.`);
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
        event.onlineAddress = this.onlineAddress?.value;
        event.physicalAddress = this.physicalAddress?.value;
        event.eventOrganizer = this.eventOrganizer?.value;
        event.agenda = this.agenda?.value;
        event.faq = this.faq?.value;
        event.imageCovers = this.imageCovers?.value;
        event.startTime = this.startTime?.value.toISOString();
        event.endTime = this.endTime?.value.toISOString();
        event.timeZone = (this.timeZone?.value) ? this.timeZone?.value : Intl.DateTimeFormat().resolvedOptions().timeZone;
        event.timeZoneOffset = this.startTime?.value.getTimezoneOffset();
        event.owner = (this.currentUser?.email) ? this.currentUser?.email : undefined;

        console.log(event);
        return event;
    }

    partialUpdateEvent(event : Event, successMessage ?: string){
        if(this.eventId){
            event.id = this.eventId;
        }
        
        this.updateEventSubscription = this.eventService.update(event).subscribe({
            next : (event) => {
                if(successMessage)
                    this.messageService.add({ severity: 'success', summary: $localize`Succès`, detail: successMessage });
            },
            error : (error) => {
                this.messageService.add({ severity: 'error', summary: $localize`Erreur`, detail: $localize`Un problème est survenu lors de la mise a jour de l'événement.` });
                console.log(error);
            }
            
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
            this.router.navigate(['organizer-mode']).then(() => {
                this.router.navigate(['organizer-mode','my-events','my-event-configuration',eventId,'details']);
            });
        } else{
            this.router.navigate(['my-events','my-event-configuration',eventId,'details'], {relativeTo: this.route});
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

    get onlineAddress(){
        return this.eventForm.get('onlineAddress');
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
