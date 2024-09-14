import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TabMenuModule } from 'primeng/tabmenu';
import { CommonModule } from '@angular/common';


@Component({
    selector: 'app-organisation',
    standalone: true,
    imports: [
        CommonModule, 
        TabMenuModule,
    ],
    templateUrl: './organisation.component.html',
    styleUrl: './organisation.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrganisationComponent {

}
