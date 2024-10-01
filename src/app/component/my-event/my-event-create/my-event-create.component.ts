import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
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
import { COUNTRIES } from '../../../data/countries.data';
import { EditorModule } from 'primeng/editor';
import { CardModule } from 'primeng/card';
import { Galleria, GalleriaModule } from 'primeng/galleria';
import { ChipsModule } from 'primeng/chips';
import { VenueType } from '../../../enumerations/venueType';
import { Event } from '../../../models/event';
import { EventService } from '../../../service/event.service';
import { Subscription } from 'rxjs';
import { FilePondModule, registerPlugin } from 'ngx-filepond';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import { FileStorageService } from '../../../service/file-storage.service';
import { getDownloadURL } from '@angular/fire/storage';
import { Inplace, InplaceModule } from 'primeng/inplace';
import { Console } from 'console';


registerPlugin(FilePondPluginFileValidateType, FilePondPluginImagePreview);


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
        ChipsModule,
        FilePondModule,
        InplaceModule
    ],
    templateUrl: './my-event-create.component.html',
    styleUrl: './my-event-create.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class MyEventCreateComponent implements OnInit, OnDestroy {

    // TODO : donner la possibilité à l'utilisateur de préciser la LANGUE de l'evènement;

    eventSubscription : Subscription | undefined;
    createEventSubscription : Subscription | undefined;
    updateEventSubscription : Subscription | undefined;
    auth : Auth | undefined;
    eventForm !: FormGroup;
    selectedEventType : EventType | undefined = EventType.SINGLE_EVENT;
    selectedVenueType : VenueType | undefined = VenueType.FACE_TO_FACE;
    showGalleriaPlaceholder : boolean = true;
    images: any[] | undefined;
    placeholderImages: any[] | undefined;
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

    @Input()
    eventId : string | undefined;

    @ViewChild('imageInplace') imageInplace!: Inplace;
    @ViewChild('galleria') galleria!: Galleria;
    @ViewChild('imagesCoverPond') imageCoverPond: any;

    pondOptions = {
        name: 'imagesCoverPond',
        class: 'images-cover-pond',
        multiple: true,
        maxFiles: 5,
        acceptedFileTypes: 'image/jpeg, image/png',
        labelInvalidField: $localize `Ce champ contient des fichiers invalides.`,
        labelIdle: $localize `Glisser & Déposer vos fichiers OU <span class="filepond--label-action"> Cliquez pour sélectionner</span>.`,
        allowReorder: true,
        server : {
            process : (fieldName : string, file : File, metadata : any, load : Function, error : Function, progress : Function, abort : Function, transfer : Function, options : any) => {
                let path = 'repos/'+this.auth?.currentUser?.uid+'/images';
                const uploadTask = this.fileStorageService.uploadFile(file, path);

                uploadTask.on('state_changed', 
                    (snapshot) => {
                        const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        progress(true, snapshot.bytesTransferred, snapshot.totalBytes);
                    }, 
                    (err) => {
                        error(err);
                    }, 
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                            load(downloadURL);
                            this.addImageCover(downloadURL)
                        });
                    }
                );

                return {
                    abort: () => {
                        uploadTask.cancel();
                        abort();
                    },
                };
            }
        }
    };


    constructor(private router : Router, 
                private eventService : EventService,
                private fileStorageService : FileStorageService){}

    ngOnInit(): void {
        this.placeholderImages = [
            {source : 'assets/layout/images/galleria/cover1.jpg'},
            {source : 'assets/layout/images/galleria/cover2.jpg'},
            {source : 'assets/layout/images/galleria/cover3.jpg'},
        ];
        this.images = [];

        this.auth = getAuth();
        this.currentUser = this.auth?.currentUser;
        this.messages = [{ severity: 'info', detail: this.multipleEventsMessage }];

        this.eventForm = new FormGroup({
            title : new FormControl<string | undefined>('', [Validators.required]),
            eventType : new FormControl<EventType | undefined>(EventType.SINGLE_EVENT),
            venueType : new FormControl<VenueType | undefined>(VenueType.FACE_TO_FACE),
            eventCategory : new FormControl<string | undefined>(undefined),
            tags : new FormControl<string[]>([]),
            imageCover : new FormControl<string[]>([]),
            summary : new FormControl<string | undefined>('', [Validators.maxLength(150)]),
            description : new FormControl<string | undefined>(undefined),
            publicationDate : new FormControl<string | undefined>(undefined),
            visibility : new FormControl<boolean>(false),
            eventPageLanguage : new FormControl<string | undefined>(undefined),
            date : new FormControl<Date | undefined>(undefined, [Validators.required]),
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
            cashAccounts : new FormControl<CashAccount[] | undefined>([]),
        }, {validators : [laterDateValidator]});

        // init event informations if the eventId is passed. 
        this.initEventIfIdIsPassed();
    }

    initEventIfIdIsPassed(){
        if(this.eventId){
            this.eventSubscription = this.eventService.findById(this.eventId).subscribe((event) => {
                this.eventForm.patchValue(event);
                if(event.startTime && event.endTime && event.timeZone){
                    this.eventForm.patchValue({
                        date : this.utcDateToZonedDateTime(event.startTime, event.timeZone),
                        startTime : this.utcDateToZonedDateTime(event.startTime, event.timeZone),
                        endTime : this.utcDateToZonedDateTime(event.endTime, event.timeZone)
                    });
                }
                console.log(this.eventForm.value);
            });
        }
    }

    utcDateToZonedDateTime(utcDate : string, timeZone : string) : Date | null{
        const zonedDateTime = new Date(utcDate).toLocaleString("en-US" , {timeZone: timeZone});
        return new Date(zonedDateTime);
    }

    onEventTypeChange(event: any){
        this.selectedEventType = event.value;
    }

    onVenueTypeChange(event: any){
        this.selectedVenueType = event.value;
    }

    pondHandleAddFile(event: any) {
        console.log(event);
    }

    pondHandleRemoveFile(event: any) {
        this.fileStorageService.removeFile(event.file.file, 'repos/'+this.auth?.currentUser?.uid+'/images')
        .then(() => {
            // console.log("BEFOR : "+this.imageCover?.value.length);
            if(this.imageCover?.value)
                this.removeImageCover(event);
            // console.log("AFTER : "+this.imageCover?.value.length);
        })
        .catch((error) => {
            console.log(error);
        });
    }

    // IMAGE INPLACE
    showImageInplace(){
        this.imageInplace.deactivate();
    }

    hideImageInplace(){
        this.imageInplace.activate();
    }


    // IMAGE GALLERIA LISTENER
    removeImageCover(event : any){
        let filter = (value : string, index : number , array : []) => {
            return value.includes(event.file.file.name);
        }
        let index = this.imageCover?.value?.findIndex(filter);
        this.imageCover?.value?.splice(index, 1);
        this.images?.splice(index, 1);
        // this.galleria.value = this.images;
        console.log("images length : "+this.images?.length);
        if(this.images && this.images.length === 0){
            this.showGalleriaPlaceholder = true;
        }
    }

    addImageCover(downloadURL : string){
        this.imageCover?.value?.push(downloadURL);
        this.images?.push({source: downloadURL});
        // this.galleria.value = this.images;
        console.log("images length : "+this.images?.length);
        if(this.images && this.images.length > 0){
            this.showGalleriaPlaceholder = false;
        }
    
    }


    // FORM DATA PROCESS
    submit(){
        let event : Event = this.eventForm.value as Event;
        const startTime : Date = this.mergeDateAndTime(this.date?.value, this.startTime?.value);
        const endTime : Date = this.mergeDateAndTime(this.date?.value, this.endTime?.value);

        event.startTime = startTime.toISOString();
        event.endTime = endTime.toISOString();
        event.timeZone = (this.timeZone?.value) ? this.timeZone?.value : Intl.DateTimeFormat().resolvedOptions().timeZone;
        event.timeZoneOffset = startTime.getTimezoneOffset();
        event.owner = (this.currentUser?.email) ? this.currentUser?.email : undefined;

        if(this.eventId){
            this.updateEvent(event);
        } else {
            this.createEvent(event);
        }
    }

    updateEvent(event : Event){
        event.id = this.eventId;
        this.updateEventSubscription = this.eventService.update(event).subscribe({
            next : (event) => {
                this.reloadPageWithEventId(event.id);
            },
            error : (error) => {
                console.log(error);
            }
        });
    }

    createEvent(event : Event){

        this.createEventSubscription = this.eventService.save(event).subscribe({
            next : (event) => {
                this.reloadPageWithEventId(event.id);
            },
            error : (error) => {
                console.log(error);
            }
        });
    }

    mergeDateAndTime(date : Date, time : Date){
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), time.getHours(), time.getMinutes());
    }

    reloadPageWithEventId(eventId : string | undefined){
        this.router.navigate([`/my-events/${eventId}/details`]);
    }

    goToEventListPage(){
        this.router.navigate(['/my-events']);
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
