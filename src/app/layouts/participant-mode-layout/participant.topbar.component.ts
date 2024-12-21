import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ParticipantLayoutService } from "./service/participant.layout.service";
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { StyleClassModule } from 'primeng/styleclass';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { getAuth, onAuthStateChanged } from '@angular/fire/auth';
import { AutenticationService } from '@services/autentication.service';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

@Component({
    selector: 'participant-topbar',
    templateUrl: './participant.topbar.component.html',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        ButtonGroupModule,
        RouterLink,
        RouterLinkActive,
        StyleClassModule,
        AvatarModule,
        InputTextModule,
        InputGroupModule,
        InputGroupAddonModule,
        IconFieldModule,
        InputIconModule
    ]
})
export class ParticipantTopBarComponent implements OnInit {

    menu: MenuItem[] = [];

    user : any;

    @ViewChild('searchinput') searchInput!: ElementRef;

    @ViewChild('menubutton') menuButton!: ElementRef;

    searchActive: boolean = false;

    authService : AutenticationService = inject(AutenticationService);

    constructor(public layoutService: ParticipantLayoutService) {
    }
    
    ngOnInit(): void {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                this.user = this.authService.getAuthenticatedUserData(user);
            }
        });
    }

    logout(){
        this.authService.logout();
    }

    
    onMenuButtonClick() {
        this.layoutService.onMenuToggle();
    }

    activateSearch() {
        this.searchActive = true;
        setTimeout(() => {
            this.searchInput.nativeElement.focus();
        }, 100);
    }

    deactivateSearch() {
        this.searchActive = false;
    }

    removeTab(event: MouseEvent, item: MenuItem, index: number) {
        this.layoutService.onTabClose(item, index);
        event.preventDefault();
    }

    get layoutTheme(): string {
        return this.layoutService.config().layoutTheme;
    }

    get colorScheme(): string {
        return this.layoutService.config().colorScheme;
    }

    get logo(): string {
        const path = 'assets/layout/images/logo/';
        const logo = 'Pt.png';
        return path + logo;
    }

    get tabs(): MenuItem[] {
        return this.layoutService.tabs;
    }
}
