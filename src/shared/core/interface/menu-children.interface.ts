import { MenuModule } from "./menu-module.interface";

export interface MenuChildren {
    id: number,
    text: string,
    function: string,
    screen: string,
    pkg: string,
    key: string,
    leaf: boolean,
    children: MenuChildren[],
    active: boolean,
    inicio: string,
    funcionSU: string,
    tipoPantalla: string,
    dashboard: string,
    module: MenuModule,   
}