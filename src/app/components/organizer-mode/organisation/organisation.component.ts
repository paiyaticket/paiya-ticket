import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { TabMenuModule } from 'primeng/tabmenu';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { EventOrganisationCreateComponent } from './event-organisation-create/event-organisation-create.component';
import { EventOrganisationListComponent } from './event-organisation-list/event-organisation-list.component';
import { Auth, User } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService, Message } from 'primeng/api';
import { EventOrganizer } from '@models/event-organizer';
import { EventOrganizerService } from '@services/event-organizer.service';
import { Observable } from 'rxjs';
import { ConfirmDialogModule } from 'primeng/confirmdialog';


@Component({
    selector: 'app-organisation',
    standalone: true,
    imports: [
        CommonModule, 
        TabMenuModule,
        ButtonModule,
        SidebarModule,
        ConfirmDialogModule,
        EventOrganisationCreateComponent,
        EventOrganisationListComponent,
    ],
    templateUrl: './organisation.component.html',
    styleUrl: './organisation.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrganisationComponent {


    sidebarVisible : boolean = false;
    selectedEventOrganizerId : string | undefined;
    eventOrganizerList$ !: Observable<EventOrganizer[]>;
    user !: User | null;

    constructor (
        private auth : Auth,
        private router : Router,
        private route : ActivatedRoute, 
        private cdRef : ChangeDetectorRef,
        private eventOrganizerService : EventOrganizerService, 
        private confirmationService: ConfirmationService,
        private messageService : MessageService
    ) {}
    
    ngOnInit(): void{
        this.user = this.auth.currentUser;
        this.loadEventOrganizerList();
    }

    loadEventOrganizerList(){
        if (this.user && this.user.email != null){
            this.eventOrganizerList$ = this.eventOrganizerService.listByUserEmail(this.user.email);
        }
    }

    showSidebar(){
        this.sidebarVisible = true;
    }

    handleUpdate($event : string) {
        this.selectedEventOrganizerId = $event;
        this.sidebarVisible = true;
        this.cdRef.detectChanges();
    }

    handleDelete($event : EventOrganizer) {
        this.confirm($event);
        
    }

    closeSidebar(){
        this.loadEventOrganizerList()
        this.sidebarVisible = false;
        this.selectedEventOrganizerId = undefined;
        this.cdRef.detectChanges();
    }

    confirm(org : EventOrganizer) {
        this.confirmationService.confirm({
            header: $localize `Etes-vous sur(e)?`,
            message: $localize `Je confirme que je veux suprimer "${org.name}".`,
            accept: () => {
                if(org.id)
                    this.eventOrganizerService.delete(org.id).subscribe(()=>{
                        this.messageService.add({severity: 'success', icon: 'pi pi-trash', summary: $localize `Succès`, detail: $localize `Organisation supprimée avec succès.`});
                        this.loadEventOrganizerList();
                        this.cdRef.detectChanges();
                    });
            },
            reject: () => {}
        });
    }

}
