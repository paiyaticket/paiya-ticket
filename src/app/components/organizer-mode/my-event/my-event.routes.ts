import { AuthGuard } from "@angular/fire/auth-guard";
import { Routes } from "@angular/router";
import { MyEventConfigurationComponent } from "./my-event-configuration/my-event-configuration.component";
import { MyEventCreateComponent } from "./my-event-create/my-event-create.component";
import { MyEventListComponent } from "./my-event-list/my-event-list.component";
import { MyEventComponent } from "./my-event.component";
import { PublishComponent } from "./publish/publish.component";
import { TicketComponent } from "./ticket/ticket.component";

export const myEventRoutes : Routes = [
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
    }
];