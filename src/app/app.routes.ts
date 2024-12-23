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
        children: organizerModeRoutes,
        data:{ authGuardPipe : redirectUnauthorizedToLogin } 
    },
    {path: 'auth/login', component: LoginComponent, title: 'Login'},
    {path: "auth/register", component: RegisterComponent},
    {path: "**", component: NotFoundComponent},    
];
