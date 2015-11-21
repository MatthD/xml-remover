xml-remover
==========
Command line XML elements remover

Can be lauch on file/folder , if folder , will check which one is xml.

## Install 


`npm i -g xml-remover`


## Usage


### Help 
`xmlrm —help`


###Example

`xmlrm -i /Path/To/File.xml -b span`

Will remove all span from File.xml

`xmlrm -i /Path/To/Folder/ -b span`

Attention : to work with folder don't forget "/" after folder name !


### Params


--input, -i ,	 Input folder or XML file, Required (null by default)

--balise, -b,	Remove all balises (ex: -b span) (null by default)

--attribut, -a ,	Remove all asked attributs (ex: -a type) (null by default)

--method, -m	(See methods values below) (null by default)

           and -> Remove balises & attributs (Enable by default)
           bwa -> Remove balises with attribut name
           aib -> Remove attribut in balises 
           
           
           
### Complexe example

- `xmlrm -i /Path/To/folder/ -b title -a type -m bwa`

    Will remove all `<title> ` with a "type" attribute
    
    
- `xmlrm -i /Path/To/folder/ -b title -a type::value -m bwa`

    Will remove all `<title> ` with a "type" attribute that have a "value" value
    
    
- `xmlrm -i /Path/To/file.xml -b title -a type -m aib`

    Will remove all "type"  attribute in  `<title> ` balises






