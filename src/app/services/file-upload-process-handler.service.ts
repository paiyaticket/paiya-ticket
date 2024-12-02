import { getDownloadURL } from "@angular/fire/storage";
import { ProcessServerConfigFunction, LoadServerConfigFunction, RevertServerConfigFunction, FetchServerConfigFunction, RemoveServerConfigFunction } from "filepond";
import { ImageCover } from "../models/image-cover";
import { Auth, getAuth } from "@angular/fire/auth";
import { FileStorageService } from "./file-storage.service";
import { inject } from "@angular/core";

export abstract class FileUploadProcessHandler{
    auth : Auth = getAuth();
    fileStorageService : FileStorageService = inject(FileStorageService);
    
    process() : ProcessServerConfigFunction {
        return (fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
            console.log("PROCESS...");
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
                load();
            }).catch((e) => {
                error(e.message);
            });
        }
    }

    fetch() : FetchServerConfigFunction {
        return (url, load, error, progress, abort, headers) => {
            console.log("FETCH...");
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


    extractFileNameFromUrl(url : string){
        let urlParts = url.split("%2F");
        const filename = urlParts[urlParts.length - 1].split("?")[0];
        return filename;
    }

}