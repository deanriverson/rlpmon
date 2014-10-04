'use strict';

angular.module('reloadApp', ['ngRoute'])

.config(function($routeProvider) {
	console.log('CONFIGURING ROUTES');
	$routeProvider
		.when('/index', {
			controller: 'MonitorCtrl',
			templateUrl: '/views/main.html'
		})

		.otherwise({
			redirectTo: '/index'
		});
});
