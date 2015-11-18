/* Small APP to remove XML Balises , Attributes ... */

var cheerio = require('cheerio'),
    args = require('args'),
    kuler = require('kuler'),
    fs = require('fs'),
    xmllint = require('xmllint'),
    argv = process.argv;

var options = args.Options.parse([
  {
    name: 'balise',
    shortName: 'b',
    help: 'Remove all asked balises',
    defaultValue : null,
    required : false
  },
  {
    name: 'input',
    shortName: 'i',
    help: 'Input folder or XML file',
    defaultValue : null,
    required : true
  },
  {
    name: 'attribut',
    shortName: 'a',
    help: 'Remove all asked attributs',
    defaultValue : null,
    required : false
  }
]);

var parsed = args.parser(argv).parse(options);

/* ----------- */
/*  CHECK ARGS */
/* ----------- */

if(!parsed.input){
  console.log(kuler("Please indicate XML File/Folder , see help" , "red"));
  return;
}

if(!(parsed.balise || parsed.attribut)){
  console.log(kuler("Please indicate balise/attribut to remove, see help" , "red"));
  return;
}

/* ----------- */
/*  DEL ELEM   */
/* ----------- */

  parsed.input = (parsed.input).toString()

  fs.stat(parsed.input , function(err, stats){
    if(err){
      console.log(kuler("File or Folder does not exist" , "red"));
      return;
    }
    // If it's an existing file.
    if(stats.isFile()){
      console.log(kuler("Checking XML file ... " , "green"));
      var file  =  fs.readFile(parsed.input , function(err, data){
        var check = xmllint.validateXML({
          xml: data
        });
        console.log("check " , check);
      });
      

    }
    // If it's an existing file.
    if(stats.isDirectory()){
      console.log(kuler("Checking folder ... " , "green"));
    }
  });

    $ = cheerio.load('<ul id="fruits">\
<li class="apple test">Apple</li>\
<li class="orange pear">Orange</li>\
<li class="pear">Pear2</li>\
</ul>' , {xmlMode: true});

console.log("parsed " , parsed);

$('li').filter(function(i, el) {
  console.log("li : " , $(this).text() );
  if($(this).attr('class').indexOf("orange2") > -1){
    $(this).remove();
  }
});

console.log("$ "  , $.xml());