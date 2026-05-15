import { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/dashboard';
import { AddPosition } from './features/add-position/add-position';

export const routes: Routes = [
    {
        path: "",
        component: Dashboard,
        title: "Dashboard"
    },
    {
        path: "add-position",
        component: AddPosition,
        title: "Add Position",
    },
];
