import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { EventOrganizerService } from '../../../../service/event-organizer.service';
import { Observable, Subscription } from 'rxjs';
import { EventOrganizer } from '../../../../models/event-organizer';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-choose-organizer',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    DividerModule
  ],
  templateUrl: './choose-organizer.component.html',
  styleUrl: './choose-organizer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChooseOrganizerComponent {

    organizerList$ : Observable<EventOrganizer[]> | undefined;
    currentUser : any;
    
    constructor(
        private router : Router,
        private auth: Auth, 
        private organizerService: EventOrganizerService) { }

    ngOnInit(): void {
        this.currentUser = this.auth.currentUser;
        this.organizerList$ = this.organizerService.listByUserEmail(this.currentUser.email);
    }

    selectOrganizer(id : string){
        this.router.navigate(['/my-events/my-event-configuration'], { queryParams: { organizerId: id } });
    }

}
