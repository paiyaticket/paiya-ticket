import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { FieldsetModule } from 'primeng/fieldset';
import { DropdownModule } from 'primeng/dropdown';

@Component({
    selector: 'app-settings-sidebar',
    standalone: true,
    imports: [
        CommonModule,
		MenuModule, 
        FieldsetModule,
        DropdownModule
    ],
    templateUrl: './settings-sidebar.component.html',
    styleUrl: './settings-sidebar.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsSidebarComponent {
    items: MenuItem[] = [];
    private router: Router = inject(Router);
    private activatedRoute : ActivatedRoute = inject(ActivatedRoute);

    ngOnInit() {
        this.items = [
            {
				label: 'Compte Utilisateur',
				tooltip: 'Gérer les informations de votre profile',
				escape: false,
				routerLink : 'user-data'
			},
            {
				label: 'Comptes et mode d\'encaissement',
				tooltip: 'Gérer les moyens par lesquels l\'argent des clients vous sera reversé.',
				escape: false,
				routerLink : 'cash-accounts'
			},
        ];
    }
}
