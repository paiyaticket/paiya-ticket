export class Ticket {
    id : string | undefined;
    code : string | undefined;
    name : string | undefined;
    quantity : number | undefined;
    price : number | undefined;
    isTransactionFeesSupported : boolean = false;
    startDateOfSales : string | undefined;
    endDateOfSales : string | undefined;
    minimumTicketQuantityPerOrder : Number = 1;
    maximumTicketQuantityPerOrder : Number = 3;
    description : string | undefined;
}
