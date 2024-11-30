import { Routes } from "@angular/router";
import { EmptyComponent } from "../empty/empty.component";
import { myEventRoutes } from "./my-event/my-event.routes";

export const organizerModeRoutes : Routes = [
    {path: "", component: EmptyComponent, children: [
        ...myEventRoutes,
    ]},

];