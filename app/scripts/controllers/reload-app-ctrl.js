'use strict';

angular.module('reloadApp')

.controller('ReloadAppCtrl', function($scope, $route) {
	console.log('RELOAD APP CTRL!!!!!!!!!!');
	console.log(angular.module('reloadApp')._invokeQueue);
	$scope.awesomeThings = [
		'HTML5 Boilerplate',
		'AngularJS',
		'Karma'
	];

	$scope.$on('$routeChangeSuccess', function(e) {
		console.log('Got route change success', $route.current);
	})
});
