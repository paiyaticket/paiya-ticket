import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from './service/app.layout.service';
import { CommonModule } from '@angular/common';
import { AppMenuitemComponent } from './app.menuitem.component';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html',
    standalone: true,
    imports: [
        CommonModule,
        AppMenuitemComponent
    ]
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService) { }

    ngOnInit() {
        this.model = [
            {
                label: `Évènements`, icon: 'pi pi-calendar',
				items: [
                    { label: 'Évènements', icon: 'pi pi-calendar', routerLink: ['./events'] },
                ]
            },
			{
                label: `Tickets`, icon: 'pi pi-ticket',
				items: [
                    { label: 'Vos Tickets', icon: 'pi pi-ticket', routerLink: ['./tickets'] },
					{ label: 'Revendre', icon: 'pi pi-sync', routerLink: ['./resell'] },
					{ label: 'Remboursements', icon: 'pi pi-money-bill', routerLink: ['./payback'] },
                ]
            },
            {
                label: 'Organisation', icon: 'pi pi-sliders-v', routerLink: ['/dashboard'],
                items: [
                    { label: 'Organisateur', icon: 'pi pi-sitemap', routerLink: ['./organisations'] },
                    { label: 'Mes Évènements', icon: 'pi pi-star', routerLink: ['./my-events'], },
                    { label: 'Publications', icon: 'pi pi-megaphone', routerLink: ['./publications'] },
                    { label: 'Contrôl de ticket', icon: 'pi pi-verified', routerLink: ['./ticket-checking'] },
                    { label: 'Point de ventes', icon: 'pi pi-chart-bar', routerLink: ['./ticket-checking'] },
                    { label: 'Facturation', icon: 'pi pi-credit-card', routerLink: ['./ticket-checking'] }
                ]
            }
        ];
    }
}
