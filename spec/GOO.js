var Settings;
(function (Settings) {
    Settings.NEW_LINE = "\n|<p>|<br>";
    Settings.HTML_CHUNK = /(<[^>]+>)|(\s+)/;
    Settings.ANY_HTML = /<[^>]+>/g;
    Settings.CLEAN_TEXT = /[A-zА-я0-9_-]+/g;
    Settings.SHOULD_PREPOPULATE = true;
    Settings.TEST_DATA = "\n             Купить шарлотка сахар\n             Купить шарлотка корица\n             Купить шарлотка ваниль\n             Купить шарлотка разрыхлитель\n             Купить шарлотка яблоки\n             Купить кофе\n             Купить сыр\n             Купить хлеб\n             Купить колбаса\n             Купить молоко\n             Купить сливки\n             Купить пюре\n             Купить помидоры\n             Купить огурцы\n             Купить огурцы сметана\n             Купить лук\n             Купить сосиски\n             Купить сосиски фарш\n             Купить макароны\n    ";
    // Болгария в_израиле teamviewer_родителям
    Settings.TEST_DATA_HTML = "<p>Покупка всякого</p>\n         <p>шарлотка сахар</p>\n         <p>шарлотка корица</p>\n         <p>шарлотка ваниль</p>\n         <p>шарлотка разрыхлитель</p>\n         <p>шарлотка яблоки</p>\n         <p>кофе</p>\n         <p>молочка сыр</p>\n         <p>хлеб</p>\n         <p>мясо колбаса</p>\n         <p>молочка молоко</p>\n         <p>молочка сливки</p>\n         <p>пюре</p>\n         <p>овощи помидоры</p>\n         <p>овощи огурцы</p>\n         <p>овощи огурцы сметана</p>\n         <p>молочка  сметана</p>        \n         <p>овощи лук</p>\n         <p>мясо сосиски</p>\n         <p>мясо фарш</p>\n         <p>мясо</p>\n         <p>макароны</p>\n         <p>мясо</p>\n        ";
    Settings.PREPOPULATE_DATA = "\n       <p>Mind-mapper</p>\n       <p>Can add elements </p>\n       <p>Can autosave </p>\n       <p>Can remove elements</p>\n       <p>Can share email</p>\n       <p>Can share dropbox</p>\n       <p>Can share text </p>\n       <p>Good simple-concepts</p>\n       <p>Good fast-prototyping</p>\n       <p>Good small-data</p>\n       <p>Best sketching </p>\n       <p>Best todos</p>\n        ";
    Settings.TEST__DATA_HTML = "<p> Тестируем </p>" + _.map(_.range(1, 100), function () {
        return "<p>" + _.sample(["овощи", "огурцы", "сметана", "шарлотка", "сахар", "Покупка", "всякого", "барахла"], 10).join(" ") + "</p>";
    }).join("");
})(Settings || (Settings = {}));
///<reference path='../typings/jquery/jquery.d.ts' />
///<reference path='../typings/lodash/lodash.d.ts' />
///<reference path='../myTypings/etc.d.ts' />
///<reference path='../typings/q/Q.d.ts' />
///<reference path='./settings.ts' />
function Reload() {
    location.reload();
}
var Lib;
(function (Lib) {
    function gensym() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        }
        return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
    }
    Lib.gensym = gensym;
    // ====================================  Tree Converter ===============================================
    function update_in(data, path) {
        // TESTED
        var temp = data;
        for (var k in path) {
            var el = path[k];
            if (temp[el] == undefined) {
                temp[el] = {};
            }
            temp = temp[el];
        }
        // temp[last] = {}
        return data;
    }
    Lib.update_in = update_in;
    function flush_to_storage(data) {
        store.set("state", data);
    }
    Lib.flush_to_storage = flush_to_storage;
    function fill_from_storage() {
        if (store.get("state") == undefined) {
            var state = {
                MapView: { name: "", children: [], font_size: 14, shouldReverse: false },
                LeftTree: { name: "", children: [], font_size: 14, shouldReverse: false },
                RightTree: { name: "", children: [], font_size: 14, shouldReverse: false },
                Data: "",
                SplittedData: { topic: "", data: [] },
                TagSize: {},
                maxFont: 24,
                minFont: 14
            };
        }
        else {
            var state = store.get("state");
        }
        if (state.Data.trim() == "") {
            state.Data = Settings.PREPOPULATE_DATA;
        }
        // populate html element with data
        $("#textor").html(state.Data);
        return state;
    }
    Lib.fill_from_storage = fill_from_storage;
    function split_complexor(term) {
        var body = term.split(/\s+/);
        var data = body.pop();
        return { body: body, data: data };
    }
    Lib.split_complexor = split_complexor;
    function complexor(term, s) {
        var contextSensitive = [];
        var contextInSensitive = [];
        var data = split_complexor(term).body;
        var complete_begins_with = split_complexor(term).data;
        //  =======  context sensitive complexor ======
        _.each(s.SplittedData.data, function (v, k) {
            // if branch is aligned
            if (_.intersection(data, v).length == data.length) {
                contextSensitive = contextSensitive.concat(_.difference(v, data));
            }
        });
        //  Sort by popularity            
        contextSensitive = _.sortBy(contextSensitive, function (v, k) {
            return -s.TagSize[v];
        });
        // ======== context insensitive complexor ===============
        contextInSensitive = _.sortBy(_.filter(_.keys(s.TagSize), function (v, k) {
            // remove self references
            return !_.contains(data, v);
        }), function (v, k) {
            // sort by popularity
            return -s.TagSize[v];
        });
        // filter result by popularity
        return _.uniq(_.filter(contextSensitive.concat(contextInSensitive), function (v, k) {
            // we should not use root's name
            if (v === s.MapView.name) {
                return false;
            }
            return _.startsWith(v, complete_begins_with);
        })).splice(0, 10);
    }
    Lib.complexor = complexor;
    function next_line_data(data, splitter, symbols) {
        if (splitter === void 0) { splitter = "</br>"; }
        if (symbols === void 0) { symbols = 7; }
        var result = [];
        _.each(data, function (v, k) {
            if (k % symbols == 0) {
                result.push(splitter);
            }
            result.push(v);
        });
        return result.join("");
    }
    Lib.next_line_data = next_line_data;
    function simple_map_to_d3js_tree_relation(data) {
        // TESTED
        function transform(v, k) {
            var result = {
                name: k,
                children: _.map(v, transform),
                font_size: 14,
                width: 14,
                height: 14,
                shouldReverse: false
            };
            return result;
        }
        return _.map(data, transform)[0];
    }
    Lib.simple_map_to_d3js_tree_relation = simple_map_to_d3js_tree_relation;
    function build_tree(data) {
        // TESTED
        var result = {};
        var return_result = {};
        _.each(data.data, function (v, k) {
            update_in(result, v);
        });
        return_result[data.topic] = result;
        return return_result;
    }
    Lib.build_tree = build_tree;
    function split_reverses(data) {
        var pivot = (data.MapView.children.length) / 2;
        var leftTree = {
            font_size: data.MapView.font_size,
            name: "",
            children: [],
            shouldReverse: null
        };
        var rightTree = {
            font_size: data.MapView.font_size,
            name: data.MapView.name,
            children: [],
            shouldReverse: null
        };
        _.each(data.MapView.children, function (v, k) {
            if (k > pivot) {
                leftTree.children.push(v);
            }
            else {
                rightTree.children.push(v);
            }
        });
        data.LeftTree = leftTree;
        data.RightTree = rightTree;
    }
    Lib.split_reverses = split_reverses;
    function calculate_reverses(data) {
        // we consider reversing other half of the data
        var pivot = (data.MapView.children.length) / 2;
        function propagate_recur(data, shouldReverse) {
            if (shouldReverse === void 0) { shouldReverse = false; }
            data.shouldReverse = shouldReverse;
            _.each(data.children, function (v, k) {
                propagate_recur(v, shouldReverse);
            });
        }
        _.each(data.MapView.children, function (v, k) {
            if (k > pivot) {
                propagate_recur(v, true);
            }
            else {
                propagate_recur(v, false);
            }
        });
        data.MapView.shouldReverse = null;
    }
    Lib.calculate_reverses = calculate_reverses;
    function parse(data) {
        // TESTED
        var data = data.replace(/&nbsp;/g, " ");
        // debugger 
        var element = /<p>(.*?)<\/p>/g;
        var result = { topic: "", data: [] };
        var parsed_data = _.filter(_.map(data.split(element), function (v, k) {
            var v = v.replace(Settings.ANY_HTML, " ");
            return _.compact(v.match(Settings.CLEAN_TEXT));
        }), function (v, k) {
            if (v.length == 0) {
                return false;
            }
            return true;
        });
        try {
            result.topic = parsed_data.shift().join(" ");
            result.data = parsed_data;
        }
        catch (e) {
            result.topic = "";
            result.data = [];
        }
        return result;
    }
    Lib.parse = parse;
    function maximumTagSize(data) {
        var maxTagSize = 0;
        function calc_max_recursive(data) {
            if (data.children.length > maxTagSize) {
                maxTagSize = data.children.length;
            }
            _.each(data.children, calc_max_recursive);
        }
        calc_max_recursive(data);
        return maxTagSize;
    }
    Lib.maximumTagSize = maximumTagSize;
    function calculate_length_of_all_children_in_one_node(el) {
        function calc_recur(el, k) {
            var length = el.children.length;
            length += _.sum(_.map(el.children, calc_recur));
            el.children_length = length;
            return length;
        }
        calc_recur(el, 0);
    }
    Lib.calculate_length_of_all_children_in_one_node = calculate_length_of_all_children_in_one_node;
    function calculateTagSize(state) {
        calculate_length_of_all_children_in_one_node(state.MapView);
        var tagSize = {};
        var maxSize = maximumTagSize(state.MapView);
        var maxFont = state.maxFont;
        var minFont = state.minFont;
        function recursiveRecalculator(data) {
            if (data.children == undefined) {
                return;
            }
            var curLen = data.children_length;
            if (curLen == 0) {
                curLen = 1;
            }
            var curName = data.name;
            var curSize = Math.log(curLen) / Math.log(maxSize) * (maxFont - minFont) + minFont;
            data.font_size = curSize;
            tagSize[curName] = curSize;
            // should not pass errors
            if (_.isNaN(data.font_size) || !_.isFinite(data.font_size)) {
                data.font_size = minFont;
            }
            _.each(data.children, function (v, k) {
                recursiveRecalculator(v);
            });
        }
        recursiveRecalculator(state.MapView);
        return tagSize;
    }
    Lib.calculateTagSize = calculateTagSize;
})(Lib || (Lib = {}));
var State;
(function (_State) {
    _State.State = Lib.fill_from_storage();
    // ======================== PUB SUB =================
    var _subscribers = {};
    function pub() {
        _.map(_subscribers, function (v, k) {
            v(_State.State);
        });
    }
    _State.pub = pub;
    function sub(cb) {
        var id = Lib.gensym();
        _subscribers[id] = cb;
        return id;
    }
    _State.sub = sub;
    function unsub(id) {
        delete _subscribers[id];
    }
    _State.unsub = unsub;
    // =================== View Methods ===============================
    function get_completions(data) {
        return Lib.complexor(data, _State.State);
    }
    _State.get_completions = get_completions;
    function on_text_change(data) {
        _State.State.SplittedData = Lib.parse(data);
        _State.State.Data = data;
        var result = Lib.simple_map_to_d3js_tree_relation(Lib.build_tree(_State.State.SplittedData));
        _State.State.MapView = result;
        _State.State.TagSize = Lib.calculateTagSize(_State.State);
        Lib.split_reverses(_State.State);
        Lib.flush_to_storage(_State.State);
        pub();
    }
    _State.on_text_change = on_text_change;
})(State || (State = {}));
///<reference path='../typings/jasmine/jasmine.d.ts' />
///<reference path='../src/main.ts' />
///<reference path='../src/settings.ts' />
describe("Test data parsing", function () {
    it("tests parse", function () {
        var data = Settings.TEST_DATA_HTML;
        var result = Lib.parse(data);
        var counter = 0;
        _.each(result, function (v, k) {
            _.each(v, function (v, k) {
                counter += 1;
            });
        });
        console.log(result);
        console.log(counter);
        expect(counter).toBe(37);
    });
    it("tests tree building", function () {
        var data = Settings.TEST_DATA_HTML;
        var result = Lib.parse(data);
        var tree = Lib.build_tree(result);
        var root = "Покупка всякого";
        expect(_.values(tree).length).toBe(1);
        expect(_.values(tree[root]).length).toBe(8);
        expect(_.values(tree[root]['молочка']).length).toBe(4);
        expect(_.values(tree[root]['мясо']).length).toBe(3);
        console.log(tree);
    });
    it("tests d3.js acceptable tree  building", function () {
        var data = Settings.TEST_DATA_HTML;
        var result = Lib.parse(data);
        var tree = Lib.build_tree(result);
        var d3_tree = Lib.simple_map_to_d3js_tree_relation(tree);
        console.log(d3_tree);
        expect(d3_tree.children.length).toBe(8);
    });
    it("tests complexor", function () {
        State.on_text_change(Settings.TEST_DATA_HTML);
        // console.log(State.get_completions("шарлотка "))
        var result = ['сахар', 'корица', 'ваниль', 'разрыхлитель', 'яблоки', 'молочка', 'овощи', 'мясо', 'кофе', 'сыр'];
        expect(State.get_completions("шарлотка ")).toEqual(result);
        expect(State.get_completions("шарлот")).toEqual(["шарлотка"]);
        expect(State.get_completions("шарлотка са")).toEqual(["сахар"]);
        expect(State.get_completions("овощи огурцы ")[0]).toEqual("сметана");
        expect(State.get_completions("")[0]).toEqual("шарлотка");
    });
});
