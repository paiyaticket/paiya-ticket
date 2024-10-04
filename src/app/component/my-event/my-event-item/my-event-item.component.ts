import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SplitButtonModule } from 'primeng/splitbutton';
import { Event } from '../../../models/event';
import { ChipModule } from 'primeng/chip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DataViewModule } from 'primeng/dataview';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { EventService } from '../../../service/event.service';
import { Subscription } from 'rxjs';

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
export class MyEventItemComponent implements OnDestroy {
    @Input()
    event !: Event;

    items !: MenuItem[];
    defaultImageCover : string = '../../../../assets/layout/images/image-placeholder.png';
    deleteSubscription : Subscription | undefined;
    publishSubscription : Subscription | undefined;


    constructor(private router : Router, 
                private confirmationService : ConfirmationService,
                private eventService : EventService){
        
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

    get imageCover(){
        return (this.event.imageCovers && this.event.imageCovers.length > 0 && this.event.imageCovers[0] != null) ? 
        this.event.imageCovers[0].source : this.defaultImageCover;
    }

    confirmDelete(event : Event) {
        this.confirmationService.confirm({
            header: $localize `Etes-vous sur(e)?`,
            message: $localize `Je confirme que je veux suprimer "${event.title}"`,
            icon: "pi-trash",
            accept: () => {
                if(event.id){
                    this.deleteSubscription = this.eventService.delete(event.id).subscribe(() => {
                        this.reloadComponent();
                    });
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

    goToDetailsPage(event : Event){
        this.router.navigate([`/my-events/${event.id}/details`])
    }

    reloadComponent(){
        window.location.reload();
    }

    ngOnDestroy(): void {
        if(this.deleteSubscription){
            this.deleteSubscription.unsubscribe();
        }
        if(this.publishSubscription){
            this.publishSubscription.unsubscribe();
        }
    }
}
