export class Ticket {
    id !: string;
    eventId : string | undefined;
    code : string | undefined;
    label : string | undefined;
    quantity : number | undefined;
    price : number | undefined;
    transactionFeesSupported : boolean = false;
    startDateOfSales : string | undefined;
    endDateOfSales : string | undefined;
    minimumTicketQuantityPerOrder : Number = 1;
    maximumTicketQuantityPerOrder : Number = 3;
    details : string | undefined;
    refundable : boolean = false;
    refundPolicy : string | undefined;
    createdBy : string | undefined;
    createdDate : string | undefined;
    lastModifiedDate : string | undefined;
}
