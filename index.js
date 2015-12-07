#!/usr/bin/env node

var cheerio = require('cheerio'),
    args = require('args'),
    kuler = require('kuler'),
    fs = require('fs'),
    isXml = require('is-xml'),
    pd = require('pretty-data'),
    argv = process.argv,
    fnRM,
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
           aib -> Remove attribut in balises \n\
           bwoa -> Remove balises withOut attribut name \n\
           ',

    defaultValue : null,
    required : false
  }
]);

var parsed = args.parser(argv).parse(options);

/* ----------- */
/*  SPLIT VAL  */
/* ----------- */
if(parsed.attribut){
  var attVal = (parsed.attribut).split("::").length > 1 ? (parsed.attribut).split("::")[1].split(",,") : 0 ,
      attName = (parsed.attribut).split("::").length > 1 ? (parsed.attribut).split("::")[0] : parsed.attribut ;
}

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

//If no method asked
if(!parsed.method || parsed.method === "and"){
  if(parsed.balise){
    fnRM = function(){
      $(parsed.balise).remove();
    }
  }
  if(parsed.attribut){
    fnRM = function(){
      $("["+  attName +"]").removeAttr(attName);
    }
  }
}
// If method asked + balise & attribute
else if(parsed.balise && parsed.attribut){
  if(parsed.method === "bwa"){
    fnRM = function(){
      if(!attVal.length > 0){
        $(parsed.balise + "["+  attName +"]").remove();
        return;
      }
      for (var i = 0; i < attVal.length; i++) {
        $(parsed.balise + "["+  attName +"='"+ attVal[i] +"']").remove();
      };
    }
  }
  else if(parsed.method === "aib"){
    fnRM = function(){
      if(!attVal.length > 0){
        $(parsed.balise + "["+  attName +"]").removeAttr(attName);
        return;
      }
      for (var i = 0; i < attVal.length; i++) {
        $(parsed.balise + "["+  attName +"='"+ attVal[i] +"']").removeAttr(attName);
      };
    }
  }
  else if (parsed.method === "bwoa"){
    fnRM = function(){
      if(!attVal.length > 0){
        $(parsed.balise + ":not(["+  attName +"])").remove(attName);
        return;
      }
      var attrList = "";
      for (var i = 0; i < attVal.length; i++) {
        attrList = attrList + '['+  attName +'~="'+ attVal[i] +'"]';
        // Do not add coma to lastest
        if(!(i === (attVal.length -1))){
          attrList = attrList + " , ";
        }
        // $(parsed.balise + "["+  attName +"='"+ attVal[i] +"']").remove(attName);
      };
      $(parsed.balise).not(attrList).remove();
    }
  }
}
// People send method without balise Or attribut
else{
  console.error("You asked method but you forgot balise or attribut !");
  process.exit;
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
      process.stdout.write(kuler("File detected : \r"  , "blue"));
      process.stdout.clearLine();
      rmAndPretty(parsed.input);
    }
    // If it's an existing file.
    if(stats.isDirectory()){
      var nbOfFiles = 0;
      process.stdout.write(kuler("Folder detected ... \r" , "blue"));
      process.stdout.clearLine();
      fs.readdir(parsed.input, function(err, files){
        for (var i = 0 ; i < files.length ; i++){
          isRm = rmAndPretty(parsed.input + files[i] , i , files.length );
          if(isRm){
            nbOfFiles++;
          }
        }
        console.info(kuler("Number of files processed : " + nbOfFiles , "green"));
      });
    }
  });

  var rmAndPretty = function(path,index,filesLength){
    file = fs.readFileSync(path).toString();
    check = isXml(file);      
    if(!check){
      process.stdout.write(kuler("Not XML file detected \r" , "red"));
      process.stdout.clearLine()
      return;
    }
    $ = cheerio.load(file, {xmlMode: true});
    fnRM();
    process.stdout.write("\r");
    process.stdout.write("File " + kuler(index, "orange") +" / "+ kuler(filesLength , "green") + " parsed ... ");

    var xml = $.xml().replace(/^\s*$/gm, '');
    xml = pd.pd.xml(xml);
    fs.writeFileSync(path , xml);
    return true;
  };