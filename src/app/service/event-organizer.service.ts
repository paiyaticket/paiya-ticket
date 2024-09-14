import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { EventOrganizer } from '../models/event-organizer';

@Injectable({
  providedIn: 'root'
})
export class EventOrganizerService {

    private httpClient : HttpClient = inject(HttpClient);

    constructor() { }

    apiBaseUrl : string = environment.backendApi.accountManager.baseUrl;
    resourcePath : string = `${this.apiBaseUrl}/v1/event-organizers`;

    save(eventOrganizer : EventOrganizer) : Observable<EventOrganizer>{
        return this.httpClient.post<EventOrganizer>(this.resourcePath, eventOrganizer);
    }

    listByUserEmail(email : string) : Observable<EventOrganizer[]> {
        return this.httpClient.get<EventOrganizer[]>(this.resourcePath, {
            params : {
                "owner" : email
            }
        })
    }

    findById(id : string) : Observable<EventOrganizer> {
        return this.httpClient.get<EventOrganizer>(`${this.resourcePath}/${id}`);
    }

    update(eventOrganizer : EventOrganizer) : Observable<EventOrganizer>{
        return this.httpClient.patch<EventOrganizer>(`${this.resourcePath}/${eventOrganizer.id}`, eventOrganizer);
    }

    delete(id : string) : Observable<void> {
        return this.httpClient.delete<void>(`${this.resourcePath}/${id}`);
    }
}
