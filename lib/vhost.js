var Vhost = function() {
	this.hostDictionary = {};
	this.hostApps = [];
};

Vhost.prototype.vhost = function() {
	var hostDictionary = this.hostDictionary;
	var hostApps = this.hostApps;
	return function vhost(req, res, next){
		if (!req.headers.host) return next();
		var host = req.headers.host.split(':')[0];
		var server = hostApps[hostDictionary[host]];
		if (!server){
			server = hostApps[hostDictionary['*' + host.substr(host.indexOf('.'))]];
		}
		if (!server) return next();
		if ('function' == typeof server) return server(req, res, next);
		server.emit('request', req, res);
	};

};

Vhost.prototype.register = function(hosts, app) {
	if ('string' == typeof hosts) hosts = [hosts];
	appIndex = this.hostApps.push(app)-1;
	for (var i = 0; i < hosts.length; i++) {
		this.hostDictionary[hosts[i]] = appIndex;		
	}
};

module.exports = Vhost;