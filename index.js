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
    isRm,
    $;


var options = args.Options.parse([
  {
    name: 'help',
    shortName: 'h',
    help: 'Get Help',
    defaultValue : null,
    type : "bool",
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
    name: 'balise',
    shortName: 'b',
    help: 'Remove all balises (ex: -b span)',
    defaultValue : null,
    required : false
  },
  {
    name: 'attribut',
    shortName: 'a',
    help: 'Remove all asked attributs (ex: -a type)',
    defaultValue : null,
    required : false
  },
  {
    name: 'method',
    shortName: 'm',
    help: '(See methods values below) \n\
           \n\
           and -> Remove balises & attributs \n\
           bwa -> Remove balises with attribut name \n\
           aib -> Remove attribut in balises',
    defaultValue : null,
    required : false
  }
]);

var parsed = args.parser(argv).parse(options);

/* ----------- */
/*  CHECK ARGS */
/* ----------- */

if(parsed.help){
  // shows help 
  console.info(options.getHelp());
  return;
}

if(!parsed.input){
  console.info(kuler("Please indicate XML File/Folder , see help" , "red"));
  return;
}

if(!(parsed.balise || parsed.attribut)){
  console.info(kuler("Please indicate balise/attribut to remove, see help" , "red"));
  return;
}

/* ----------- */
/*  DEL ELEM   */
/* ----------- */

  parsed.input = (parsed.input).toString()

  fs.stat(parsed.input , function(err, stats){
    if(err){
      console.error(kuler("File or Folder does not exist" , "red"));
      return;
    }
    // If it's an existing file.
    if(stats.isFile()){
      rmAndPretty(parsed.input);
      process.stdout.write(kuler("File processed : \r"  , "green"));
    }
    // If it's an existing file.
    if(stats.isDirectory()){
      var nbOfFiles = 0;
      process.stdout.write(kuler("Folder detected ... \r" , "orange"));
      fs.readdir(parsed.input, function(err, files){
        for (var i = 0 ; i < files.length ; i++){
          isRm = rmAndPretty(parsed.input + files[i]);
          if(isRm){
            nbOfFiles++;
          }
        }
        console.info(kuler("Number of files processed : " + nbOfFiles , "green"));
      });
    }
  });

  var rmAndPretty = function(path){
    file = fs.readFileSync(path).toString();
    process.stdout.write(kuler("Checking XML file ... \r" , "orange")); 
    check = isXml(file);      
    if(!check){
      process.stdout.write(kuler("Not XML file detected \r" , "red"));
      return;
    }
    $ = cheerio.load(file, {xmlMode: true});
    if(parsed.balise && parsed.attribut){
      $(parsed.balise).remove();
    }
    if(parsed.balise){
      $(parsed.balise).remove();
    }
    if(parsed.attribut){
      $("*").removeAttr(parsed.attribut);
    }
    var xml = $.xml().replace(/^\s*$/gm, '');
    xml = pd.pd.xml(xml);
    fs.writeFileSync(path , xml);
    return true;
  };