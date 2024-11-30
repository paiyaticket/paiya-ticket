import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Question } from '../../../../../../models/question';
import { AccordionModule } from 'primeng/accordion';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';


@Component({
  selector: 'app-faq-list',
  standalone: true,
  imports: [
    CommonModule,
    AccordionModule,
    ButtonModule
  ],
  templateUrl: './faq-list.component.html',
  styleUrl: './faq-list.component.scss',
  changeDetection: ChangeDetectionStrategy.Default
})
export class FaqListComponent {

    @Input() questions : Question[] = [];
    @Output() questionRemoved = new EventEmitter<Question>();
    
    ngOnChanges(changes : any){
        this.questions = changes['questions'].currentValue;
    }
    
    removeQuestion(question : Question){
        this.questionRemoved.emit(question);
    }
    

}
