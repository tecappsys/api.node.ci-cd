import { MenuChildren } from "./menu-children.interface";

export interface Menu {
    text: string,
    icon: string,
    codSistemaInfo: string,
    codAplicacion: string,
    active: boolean,
    children:MenuChildren[],
    perfilUsuario: string,
}
