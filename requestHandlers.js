var fs = require('fs');

function widgetlist(response, notused, request) {
  console.log("Request handler 'widgetlist' was called");
    var packageDir = "packages";

      BuildPackageXml(__dirname, packageDir, request, function(packageXml){
        var content = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\r\n<rsp stat=\'ok\'>\r\n<list>\r\n' + packageXml + '\r\n</list>\r\n</rsp>';
        var headers = {
          "Content-Type": "application/xml",
          "Content-Length": content.length
        };
        response.writeHead(200, headers);
        response.end(content);
      });
}

function BuildPackageXml(directory, packageDir, request, callback){
  var filesData ='';
  var host = request.headers.host;
  
  fs.readdir('packages', function(err, files){
    files.forEach(function(file){
      console.log('found: '+ file);
      var stats = fs.statSync(directory + '\\' + packageDir + '\\' + file)
              filesData += '<widget id="' + file + '">\r\n' +
                  '<title>' + file + '</title>\r\n' + 
                  '<compression size="' + stats.size + '" type="zip" />\r\n' +
                  '<description>' + file + '</description>\r\n' + 
                  '<download>http://' + host + '/Widget/' + file + '</download>\r\n'+
                  '</widget>';
          });
      callback(filesData);
    });
}

function widget(response, path) {
  console.log("Request handler 'widget' was called for " + path);

    var packageDir = "packages";
    var packagepath = __dirname + '\\' + packageDir + '\\' + path.split('/')[2];
    var widget = fs.readFile(packagepath, 'binary', function(err, data){

    var headers = {
      "Content-Type": "application/zip",
      "Content-Length": data.length // to avoid the "chunked data" response
    };

    response.writeHead(200, headers);
    response.end(data,'binary');
  });
}


function favicon(response) {
  var img = fs.readFileSync('./favicon.ico');
  response.writeHead(200, {"Content-Type": "image/x-icon"});
  response.end(img,'binary');
}

exports.widgetlist = widgetlist;
exports.widget = widget;
exports.favicon = favicon;