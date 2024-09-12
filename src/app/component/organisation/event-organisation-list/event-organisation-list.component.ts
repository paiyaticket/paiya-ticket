import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableModule } from 'primeng/table';
import { PanelModule } from 'primeng/panel';
import { ConfirmationService } from 'primeng/api';
import { EventOrganizer } from '../../../models/event-organizer';
import { getAuth, User } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { EventOrganizerService } from '../../../service/event-organizer.service';
import { SidebarModule } from 'primeng/sidebar';
import { EventOrganisationCreateComponent } from '../event-organisation-create/event-organisation-create.component';
import { EventOrganisationComponent } from '../event-organisation/event-organisation.component';

@Component({
    selector: 'app-event-organisation-list',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        ButtonModule, 
        CardModule,
        PanelModule,
        TableModule,
        ChipModule,
        ConfirmDialogModule,
        SidebarModule,
        EventOrganisationCreateComponent,
        EventOrganisationComponent
    ],
    templateUrl: './event-organisation-list.component.html',
    styleUrl: './event-organisation-list.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [ConfirmationService]
})
export class EventOrganisationListComponent implements OnInit, OnChanges{

    createSidebarVisible : boolean = false;
    updateSidebarVisible : boolean = false;

    user : User | null | undefined;
    
    eventOrganizerList$ !: Observable<EventOrganizer[]>;


    constructor (
        private router : Router,
        private route : ActivatedRoute, 
        private eventOrganizerService : EventOrganizerService, 
        private confirmationService: ConfirmationService
    ) {}

    
    
    ngOnChanges(changes: SimpleChanges): void {
        if (this.user && this.user.email != null)
            this.initEventOrganizerList(this.user.email as string);
    }
    
    ngOnInit(): void{
        this.user = getAuth().currentUser;
        if (this.user && this.user.email != null)
            this.initEventOrganizerList(this.user.email);
    }

    initEventOrganizerList(email : string){
        this.eventOrganizerList$ = this.eventOrganizerService.listByUserEmail(email);
    }

    confirm(org : EventOrganizer) {
        this.confirmationService.confirm({
            header: $localize `Etes-vous sur(e)?`,
            message: $localize `Je confirme que je veux suprimer "${org.name}"`,
            accept: () => {
                if(org.id)
                    this.eventOrganizerService.delete(org.id).subscribe(() => {
                        this.refresh();
                    })
                },
            reject: () => {}
        });
    }

    refresh(){
        window.location.reload();
    }

    showCreateForm(){
        return 'createSidebarVisible = true';
    }
}
