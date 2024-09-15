import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SplitButtonModule } from 'primeng/splitbutton';
import { Event } from '../../../models/Event';
import { ChipModule } from 'primeng/chip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DataViewModule } from 'primeng/dataview';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';

@Component({
    selector: 'app-my-event-item',
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
        ConfirmDialogModule,
    ],
    templateUrl: './my-event-item.component.html',
    styleUrl: './my-event-item.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyEventItemComponent {
    @Input()
    event !: Event;

    items !: MenuItem[];

    constructor(private confirmationService : ConfirmationService){
        this.items = [
            {
                label: 'Supprimer',
                icon: 'pi pi-trash',
                command: () => {
                    this.confirmDelete(this.event);
                }
            },
            {
                label: 'Publier',
                icon: 'pi pi-megaphone',
                command: () => {
                    this.confirmPublish(this.event);
                }
            },
        ]
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

    goToUpdatePage(event : Event){

    }
}
