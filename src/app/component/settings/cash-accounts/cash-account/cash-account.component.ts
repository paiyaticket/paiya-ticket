import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { BadgeModule } from 'primeng/badge';
import { ChipModule } from 'primeng/chip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CashAccount } from '../../../../models/cash-account';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BankAccount } from '../../../../models/bank-account';
import { CardAccount } from '../../../../models/card-account';
import { DigitalWalletAccount } from '../../../../models/digital-wallet-account';
import { MobileMoneyAccount } from '../../../../models/mobile-money-account';
import { CashAccountService } from '../../../../service/cash-account.service';
import { MobileMoneyProvider } from '../../../../enumerations/mobile-money-provider';

@Component({
    selector: 'app-cash-account',
    standalone: true,
    imports: [
        CommonModule,
        CardModule,
        ButtonModule,
        BadgeModule,
        ChipModule,
        ConfirmDialogModule,
    ],
    templateUrl: './cash-account.component.html',
    styleUrl: './cash-account.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CashAccountComponent {
    @Input({required : true})
    cashAccount !: CashAccount;

    cardAccount : CardAccount | undefined;
    mobileMoneyAccount : MobileMoneyAccount | undefined;
    bankAccount : BankAccount | undefined;
    digitalWalletAccount : DigitalWalletAccount | undefined;
    
    financialAccountTypeLabel : string | undefined;
    providerLabel : string | undefined;
    
    private confirmationService : ConfirmationService = inject(ConfirmationService);
    private messageService : MessageService = inject(MessageService);
    private cashAccountService : CashAccountService = inject(CashAccountService);
    private route : ActivatedRoute = inject(ActivatedRoute);
    private router : Router = inject(Router);

    ngOnInit(): void {
        
        switch(this.cashAccount.financialAccountType){
            case "CARD" : {
                this.cardAccount = this.cashAccount as CardAccount;
                this.financialAccountTypeLabel = $localize `Carte de crédit ou prépayée`;
                break;
            }
                
            case "MOBILE_MONEY" : {
                this.mobileMoneyAccount = this.cashAccount as MobileMoneyAccount;
                this.financialAccountTypeLabel = $localize `Compte Mobile Money`;
                if(this.mobileMoneyAccount.mobileMoneyProvider)
                    this.providerLabel = this.mobileMoneyProviderLabel(this.mobileMoneyAccount.mobileMoneyProvider);
                break;
            }

            case "BANK_ACCOUNT" : {
                this.bankAccount = this.cashAccount as BankAccount;
                this.financialAccountTypeLabel = $localize `Compte Bancaire`;
                this.providerLabel = $localize `Banque Inconnue`;
                break;
            }

            case "DIGITAL_WALLET" : {
                this.digitalWalletAccount = this.cashAccount as DigitalWalletAccount;
                this.financialAccountTypeLabel = $localize `Portefeuil numérique`;
                if(this.digitalWalletAccount.digitalWalletProvider)
                    this.providerLabel = this.digitalWalletAccount.digitalWalletProvider;
                break;
            }
                
            default : {
                this.financialAccountTypeLabel = $localize `Argent Liquide`;
                break;
            }
                
        }
    }

    mobileMoneyProviderLabel(provider : MobileMoneyProvider) {

        switch(provider){
            case "ORANGE_MONEY_CI" : return "Orange";
            case "MTN_MONEY_CI" : return "MTN";
            case "MOOV_MONEY_CI" : return "MOOV";
            case "WAVE_CI" : return "Wave";
            default : return undefined;
        }

    }

    confirm(cashAccount : CashAccount) {
        this.confirmationService.confirm({
            header: $localize `Êtes-vous sur(e)?`,
            message: $localize `Voulez vous supprimer le compte d'encaissement "${this.financialAccountTypeLabel}" ?`,
            accept: () => {
                if(cashAccount.id)
                    this.cashAccountService.delete(cashAccount.id).subscribe(() => {
                    this.refresh();
                })
            },
            reject: () => {}
        });
    }

    refresh(): void {
        this.router.navigate(["/settings"], {skipLocationChange : true}).then(()=>{
            this.pushMessage();
            this.router.navigateByUrl('/settings/cash-accounts');
        });
    }

    pushMessage(){
        this.messageService.add({severity: 'success', summary: $localize `Succès`, detail: $localize `Compte d'encaissement supprimé.`, life: 3000 });
    }

    goToUpdatePage(id : string | undefined){
        this.router.navigate([id], {relativeTo: this.route});
    }
}
