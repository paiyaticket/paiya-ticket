import { Routes } from '@angular/router';
import { EmptyComponent } from './component/empty/empty.component';
import { AppLayoutComponent } from './layout/app.layout.component';
import { LoginComponent } from './component/authentication/login/login.component';
import { RegisterComponent } from './component/authentication/register/register.component';
import { NotFoundComponent } from './component/not-found/not-found.component';
import { SettingsComponent } from './component/settings/settings.component';
import {AuthGuard, redirectUnauthorizedTo} from '@angular/fire/auth-guard';
import { UserDataComponent } from './component/settings/user-data/user-data.component';
import { CashAccountListComponent } from './component/settings/cash-accounts/cash-account-list/cash-account-list.component';
import { CashAccountCreateComponent } from './component/settings/cash-accounts/cash-account-create/cash-account-create.component';
import { CashAccountUpdateComponent } from './component/settings/cash-accounts/cash-account-update/cash-account-update.component';
import { EventOrganisationListComponent } from './component/organisation/event-organisation-list/event-organisation-list.component';
import { OrganisationComponent } from './component/organisation/organisation.component';
import { EventOrganisationCreateComponent } from './component/organisation/event-organisation-create/event-organisation-create.component';
import { EventOrganisationComponent } from './component/organisation/event-organisation/event-organisation.component';


const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['auth/login']);

export const routes: Routes = [
    {path : "", component: AppLayoutComponent, title: `Accueil`, 
        data: { breadcrumb: `Accueil`}, 
        children: [
            {path: "", component: EmptyComponent},
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
            {path : "organisations",
                title : $localize `Organisations`, component: OrganisationComponent,
                data : { breadcrumb: $localize `Organisations`}, canActivate: [AuthGuard],
                children: [
                    {path: "", redirectTo: "event-organizer-list", pathMatch: 'full'},
                    {path: "event-organizer-list", title: $localize `Organisateur d'évènement`, component: EventOrganisationListComponent, data: { breadcrumb: $localize `Organisateur d'évènement`}, canActivate: [AuthGuard]},
                    {path: "event-organizer-create", title: $localize `Organisateur d'évènement - creation`, component: EventOrganisationCreateComponent, data: { breadcrumb: $localize `Organisateur d'évènement - création`}, canActivate: [AuthGuard]},
                    {path: "event-organizer/:id", title: $localize `Organisateur d'évènement - consultation et mise à jour`, component: EventOrganisationComponent, data: { breadcrumb: $localize `Organisateur d'évènement - consultation et mise à jour`}, canActivate: [AuthGuard]}
                ]
            }
        ]
    },
    {path: 'auth/login', component: LoginComponent, title: 'Login'},
    {path: "auth/register", component: RegisterComponent},
    {path: "**", component: NotFoundComponent},
];
