import { Routes } from "@angular/router";
import { EmptyComponent } from "../empty/empty.component";
import { settingsRoutes } from "@components/settings/settings.routes";

export const participantModeRoutes : Routes = [
    {path: "", component: EmptyComponent},
    ...settingsRoutes,
];