import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FilePondModule, registerPlugin } from 'ngx-filepond';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginImageResize from 'filepond-plugin-image-resize';
import FilePondPluginImageTransform from 'filepond-plugin-image-transform';
import { CommonModule } from '@angular/common';
import { ImageCover } from '@models/image-cover';
import { FilePond, FilePondOptions, ProcessServerConfigFunction, RemoveServerConfigFunction } from 'filepond';
import { getDownloadURL } from '@angular/fire/storage';
import { FileStorageService } from '@services/file-storage.service';
import { Auth } from '@angular/fire/auth';
import { ButtonModule } from 'primeng/button';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TooltipModule } from 'primeng/tooltip';


@Component({
    selector: 'app-image-cover',
    standalone: true,
    imports: [
        CommonModule,
        FilePondModule,
        ButtonModule,
        DialogModule,
        InputGroupModule,
        InputGroupAddonModule,
        TooltipModule
    ],
    templateUrl: './image-cover.component.html',
    styleUrl: './image-cover.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageCoverComponent implements OnInit {
    eventId : string | undefined;
    imageCovers: ImageCover[] = [];
    pondOptions : FilePondOptions | undefined;
    @ViewChild("filePond") filePond !: FilePond;

    constructor(
        private auth: Auth,
        private ref: DynamicDialogRef,
        private dialogConfig: DynamicDialogConfig,
        private fileStorageService : FileStorageService,
        private cdr : ChangeDetectorRef
    ){
        registerPlugin(
            FilePondPluginFileValidateType, 
            FilePondPluginImagePreview, 
            FilePondPluginImageResize, 
            FilePondPluginImageTransform);
    }

    ngOnInit(): void {
        this.imageCovers = this.dialogConfig.data.imageCovers;
        this.eventId = this.dialogConfig.data.eventId;
        this.pondOptions = {
            name: 'imagesCoverPond',
            allowMultiple: false,
            maxFiles: 5,
            itemInsertLocation: 'after',
            allowReorder: false,
            allowRevert: false,
            allowRemove: true,
            allowImagePreview: false,
            acceptedFileTypes: ['image/jpeg', 'image/png'],
            labelInvalidField: $localize `Ce champ contient des fichiers invalides.`,
            labelIdle: $localize `<b>Copier & Coller OU Glisser & déposer OU <span class="filepond--label-action"> Naviguer </span></b>.`,
            allowImageResize : true,
            imageResizeTargetWidth : 600,
            imageResizeTargetHeight : 300,
            server : {
                process : this.process(), 
                // remove : this.remove()
            },
            credits : false
        };
    }

    /* *********************** */
    // FILEPOND EVENT HANDLERS //
    /* *********************** */
    process() : ProcessServerConfigFunction {
        return (fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
            let path = 'repos/'+this.auth?.currentUser?.uid+'/images';
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
                        load(downloadURL);
                        this.addImage(downloadURL);
                        this.filePond.removeFile();
                        this.cdr.detectChanges();
                    }).catch((e) => {
                        error(e.message);
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

    remove() : RemoveServerConfigFunction {
        return (source, load, error) => {
            console.log("REMOVE...");
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

    isFileAlreadyExist(filename : string){
        const filter = (value: ImageCover) => {
            return Object.is(value.name,filename);
        }
        return this.imageCovers?.some(filter);
    }

    addImage(downloadURL : string){
        const filename = this.extractFileNameFromUrl(downloadURL);
        let image : ImageCover = {
            source : downloadURL,
            byDefault : false,
            name : filename,
            alt : filename
        };

        const filter = (value: ImageCover) => {
            return Object.is(value.source.split("?")[0],downloadURL.split("?")[0]);
        }

        if(!this.imageCovers?.some(filter)){
            this.imageCovers?.push(image);
        }
    }

    removeImageCover(index : number){
        let image = this.imageCovers[index];
        this.fileStorageService.removeFile(image.source).then(() => {
            this.removeImageFromLocalList(index);
            this.cdr.detectChanges();
        }).catch((e) => {
            console.log(e);
        });
    }

    removeImageFromLocalList(index : number){
        if(this.imageCovers?.length > 1){
            this.imageCovers?.splice(index, 1);
        } else {
            this.imageCovers = [];
        }
    }

    makeImageDefault(index : number){
        let images = this.imageCovers[index];

        if(images){
            images.byDefault = true;
            for(let i = 0; i < this.imageCovers.length; i++) {
                if(i !== index){
                    this.imageCovers[i].byDefault = false;
                }
            }
        }

        this.cdr.detectChanges();
    }

    close() {
        if (this.ref) {
            this.filePond.removeFiles();
            this.ref.close(this.imageCovers);
        }
    }

    /*
    removeImage(url : string){
        let filter = (value : any, index : number , obj : any[]) => {
            return Object.is(value.source.split("?")[0],url.split("?")[0]);
        }
        let i = this.imageCovers?.findIndex(filter);
        let j = this.pondOptions?.files?.findIndex(filter);

        if(this.imageCovers?.length > 1){
            this.imageCovers?.splice(i, 1);
        } else {
            this.imageCovers?.pop();
        }

        if(this.pondOptions?.files && this.pondOptions?.files?.length > 1 && j){
            this.pondOptions?.files.splice(j, 1);
        } else {
            this.pondOptions?.files?.pop();
        }
        
    }
    */


}
