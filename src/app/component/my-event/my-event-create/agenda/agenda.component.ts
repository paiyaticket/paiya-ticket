import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { TimeSlot } from '../../../../models/time-slot';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FilePondModule, registerPlugin } from 'ngx-filepond';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginImageResize from 'filepond-plugin-image-resize';
import FilePondPluginImageTransform from 'filepond-plugin-image-transform';
import FilePondPluginImageCrop from 'filepond-plugin-image-crop';



@Component({
  selector: 'app-agenda',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    InputTextareaModule,
    ReactiveFormsModule,
    ButtonModule, 
    CalendarModule,
    FilePondModule,
  ],
  templateUrl: './agenda.component.html',
  styleUrl: './agenda.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgendaComponent {

    @Output() timeSlotAdded = new EventEmitter<TimeSlot>();
    @Output() timeSlotRemoved = new EventEmitter<TimeSlot>();

    timeSlots : TimeSlot[] = [];
    timeSlotForm !: FormGroup;
    pondOptions : any;


    ngOnInit(){

        registerPlugin(
            FilePondPluginFileValidateType,
            FilePondPluginImagePreview,
            FilePondPluginImageCrop,
            FilePondPluginImageResize,
            FilePondPluginImageTransform
          );

        this.timeSlotForm = new FormGroup({
            order : new FormControl<string | undefined>(undefined),
            startTime : new FormControl<string | undefined>(undefined, [Validators.required]),
            endTime : new FormControl<string | undefined>(undefined, [Validators.required]),
            title : new FormControl<string | undefined>(undefined, [Validators.required]),
            icon : new FormControl<string | undefined>(undefined),
            description : new FormControl<string | undefined>(undefined),
            speaker : new FormGroup({
                completeName : new FormControl<string | undefined>(undefined),
                photo : new FormControl<string | undefined>(undefined),
                description : new FormControl<string | undefined>(undefined),
                xlink : new FormControl<string | undefined>(undefined),
                linkedin : new FormControl<string | undefined>(undefined),
                instagram : new FormControl<string | undefined>(undefined),
                facebook : new FormControl<string | undefined>(undefined),
                twitter : new FormControl<string | undefined>(undefined),
            }),
        });

        this.pondOptions = {
            name: 'speakerImageCoverPond',
            imagePreviewHeight: 220,
            imageCropAspectRatio: '1:1',
            imageResizeTargetWidth: 240,
            imageResizeTargetHeight: 240,
            stylePanelLayout: 'compact circle',
            styleLoadIndicatorPosition: 'center bottom',
            styleProgressIndicatorPosition: 'right bottom',
            styleButtonRemoveItemPosition: 'left bottom',
            styleButtonProcessItemPosition: 'right bottom',
            acceptedFileTypes: ['image/jpeg', 'image/png'],
            labelInvalidField: $localize `Ce champ contient des fichiers invalides.`,
            labelIdle: $localize `<span class="filepond--label-action"> Choisir une photo </span>.`,
            credits : false
        }

    }

    submit(){
        let tineSlot = this.timeSlotForm.value as TimeSlot;
        this.timeSlots.push(tineSlot);
        this.timeSlotAdded.emit(tineSlot);
        this.timeSlotForm.reset();
    }

    onRemove(timeSlot : TimeSlot){
        let index = this.timeSlots.indexOf(timeSlot);
        this.timeSlots.splice(index, 1);
        this.timeSlotRemoved.emit(timeSlot);
    }



    get order(){
        return this.timeSlotForm.get('order');
    }

    get startTime(){
        return this.timeSlotForm.get('startTime');
    }

    get endTime(){
        return this.timeSlotForm.get('endTime');
    }

    get title(){
        return this.timeSlotForm.get('title');
    }

    get icon(){
        return this.timeSlotForm.get('icon');
    }

    get description(){
        return this.timeSlotForm.get('description');
    }

    get spekers(){
        return this.timeSlotForm.get('spekers');
    }

    get completeName(){
        return this.timeSlotForm.get('completeName');
    }

    get photo(){
        return this.timeSlotForm.get('photo');
    }

    get descriptionSpeker(){
        return this.timeSlotForm.get('descriptionSpeker');
    }


}
