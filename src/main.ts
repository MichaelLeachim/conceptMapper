///<reference path='../typings/jquery/jquery.d.ts' />

///<reference path='../typings/lodash/lodash.d.ts' />
///<reference path='../myTypings/etc.d.ts' />
///<reference path='../typings/q/Q.d.ts' />

///<reference path='./settings.ts' />

function Reload (){
    location.reload()
}
module Lib {
    interface TreeMap {[index:string]:TreeMap}
    export function  gensym():string{
        function s4():string{
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
        }
        return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4()
    }
    // ====================================  Tree Converter ===============================================
    export function update_in(data:TreeMap,path:string[]):TreeMap{
        // TESTED
        var temp = data
        // var last = path.pop()
        for(var k in path){
            var el = path[k]
            if(temp[el] == undefined){
                temp[el] = {}
            }
            temp = temp[el]
        }
        // temp[last] = {}
        return data
    }
    export function flush_to_storage(data:State.IState){
        store.set("state",data)
    }
    export function fill_from_storage():State.IState{
        if(store.get("state") == undefined){
            var state:State.IState =  {
                MapView: {name:"",children:[],font_size:14,shouldReverse:false},
                LeftTree:{name:"",children:[],font_size:14,shouldReverse:false},
                RightTree:{name:"",children:[],font_size:14,shouldReverse:false},
                Data: "",
                SplittedData: {topic:"",data:[]},        
                TagSize: {},
                maxFont:  24,
                minFont:  14,
            }
        }else{
            var state:State.IState =  store.get("state")
        }
        
        if(state.Data.trim() == ""){
            state.Data = Settings.PREPOPULATE_DATA
        }
        // populate html element with data
        $("#textor").html(state.Data)
        return state
    }
    
    export function split_complexor(term:string):{body:string[];data:string}{
        var body = term.split(/\s+/)
        var data = body.pop()
        return {body:body,data:data}
    }
    
    export function complexor(term:string,s:State.IState):string[]{
        var contextSensitive:string[] = []
        var contextInSensitive:string[] = []
        var data  = split_complexor(term).body
        var complete_begins_with = split_complexor(term).data
        //  =======  context sensitive complexor ======
        _.each(s.SplittedData.data,function(v:string[],k:number){
            // if branch is aligned
            if(_.intersection(data,v).length == data.length){
                contextSensitive =  contextSensitive.concat(_.difference(v,data))
            }
        })
        //  Sort by popularity            
        contextSensitive = _.sortBy(contextSensitive,function(v:string,k:number){
            return -s.TagSize[v]
        })
        // ======== context insensitive complexor ===============
        contextInSensitive =  _.sortBy(_.filter(_.keys(s.TagSize),function(v,k){
            // remove self references
            return !_.contains(data,v)
        }),function(v,k){
            // sort by popularity
            return -s.TagSize[v]
        })
        
        // filter result by popularity
        return _.uniq(_.filter(contextSensitive.concat(contextInSensitive),function(v,k){
            // we should not use root's name
            if(v === s.MapView.name ){
                return false
            }
            return _.startsWith(v,complete_begins_with)
        })).splice(0,10)
    }

    
    export function next_line_data(data:string,splitter:string="</br>",symbols:number=7){
        var result = []
        _.each(data,function(v,k){
            if(k%symbols == 0){
                result.push(splitter)
            }
            result.push(v)
        })
        return result.join("")    
    }
    export function simple_map_to_d3js_tree_relation(data:TreeMap):State.ITree {
        // TESTED
        function transform(v,k){
            var result:State.ITree = {
                name:k,
                children:_.map(v,transform),
                font_size: 14,
                width:  14,
                height: 14,
                shouldReverse: false
                
            }
            return result
        }
        return _.map(data,transform)[0]
    }
    export function build_tree(data:State.IntermediaryParsed):TreeMap{
        // TESTED
        var result:TreeMap = {}
        var return_result:TreeMap = {}
        _.each(data.data,function(v,k){
            update_in(result,v)
        })
        return_result[data.topic] = result
        return return_result
    }
    export function split_reverses(data:State.IState){
        var pivot = (data.MapView.children.length)/2
        var leftTree:State.ITree  = {
            font_size:data.MapView.font_size,
            name:"",
            children:[],
            shouldReverse:null
        }
        var rightTree:State.ITree = {
            font_size:data.MapView.font_size,
            name: data.MapView.name ,
            children:[],
            shouldReverse:null
        }
        _.each(data.MapView.children,function(v,k){
            if(k > pivot){
                leftTree.children.push(v)
            }else{
                rightTree.children.push(v)
            }
        })
            
        data.LeftTree = leftTree
        data.RightTree = rightTree
    }
    
