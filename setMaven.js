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
      var mavenInstallationIds =xpath.select("//maven-builder/config/installationId",doc); 
      if (mavenInstallationIds) {
          mavenInstallationIds.forEach(function(mavenId){
            mavenId.textContent ="Maven 3.2.3"; 
          }) ; 
       
          var finalXml = new XMLSerializer().serializeToString(doc); 
          fs.writeFile(file, finalXml, (err)=>{
              if (err) {
                  return console.log(err);
              } 
              console.log(`The file ${file} is saved.`);

          });
        }
      else {
        console.log(`The file ${file} is NOT hudson config XML. `);
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
          <patterns>
            <hudson.plugins.ws__cleanup.Pattern>
              <pattern>**/target/**</pattern>
              <type>INCLUDE</type>
            </hudson.plugins.ws__cleanup.Pattern>
          </patterns>
          <deleteDirs>true</deleteDirs>
          <skipWhenFailed>true</skipWhenFailed>
          <notFailBuild>true</notFailBuild>
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