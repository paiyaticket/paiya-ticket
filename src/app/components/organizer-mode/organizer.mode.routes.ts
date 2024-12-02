import { Routes } from "@angular/router";
import { EmptyComponent } from "../empty/empty.component";
import { myEventRoutes } from "./my-event/my-event.routes";
import { MyEventComponent } from "./my-event/my-event.component";
import { organisationRoutes } from "./organisation/organization.routes";
import { settingsRoutes } from "@components/settings/settings.routes";

export const organizerModeRoutes : Routes = [
    {path: "", component: MyEventComponent},
    ...settingsRoutes,
    ...myEventRoutes,
    ...organisationRoutes,
];