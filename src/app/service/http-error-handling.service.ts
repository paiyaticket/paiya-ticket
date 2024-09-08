import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MessageService } from "primeng/api";
import { EMPTY, Observable, throwError } from "rxjs";

@Injectable({
    providedIn : 'root'
})
export class HttpErrorHandlingService {
    
    private messageService : MessageService;

    constructor(messageService : MessageService){
        this.messageService = messageService;
    }

    handleHttpErrorResponse(error : HttpErrorResponse) : Observable<any>{
        if(error.status === 0){
            // The error is from the client side
            console.error("CLIENT SIDE ERROR : " + error.message);
            let message = {
                key: "global", 
                severity : "error", 
                summary : $localize `Erreur côté client`, 
                detail : $localize `Backend injoignable ou ploblème reseau. Réessayer plutard ou contactez un administrateur.`
            }
            this.messageService.add(message)
        } else {
            // The error come from the backend
            let message = {
                key: "global", 
                severity : "error", 
                summary : $localize `Erreur côté serveur`, 
                detail : $localize `Nous rencontrons un petit soucis, réessayer plutard.`
            }
            this.messageService.add(message)
        }
        return throwError(() => error);
    }
}
