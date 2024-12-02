import { OrganisationComponent } from "./organisation.component";
import { AuthGuard } from "@angular/fire/auth-guard";
import { EventOrganisationListComponent } from "./event-organisation-list/event-organisation-list.component";
import { Routes } from "@angular/router";

export const organisationRoutes : Routes = [
    {path : "organisations",
        title : $localize `Organisations`, component: OrganisationComponent,
        data : { breadcrumb: $localize `Organisations`}, canActivate: [AuthGuard],
        children: [
            {path: "", redirectTo: "event-organizer-list", pathMatch: 'full'},
            {path: "event-organizer-list", title: $localize `Organisateur d'évènement`, component: EventOrganisationListComponent, data: { breadcrumb: $localize `Organisateur d'évènement`}, canActivate: [AuthGuard]},
        ]
    }
]