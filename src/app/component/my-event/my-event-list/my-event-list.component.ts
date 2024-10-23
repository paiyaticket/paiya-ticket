import { CommonModule } from "@angular/common";
import { Component, ChangeDetectionStrategy, OnInit } from "@angular/core";
import { Auth, getAuth, User } from "@angular/fire/auth";
import { Router, RouterLink } from "@angular/router";
import { ConfirmationService, MenuItem, Message, MessageService } from "primeng/api";
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
import { Event } from "../../../models/event";
import { SidebarModule } from "primeng/sidebar";
import { DialogModule } from 'primeng/dialog';
import { MyEventItemComponent } from "../my-event-item/my-event-item.component";
import { ChooseOrganizerComponent } from "../choose-organizer/choose-organizer.component";


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
        DialogModule,
        MyEventItemComponent,
        ChooseOrganizerComponent
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

    organisationDialogVisible : boolean = false;
    createSidebarVisible : boolean = false;
    updateSidebarVisible : boolean = false;
    updateSidebarParam : string | undefined;

    constructor(
        private eventService : EventService,
        private confirmationService: ConfirmationService,
        private messageService : MessageService,
        private router : Router
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

    showDialog() {
        this.organisationDialogVisible = true;
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


    goToCreationPage(){
        this.router.navigate(['/my-events/create']);
    }

    chooseOrganizer(){
        this.showDialog()
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

