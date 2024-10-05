import { inject, Injectable } from '@angular/core';
import { deleteObject, getBlob, getDownloadURL, ref, Storage, StorageReference, uploadBytesResumable, UploadTask } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class FileStorageService {

    constructor() { }

    private readonly storage: Storage = inject(Storage);

    uploadFile(file: File, path : string) : UploadTask {
        const storageRef = ref(this.storage, `${path}/${file.name}`);
        return uploadBytesResumable(storageRef, file);
    }

    downloadFile(path : string) : Promise<any> {
        const storageRef = ref(this.storage, path);
        return getDownloadURL(storageRef);
    }

    downloadBlod(path : string) : Promise<any> {
        const storageRef = ref(this.storage, path);
        return getBlob(storageRef);
    }


    removeFile(path : string) : Promise<void> {
        const storageRef = ref(this.storage, path);
        return deleteObject(storageRef);
    }



}

