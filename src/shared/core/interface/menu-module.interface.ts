import { MenuViews } from "./menu-views.interface";

export interface MenuModule {
    id: number,
    baseUrl: string,
    views: MenuViews[]
}