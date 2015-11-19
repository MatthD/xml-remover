/* Small APP to remove XML Balises , Attributes ... */

var cheerio = require('cheerio'),
    args = require('args'),
    kuler = require('kuler'),
    fs = require('fs'),
    isXml = require('is-xml'),
    pd = require('pretty-data'),
    argv = process.argv,
    file,
    check,
    $;


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
    }
    // If it's an existing file.
    if(stats.isDirectory()){
      console.log(kuler("Checking folder ... " , "green"));
    }
  });

  var rmAndPretty = function(path , file){
    file = fs.readFileSync(parsed.input).toString();
    check = isXml(file);      
    if(!check){
      console.error(kuler("It's not an XML file :(" , "red"));
      return;
    }
    $ = cheerio.load(file, {xmlMode: true});
    if(parsed.balise){
      $(parsed.balise).remove();
    }
    if(parsed.attribut){
      $(parsed.attribut).remove();
    }
    var xml = $.xml().replace(/^\s*$/gm, '');
    xml = pd.pd.xml(xml);
    fs.writeFile(parsed.input , xml , function(){
      console.log(kuler("Suppresion(s) éffectuées" , "green"));
    });
  };