import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Speaker, TimeSlot } from '@models/time-slot';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { FilePondModule, registerPlugin } from 'ngx-filepond';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginImageResize from 'filepond-plugin-image-resize';
import FilePondPluginImageTransform from 'filepond-plugin-image-transform';
import FilePondPluginImageCrop from 'filepond-plugin-image-crop';
import { FieldsetModule } from 'primeng/fieldset';
import { TableModule } from 'primeng/table';
import { getDownloadURL } from '@angular/fire/storage';
import { ProcessServerConfigFunction, LoadServerConfigFunction, RevertServerConfigFunction, FetchServerConfigFunction, RemoveServerConfigFunction, FilePond } from 'filepond';
import { Auth } from '@angular/fire/auth';
import { FileStorageService } from '@services/file-storage.service';
import { dateEarlyThanStartTimeValidator } from '@validators/dateEarlyThanStartTimeValidator';
import { dateLaterThanEndTimeValidator } from '@validators/dateLaterThanEndTimeValidator';
import { laterDateValidator } from '@validators/laterDateValidator';
import { isSameDay } from '@utils/date-util';



@Component({
  selector: 'app-agenda-update',
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
    FieldsetModule,
    TableModule,
    AvatarModule,
    AvatarGroupModule
  ],
  templateUrl: './agenda-update.component.html',
  styleUrl: './agenda-update.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgendaUpdateComponent {

    @Input() eventStartTime !: Date;
    @Input() eventEndTime !: Date;
    @Input() timeSlot ?: TimeSlot;
    @Input() index ?: number;
    @Output() timeSlotUpdated = new EventEmitter<any>();
    @Output() canceled = new EventEmitter<void>();
    @ViewChild('speakerPhoto') speakerPhoto : FilePond | undefined;

    timeSlotForm !: FormGroup;
    pondOptions : any;
    currentUser : any;
    isSameDay : boolean = false;



    constructor(private fileStorageService : FileStorageService, 
                private cdr : ChangeDetectorRef,
                private auth : Auth){}


    ngOnInit(){
        this.currentUser = this.auth.currentUser;

        registerPlugin(
            FilePondPluginFileValidateType,
            FilePondPluginImagePreview,
            FilePondPluginImageCrop,
            FilePondPluginImageResize,
            FilePondPluginImageTransform
          );

        this.timeSlotForm = new FormGroup({
            startTime : new FormControl<Date | undefined>(undefined, [Validators.required]),
            endTime : new FormControl<Date | undefined>(undefined, [Validators.required]),
            title : new FormControl<string | undefined>(undefined, [Validators.required]),
            description : new FormControl<string | undefined>(undefined, [Validators.maxLength(500)]),
            speaker : new FormGroup({
                completeName : new FormControl<string | undefined>(undefined),
                photo : new FormControl<string | undefined>(undefined),
                description : new FormControl<string | undefined>(undefined, [Validators.maxLength(500)])
            }),
            speakers : new FormControl<Speaker[]>([]),
        }, {validators : [laterDateValidator]});

        this.isSameDay = isSameDay(this.eventStartTime, this.eventEndTime);

        this.pondOptions = {
            name: 'speakerImageCoverPond',
            imagePreviewHeight: 180,
            imageCropAspectRatio: '1:1',
            imageResizeTargetWidth: 200,
            imageResizeTargetHeight: 200,
            stylePanelLayout: 'compact circle',
            styleLoadIndicatorPosition: 'center bottom',
            styleProgressIndicatorPosition: 'right bottom',
            styleButtonRemoveItemPosition: 'left bottom',
            styleButtonProcessItemPosition: 'right bottom',
            acceptedFileTypes: ['image/jpeg', 'image/png'],
            labelInvalidField: $localize `Ce champ contient des fichiers invalides.`,
            labelIdle: $localize `<span class="filepond--label-action"> Choisir une photo </span>`,
            credits : false,
            server : {
                process : this.process(), 
                load : this.load(),
                fetch: this.fetch(),
                revert: this.revert(),
                remove: this.remove(),
            }
        }
        
    }

    ngOnChanges(changes : SimpleChanges){
        if(changes['eventStartTime']?.currentValue !== null && changes['eventEndTime']?.currentValue !== null){
            this.startTime?.setValidators([
                Validators.required,
                dateEarlyThanStartTimeValidator(changes['eventStartTime']?.currentValue), 
                dateLaterThanEndTimeValidator(changes['eventEndTime']?.currentValue)
            ]);
            
            this.endTime?.setValidators([
                Validators.required,
                dateEarlyThanStartTimeValidator(changes['eventStartTime']?.currentValue), 
                dateLaterThanEndTimeValidator(changes['eventEndTime']?.currentValue)
            ]);
            this.startTime?.setValue(changes['eventStartTime']?.currentValue);
            this.endTime?.setValue(changes['eventEndTime']?.currentValue);
        }

        this.timeSlot = changes['timeSlot']?.currentValue;
        this.index = changes['index']?.currentValue;
        if(this.timeSlot){
            this.initTimeSlotFormForUpdate(this.timeSlot);
        }
    }

    initTimeSlotFormForUpdate(timeSlot : TimeSlot){
        this.timeSlotForm.patchValue(timeSlot);
        if(timeSlot.startTime && timeSlot.endTime){
            this.startTime?.setValue(new Date(timeSlot.startTime));
            this.endTime?.setValue(new Date(timeSlot.endTime));
        }
    }



    addSpeaker(){
        let speaker = this.timeSlotForm.get('speaker')?.value as Speaker;
        this.speakers.push(speaker);
        this.speakerPhoto?.removeFiles();
        this.timeSlotForm.get('speaker')?.reset();
    }

    removeSpeaker(index : number){
        let speaker : Speaker = this.speakers[index];
        if(speaker){
            this.fileStorageService.removeFile(speaker.photo as string).then(()=>{
                this.speakers?.splice(index, 1);
                this.cdr.detectChanges();
            });
        }
    }

    cancel(){
        this.postSubmit();
        this.canceled.emit();
    }

    submit(){
        this.updateTimeslot();
    }

    updateTimeslot(){
        this.timeSlot = this.timeSlotForm.value as TimeSlot;
        this.preformatTimeslotDates(this.timeSlot, this.startTime?.value, this.endTime?.value);
        this.timeSlotUpdated.emit({timeSlot : this.timeSlot, index : this.index});
        this.postSubmit();
    }

    postSubmit(){
        this.timeSlotForm.reset();
        this.startTime?.setValue(this.eventStartTime);
        this.endTime?.setValue(this.eventEndTime);
    }

    /**
     * transforme date startTime and endTime of the form into utcDateStrings and set them 
     * in the timeslot object that will be sumited.
     * if startTime and endTime are on the same day, we juste merge they time with startTime and endTime of the event object.
     * Else we get startTime and endTime as they are.
     * @param timeSlot 
     * @param start 
     * @param end 
     */
    preformatTimeslotDates(timeSlot : TimeSlot, start : Date, end : Date){
        if(isSameDay(start, end)){
            let startTime = this.mergeOneDateWithAnotherDateTime(this.eventStartTime, start);
            let endTime = this.mergeOneDateWithAnotherDateTime(this.eventStartTime, end);
            timeSlot.startTime = startTime.getTime();
            timeSlot.endTime = endTime.getTime();
        } else {
            timeSlot.startTime = start.getTime();
            timeSlot.endTime = end.getTime();
        }
    }

    mergeOneDateWithAnotherDateTime(eventDate : Date, timeSlotDate : Date) : Date{
        return new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate(), timeSlotDate.getHours(), timeSlotDate.getMinutes());
    }

    displayHourAndMinute(date : Date){
        return date.getHours().toString().padEnd(2, '0') + ":" + date.getMinutes().toString().padStart(2, '0');
    }





    /* *********************** */
    // FILEPOND EVENT HANDLERS //
    /* *********************** */
    process() : ProcessServerConfigFunction {
        return (fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
            let path = 'repos/'+this.auth?.currentUser?.uid+'/images/speakers';
            const uploadTask = this.fileStorageService.uploadFile(file as File, path);

            uploadTask.on('state_changed', 
                (snapshot) => {
                    const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    progress(true, snapshot.bytesTransferred, snapshot.totalBytes);
                }, 
                (storageError) => {
                    error(storageError.message);
                }, 
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        this.timeSlotForm.get('speaker')?.get('photo')?.setValue(downloadURL);

                        load(downloadURL);
                    });
                }
            );

            return {
                abort: () => {
                    uploadTask.cancel();
                    abort();
                },
            };
            
        }
    }

    load() : LoadServerConfigFunction {
        return (source, load, error, progress, abort, headers) => {
            this.fileStorageService.downloadFile(source).then((downloadURL) => {
                const xhr = new XMLHttpRequest();
                xhr.responseType = 'blob';
                xhr.onload = (event) => {
                    const blob = xhr.response;
                    const file : File = new File(blob, source);
                    load(file);
                };
                xhr.open('GET', downloadURL);
                xhr.send();

            }).catch((error) => {
                error(error.message);
            })
            
            return {
                abort: () => {
                    abort();
                },
            };
        }
    }

    revert() : RevertServerConfigFunction {
        return (source, load, error) => {
            this.fileStorageService.removeFile(source).then(() => {
                load();
            }).catch((e) => {
                error(e.message);
            });
        }
    }

    fetch() : FetchServerConfigFunction {
        return (url, load, error, progress, abort, headers) => {
            this.fileStorageService.downloadBlod(url).then((blob) => {
                let urlParts = url.split("%2F");
                blob.name = urlParts[urlParts.length - 1].split("?")[0];
                load(blob);
            }).catch((e) => {
                error(e.message);
            });
            
            return {
                abort: () => {
                    abort();
                },
            };
        }
    }

    remove() : RemoveServerConfigFunction {
        return (source, load, error) => {
            // Should somehow send `source` to server so server can remove the file with this source
            this.fileStorageService.removeFile(source).then(() => {
                
                // this.removeImage(source);
                load();
            }).catch((e) => {
                error(e.message);
            });
        }
    }


    extractFileNameFromUrl(url : string){
        let urlParts = url.split("%2F");
        const filename = urlParts[urlParts.length - 1].split("?")[0];
        return filename;
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

    get speakers(){
        return this.timeSlotForm.get('speakers')?.value;
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
