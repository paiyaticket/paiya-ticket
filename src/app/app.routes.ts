import { Routes } from '@angular/router';
import { EmptyComponent } from './component/empty/empty.component';
import { AppLayoutComponent } from './layout/app.layout.component';
import { LoginComponent } from './component/authentication/login/login.component';

export const routes: Routes = [
    {path : "", component: AppLayoutComponent, title: `Accueil`, 
        data: { breadcrumb: `Accueil`}, 
        children: [
            {path: "", component: EmptyComponent},
        ]
    },
    {path: 'auth/login', component: LoginComponent, title: 'Login'}
];
