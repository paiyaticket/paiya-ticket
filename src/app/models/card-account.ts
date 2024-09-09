import { CardProvider } from "../enumerations/card-provider";
import { CashAccount } from "./cash-account";

export class CardAccount extends CashAccount{
    cardNumber : string | undefined;
    expirationDate : string | undefined;
    provider : CardProvider | undefined;

    constructor() {
        super();
    }
}