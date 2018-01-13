/*
  Enable Clean Workspace in each build
*/
var fs = require('fs');
var Finder = require('fs-finder');
var DOMParser = require('xmldom').DOMParser;
var XMLSerializer=require('xmldom').XMLSerializer; 
var xpath=require('xpath');
var rootDir = __dirname;


console.log(`Current directory: ${__dirname}`); 
var files = Finder.from(rootDir).find("config.xml");
//console.log(`Files: ${files}`); 

files.forEach((file)=> {
    console.log(file);
    addElement(file);
});

function addElement(file) {
    fs.readFileSync(file); 
   fs.readFile(file, function(err, data) {
      var doc = new DOMParser().parseFromString(data.toString());
      var container =xpath.select("/project/project-properties",doc)[0]; 
      var node = xpath.select("//entry[string = 'hudson-plugins-ws_cleanup-WsCleanup']", container);
      if (node.length==0) {
         var newNode = createCleanWorkspaceNode(); 
         container.appendChild(newNode);

         var finalXml = new XMLSerializer().serializeToString(doc); 
         fs.writeFile(file, finalXml, (err)=>{
             if (err) {
                 return console.log(err);
             } 
             console.log(`The file ${file} is saved.`);

         });

      }

    //   doc.documentElement.getAttribute();

   });

   function createCleanWorkspaceNode() {
    var node = new DOMParser().parseFromString(
        `
        <entry>
        <string>hudson-plugins-ws_cleanup-WsCleanup</string>
        <external-property>
          <originalValue class="hudson.plugins.ws_cleanup.WsCleanup">
            <deleteDirs>false</deleteDirs>
            <skipWhenFailed>false</skipWhenFailed>
            <notFailBuild>false</notFailBuild>
            <cleanupMatrixParent>false</cleanupMatrixParent>
          </originalValue>
          <propertyOverridden>false</propertyOverridden>
          <modified>true</modified>
        </external-property>
      </entry>
        `
    ); 
    return node; 
   }
}