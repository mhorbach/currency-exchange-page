import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: "",
        loadComponent: () => import("./features/exchange-rate/pages/currency-view/currency-view.component"),
    }
];
