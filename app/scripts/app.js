'use strict';

angular.module('reloadApp', ['ngRoute', 'gaugejs'])

.config(function($routeProvider) {
	$routeProvider
		.when('/index', {
			controller: 'MonitorCtrl',
			templateUrl: '/views/main.html'
		})

		.otherwise({
			redirectTo: '/index'
		});
});
