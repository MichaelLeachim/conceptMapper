///<reference path='../typings/jasmine/jasmine.d.ts' />
///<reference path='../src/main.ts' />
///<reference path='../src/settings.ts' />

describe("Test data parsing", function() {
    it("tests parse", function() {
        var data = Settings.TEST_DATA_HTML
        var result = Lib.parse(data)
        var counter = 0
        _.each(result ,function(v,k){
            _.each(v,function(v,k){
                counter +=1
            })
        })
        console.log(result)
        console.log(counter)
        expect(counter).toBe(37)
    });
    it("tests tree building", function() {
        var data = Settings.TEST_DATA_HTML
        var result = Lib.parse(data)
        var tree = Lib.build_tree(result)
        var root = "Покупка всякого"
        expect(_.values(tree).length).toBe(1)
        expect(_.values(tree[root]).length).toBe(8)
        expect(_.values(tree[root]['молочка']).length).toBe(4)
        expect(_.values(tree[root]['мясо']).length).toBe(3)
        console.log(tree)
    });
    it("tests d3.js acceptable tree  building", function() {
        var data = Settings.TEST_DATA_HTML
        var result = Lib.parse(data)
        var tree = Lib.build_tree(result)
        var d3_tree = Lib.simple_map_to_d3js_tree_relation(tree)
        console.log(d3_tree)
        expect(d3_tree.children.length).toBe(8)
    });
    
    it("tests complexor", function() {
        State.on_text_change(Settings.TEST_DATA_HTML)
        // console.log(State.get_completions("шарлотка "))
        var result =  [ 'сахар', 'корица', 'ваниль', 'разрыхлитель', 'яблоки', 'молочка', 'овощи', 'мясо', 'кофе', 'сыр' ]
        expect(State.get_completions("шарлотка ")).toEqual(result)
        expect(State.get_completions("шарлот")).toEqual(["шарлотка"])
        expect(State.get_completions("шарлотка са")).toEqual(["сахар"])
        expect(State.get_completions("овощи огурцы ")[0]).toEqual("сметана")
        expect(State.get_completions("")[0]).toEqual("шарлотка")        
    });
    
    
});

