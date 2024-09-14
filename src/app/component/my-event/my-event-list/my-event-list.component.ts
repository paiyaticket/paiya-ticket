import { CommonModule } from "@angular/common";
import { Component, ChangeDetectionStrategy, OnInit } from "@angular/core";
import { Auth, getAuth, User } from "@angular/fire/auth";
import { RouterLink } from "@angular/router";
import { ConfirmationService, Message, MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { ChipModule } from "primeng/chip";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { PanelModule } from "primeng/panel";
import { TableModule } from "primeng/table";
import { Observable } from "rxjs";
import { EventService } from "../../../service/event.service";
import { DataViewModule } from 'primeng/dataview';
import { SplitButtonModule } from 'primeng/splitbutton';
import { Event } from "../../../models/Event";
import { SidebarModule } from "primeng/sidebar";


@Component({
    selector: 'app-my-event-list',
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
        DataViewModule,
        SplitButtonModule,
        SidebarModule,
    ],
    templateUrl: './my-event-list.component.html',
    styleUrl: './my-event-list.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [ConfirmationService],
})
export class MyEventListComponent implements OnInit {

    auth !: Auth;
    owner !: User | null;
    eventList$ !: Observable<Event[]>;
    layout: string = 'list';

    createSidebarVisible : boolean = false;
    updateSidebarVisible : boolean = false;
    updateSidebarParam : string | undefined;

    constructor(
        private eventService : EventService,
        private confirmationService: ConfirmationService,
        private messageService : MessageService
    ) { }

    ngOnInit() {
        this.auth = getAuth();
        this.owner = this.auth.currentUser; 
        if(this.owner && this.owner.email)
            this.initEventList(this.owner.email);
    }

    initEventList(email : string){
        this.eventList$ = this.eventService.findByOwner(email);
    }

    openCreateSidebar(){
        this.createSidebarVisible = true;
    }

    openUpdateSidebar(event : Event){
        this.updateSidebarParam = event.id;
        this.updateSidebarVisible = true;
    }

    closeCreateSidebar(msg ?: Message){
        this.createSidebarVisible = false;
        if(msg){
            this.messageService.add(msg);
            this.refresh();
        }
    }

    closeUpdateSidebar(msg ?: Message){
        this.updateSidebarVisible = false;
        this.updateSidebarParam = undefined;
        if(msg){
            this.messageService.add(msg);
            this.refresh();
        }
    }

    handleHideSidebar(){
        this.createSidebarVisible = false;
        this.updateSidebarVisible = false;
        this.updateSidebarParam = undefined;
    }

    refresh(){
        if (this.owner && this.owner.email != null)
            this.initEventList(this.owner.email);
    }

    reload(){
        window.location.reload();
    }

    confirmDelete(event : Event) {
        this.confirmationService.confirm({
            header: $localize `Etes-vous sur(e)?`,
            message: $localize `Je confirme que je veux suprimer "${event.title}"`,
            icon: "pi-trash",
            accept: () => {
                if(event.id){
                    // deletion logic
                }
            },
            reject: () => {}
        });
    }

    confirmPublish(event : Event) {
        this.confirmationService.confirm({
            header: $localize `Etes-vous prêt(e)?`,
            message: $localize `Je confirme que je veux publier cet evènement "${event.title}"`,
            icon: "pi-megaphone",
            accept: () => {
                if(event.id){
                    // publish logic
                }
            },
            reject: () => {}
        });
    }

    modifier(event : Event){

    }

    publier(){

    }

    isSameDay(date1 : Date, date2 : Date){
        if(date1 != null && date2 != null)
            return date1.getDay() === date2.getDay();
        return true;
    }
}

