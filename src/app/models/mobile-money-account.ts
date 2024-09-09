import { MobileMoneyProvider } from "../enumerations/mobile-money-provider";
import { CashAccount } from "./cash-account";

export class MobileMoneyAccount extends CashAccount{

    phoneNumber : string | undefined;
    mobileMoneyProvider : MobileMoneyProvider | undefined;

    constructor() {
        super();
    }

}
