import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
// @ts-ignore
import { Event } from '@models/event';

@Injectable({
  providedIn: 'root'
})
export class EventService {

    constructor(private httpClient : HttpClient) { }

    apiBaseUrl : string = environment.backendApi.eventManager.baseUrl;
    resourcePath : string = `${this.apiBaseUrl}/v1/events`;

    save(event : Event) : Observable<Event>{
        return this.httpClient.post<Event>(this.resourcePath, event);
    }

    findById(id : string) : Observable<Event> {
        return this.httpClient.get<Event>(`${this.resourcePath}/${id}`);
    }
    
    findByOwner(owner : string) : Observable<Event[]> {
        return this.httpClient.get<Event[]>(`${this.resourcePath}/owned-by`, {
            params : {
                "owner" : owner
            }
        });
    }

    update(event : Event) : Observable<Event> {
        return this.httpClient.patch<Event>(`${this.resourcePath}/${event.id}`, event);
    }

    delete(id : string) : Observable<void> {
        return this.httpClient.delete<void>(`${this.resourcePath}/${id}`);
    }
}
