import { MenuOperations } from "./menu-operations.interface";

export interface MenuViews {
    id: number,
    name: string,
    viewClass: string,
    appViewName: string,
    baseUrl: string,
    searchView: boolean,
    saveView: boolean,
    exportView: boolean,
    helpView: string,
    appType: string,
    hasStyles: string,
    operations: MenuOperations[],
}