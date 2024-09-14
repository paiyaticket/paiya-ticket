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
import { MyEventListComponent } from './component/my-event/my-event-list/my-event-list.component';
import { MyEventCreateComponent } from './component/my-event/my-event-create/my-event-create.component';
import { MyEventComponent } from './component/my-event/my-event.component';


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
                ]
            },
            {path : "my-events", 
                title: $localize `Évènements`, component: MyEventComponent, 
                data: { breadcrumb: $localize `Évènements`}, canActivate: [AuthGuard],
                children: [
                    {path: "", redirectTo: "my-event-list", pathMatch: "full"},
                    {path: "my-event-list", title: $localize `Liste de vos évènements`, component: MyEventListComponent, data: { breadcrumb: $localize `Liste de vos évènements`}, canActivate: [AuthGuard]},
                    {path: "create", title: $localize `Création d'un évènement`, component: MyEventCreateComponent, data: { breadcrumb: $localize `Création d'un évènement`}, canActivate: [AuthGuard]},
                ]
            },
            
        ]
    },
    {path: 'auth/login', component: LoginComponent, title: 'Login'},
    {path: "auth/register", component: RegisterComponent},
    {path: "**", component: NotFoundComponent},
];
