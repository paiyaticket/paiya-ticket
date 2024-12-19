import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { UserData } from '../models/user-data';

@Injectable({
  providedIn: 'root'
})
export class UserService {

    private httpClient : HttpClient = inject(HttpClient);

    constructor() { }
    
    apiBaseUrl : string = environment.backendApi.accountManager.baseUrl;
    resourcePath : string = `${this.apiBaseUrl}/v1/users`;
    apiKey: string = environment.backendApi.accountManager.apiKey;


    saveUserProfileIfNotExist(user : UserData) {
        if(user.email){
            this.isUserProfileAlreadyExist(user.email).subscribe((isexist : Boolean) => {
                if(isexist === false)
                    this.saveUserProfile(user);
            })
        }
    }

    saveUserProfile(user : UserData){
        this.httpClient.post<UserData>(`${this.resourcePath}`, user).subscribe();
    }

    isUserProfileAlreadyExist(email : string) : Observable<Boolean> {
        return this.httpClient.get<Boolean>(`${this.resourcePath}`, {
            params : {email : email}
        });
    }

    getUserProfile(email : string) : Observable<UserData> {
        return this.httpClient.get<UserData>(`${this.resourcePath}/${email}`);
    }

    updateUserProfile(user : UserData) : Observable<UserData> {
        return this.httpClient.patch<UserData>(`${this.resourcePath}/${user.email}`, user);
    }

    closeUserProfile(email : string, close : {'status' : 'close'}){
        return this.httpClient.put(`${this.resourcePath}/${email}/status`, close);
    }
}
