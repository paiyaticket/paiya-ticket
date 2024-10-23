import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Question } from '../../../../../models/question';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FieldsetModule } from 'primeng/fieldset';

@Component({
  selector: 'app-faq-create',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    InputTextareaModule,
    ReactiveFormsModule,
    ButtonModule, 
    FieldsetModule,
  ],
  templateUrl: './faq-create.component.html',
  styleUrl: './faq-create.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FaqCreateComponent {
    @Output() questionAdded = new EventEmitter<Question>();

    questionForm !: FormGroup;

    ngOnInit(){
        this.questionForm = new FormGroup({
            question : new FormControl<string | undefined>(undefined, [Validators.required]),
            answer : new FormControl<string | undefined>(undefined, [Validators.required, Validators.maxLength(2000)])
        });
    }

    submit(){
        this.questionAdded.emit(this.questionForm.value);
        this.questionForm.reset();
    }

    get question(){
        return this.questionForm.get('question');
    }

    get answer(){
        return this.questionForm.get('answer');
    }

}
