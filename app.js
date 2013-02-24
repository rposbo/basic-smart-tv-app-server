var server = require("./server"),
	router = require("./route"),
	requestHandlers = require("./requestHandlers");

// launch server
var handle = {}
handle["Widget"] = requestHandlers.widget;
handle["widgetlist.xml"] = requestHandlers.widgetlist;
handle["favicon.ico"] = requestHandlers.favicon;

var port = 80;
server.start(router.route, handle, port);