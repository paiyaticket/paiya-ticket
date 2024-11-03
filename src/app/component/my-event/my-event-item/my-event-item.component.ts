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
import { TagModule } from 'primeng/tag';

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
        TagModule
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
        if(this.event.imageCovers && this.event.imageCovers.length > 0){
            const filter = (value : any, index : number , obj : any[]) => {
                return value.byDefault;
            }
            if(this.event.imageCovers.some(filter)){
                return this.event.imageCovers.find(filter)?.source;
            } else {
                return this.event.imageCovers[0].source;
            }
        } else {
            return this.defaultImageCover;
        }
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

    goToDetailsPage(eventId : string | undefined){
        this.router.navigate(['my-events','my-event-configuration',eventId,'details'])
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
