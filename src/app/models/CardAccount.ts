import { CardProvider } from "../enumerations/CardProvider";
import { CashAccount } from "./CashAccount";

export class CardAccount extends CashAccount{
    cardNumber : string | undefined;
    expirationDate : string | undefined;
    provider : CardProvider | undefined;

    constructor() {
        super();
    }
}