interface Menu {
    text: string,//"Facturación Manual",
    icon: string,//"file-invoice",
    codSistemaInfo: string,//"PSC",
    codAplicacion: string,//"FM",
    active: boolean,//true,
    children:MenuChildren[],
    perfilUsuario: string,//"FMTECFAC"
}

interface MenuChildren {
    id: number,// 1,
    text: string,// "Nueva Propuesta de Factura",
    function: string,// "FMMI02",
    screen: string,// "INVPRO01",
    pkg: string,// "https://psc-r2r-salesanddistribution-facturacionmanual.pkpd.grupoclh.com/facturacionManual",
    key: string,// null,
    leaf: boolean,// true,
    children: MenuChildren[],
    active: boolean,// true,
    inicio: string, //null,
    funcionSU: string, //null,
    tipoPantalla: string, //"S",
    dashboard: string, //null,
    module: MenuModule,   
}

interface MenuModule {
    id: number,// 1,
    baseUrl: string,// "https://psc-r2r-salesanddistribution-facturacionmanual.pkpd.grupoclh.com/facturacionManual",
    views: MenuViews[]
}

interface MenuViews {
    id: number,// 1,
    name: string,//"{i810n.INVPRO01.titfacturacionManual}",
    viewClass: string,//"baseclhfront.view.facturacionManual.nuevaPropuestaFacturacion.NuevaPropuestaFacturacion",
    appViewName: string,//null,
    baseUrl: string,//"",
    searchView: boolean,// false,
    saveView: boolean,// false,
    exportView: boolean,// false,
    helpView: string,// null,
    appType: string,// null,
    hasStyles: string,// null
    operations: MenuOperations[],
}

interface MenuOperations {
    id: number,// "1",
    name: string,// "prueba",
    handler: string,// "navigation",
    langCode: string,// "ES",
    label: string,// "<i class=\"fa fa-arrow-right\" aria-hidden=\"true\"></i>&nbsp; {i810n.INVPRO01.irAVista}",
    tooltip: string,// "{i810n.INVPRO01.irAVista}",
    funcionSU: string// "FMMI02"
}