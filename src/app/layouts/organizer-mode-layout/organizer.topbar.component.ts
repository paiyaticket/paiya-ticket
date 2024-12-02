import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { OrganizerLayoutService } from "./service/organizer.layout.service";
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { StyleClassModule } from 'primeng/styleclass';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { getAuth, onAuthStateChanged } from '@angular/fire/auth';
import { AutenticationService } from '../../services/autentication.service';
import { UserData } from '../../models/user-data';

@Component({
    selector: 'organizer-topbar',
    templateUrl: './organizer.topbar.component.html',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        RouterLink,
        RouterLinkActive,
        StyleClassModule,
        AvatarModule,
        InputTextModule
    ]
})
export class OrganizerTopBarComponent implements OnInit {

    menu: MenuItem[] = [];

    user : UserData | undefined;

    @ViewChild('searchinput') searchInput!: ElementRef;

    @ViewChild('menubutton') menuButton!: ElementRef;

    searchActive: boolean = false;

    authService : AutenticationService = inject(AutenticationService);

    constructor(public layoutService: OrganizerLayoutService) {
    }
    
    ngOnInit(): void {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                this.user = this.authService.getAuthenticatedUserData(user);
            } else {
                this.logout();
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
