import { ChangeDetectionStrategy, Component, inject, Input, OnDestroy, OnInit, output } from '@angular/core';
import { getAuth, User } from '@angular/fire/auth';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SOCIALMEDIA } from '../../../data/socialmedia.data';
import { SocialMedia, EventOrganizer } from '../../../models/event-organizer';
import { EventOrganizerService } from '../../../service/event-organizer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ChipsModule } from 'primeng/chips';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TableModule } from 'primeng/table';
import { Message } from 'primeng/api';

@Component({
    selector: 'app-event-organisation',
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
        TableModule,
        ChipsModule
    ],
    templateUrl: './event-organisation.component.html',
    styleUrl: './event-organisation.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventOrganisationComponent implements OnInit, OnDestroy{

    @Input()
    id : string | undefined;

    SUCCESS_MESSAGE : Message = {
        key: 'global', 
        severity: 'success', 
        summary: $localize `Succès`, 
        detail: $localize `Organisation modifiée avec succès.`, 
        life: 3000 
    };
    
    onSave = output<Message>();

    onCancel = output<void>();

    subscription !: Subscription;

    user !: User | null;
    
    socialMediaOptions : SocialMedia[] = SOCIALMEDIA;

    socialMediaList : SocialMedia[] = [];

    eventOrganizer : EventOrganizer = new EventOrganizer();

    eventOrganizerForm : FormGroup = new FormGroup({
        name : new FormControl<string | undefined>('', [Validators.required]),
        details : new FormControl<string | undefined>('', [Validators.maxLength(250)]),
        email : new FormControl<string | undefined>('', [Validators.email]),
        phoneNumbers : new FormControl<string[] | undefined>([]),
        staffMembers : new FormControl<string[] | undefined>([]),
        selectedSocialMedia : new FormControl<SocialMedia | undefined>(undefined),
        selectedSocialMediaLink : new FormControl<string | undefined>('')
    });

    private route = inject(ActivatedRoute); 
    private router = inject(Router);
    private eventOrganizerService = inject(EventOrganizerService);

    ngOnInit(): void {
        const auth = getAuth();
        this.user = auth.currentUser;

        if(this.id)
            this.subscription = this.eventOrganizerService.findById(this.id).subscribe((org: EventOrganizer) => {
                this.eventOrganizer = org;
                this.eventOrganizerForm.patchValue(org);
                this.socialMediaList = org.socialMedia;
            });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }


    addSocialMedia(){
        let media : SocialMedia = this.eventOrganizerForm.value.selectedSocialMedia as SocialMedia;
        media.link = this.eventOrganizerForm.value.selectedSocialMediaLink;
        this.socialMediaList.push(media);
        
        this.eventOrganizerForm.patchValue({
            selectedSocialMedia : undefined,
            selectedSocialMediaLink : ''
        });
    }

    removeSocialMedia(socialMedia : SocialMedia){
        let index : number | undefined = this.socialMediaList?.indexOf(socialMedia);
        if(index !==  undefined)
            this.socialMediaList.splice(index, 1);
    }

    goToOrganizationListPage(){
        this.router.navigateByUrl('/organisations/event-organizer-list');
    }

    submit(){
        this.eventOrganizer.name = this.eventOrganizerForm.value.name;
        this.eventOrganizer.email = this.eventOrganizerForm.value.email;
        this.eventOrganizer.details = this.eventOrganizerForm.value.details;
        this.eventOrganizer.staffMembers = this.eventOrganizerForm.value.staffMembers;
        this.eventOrganizer.phoneNumbers = this.eventOrganizerForm.value.phoneNumbers;
        this.eventOrganizer.socialMedia = this.socialMediaList;
        this.eventOrganizer.createdBy = this.user?.email;
        this.eventOrganizerService.update(this.eventOrganizer).subscribe((org) => {
            this.eventOrganizerForm.reset();
            this.onSave.emit(this.SUCCESS_MESSAGE);
        });        
    }

    cancel(){
        this.eventOrganizerForm.reset();
        this.onCancel.emit();
    }

    get name(){
        return this.eventOrganizerForm.get('name');
    }

    get details(){
        return this.eventOrganizerForm.get('details');
    }

    get email(){
        return this.eventOrganizerForm.get('email');
    }

    get phoneNumber(){
        return this.eventOrganizerForm.get('phoneNumbers');
    }

    get staffMembers(){
        return this.eventOrganizerForm.get("staffMembers");
    }

    get selectedSocialMedia(){
        return this.eventOrganizerForm.get('selectedSocialMedia');
    }

    get selectedSocialMediaLink(){
        return this.eventOrganizerForm.get('selectedSocialMediaLink');
    }
}

