///<reference path='../myTypings/etc.d.ts' />
///<reference path='../typings/d3/d3.d.ts' />
///<reference path='./settings.ts' />
///<reference path='./main.ts' />
///<reference path='./jsnips.ts' />

module Tree {
    // var data = jsnips.generate_simple_tree()(state.MapView)
    // var widthPercent = $(window).width()/100    
    var cwidth  = $(window).width() - $("#right_panel").width() - 60
    var cheight = $(window).height()
    
    function update(state:State.IState){
        // debugger
        $("svg").remove()
        var svg = d3.select("body").append("svg")
            .attr("width", cwidth)
            .attr("height", cheight)
            .attr("class","canvas")
            .append("g")
        
        var foreignRoot = jsnips.generate_simple_tree(svg,cwidth, cheight, state.RightTree,true)
        jsnips.generate_simple_tree(svg,cwidth, cheight, state.LeftTree ,false,foreignRoot)
    }

    // subsribe to updates
    State.sub(update)
    
    // change on resize
    $(window).resize(function(){
        cwidth  = $(window).width() - $("#right_panel").width() - 60
        cheight = $(window).height()
        update(State.State)
    })

    // evaluate on init
    State.on_text_change(State.State.Data)

}

module Textor {
    // * This is the text side module
    export function TextComplete(textSelector: string | JQuery) {
        // completer
        $(textSelector)["textcomplete"]([{
            match: /(.*?)$/,
            body:  "",
            search: function(term:string, callback:any) {
                this.body = Lib.split_complexor(term).body.join(" ")
                callback(State.get_completions(term))        
            },
            index: 1,
            replace: function(word:string) {
                return (this.body + " " + word + " ").trim()
            }
        }])

    }
// MindMapper 
// Can add new nodes
// Can remove nodes
// Can auto save
// Can auto update 
// Intended small projects
// Intended prototyoing
// Not good big projects
// Not good big teams 
// Not good large_texts 
// Not good copyPaste
// Can share email 
// Can share dropbox 
// Can share github
    
    
    function initTextEditor(text_node:JQuery) {
        var editor = new MediumEditor(text_node.get(0), {
            placeholder: { text: "Try to write anything  here" },
            ColorPicker: {},
            paste: {
                forcePlainText: true,
                cleanPastedHTML: true,
                cleanReplacements: [],
                cleanAttrs: ['class', 'src', 'dir',"style"],
                cleanTags: ['meta', "script"],
            },
            toolbar: {
                buttons: ['colorPicker', 'bold', 'italic', 'underline',
                    'h2', 'h3', 'h4', 'h5', 'quote',
                    "strikethrough", "orderedlist", "unorderedlist",
                    "removeFormat"
                ]
            },
            extensions: {
                ColorPicker: new ColorPickerExtension(),
                'table': new MediumEditorTable({
                    rows: 10,
                    columns: 5
                })
            }
        })
        editor.subscribe("editableInput", function(e, data) {
            State.on_text_change($(data).html())
        })
        
        TextComplete(text_node)
    }
    initTextEditor($("#textor"))
}
