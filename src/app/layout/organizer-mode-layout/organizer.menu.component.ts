import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { OrganizerLayoutService } from './service/organizer.layout.service';
import { CommonModule } from '@angular/common';
import { OrganizerMenuitemComponent } from './organizer.menuitem.component';

@Component({
    selector: 'organizer-menu',
    templateUrl: './organizer.menu.component.html',
    standalone: true,
    imports: [
        CommonModule,
        OrganizerMenuitemComponent
    ]
})
export class OrganizerMenuComponent implements OnInit {

    model: MenuItem[] = [];

    constructor(public layoutService: OrganizerLayoutService) { }

    ngOnInit() {
        this.model = [
            {
                label: 'Menu Participant', icon: 'pi pi-bars', separator: true,
                items: [
                    { label: 'Évènements', icon: 'pi pi-calendar', routerLink: ['./events'], routerLinkActiveOptions: { paths: 'exact', queryParams: 'ignored', matrixParams: 'ignored', fragment: 'ignored' }  },
                    { label: 'Vos Tickets', icon: 'pi pi-ticket', routerLink: ['./tickets'], routerLinkActiveOptions: { paths: 'exact', queryParams: 'ignored', matrixParams: 'ignored', fragment: 'ignored' }  },
                    { label: 'Revendre', icon: 'pi pi-sync', routerLink: ['./resell'], routerLinkActiveOptions: { paths: 'exact', queryParams: 'ignored', matrixParams: 'ignored', fragment: 'ignored' }  },
                    { label: 'Remboursements', icon: 'pi pi-money-bill', routerLink: ['./payback'], routerLinkActiveOptions: { paths: 'exact', queryParams: 'ignored', matrixParams: 'ignored', fragment: 'ignored' }  },
                ]
            },
            {
                label: 'Menu Organisateur', icon: 'pi pi-bars', separator: true,
                items: [
                    { label: 'Organisateur', icon: 'pi pi-sitemap', routerLink: ['./organisations'], routerLinkActiveOptions: { paths: 'exact', queryParams: 'ignored', matrixParams: 'ignored', fragment: 'ignored' } },
                    { label: 'Mes Évènements', icon: 'pi pi-star', routerLink: ['./my-events'], routerLinkActiveOptions: { paths: 'exact', queryParams: 'ignored', matrixParams: 'ignored', fragment: 'ignored' } },
                    { label: 'Contrôl de ticket', icon: 'pi pi-verified', routerLink: ['./ticket-checking'], routerLinkActiveOptions: { paths: 'exact', queryParams: 'ignored', matrixParams: 'ignored', fragment: 'ignored' } },
                    { label: 'Point de ventes', icon: 'pi pi-chart-bar', routerLink: ['./ticket-checking'], routerLinkActiveOptions: { paths: 'exact', queryParams: 'ignored', matrixParams: 'ignored', fragment: 'ignored' } },
                    { label: 'Facturation', icon: 'pi pi-credit-card', routerLink: ['./ticket-checking'], routerLinkActiveOptions: { paths: 'exact', queryParams: 'ignored', matrixParams: 'ignored', fragment: 'ignored' } }
                ]
            }
        ];
    }
}
