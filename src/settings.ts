
module Settings {
    export var NEW_LINE    = `\n|<p>|<br>`
    export var HTML_CHUNK  = /(<[^>]+>)|(\s+)/
    export var ANY_HTML    = /<[^>]+>/g
    export var CLEAN_TEXT  = /[A-zА-я0-9_-]+/g
    export var SHOULD_PREPOPULATE = true
    export var TEST_DATA =   `
             Купить шарлотка сахар
             Купить шарлотка корица
             Купить шарлотка ваниль
             Купить шарлотка разрыхлитель
             Купить шарлотка яблоки
             Купить кофе
             Купить сыр
             Купить хлеб
             Купить колбаса
             Купить молоко
             Купить сливки
             Купить пюре
             Купить помидоры
             Купить огурцы
             Купить огурцы сметана
             Купить лук
             Купить сосиски
             Купить сосиски фарш
             Купить макароны
    `
    // Болгария в_израиле teamviewer_родителям
    export var TEST_DATA_HTML = `<p>Покупка всякого</p>
         <p>шарлотка сахар</p>
         <p>шарлотка корица</p>
         <p>шарлотка ваниль</p>
         <p>шарлотка разрыхлитель</p>
         <p>шарлотка яблоки</p>
         <p>кофе</p>
         <p>молочка сыр</p>
         <p>хлеб</p>
         <p>мясо колбаса</p>
         <p>молочка молоко</p>
         <p>молочка сливки</p>
         <p>пюре</p>
         <p>овощи помидоры</p>
         <p>овощи огурцы</p>
         <p>овощи огурцы сметана</p>
         <p>молочка  сметана</p>        
         <p>овощи лук</p>
         <p>мясо сосиски</p>
         <p>мясо фарш</p>
         <p>мясо</p>
         <p>макароны</p>
         <p>мясо</p>
        `
    export var PREPOPULATE_DATA  = `
       <p>Mind-mapper</p>
       <p>Can add elements </p>
       <p>Can autosave </p>
       <p>Can remove elements</p>
       <p>Can share email</p>
       <p>Can share dropbox</p>
       <p>Can share text </p>
       <p>Good simple-concepts</p>
       <p>Good fast-prototyping</p>
       <p>Good small-data</p>
       <p>Best sketching </p>
       <p>Best todos</p>
        `
    export var TEST__DATA_HTML = "<p> Тестируем </p>" + _.map(_.range(1,100),function(){
        return "<p>" + _.sample(["овощи", "огурцы", "сметана", "шарлотка", "сахар", "Покупка",  "всякого", "барахла"],10).join(" ") + "</p>"
    }).join("")
}
