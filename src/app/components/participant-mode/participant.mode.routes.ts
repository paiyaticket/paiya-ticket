import { Routes } from "@angular/router";
import { EmptyComponent } from "../empty/empty.component";
import { settingsRoutes } from "@components/settings/settings.routes";
import { HomeComponent } from "./home/home.component";

export const participantModeRoutes : Routes = [
    {path: "", component: HomeComponent},
    ...settingsRoutes,
];