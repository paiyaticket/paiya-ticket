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
        this.httpClient.post<UserData>(`${this.apiBaseUrl}/v1/users`, user).subscribe();
    }

    isUserProfileAlreadyExist(email : string) : Observable<Boolean> {
        return this.httpClient.get<Boolean>(`${this.apiBaseUrl}/v1/users/isexist`, {
            params : {email : email}
        });
    }

    getUserProfile(email : string) : Observable<UserData> {
        return this.httpClient.get<UserData>(`${this.apiBaseUrl}/v1/users/${email}`);
    }

    updateUserProfile(user : UserData) : Observable<UserData> {
        return this.httpClient.patch<UserData>(`${this.apiBaseUrl}/v1/users/${user.email}`, user);
    }

    closeUserProfile(email : string, close : {'status' : 'close'}){
        return this.httpClient.put(`${this.apiBaseUrl}/v1/${email}/status`, close);
    }
}
