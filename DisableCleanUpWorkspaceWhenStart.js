/*
  Enable Clean Workspace in each build
*/
var fs = require('fs');
var Finder = require('fs-finder'); 
var DOMParser = require('xmldom').DOMParser;
var XMLSerializer=require('xmldom').XMLSerializer; 
var xpath=require('xpath');
// var rootDir = "C:\\.hudson\\jobs\\WebService-v.5.40.10.01";
//  var rootDir = "C:\\.hudson\\jobs";
 var rootDir = __dirname; 

console.log(`Current directory: ${__dirname}`); 
var files = Finder.from(rootDir).find("config.xml");
//console.log(`Files: ${files}`); 

files.forEach((file)=> {
    addElement(file);
});

function addElement(file) {
   fs.readFile(file, function(err, data) {
      console.log(file);
      var doc = new DOMParser().parseFromString(data.toString());
      var container =xpath.select("/project/project-properties",doc)[0]; 
        if (container) {
          var node = xpath.select("//entry[string = 'cleanWorkspaceRequired']", container);
          if (node.length!=0) {
            container.removeChild(node[0]); 
          }
      } else {
        console.log(`The file ${file} is NOT hudson config XML. `);
      } 

    //   doc.documentElement.getAttribute();

   });

   function createCleanWorkspaceNode() {
    var node = new DOMParser().parseFromString(
        `
        <entry>
        <string>cleanWorkspaceRequired</string>
        <boolean-property>
          <originalValue class="boolean">true</originalValue>
          <propertyOverridden>false</propertyOverridden>
        </boolean-property>
      </entry>
        `
    ); 
    return node; 
   }
}