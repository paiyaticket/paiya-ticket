import { CashAccount } from "./cash-account";

export class BankAccount extends CashAccount{

    bankCode : string | undefined;
    accountNumber : string | undefined;
    succusale : string | undefined;
    iban : string | undefined;
    bicSwift : string | undefined;

    constructor() {
        super();
    }

}
