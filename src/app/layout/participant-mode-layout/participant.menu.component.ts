import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ParticipantLayoutService } from './service/participant.layout.service';
import { CommonModule } from '@angular/common';
import { ParticipantMenuitemComponent } from './participant.menuitem.component';

@Component({
    selector: 'participant-menu',
    templateUrl: './participant.menu.component.html',
    standalone: true,
    imports: [
        CommonModule,
        ParticipantMenuitemComponent
    ]
})
export class ParticipantMenuComponent implements OnInit {

    model: MenuItem[] = [];

    constructor(public layoutService: ParticipantLayoutService) { }

    ngOnInit() {
        this.model = [
            {
                label: `Évènements`, icon: 'pi pi-calendar',
				items: [
                    { label: 'Évènements', icon: 'pi pi-calendar', routerLink: ['./events'], routerLinkActiveOptions: { paths: 'exact', queryParams: 'ignored', matrixParams: 'ignored', fragment: 'ignored' }  },
                ]
            },
			{
                label: `Tickets`, icon: 'pi pi-ticket',
				items: [
                    { label: 'Vos Tickets', icon: 'pi pi-ticket', routerLink: ['./tickets'], routerLinkActiveOptions: { paths: 'exact', queryParams: 'ignored', matrixParams: 'ignored', fragment: 'ignored' }  },
					{ label: 'Revendre', icon: 'pi pi-sync', routerLink: ['./resell'], routerLinkActiveOptions: { paths: 'exact', queryParams: 'ignored', matrixParams: 'ignored', fragment: 'ignored' }  },
					{ label: 'Remboursements', icon: 'pi pi-money-bill', routerLink: ['./payback'], routerLinkActiveOptions: { paths: 'exact', queryParams: 'ignored', matrixParams: 'ignored', fragment: 'ignored' }  },
                ]
            },
        ];
    }
}
