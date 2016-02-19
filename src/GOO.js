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
var jsnips;
(function (jsnips) {
    function generate_simple_tree(svg, cwidth, cheight, root, shouldReverse, foreignRoot) {
        if (shouldReverse === void 0) { shouldReverse = true; }
        // ************** Generate simple tree  diagram	 *****************
        root.isRoot = true;
        var return_root;
        var level_text_box;
        var tree = d3.layout.tree().size([cheight, (cwidth / 2) - 50]);
        if (shouldReverse) {
            var htmlClass = " reversed ";
        }
        else {
            var htmlClass = " not_reversed ";
        }
        var nodes = tree.nodes(root);
        var links = tree.links(nodes);
        nodes.forEach(function (d) {
            // console.log(d.y)
            // d.y = d.depth * 180 *  0.618
            // d.y = d.depth * 360
            if (shouldReverse) {
                d.y = -d.y;
            }
            d.y = d.y + cwidth / 2;
        });
        // Manage distance between elements
        var diagonal = d3.svg.diagonal().source(function (d) {
            var source = d.source;
            // if foreign root, store it to let another sub tree use
            if (d.source.isRoot) {
                return_root = d.source;
            }
            // we use other's main node to adjust current data
            if (d.source.isRoot && (foreignRoot != undefined)) {
                var source = foreignRoot;
            }
            var inc_width = source.bbox.width;
            // null is root
            if (shouldReverse) {
                return { x: source.x, y: source.y - inc_width / 2 };
            }
            else {
                return { x: source.x, y: source.y + inc_width / 2 };
            }
        }).target(function (d) {
            var target = d.target;
            var inc_width = target.bbox.width;
            if (shouldReverse) {
                return { x: d.target.x, y: d.target.y + inc_width / 2 };
            }
            else {
                return { x: d.target.x, y: d.target.y - inc_width / 2 };
            }
        }).projection(function (d) {
            return [d.y, d.x];
        });
        // just node rendering
        var node = svg.selectAll(".node" + htmlClass).data(nodes).enter().append("g").attr("class", "node" + htmlClass).attr("transform", function (d) {
            return "translate(" + d.y + "," + d.x + ")";
        });
        // text rendering
        node.append("text").attr("dy", function (d) {
            return d.font_size / 3;
        }).style("text-anchor", function (d) {
            return "middle";
        }).style("font-size", function (d) {
            return d.font_size + 'px';
        }).text(function (d) {
            return d.name;
        }).each(function (d) {
            d.bbox = this.getBBox();
        });
        // link(Important, must be last, so bbox will be populated)
        var link = svg.selectAll(".link" + htmlClass).data(links).enter().append("path").attr("class", "link" + htmlClass).attr("d", diagonal).style("stroke-width", function (d) {
            return (d.target.font_size) / 3;
        });
        svg.selectAll("path.link" + htmlClass).data(links).exit().remove();
        svg.selectAll("g.node text" + htmlClass).data(nodes).exit().remove();
        return root;
    }
    jsnips.generate_simple_tree = generate_simple_tree;
    function generate_round_tree(root) {
        // ************** Generate round tree  diagram	 *****************
        // proudly taken from http://bl.ocks.org/mbostock/4339607
        // deps: d3.min.js
        var radius = 960 / 2;
        var cluster = d3.layout.cluster().size([360, radius - 120]);
        var diagonal = d3.svg.diagonal.radial().projection(function (d) {
            return [d.y, d.x / 180 * Math.PI];
        });
        var svg = d3.select("body").append("svg").attr("width", radius * 2).attr("height", radius * 2).append("g").attr("transform", "translate(" + radius + "," + radius + ")");
        var nodes = cluster.nodes(root);
        var link = svg.selectAll("path.link").data(cluster.links(nodes)).enter().append("path").attr("class", "link").attr("d", diagonal);
        var node = svg.selectAll("g.node").data(nodes).enter().append("g").attr("class", "node").attr("transform", function (d) {
            return "rotate(" + (d.x) + ")translate(" + d.y + ")";
        });
        node.append("circle").attr("r", 4.5);
        node.append("text").attr("dy", ".31em").attr("text-anchor", function (d) {
            return d.x < 180 ? "start" : "end";
        }).attr("transform", function (d) {
            return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)";
        }).text(function (d) {
            return d.name;
        });
        d3.select(self.frameElement).style("height", radius * 2 + "px");
    }
    jsnips.generate_round_tree = generate_round_tree;
    function generate_expanding_tree(treeData) {
        // ************** Generate the tree diagram	 *****************
        // proudly taken from  http://bl.ocks.org/d3noob/8375092
        // deps: d3.min.js
        var margin = { top: 20, right: 120, bottom: 20, left: 120 }, width = 960 - margin.right - margin.left, height = 500 - margin.top - margin.bottom;
        var i = 0, duration = 750, root;
        var tree = d3.layout.tree().size([height, width]);
        var diagonal = d3.svg.diagonal().projection(function (d) {
            return [d.y, d.x];
        });
        var svg = d3.select("body").append("svg").attr("width", width + margin.right + margin.left).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        root = treeData[0];
        root.x0 = height / 2;
        root.y0 = 0;
        update(root);
        d3.select(self.frameElement).style("height", "500px");
        function update(source) {
            // Compute the new tree layout.
            var nodes = tree.nodes(root).reverse(), links = tree.links(nodes);
            // Normalize for fixed-depth.
            nodes.forEach(function (d) {
                d.y = d.depth * 180;
            });
            // Update the nodes…
            var node = svg.selectAll("g.node").data(nodes, function (d) {
                return d.id || (d.id = ++i);
            });
            // Enter any new nodes at the parent's previous position.
            var nodeEnter = node.enter().append("g").attr("class", "node").attr("transform", function (d) {
                return "translate(" + source.y0 + "," + source.x0 + ")";
            }).on("click", click);
            nodeEnter.append("circle").attr("r", 1e-6).style("fill", function (d) {
                return d._children ? "lightsteelblue" : "#fff";
            });
            nodeEnter.append("text").attr("x", function (d) {
                return d.children || d._children ? -13 : 13;
            }).attr("dy", ".35em").attr("text-anchor", function (d) {
                return d.children || d._children ? "end" : "start";
            }).text(function (d) {
                return d.name;
            }).style("fill-opacity", 1e-6);
            // Transition nodes to their new position.
            var nodeUpdate = node.transition().duration(duration).attr("transform", function (d) {
                return "translate(" + d.y + "," + d.x + ")";
            });
            nodeUpdate.select("circle").attr("r", 10).style("fill", function (d) {
                return d._children ? "lightsteelblue" : "#fff";
            });
            nodeUpdate.select("text").style("fill-opacity", 1);
            // Transition exiting nodes to the parent's new position.
            var nodeExit = node.exit().transition().duration(duration).attr("transform", function (d) {
                return "translate(" + source.y + "," + source.x + ")";
            }).remove();
            nodeExit.select("circle").attr("r", 1e-6);
            nodeExit.select("text").style("fill-opacity", 1e-6);
            // Update the links…
            var link = svg.selectAll("path.link").data(links, function (d) {
                return d.target.id;
            });
            // Enter any new links at the parent's previous position.
            link.enter().insert("path", "g").attr("class", "link").attr("d", function (d) {
                var o = { x: source.x0, y: source.y0 };
                return diagonal({ source: o, target: o });
            });
            // Transition links to their new position.
            link.transition().duration(duration).attr("d", diagonal);
            // Transition exiting nodes to the parent's new position.
            link.exit().transition().duration(duration).attr("d", function (d) {
                var o = { x: source.x, y: source.y };
                return diagonal({ source: o, target: o });
            }).remove();
            // Stash the old positions for transition.
            nodes.forEach(function (d) {
                d["x0"] = d.x;
                d["y0"] = d.y;
            });
        }
        // Toggle children on click.
        function click(d) {
            if (d.children) {
                d._children = d.children;
                d.children = null;
            }
            else {
                d.children = d._children;
                d._children = null;
            }
            update(d);
        }
    }
    jsnips.generate_expanding_tree = generate_expanding_tree;
})(jsnips || (jsnips = {}));
///<reference path='../myTypings/etc.d.ts' />
///<reference path='../typings/d3/d3.d.ts' />
///<reference path='./settings.ts' />
///<reference path='./main.ts' />
///<reference path='./jsnips.ts' />
var Tree;
(function (Tree) {
    // var data = jsnips.generate_simple_tree()(state.MapView)
    // var widthPercent = $(window).width()/100    
    var cwidth = $(window).width() - $("#right_panel").width() - 60;
    var cheight = $(window).height();
    function update(state) {
        // debugger
        $("svg").remove();
        var svg = d3.select("body").append("svg").attr("width", cwidth).attr("height", cheight).attr("class", "canvas").append("g");
        var foreignRoot = jsnips.generate_simple_tree(svg, cwidth, cheight, state.RightTree, true);
        jsnips.generate_simple_tree(svg, cwidth, cheight, state.LeftTree, false, foreignRoot);
    }
    // subsribe to updates
    State.sub(update);
    // change on resize
    $(window).resize(function () {
        cwidth = $(window).width() - $("#right_panel").width() - 60;
        cheight = $(window).height();
        update(State.State);
    });
    // evaluate on init
    State.on_text_change(State.State.Data);
})(Tree || (Tree = {}));
var Textor;
(function (Textor) {
    // * This is the text side module
    function TextComplete(textSelector) {
        // completer
        $(textSelector)["textcomplete"]([{
            match: /(.*?)$/,
            body: "",
            search: function (term, callback) {
                this.body = Lib.split_complexor(term).body.join(" ");
                callback(State.get_completions(term));
            },
            index: 1,
            replace: function (word) {
                return (this.body + " " + word + " ").trim();
            }
        }]);
    }
    Textor.TextComplete = TextComplete;
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
    function initTextEditor(text_node) {
        var editor = new MediumEditor(text_node.get(0), {
            placeholder: { text: "Try to write anything  here" },
            ColorPicker: {},
            paste: {
                forcePlainText: true,
                cleanPastedHTML: true,
                cleanReplacements: [],
                cleanAttrs: ['class', 'src', 'dir', "style"],
                cleanTags: ['meta', "script"]
            },
            toolbar: {
                buttons: ['colorPicker', 'bold', 'italic', 'underline', 'h2', 'h3', 'h4', 'h5', 'quote', "strikethrough", "orderedlist", "unorderedlist", "removeFormat"]
            },
            extensions: {
                ColorPicker: new ColorPickerExtension(),
                'table': new MediumEditorTable({
                    rows: 10,
                    columns: 5
                })
            }
        });
        editor.subscribe("editableInput", function (e, data) {
            State.on_text_change($(data).html());
        });
        TextComplete(text_node);
    }
    initTextEditor($("#textor"));
})(Textor || (Textor = {}));
var testData;
(function (testData) {
    // Tree represents this way
    testData.TestData = "\n    @todo @urgent  Do paint; Rebuild tree; Restore database\n    \n    @urgent Must stay the same\n    @todo Here we write todo-s\n    \n    @todo  @mindor Make transition to new React version Study d3.js Write prototype\n    @mindor @later Move to production\n    @todo @later  Get a life\n\n    @later No way you can do anything\n    \n    @mindor @later @globals\n      Blablabla blablabla\n    @later @drogon\n      hohohoh\n    ";
    // This must be translated into:
    testData.TestDataResultingTree = "\n    todo\n      urgent\n      mindor  \n        later\n        globals\n      later\n        drogon\n    later\n    ";
})(testData || (testData = {}));
