import { FinancialAccountType } from "../enumerations/financial-account-type";

export abstract class CashAccount {

    id : string | undefined;
    isDefault : boolean = false;
    owner : string | undefined;
    financialAccountType : FinancialAccountType | undefined;


    constructor() { }

}
