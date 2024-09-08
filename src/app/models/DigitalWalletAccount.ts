import { DigitalWalletProvider } from "../enumerations/DigitalWalletProvider";
import { CashAccount } from "./CashAccount";

export class DigitalWalletAccount extends CashAccount{

    email :  string | undefined;
    phoneNumber : string | undefined;
    digitalWalletProvider : DigitalWalletProvider | undefined;

    constructor() {
        super();
    }

}
