import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';

@Component({
    selector: 'app-my-event-create',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        InputTextModule,
        InputTextareaModule,
        InputMaskModule,
        ReactiveFormsModule,
        FieldsetModule, 
        ButtonModule, 
        DropdownModule,
    ],
    templateUrl: './my-event-create.component.html',
    styleUrl: './my-event-create.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyEventCreateComponent {

    goToEventListPage(){
    
    }
}
