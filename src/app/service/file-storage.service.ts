import { inject, Injectable } from '@angular/core';
import { deleteObject, ref, Storage, uploadBytesResumable, UploadTask } from '@angular/fire/storage';

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

    removeFile(file: File, path : string) : Promise<void> {
        const storageRef = ref(this.storage, `${path}/${file.name}`);
        return deleteObject(storageRef);
    }

}
