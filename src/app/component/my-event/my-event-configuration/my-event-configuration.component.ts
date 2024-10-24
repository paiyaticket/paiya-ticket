import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, Input, Signal, SimpleChange, SimpleChanges } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { MyEventCreateComponent } from '../my-event-create/my-event-create.component';
import { MyEventSidebarMenuComponent } from '../my-event-sidebar-menu/my-event-sidebar-menu.component';

@Component({
  selector: 'app-my-event-configuration',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MyEventSidebarMenuComponent,
    MyEventCreateComponent,
  ],
  templateUrl: './my-event-configuration.component.html',
  styleUrl: './my-event-configuration.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyEventConfigurationComponent {

    eventId : string | undefined;


    constructor(private route : ActivatedRoute) { }

    ngOnInit(){
        this.eventId = this.route.snapshot.children[0].params['eventId'] || undefined;
    }

    



}


