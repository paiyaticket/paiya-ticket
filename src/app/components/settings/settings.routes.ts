import { Routes } from "@angular/router";
import { SettingsComponent } from "./settings.component";
import { AuthGuard } from "@angular/fire/auth-guard";
import { CashAccountCreateComponent } from "./cash-accounts/cash-account-create/cash-account-create.component";
import { CashAccountListComponent } from "./cash-accounts/cash-account-list/cash-account-list.component";
import { CashAccountUpdateComponent } from "./cash-accounts/cash-account-update/cash-account-update.component";
import { UserDataComponent } from "./user-data/user-data.component";

export const settingsRoutes : Routes = [
    {path: "settings", 
        title: $localize `Paramètres`, component: SettingsComponent, 
        data: { breadcrumb: $localize `Paramètres`}, 
        canActivate: [AuthGuard],
        children: [
            {path: "", redirectTo: "user-data", pathMatch: "full"},
            {path: "user-data", title: $localize `Compte Utilisateur`, component: UserDataComponent, data: { breadcrumb: $localize `Compte Utilisateur`}, canActivate: [AuthGuard]},
            {path: "cash-accounts", title : $localize `Comptes d'encaissement`, component: CashAccountListComponent, data :{ breadcrumb: $localize `Comptes d'encaissement`}, canActivate: [AuthGuard]},
            {path: "cash-accounts/create", title: $localize `Comptes d'encaissement - creation`, component: CashAccountCreateComponent, data: { breadcrumb: $localize `Comptes d'encaissement - creation`}, canActivate: [AuthGuard]},
            {path: "cash-accounts/:accountId", title: $localize `Comptes d'encaissement - consultation et mise à jour`, component: CashAccountUpdateComponent, data: { breadcrumb: $localize `Comptes d'encaissement - consultation et mise à jour`}, canActivate: [AuthGuard]},
        ]
    },
]