import { Routes } from '@angular/router';
import { LoginComponent } from '@components/authentication/login/login.component';
import { RegisterComponent } from '@components/authentication/register/register.component';
import { NotFoundComponent } from '@components/not-found/not-found.component';
import {AuthGuard, redirectUnauthorizedTo} from '@angular/fire/auth-guard';
import { ParticipantModeLayoutComponent } from '@layouts/participant-mode-layout/participant.mode.layout.component';
import { organizerModeRoutes } from '@components/organizer-mode/organizer.mode.routes';
import { OrganizerModeLayoutComponent } from '@layouts/organizer-mode-layout/organizer-mode-layout.component';
import { participantModeRoutes } from '@components/participant-mode/participant.mode.routes';


const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['auth/login']);

export const routes: Routes = [
    {path: "", component: ParticipantModeLayoutComponent, children: participantModeRoutes },
    {
        path: "organizer-mode", component: OrganizerModeLayoutComponent, 
        canActivate: [AuthGuard], 
        canActivateChild: [AuthGuard], 
        children: organizerModeRoutes,
        data:{ authGuardPipe : redirectUnauthorizedToLogin } 
    },
    {path: 'auth/login', component: LoginComponent, title: 'Login'},
    {path: "auth/register", component: RegisterComponent},
    {path: "**", component: NotFoundComponent},
    /*
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
                    {path: "my-event-configuration", 
                        title: $localize `Création d'un évènement`, 
                        component: MyEventConfigurationComponent, 
                        data: { breadcrumb: $localize `Création d'un évènement`}, 
                        canActivate: [AuthGuard],
                        children: [
                            {path: "", redirectTo: "create", pathMatch: "full"},
                            {path: "create", title: $localize `Création d'un évènement`, component: MyEventCreateComponent, data: { breadcrumb: $localize `Création d'un évènement`}, canActivate: [AuthGuard]},
                            {path: ":eventId/details", title: $localize `Configuration d'un évènement`, component: MyEventCreateComponent, data: { breadcrumb: $localize `Configuration de évènement`}, canActivate: [AuthGuard]},
                            {path: ":eventId/tickets", title: $localize `Configuration de la billeterie`, component: TicketComponent, data: { breadcrumb: $localize `Configuration de la billeterie`}, canActivate: [AuthGuard]},
                            {path: ":eventId/publish", title: $localize `Configuration de la billeterie`, component: PublishComponent, data: { breadcrumb: $localize `Configuration de la billeterie`}, canActivate: [AuthGuard]},
                        
                        ]
                    },
                ]
            },
            
        ]
        
    },
    */
    
];
