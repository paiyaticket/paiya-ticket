import { DigitalWalletProvider } from "../enumerations/digital-wallet-provider";
import { CashAccount } from "./cash-account";

export class DigitalWalletAccount extends CashAccount{

    email :  string | undefined;
    phoneNumber : string | undefined;
    digitalWalletProvider : DigitalWalletProvider | undefined;

    constructor() {
        super();
    }

}