    export function calculate_reverses(data:State.IState){
        // we consider reversing other half of the data
        var pivot = (data.MapView.children.length)/2
        
        function propagate_recur(data:State.ITree,shouldReverse=false){
            data.shouldReverse = shouldReverse
            _.each(data.children,function(v,k){
                propagate_recur(v,shouldReverse)
            })
        }            
        _.each(data.MapView.children,function(v,k){
            if(k > pivot){
                propagate_recur(v,true)
            }else{
                propagate_recur(v,false)
            }
        })
        data.MapView.shouldReverse = null            
    }
    export function  parse(data:string):State.IntermediaryParsed{
        // TESTED
        var data  = data.replace(/&nbsp;/g," ")
        // debugger 
        var element = /<p>(.*?)<\/p>/g
        var result:State.IntermediaryParsed = {topic:"",data:[]}
        var parsed_data   = _.filter(_.map(data.split(element),function(v,k){
            var v = v.replace(Settings.ANY_HTML," ")
            return _.compact(v.match(Settings.CLEAN_TEXT))
        }),function(v,k){
            if(v.length == 0){
                return false
            }
            return true
        })
        try{
            result.topic = parsed_data.shift().join(" ")
            result.data  = parsed_data
        }catch(e){
            result.topic = ""
            result.data  = []
        }
        return result
    }
    export function maximumTagSize(data:State.ITree):number{
        var maxTagSize = 0
        function calc_max_recursive(data){
            if(data.children.length > maxTagSize){
                maxTagSize = data.children.length
            }
            _.each(data.children,calc_max_recursive)
        }
        
        calc_max_recursive(data)
        return maxTagSize
    }
    
    export function calculate_length_of_all_children_in_one_node(el:State.ITree){
        function calc_recur(el:State.ITree,k:number):number{
            var length  = el.children.length
            length += _.sum(_.map(el.children,calc_recur))
            el.children_length = length
            return length
        }
        calc_recur(el,0)
    }
    
    export function calculateTagSize(state:State.IState):State.TagSize{
        calculate_length_of_all_children_in_one_node(state.MapView)
        var tagSize:State.TagSize = {}         
        
        var maxSize = maximumTagSize(state.MapView)

        
	var maxFont = state.maxFont
	var minFont = state.minFont
        function recursiveRecalculator(data:State.ITree){
            if(data.children == undefined){
                return 
            }
            var curLen  = data.children_length
            if(curLen == 0){
                curLen = 1
            }
            var curName = data.name
            var curSize =  Math.log(curLen)/Math.log(maxSize)*(maxFont-minFont) + minFont
            data.font_size = curSize
            tagSize[curName] = curSize
            // should not pass errors
            if(_.isNaN(data.font_size) || !_.isFinite(data.font_size)){
                data.font_size = minFont
            }
            _.each(data.children,function(v:State.ITree,k){
                recursiveRecalculator(v)
            })
        }
        recursiveRecalculator(state.MapView)
        return tagSize
    }
}


module State {
    export interface  IntermediaryParsed  {
        topic: string
        data:  string[][]
    }
    export interface ITree {
        name: string
        children: ITree[]
        children_length?: number
        bbox?: {height:number;width:number}
        shouldReverse: boolean
        font_size: number
        isRoot?: boolean
        x?:number
        y?:number
    }
    export interface TagSize {[index:string]:number}
    export interface IState {
        MapView: ITree
        LeftTree: ITree
        RightTree: ITree
        Data: string
        TagSize:  TagSize
        maxFont:  number
        minFont:  number
        SplittedData: IntermediaryParsed
    }
    export var State:IState  = Lib.fill_from_storage()  
    // ======================== PUB SUB =================
    var _subscribers:{[index:string]:(data:IState)=>void} =  {}

    export function pub(){
        _.map(_subscribers,function(v,k){
            v(State)
        })
    } 
    export function sub(cb:(data:IState)=>void):string{
        var id  = Lib.gensym()
        _subscribers[id] = cb
        return id
    }
    export function unsub(id:string):void{
        delete _subscribers[id]
    }
    // =================== View Methods ===============================
    export function get_completions(data:string):string[]{
        return Lib.complexor(data,State)
    }
    export function on_text_change(data:string):void{
        State.SplittedData =  Lib.parse(data)
        State.Data = data
        var result =  Lib.simple_map_to_d3js_tree_relation(Lib.build_tree(State.SplittedData))
        State.MapView = result
        State.TagSize =  Lib.calculateTagSize(State)
        Lib.split_reverses(State)
        Lib.flush_to_storage(State)
        pub()
    }
}
