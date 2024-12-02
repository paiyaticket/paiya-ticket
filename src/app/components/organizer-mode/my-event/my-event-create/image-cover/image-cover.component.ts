import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FilePondModule, registerPlugin } from 'ngx-filepond';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginImageResize from 'filepond-plugin-image-resize';
import FilePondPluginImageTransform from 'filepond-plugin-image-transform';
import { CommonModule } from '@angular/common';
import { ImageCover } from '@models/image-cover';
import { FetchServerConfigFunction, FilePondOptions, LoadServerConfigFunction, ProcessServerConfigFunction, RemoveServerConfigFunction, RevertServerConfigFunction } from 'filepond';
import { getDownloadURL } from '@angular/fire/storage';
import { FileStorageService } from '@services/file-storage.service';
import { Auth } from '@angular/fire/auth';
import { EventService } from '@services/event.service';
import { ButtonModule } from 'primeng/button';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
import { DialogModule } from 'primeng/dialog';

@Component({
    selector: 'app-image-cover',
    standalone: true,
    imports: [
        CommonModule,
        FilePondModule,
        ButtonModule,
        DialogModule,
        InputGroupModule,
        InputGroupAddonModule
    ],
    templateUrl: './image-cover.component.html',
    styleUrl: './image-cover.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageCoverComponent implements OnInit {
    @Input() eventForm : any;
    @Input() imageCovers : any;
    @Input() eventId : string | undefined;
    images: ImageCover[] = [];
    defaultImage : ImageCover | undefined;
    pondOptions : FilePondOptions | undefined;
    visible : boolean = false;


    constructor(
        private auth: Auth,
        private eventService : EventService,
        private fileStorageService : FileStorageService
    ){
        registerPlugin(FilePondPluginFileValidateType, FilePondPluginImagePreview, 
            FilePondPluginImageResize, FilePondPluginImageTransform);
    }

    ngOnInit(): void {
        this.pondOptions = {
            name: 'imagesCoverPond',
            allowMultiple: true,
            maxFiles: 10,
            itemInsertLocation: 'after',
            allowReorder: false,
            allowRevert: true,
            allowRemove: true,
            acceptedFileTypes: ['image/jpeg', 'image/png'],
            labelInvalidField: $localize `Ce champ contient des fichiers invalides.`,
            labelIdle: $localize `Glisser & déposer OU <span class="filepond--label-action"> naviguer </span>.`,
            imagePreviewHeight:300,
            allowImageResize : true,
            imageResizeTargetWidth : 600,
            imageResizeTargetHeight : 300,
            files: [],
            server : {
                process : this.process(), 
                load : this.load(),
                fetch: this.fetch(),
                revert: this.revert(),
                remove: this.remove(),
            },
            credits : false
        };
    }

    // initialise le fileuploader avec des fichiers existants
    initImagesIfEventIdIsPassed(){
        if(this.eventId){
            return this.imageCovers?.value.map((image: { source: string }) => {
                return { source: image.source, options: {
                    metadata: {
                        revertUrl: image.source,
                    },
                } };
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
        return this.imageCovers?.value.some(filter);
    }

    addImage(downloadURL : string){
        let image = new ImageCover();
        image.source = downloadURL;
        image.byDefault = false;
        image.name = this.extractFileNameFromUrl(downloadURL);
        image.alt = image.name;


        const filter = (value: ImageCover) => {
            return Object.is(value.source.split("?")[0],downloadURL.split("?")[0]);
        }
        if(!this.imageCovers?.value.some(filter)){
            this.imageCovers?.value.push(image);
        }
        this.images = this.imageCovers?.value;
    }

    removeImage(url : string){
        let filter = (value : any, index : number , obj : any[]) => {
            return Object.is(value.source.split("?")[0],url.split("?")[0]);
        }
        let i = this.imageCovers?.value.findIndex(filter);
        let j = this.pondOptions?.files?.findIndex(filter);

        if(this.imageCovers?.value.length > 1){
            this.imageCovers?.value.splice(i, 1);
        } else {
            this.imageCovers?.value.pop();
        }

        if(this.pondOptions?.files && this.pondOptions?.files?.length > 1 && j){
            this.pondOptions?.files.splice(j, 1);
        } else {
            this.pondOptions?.files?.pop();
        }
        
        // this.images = this.imageCovers?.value;
        this.partialUpdateEvent(this.eventForm.value);
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
                        this.addImage(downloadURL);
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
            console.log("LOAD...");

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
            console.log("REVERT...");
            this.fileStorageService.removeFile(source).then(() => {
                this.removeImage(source);
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

    partialUpdateEvent(event : Event){
        // to implement later
    }





    /* *********************** */
    //   DEFAULT IMAGE MODAL   //
    /* *********************** */
    showDialog() {
        this.visible = true;
    }

    makeImageDefault(index : number){
        let images = this.imageCovers?.value;

        if(images[index]){
            images[index].byDefault = true;
            this.defaultImage = images[index];
            for(let i = 0; i < images.length; i++) {
                if(i !== index){
                    images[i].byDefault = false;
                }
            }
            this.eventForm.patchValue({imageCovers : images});
        }
    }
}
