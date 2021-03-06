declare module "child_process" {}
declare module "interpolate" {}

declare module "lorem-ipsum" {
    function myInit():string
    export = myInit
}

declare class MediumEditor {
    constructor(selector:string|HTMLElement,params:any)
    subscribe:(name:string,listener:(data:Event|Object,editable:HTMLElement)=>void)=>void
    pasteHTML:(data:string,options?:any)=>void
    cleanPaste:(data:string,options?:any)=>void
    destroy:()=>void
}
declare module  PEG {
    interface Parser {
        parse: (data:string)=>any
    }
    export function buildParser(data:string):Parser
}
declare module  Parser {
    export function parse(data:string):any
}
declare module store {
    export function get(data:string):any
    export function set(name:string,data:any):any
}

declare class MediumEditorTable {
    constructor(settings: any)
}


declare class ColorPickerExtension {
    constructor()
}



declare class ColorThief {
    constructor()
    getColor(sourceImage:JQuery|HTMLImageElement)
    getPalette(sourceImage:JQuery|HTMLImageElement, amount:number)
}

// declare  module child_process {
//     function exec(command:string,cb:(error:string,stdout:string,stderr:string)=>any):void

//     export function spawn(command: string, args?: string[], options?: {
//         cwd?: string;
//         stdio?: any;
//         custom?: any;
//         env?: any;
//         detached?: boolean;
//     }): ChildProcess;
// }
declare module rasterizeHTML {
    export function drawHTML(html:string,canvas?:HTMLCanvasElement):void
    export function drawURL (url:string, canvas?:HTMLCanvasElement):void
    export function drawDocument(document:HTMLDocument, canvas?:HTMLCanvasElement):void
}


declare module absPath {
    var path:string
}
