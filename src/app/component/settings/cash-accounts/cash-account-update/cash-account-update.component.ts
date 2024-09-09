import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Auth, getAuth } from '@angular/fire/auth';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { InputMaskModule } from 'primeng/inputmask';
import { InputSwitchChangeEvent, InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { CARD_PROVIDER_OPTIONS } from '../../../../data/card-provider.data';
import { DIGITAL_WALLET_PROVIDER } from '../../../../data/digital-wallet-provider.data';
import { FINANCIAL_ACCOUNT_OPTIONS } from '../../../../data/financial-account-type.data';
import { MOBILE_MONEY_PROVIDER } from '../../../../data/mobile-money-provider.data';
import { CardProvider } from '../../../../enumerations/card-provider';
import { DigitalWalletProvider } from '../../../../enumerations/digital-wallet-provider';
import { FinancialAccountType } from '../../../../enumerations/financial-account-type';
import { MobileMoneyProvider } from '../../../../enumerations/mobile-money-provider';
import { BankAccount } from '../../../../models/bank-account';
import { CardAccount } from '../../../../models/card-account';
import { CashAccount } from '../../../../models/cash-account';
import { DigitalWalletAccount } from '../../../../models/digital-wallet-account';
import { MobileMoneyAccount } from '../../../../models/mobile-money-account';
import { CashAccountService } from '../../../../service/cash-account.service';

@Component({
    selector: 'app-cash-account-update',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        InputTextModule,
        ReactiveFormsModule,
        ButtonModule,
        DropdownModule,
        FieldsetModule,
        InputMaskModule,
        InputSwitchModule,
        MessagesModule
    ],
    templateUrl: './cash-account-update.component.html',
    styleUrl: './cash-account-update.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CashAccountUpdateComponent implements OnInit {
    @Input()
    accountId !: string;

    auth : Auth | undefined;
    cashAccountForm : FormGroup = new FormGroup({
        financialAccountType : new FormControl<FinancialAccountType | undefined>({value : undefined, disabled : true}),
        isDefault : new FormControl<boolean>({value : false, disabled : false}),

        // cardAccount fields
        cardNumber : new FormControl<string|undefined>(undefined),
        expirationDate : new FormControl<string|undefined>(undefined),
        cardProvider : new FormControl<CardProvider | undefined>(undefined),

        // mobileMoneyAccount fields
        phoneNumber : new FormControl<string|undefined>(undefined),
        mobileMoneyProvider : new FormControl<MobileMoneyProvider|undefined>(undefined),

        // bankAccount fields
        bankCode : new FormControl<string|undefined>(undefined),
        accountNumber : new FormControl<string|undefined>(undefined),
        succusale : new FormControl<string|undefined>(undefined),
        iban : new FormControl<string|undefined>(undefined),

        // digitalWalletAccount fields
        digitalWalletEmail : new FormControl<string|undefined>(undefined, [Validators.email]),
        digitalWalletPhoneNumber : new FormControl<string|undefined>(undefined),
        digitalWalletProvider : new FormControl<DigitalWalletProvider|undefined>(undefined),
    });

    financialAccountTypeList = FINANCIAL_ACCOUNT_OPTIONS;
    cardProviderList = CARD_PROVIDER_OPTIONS;
    mobileMoneyProviderList = MOBILE_MONEY_PROVIDER;
    digitalWalletProviderList = DIGITAL_WALLET_PROVIDER;
    appInstanceParams = environment.instanceParams;
    selectedFinancialAccountType : FinancialAccountType | undefined;
    defaultAccount$ : Observable<CashAccount> | undefined;
    defaultAccountAlreadyExistMessage = "Vous avez dejà defini un mode d'encaissement par defaut. Modifier le avant d'en définir un nouveau.";


    constructor(private router : Router, 
                private route : ActivatedRoute, 
                private messageService : MessageService, 
                private cashAccountService : CashAccountService){
        this.auth = getAuth();
        if(this.auth?.currentUser?.email){
            this.defaultAccount$ = this.cashAccountService.findDefault(this.auth.currentUser?.email);
        }
    }


    ngOnInit(): void {
        this.cashAccountService.findById(this.accountId).subscribe((ca) => {
            console.log(ca);
            this.selectedFinancialAccountType = ca.financialAccountType;
            this.fillForm(ca);  
        });
    } 

    fillForm(cashAccount : CashAccount) {
        let ca;
        switch(this.selectedFinancialAccountType){
            case 'CARD' : 
                ca = cashAccount as CardAccount;
                let card = {
                    financialAccountType : this.selectedFinancialAccountType,
                    cardNumber : ca.cardNumber,
                    expirationDate : ca.expirationDate,
                    cardProvider : ca.provider
                };
                this.cashAccountForm.patchValue(card);
                break;
            case 'MOBILE_MONEY' : 
                ca = cashAccount as MobileMoneyAccount;
                let mobile = {
                    financialAccountType : this.selectedFinancialAccountType,
                    phoneNumber : ca.phoneNumber,
                    mobileMoneyProvider : ca.mobileMoneyProvider
                }
                this.cashAccountForm.patchValue(mobile);
                break;

            case 'BANK_ACCOUNT' : 
                ca = cashAccount as BankAccount;
                let bank = {
                    financialAccountType : this.selectedFinancialAccountType,
                    bankCode : ca.bankCode,
                    accountNumber : ca.accountNumber,
                    succusale : ca.succusale,
                    iban : ca.iban
                }
                this.cashAccountForm.patchValue(bank);
                break;
            case 'DIGITAL_WALLET' :
                ca = cashAccount as DigitalWalletAccount;
                let wallet = {
                    financialAccountType : this.selectedFinancialAccountType,
                    digitalWalletEmail : ca.email,
                    digitalWalletPhoneNumber : ca.phoneNumber,
                    digitalWalletProvider : ca.digitalWalletProvider
                }
                this.cashAccountForm.patchValue(wallet);
                break;
        }
    }

    onIsDefaultChange(event : InputSwitchChangeEvent, defaultAccount : CashAccount){
        if(defaultAccount){
            this.cashAccountForm.patchValue({
                isDefault : false
            })
        }
    }

    onSubmit(){
        switch(this.selectedFinancialAccountType){
            case 'CARD' : 
                let cardAccount = new CardAccount();
                cardAccount.id = this.accountId;
                cardAccount.financialAccountType = this.selectedFinancialAccountType;
                cardAccount.cardNumber = this.cashAccountForm.value.cardNumber;
                cardAccount.expirationDate = this.cashAccountForm.value.expirationDate;
                cardAccount.provider = this.cashAccountForm.value.cardProvider;
                cardAccount.isDefault = this.cashAccountForm.value.isDefault;
                if(this.auth?.currentUser?.email)
                    cardAccount.owner = this.auth?.currentUser?.email;

                
                this.cashAccountService.update(cardAccount).subscribe(() => this.pushMessage());
                
                break;
            case 'MOBILE_MONEY' : 
                let mobileMoneyAccount = new MobileMoneyAccount();
                mobileMoneyAccount.id = this.accountId;
                mobileMoneyAccount.financialAccountType = this.selectedFinancialAccountType;
                mobileMoneyAccount.isDefault = this.cashAccountForm.value.isDefault;
                mobileMoneyAccount.mobileMoneyProvider = this.cashAccountForm.value.mobileMoneyProvider;
                mobileMoneyAccount.phoneNumber = this.cashAccountForm.value.phoneNumber;
                if(this.auth?.currentUser?.email)
                    mobileMoneyAccount.owner = this.auth?.currentUser?.email;

                
                this.cashAccountService.update(mobileMoneyAccount).subscribe(() => this.pushMessage());
                ;
                break;
            case 'BANK_ACCOUNT' : 
                let bankAccount = new BankAccount();
                bankAccount.id = this.accountId;
                bankAccount.financialAccountType = this.selectedFinancialAccountType;
                bankAccount.accountNumber = this.cashAccountForm.value.accountNumber;
                bankAccount.bankCode = this.cashAccountForm.value.bankCode;
                bankAccount.succusale = this.cashAccountForm.value.succusale;
                bankAccount.iban = this.cashAccountForm.value.iban;
                bankAccount.bicSwift = this.cashAccountForm.value.bicSwift;
                bankAccount.isDefault = this.cashAccountForm.value.isDefault;
                if(this.auth?.currentUser?.email)
                    bankAccount.owner = this.auth?.currentUser?.email;

                
                this.cashAccountService.update(bankAccount).subscribe(() => this.pushMessage());
                break;
            case 'DIGITAL_WALLET' : 
                let digitalWallet = new DigitalWalletAccount();
                digitalWallet.id = this.accountId;
                digitalWallet.financialAccountType = this.selectedFinancialAccountType;
                digitalWallet.isDefault = this.cashAccountForm.value.isDefault;
                digitalWallet.phoneNumber = this.cashAccountForm.value.digitalWalletPhoneNumber;
                digitalWallet.email = this.cashAccountForm.value.digitalWalletEmail;
                digitalWallet.digitalWalletProvider = this.cashAccountForm.value.digitalWalletProvider;
                if(this.auth?.currentUser?.email)
                    digitalWallet.owner = this.auth?.currentUser?.email;

                
                this.cashAccountService.update(digitalWallet).subscribe(() => this.pushMessage());
                break;
        }
        this.returnToListPage();
    }

    returnToListPage(): void {
        this.router.navigate(["/settings"], {skipLocationChange : true}).then(()=>{
            this.router.navigateByUrl('/settings/cash-accounts');
        });
    }

    pushMessage(){
        this.messageService.add({key: 'global', severity: 'success', summary: $localize `Succès`, detail: $localize `Compte d'encaissement mis à jour.`, life: 3000 });
    }


    get financialAccountType(){
        return this.cashAccountForm.get("financialAccountType");
    }

    get isDefault(){
        return this.cashAccountForm.get("isDefault");
    }

    get cardNumber(){
        return this.cashAccountForm.get("cardNumber");
    }

    get cardProvider(){
        return this.cashAccountForm.get("cardProvider");
    }

    get expirationDate(){
        return this.cashAccountForm.get("expirationDate");
    }

    get bankCode(){
        return this.cashAccountForm.get("bankCode");
    }

    get accountNumber(){
        return this.cashAccountForm.get("accountNumber");
    }

    get succusale(){
        return this.cashAccountForm.get("succusale");
    }

    get iban(){
        return this.cashAccountForm.get("iban");
    }

    get digitalWalletEmail(){
        return this.cashAccountForm.get("digitalWalletEmail");
    }

    get digitalWalletPhoneNumber(){
        return this.cashAccountForm.get("digitalWalletPhoneNumber");
    }

    get digitalWalletProvider(){
        return this.cashAccountForm.get("digitalWalletProvider");
    }
    
    get countryPrefixNumber(){
        return this.cashAccountForm.get("countryPrefixNumber");
    }
    
    get mobileMoneyProvider(){
        return this.cashAccountForm.get("mobileMoneyProvider");
    }

    get phoneNumber(){
        return this.cashAccountForm.get("phoneNumber");
    }
}

