import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-my-event',
    standalone: true,
    imports: [
        CommonModule, 
        RouterOutlet,
    ],
    templateUrl: './my-event.component.html',
    styleUrl: './my-event.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyEventComponent {

}
