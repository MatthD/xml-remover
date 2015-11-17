var cheerio = require('cheerio'),
    args = require('args'),
    argv = process.argv.split(' '),
    $ = cheerio.load('<ul id="fruits">\
<li class="apple test">Apple</li>\
<li class="orange pear">Orange</li>\
<li class="pear">Pear2</li>\
</ul>' , {xmlMode: true});

var options = args.Options.parse([
    {
        name: 'balise',
        shortName: 'b',
        help: 'Remove all asked balises'
    }
]);

var parsed = args.parser(argv).parse(options);

console.log(" parsed " , parsed);

$('li').filter(function(i, el) {
  console.log("li : " , $(this).text() );
  if($(this).attr('class').indexOf("orange2") > -1){
    $(this).remove();
  }
});

console.log("$ "  , $.xml());