var fs = require('fs');

// main function - loop through the root package dir and create one archive per sub directory
// (assumption is that each sub dir contains one entire project)
function createPackages(rootDirectory)
{
	fs.readdir(rootDirectory, function(err, files)
	{	
		files.forEach(function(item){
			if (item.indexOf('.')  != 0)
			{
				var file = rootDirectory + '\\' + item;
				fs.stat(file, function(err,stats){
					if (stats.isDirectory()){
						console.log('** PACKAGE **\n' + item);
						createPackage(item, file, rootDirectory);
					}
				});
			}
		});
	});
}

// create each zipped archive
function createPackage(packageName, path, rootPath)
{	
	console.log('* PACKING ' + packageName);
	var zip = new require('node-zip')();

	var archive = zipMe(path, zip);
	console.log('** ARCHIVING')
	var content = archive.generate({base64:false,compression:'DEFLATE'});

	fs.writeFileSync(rootPath + '\\' + packageName + '.zip', content);
	console.log('saved as ' + rootPath + '\\' + packageName + '.zip');
}

// recursive function to either add a file to the current archive or recurse into the sub directory 
function zipMe(currentDirectory, zip)
{
	console.log('looking at: ' + currentDirectory);
	var dir = zip.folder(currentDirectory);

	var files = fs.readdirSync(currentDirectory)

	files.forEach(function(item){
		if (item.indexOf('.')  != 0)
		{
			var file = currentDirectory + '\\' + item;
			var stats = fs.statSync(file);
			if (stats.isDirectory())
			{
				console.log('directory; recursing..')
				return zipMe(file, dir);
			}
			else
			{
				console.log('file; adding..')
				dir.file(file, fs.readFileSync(file,'utf8'));
			}
		}
	});

	return dir
}

exports.createPackages = createPackages;