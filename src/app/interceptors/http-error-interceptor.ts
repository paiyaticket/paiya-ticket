import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { error } from "console";
import { catchError } from "rxjs";
import { Observable } from "rxjs/internal/Observable";
import { inject } from "@angular/core";
import { HttpErrorHandlingService } from "../service/http-error-handling.service";

export function HttpErrorInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    let httpErrorHandlingService = inject(HttpErrorHandlingService);
    return next(req).pipe(catchError((error : HttpErrorResponse) => {
        return httpErrorHandlingService.handleHttpErrorResponse(error);
    }));
}