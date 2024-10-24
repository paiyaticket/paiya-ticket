import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, SimpleChange, SimpleChanges } from '@angular/core';
import { Auth, User } from '@angular/fire/auth';
import { urlencoded } from 'express';
import { MenuItem } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { MenuModule } from 'primeng/menu';

@Component({
  selector: 'app-my-event-sidebar-menu',
  standalone: true,
  imports: [
    CommonModule,
    MenuModule, 
    FieldsetModule,
    DropdownModule
  ],
  templateUrl: './my-event-sidebar-menu.component.html',
  styleUrl: './my-event-sidebar-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.Default
})
export class MyEventSidebarMenuComponent {
    items: MenuItem[] = [];
    @Input()
    eventId : string | undefined;
    currentUser : User | null = null;

    constructor(private auth: Auth) { }

    
    ngOnInit() {
        this.currentUser = this.auth.currentUser;
        this.items = [
            {
				label: 'Information sur l\'évènement',
				tooltip: 'Toute les informations de base de l\'évenement',
                icon: 'pi pi-info-circle',
				escape: false,
				routerLink : this.eventId ? `${this.eventId}` : `create`, 
                queryParams: this.eventId === undefined ? {organizerId : this.currentUser?.email} : {},
                preserveFragment: true
            },
            {
				label: 'Tickets',
				tooltip: 'Créer les différents type de ticket en vente',
                icon: 'pi pi-ticket',
				escape: false,
				routerLink : `${this.eventId}/tickets`, 
                preserveFragment: true
			},
            {
				label: 'Publication',
				tooltip: 'Publier l\'évènement afin qu\'il soit visible',
                icon: 'pi pi-megaphone',
				escape: false,
				routerLink : `${this.eventId}/publish`, 
                preserveFragment: true,
                disabled: true
			},
        ];
        console.log(this.eventId);
    } 

    ngOnChanges(changes : SimpleChanges){
        this.eventId = changes['eventId'].currentValue;

        console.log(this.eventId);
    }
}
