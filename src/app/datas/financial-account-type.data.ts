import { FinancialAccountType } from "../enumerations/financial-account-type";

export const FINANCIAL_ACCOUNT_OPTIONS : any[] = [
    {label : $localize `Carte de crédit ou prépayée`, value: FinancialAccountType.CARD},
    {label : $localize `Compte Mobile Money`, value: FinancialAccountType.MOBILE_MONEY},
    {label : $localize `Compte Bancaire`, value: FinancialAccountType.BANK_ACCOUNT},
    {label : $localize `Portefeuil numérique`, value: FinancialAccountType.DIGITAL_WALLET},
    {label : $localize `Argent Liquide`, value: FinancialAccountType.CASH},
]