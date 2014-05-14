var Vhost = function() {
	this.hostDictionary = {};
};

Vhost.prototype.vhost = function() {
	var hostDictionary = this.hostDictionary;

	return function vhost(req, res, next){
		if (!req.headers.host) return next();
		var host = req.headers.host.split(':')[0];
		var server = hostDictionary[host];
		if (!server){
			server = hostDictionary['*' + host.substr(host.indexOf('.'))];
		}
		if (!server) return next();
		if ('function' == typeof server) return server(req, res, next);
		server.emit('request', req, res);
	};

};

Vhost.prototype.register = function(hosts, app) {
	if ('string' == typeof hosts) hosts = [hosts];
	for (var i = 0; i < hosts.length; i++) {
		this.hostDictionary[hosts[i]] = app;        
	}
};

module.exports = Vhost;