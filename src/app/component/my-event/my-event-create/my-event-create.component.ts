import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, Input, OnDestroy, OnInit, PLATFORM_ID, ViewChild, ViewEncapsulation } from '@angular/core';
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
import { GalleriaModule } from 'primeng/galleria';
import { ChipsModule } from 'primeng/chips';
import { VenueType } from '../../../enumerations/venueType';
import { Event } from '../../../models/event';
import { EventService } from '../../../service/event.service';
import { Subscription } from 'rxjs';
import { FilePondModule, registerPlugin } from 'ngx-filepond';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginImageResize from 'filepond-plugin-image-resize';
import FilePondPluginImageTransform from 'filepond-plugin-image-transform';
import { FileStorageService } from '../../../service/file-storage.service';
import { getDownloadURL } from '@angular/fire/storage';
import { Inplace, InplaceModule } from 'primeng/inplace';
import { ImageCover } from '../../../models/image-cover';
import { MessageService } from 'primeng/api';
import { FilePond, FilePondOptions } from 'filepond';





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


    eventSubscription : Subscription | undefined;
    createEventSubscription : Subscription | undefined;
    updateEventSubscription : Subscription | undefined;
    auth : Auth | undefined;
    eventForm !: FormGroup;
    selectedEventType : EventType | undefined = EventType.SINGLE_EVENT;
    selectedVenueType : VenueType | undefined = VenueType.FACE_TO_FACE;
    showGalleriaPlaceholder : boolean = true;
    DEFAULT_IMAGE = '../../../../assets/layout/images/image-placeholder.png';
    images: ImageCover[] = [];
    pondOptions : FilePondOptions | undefined;
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

    @Input() eventId : string | undefined;
    @ViewChild('imageInplace') imageInplace!: Inplace;
    @ViewChild('imageCoverPond') imageCoverPond!: FilePond;

    
    constructor(private router : Router, 
                private eventService : EventService,
                private fileStorageService : FileStorageService,
                private messageService: MessageService,
                @Inject(PLATFORM_ID) private platformId: any){
                    registerPlugin(FilePondPluginFileValidateType, FilePondPluginImagePreview, 
                                    FilePondPluginImageResize, FilePondPluginImageTransform);
                    if (isPlatformBrowser(this.platformId)) {
                        import('filepond-plugin-file-poster').then(m => registerPlugin(m.default));
                    }
                }
    
    ngOnInit(): void {
        this.placeholderImages = [
            {source : 'assets/layout/images/galleria/cover1.jpg'},
            {source : 'assets/layout/images/galleria/cover2.jpg'},
            {source : 'assets/layout/images/galleria/cover3.jpg'},
        ];

        this.pondOptions = {
            name: 'imagesCoverPond',
            allowMultiple: true,
            maxFiles: 10,
            acceptedFileTypes: ['image/jpeg', 'image/png'],
            labelInvalidField: $localize `Ce champ contient des fichiers invalides.`,
            labelIdle: $localize `Glisser & Déposer vos fichiers OU <span class="filepond--label-action"> Cliquez pour sélectionner</span>.`,
            allowReorder: false,
            imagePreviewHeight:300,
            allowImageResize : true,
            imageResizeTargetWidth : 600,
            imageResizeTargetHeight : 300,
            files: [
                {
                    // the server file reference
                    source: 'assets/layout/images/galleria/cover1.jpg',
        
                    // set type to local to indicate an already uploaded file
                    options: {
                        type: 'local',
                    },
                },
            ],
            server : {
                process : (fieldName : string, file : any, metadata : any, load : Function, error : Function, progress : Function, abort : Function, transfer : Function, options : any) => {
                    let path = 'repos/'+this.auth?.currentUser?.uid+'/images';
                    const uploadTask = this.fileStorageService.uploadFile(file as File, path);
    
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
                                let image = new ImageCover;
                                image.source = downloadURL;
                                image.isDefault = false;
                                this.images.push(image);
                                load(downloadURL);
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
            },
        };

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

                this.initImagesIfEventIsLoaded(event);
                
            });
        }
    }

    initImagesIfEventIsLoaded(event : Event){
        if(this.pondOptions && event){
            this.pondOptions.files = [];
            event.imageCovers
            .map((image: { source: any; }) => image.source)
            .forEach((source) => {
                if(source){
                    this.pondOptions?.files?.push({
                        source : source, options : {type : 'local'}
                    });
                }
            });
            console.log("initImagesIfEventIsLoaded : "+this.pondOptions.files.length);
        }
    }

    /*
    initImagesIfEventIsLoaded(){
        this.imageCovers?
        .map((image: { source: any; }) => image.source)
        .forEach((source) => {
            if(source){
                this.imageCoverPond.files.push({
                    source : source, options : {type : 'local'}
                });
            }
        });
    }
        */

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

    // IMAGE INPLACE
    showInplaceContent(){
        if(this.images && this.images.length == 0){
            this.imageInplace.deactivate();
        }
    }

    hideInplaceContent(){
        this.imageInplace.activate();
    }


    // FILEPOND EVENT HANDLERS
    pondHandleReorderFiles(event: any) {
        this.reorderImageCover(event.origin, event.target);
    }

    pondHandleRemoveFile(event: any) {
        this.fileStorageService.removeFile(event.file.file, 'repos/'+this.auth?.currentUser?.uid+'/images')
        .then(() => {
            if(this.imageCovers?.value)
                this.removeImageCover(event);
        })
        .catch((error) => {
            console.log(error);
        });
    }

    reorderImageCover(origin : number, target : number){
        this.images.splice(target, 0, this.images.splice(origin, 1)[0]);
    }

    

    // IMAGE GALLERIA LISTENER
    removeImageCover(event : any){
        let filter = (value : any, index : number , obj : any[]) => {
            return value.source.includes(event.file.file.name);
        }

        let index = this.images.findIndex(filter);
        this.images?.splice(index, 1);

        if(this.images && this.images.length === 1){
            this.showGalleriaPlaceholder = true;
        }
    }    



    // FORM DATA PROCESS
    submit(){
        let event : Event = this.eventForm.value as Event;
        const startTime : Date = this.mergeDateAndTime(this.date?.value, this.startTime?.value);
        const endTime : Date = this.mergeDateAndTime(this.date?.value, this.endTime?.value);

        event.imageCovers = this.images;
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
                this.messageService.add({ severity: 'success', key: "global", summary: $localize`Succès`, detail: $localize`Mise a jour réussie.` });
                this.reloadPageWithEventId(event.id);
            },
            error : (error) => {
                this.messageService.add({ severity: 'error', key: "global", summary: $localize`Erreur`, detail: $localize`Un problème est survenu lors de la mise a jour de l'événement.` });
                console.log(error);
            }
        });
    }

    createEvent(event : Event){

        this.createEventSubscription = this.eventService.save(event).subscribe({
            next : (event) => {
                this.messageService.add({ severity: 'success', key: "global", summary: $localize`Succès`, detail: $localize`Création de l'événement réussie.` });
                this.reloadPageWithEventId(event.id);
            },
            error : (error) => {
                this.messageService.add({ severity: 'error', key: "global", summary: $localize`Erreur`, detail: $localize`Un problème est survenu lors de la création de l'événement.` });
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


}
