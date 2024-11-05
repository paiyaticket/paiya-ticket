import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Ticket } from '../models/ticket';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
    
    constructor(private httpClient : HttpClient) { }

    apiBaseUrl : string = environment.backendApi.eventManager.baseUrl;
    resourcePath : string = `${this.apiBaseUrl}/v1/tickets`;

    save(ticket : Ticket) : Observable<Ticket>{
        return this.httpClient.post<Ticket>(this.resourcePath, ticket);
    }

    findByEventId(eventId : string) : Observable<Ticket[]> {
        return this.httpClient.get<Ticket[]>(`${this.resourcePath}`, {
            params : {
                "eventId" : eventId
            }
        });
    }

    findById(id : string) : Observable<Ticket> {
        return this.httpClient.get<Ticket>(`${this.resourcePath}/${id}`);
    }

    update(ticket : Ticket) : Observable<Ticket> {
        return this.httpClient.patch<Ticket>(`${this.resourcePath}/${ticket.id}`, ticket);
    }

    delete(id : string) : Observable<void> {
        return this.httpClient.delete<void>(`${this.resourcePath}/${id}`);
    }
}
