import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, SimpleChanges } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Event } from '../../../models/event';
import { EventService } from '../../../service/event.service';
import { EventVisibility, PublishMoment, PublishSettings } from '../../../models/publishSettings';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { SelectButtonModule } from 'primeng/selectbutton';
import { utcDateToZonedDateTime } from '../../../utils/date-util';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-publish',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    SelectButtonModule,
    CalendarModule,
    ConfirmDialogModule,
    MessagesModule,
    ToastModule

  ],
  templateUrl: './publish.component.html',
  styleUrl: './publish.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MessageService, ConfirmationService]
})
export class PublishComponent {

    @Input()
    eventId !: string;
    event !: Event;
    publishForm !: FormGroup;
    visibilityOptions : any[] = [
        {'label' : $localize `Public`, 'value' : EventVisibility.PUBLIC},
        {'label' : $localize `Privé`, 'value' : EventVisibility.PRIVATE}
    ];
    whenToPublishOptions : any[] = [
        {'label' : $localize `Maintenant`, 'value' : PublishMoment.NOW},
        {'label' : $localize `Dans le futur`, 'value' : PublishMoment.SCHEDULED}
    ];




    constructor(
        private route : ActivatedRoute, 
        private router : Router,
        private eventService : EventService,
        private cdRef : ChangeDetectorRef,
        private messageService : MessageService,
        private confirmationService : ConfirmationService
    ) { }

    ngOnInit(): void {
        this.publishForm = new FormGroup({
            eventVisibility : new FormControl<EventVisibility>(EventVisibility.PUBLIC, Validators.required),
            whenToPublish : new FormControl<PublishMoment>(PublishMoment.NOW, Validators.required),
            publicationScheduledDate : new FormControl<Date | undefined>(undefined)
        });

        this.eventService.findById(this.eventId).subscribe(event => {
            this.event = event;
            this.initPublishForm();
        });
        
    }

    initPublishForm(){
        this.eventVisibility?.setValue(this.event.publishSettings?.eventVisibility);
        if(this.event.publishSettings?.whenToPublish === PublishMoment.SCHEDULED){
            this.whenToPublish?.setValue(this.event.publishSettings?.whenToPublish);
            this.publicationScheduledDate?.setValue(utcDateToZonedDateTime(this.event.publishSettings?.publicationScheduledDate!, this.event.timeZone!));
        } else {
            this.whenToPublish?.setValue(PublishMoment.NOW);
            this.publicationScheduledDate?.setValue(undefined);
        }
    }


    ngOnChanges(changes : SimpleChanges){
    }

    isPublicationScheduledDateVisible(){
        return this.whenToPublish?.value === PublishMoment.SCHEDULED;
    }

    onEventVisibilityChange(event : any){
        this.eventVisibility?.setValue(event.value);
    }

    onWhenToPublishChange(event : any){
        this.whenToPublish?.setValue(event.value);
        if(this.whenToPublish?.value === PublishMoment.SCHEDULED){
            this.publicationScheduledDate?.addValidators(Validators.required);
        } else {
            this.publicationScheduledDate?.removeValidators(Validators.required);
            this.publicationScheduledDate?.updateValueAndValidity();
        }
    }



    publish(){
        if(!this.event) return;
        if(this.whenToPublish?.value === PublishMoment.NOW){
            this.event.published = true;
            this.event.publicationDate = new Date().toISOString();
        } else {
            this.event.published = false;
            this.event.publicationDate = undefined;
        }


        let publishSetting : PublishSettings = new PublishSettings();
        publishSetting.eventVisibility = this.eventVisibility?.value;
        publishSetting.whenToPublish = this.whenToPublish?.value;
        publishSetting.publicationScheduledDate = this.publicationScheduledDate?.value?.toISOString();
        this.event.publishSettings = publishSetting;

        this.eventService.update(this.event).subscribe(()=>{
            this.messageService.add({ 
                icon: 'pi pi-megaphone',
                severity: 'success', 
                summary: $localize`Évènement publié avec succès`, 
                detail: $localize`${this.event?.title}`
            });
            this.router.navigate(['my-events']);
        });
    }

    confirmUnpublish(event: any) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            header: $localize `Etes-vous sur(e)?`,
            message: $localize `Je confirme vouloir retirer la publication de l'évènement "${this.event.title}".`,
            accept: () => this.unpublish(),
            reject: () => {}
        });
    }

    unpublish(){
        this.event.published = false;
        this.event.publicationDate = undefined;
        this.event.publishSettings = undefined;
        this.eventService.update(this.event).subscribe(() => {
            this.messageService.add({ 
                icon: 'pi pi-megaphone',
                severity: 'success', 
                summary: $localize`Publication retirée avec succès`, 
                detail: $localize`${this.event?.title}`
            });
            this.router.navigate(['my-events']);
        });
        
    }

    get eventVisibility() {
        return this.publishForm.get('eventVisibility');
    }

    get whenToPublish() {
        return this.publishForm.get('whenToPublish');
    }

    get publicationScheduledDate() {
        return this.publishForm.get('publicationScheduledDate');
    }


}
