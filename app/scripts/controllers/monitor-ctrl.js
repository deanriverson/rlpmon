'use strict';

angular.module('reloadApp')

.controller('MonitorCtrl', function($scope) {
	console.log('IN MONITOR CTRL');

	var socket = io();

	$scope.message = "";
	$scope.messages = [];

	$scope.onKeyUp = function(ev) {
		if (ev.keyCode == 13) {
			console.log('sending', $scope.message, 'to server');
			socket.emit('chat_message', $scope.message);
			$scope.message = '';
		}
	};

	socket.on('chat_message', function(msg) {
		$scope.$apply(function() {
			$scope.messages.push(msg);
		});
		console.log('got chat message from server', msg, $scope.messages);
	})
});

console.log('registered MonitorCtrl');