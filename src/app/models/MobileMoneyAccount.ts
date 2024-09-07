import { MobileMoneyProvider } from "../enumerations/MobileMoneyProvider";
import { CashAccount } from "./CashAccount";

export class MobileMoneyAccount extends CashAccount{

    phoneNumber : string | undefined;
    mobileMoneyProvider : MobileMoneyProvider | undefined;

    constructor() {
        super();
    }

}
