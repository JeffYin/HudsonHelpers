/*
  Enable Clean Workspace in each build
*/
var fs = require('fs');
var Finder = require('fs-finder');

var rootDir = "C:\\.hudson\\jobs";


console.log(`Current directory: ${__dirname}`); 
var workspaceFolders = Finder.from(rootDir).findDirectories("workspace");
//console.log(`Files: ${files}`); 

workspaceFolders.forEach((folder)=> {
    console.log(folder);
    // deleteFolder(folder);
});

function deleteFolder(folder) {
    fs.deleteFolder(folder); 
 };
