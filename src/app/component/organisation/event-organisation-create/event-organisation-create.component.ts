import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, output, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TableModule } from 'primeng/table';
import { ChipsModule } from 'primeng/chips';
import { User, getAuth, onAuthStateChanged } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { SOCIALMEDIA } from '../../../data/socialmedia.data';
import { SocialMedia, EventOrganizer } from '../../../models/event-organizer';
import { EventOrganizerService } from '../../../service/event-organizer.service';
import { Message } from 'primeng/api';

@Component({
    selector: 'app-event-organisation-create',
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
    templateUrl: './event-organisation-create.component.html',
    styleUrl: './event-organisation-create.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventOrganisationCreateComponent implements OnInit {

    SUCCESS_MESSAGE : Message = {key: 'global', severity: 'success', summary: $localize `Succès`, detail: $localize `Organisation créee avec succès.`, life: 3000 };
    
    onSave = output<Message>();

    onCancel = output<void>();

    user : User | undefined;
    
    socialMediaOptions : SocialMedia[] = SOCIALMEDIA;

    socialMediaList : SocialMedia[] = [];

    eventOrganizerForm !: FormGroup;

    eventOrganizer : EventOrganizer = new EventOrganizer();

    constructor(private route : ActivatedRoute, 
                private router : Router,
                private organizationService : EventOrganizerService){}
    
    ngOnInit(): void {
        this.eventOrganizerForm = new FormGroup({
            name : new FormControl<string | undefined>('', [Validators.required]),
            details : new FormControl<string | undefined>('', [Validators.maxLength(150)]),
            email : new FormControl<string | undefined>('', [Validators.email]),
            phoneNumbers : new FormControl<string[] | undefined>([]),
            staffMembers : new FormControl<string[] | undefined>([]),
            selectedSocialMedia : new FormControl<SocialMedia | undefined>(undefined),
            selectedSocialMediaLink : new FormControl<string | undefined>('')
        });
        
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                this.user = user;
            } 
        });
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

    goToOrganizationListPage(message ?: any){
        this.router.navigate(['/organisations']).then(() => {
            this.router.navigateByUrl('/organisations/event-organizer-list');
        });
    }

    submit(){
        this.eventOrganizer.name = this.eventOrganizerForm.value.name;
        this.eventOrganizer.email = this.eventOrganizerForm.value.email;
        this.eventOrganizer.details = this.eventOrganizerForm.value.details;
        this.eventOrganizer.staffMembers = this.eventOrganizerForm.value.staffMembers;
        this.eventOrganizer.phoneNumbers = this.eventOrganizerForm.value.phoneNumbers;
        this.eventOrganizer.socialMedia = this.socialMediaList;
        this.eventOrganizer.createdBy = this.user?.email;
        this.organizationService.save(this.eventOrganizer).subscribe(() => {
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
