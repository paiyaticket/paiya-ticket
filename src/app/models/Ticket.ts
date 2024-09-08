export class Ticket {
    code : string | undefined;
    name : string | undefined;
    quantity : number | undefined;
    price : number | undefined;
    isTransactionFeesSupported : boolean = false;
    startDateOfSales : Date | undefined;
    endDateOfSales : Date | undefined;
    minimumTicketQuantityPerOrder : Number = 1;
    maximumTicketQuantityPerOrder : Number = 3;
    description : string | undefined;
}
