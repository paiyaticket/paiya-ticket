import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit, output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TableModule } from 'primeng/table';
import { ChipsModule } from 'primeng/chips';
import { Auth } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { SOCIALMEDIA } from '../../../../datas/socialmedia.data';
import { SocialMedia, EventOrganizer } from '../../../../models/event-organizer';
import { EventOrganizerService } from '../../../../services/event-organizer.service';
import { MessageService } from 'primeng/api';

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

    @Input({required : false})
    eventOrganizerId : string | undefined;
    eventOrganizer : EventOrganizer = new EventOrganizer();

    onSave = output<void>();

    onCancel = output<void>();

    user : any;
    
    socialMediaOptions : SocialMedia[] = SOCIALMEDIA;

    socialMediaList : SocialMedia[] = [];

    eventOrganizerForm !: FormGroup;

    constructor(private auth : Auth,
                private route : ActivatedRoute, 
                private router : Router,
                private messageService : MessageService,
                private organizationService : EventOrganizerService){}
    
    ngOnInit(): void {
        this.user = this.auth.currentUser;
        this.eventOrganizerForm = new FormGroup({
            name : new FormControl<string | undefined>('', [Validators.required]),
            details : new FormControl<string | undefined>('', [Validators.maxLength(150)]),
            email : new FormControl<string | undefined>('', [Validators.email]),
            phoneNumbers : new FormControl<string[] | undefined>([]),
            staffMembers : new FormControl<string[] | undefined>([]),
            selectedSocialMedia : new FormControl<SocialMedia | undefined>(undefined),
            selectedSocialMediaLink : new FormControl<string | undefined>('')
        });
        this.initFormIfUpdate();
    } 

    ngOnChanges(changes : SimpleChanges){
        if(changes['eventOrganizerId']){
            this.eventOrganizerId = changes['eventOrganizerId'].currentValue;
            this.initFormIfUpdate();
        }
    }

    initFormIfUpdate(){
        if(this.eventOrganizerId){
            this.organizationService.findById(this.eventOrganizerId).subscribe((eventOrganizer : EventOrganizer) => {
                this.eventOrganizer = eventOrganizer;
                this.eventOrganizerForm.patchValue({
                    name : eventOrganizer.name,
                    details : eventOrganizer.details,
                    email : eventOrganizer.email,
                    phoneNumbers : eventOrganizer.phoneNumbers,
                    staffMembers : eventOrganizer.staffMembers
                });
                this.socialMediaList = eventOrganizer.socialMedia;
            });
        }
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
            this.messageService.add({severity: 'success', icon: 'pi pi-check', summary: $localize `Succès`, detail: $localize `Organisation créee avec succès.`});
            this.onSave.emit();
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
