import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CashAccount } from '../models/cash-account';

@Injectable({
  providedIn: 'root'
})
export class CashAccountService {

    httpClient : HttpClient = inject(HttpClient);

    apiBaseUrl : string = environment.backendApi.accountManager.baseUrl;
    resourcePath : string = `${this.apiBaseUrl}/v1/cash-accounts`;
    
    constructor() { }


    save(cashAccount : CashAccount) : Observable<CashAccount>{
        return this.httpClient.post<CashAccount>(this.resourcePath, cashAccount);
    }

    listByUserEmail(userEmail : string) : Observable<CashAccount[]> {
        return this.httpClient.get<CashAccount[]>(`${this.resourcePath}`, {
            params : {
                "owner" : userEmail
            }
        });
    }

    findDefault(userEmail : string) : Observable<CashAccount> {
        return this.httpClient.get<CashAccount>(`${this.resourcePath}/default`, {
            params : {
                "owner" : userEmail
            }
        });
    }

    findById(id : string) : Observable<CashAccount> {
        return this.httpClient.get<CashAccount>(`${this.resourcePath}/${id}`);
    }

    update(cashAccount : CashAccount) : Observable<CashAccount>{
        return this.httpClient.patch<CashAccount>(`${this.resourcePath}/${cashAccount.id}`, cashAccount);
    }

    delete(id : string) : Observable<void> {
        return this.httpClient.delete<void>(`${this.resourcePath}/${id}`);
    }
}
