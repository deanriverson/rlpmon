'use strict';

angular.module('reloadApp')

.controller('MonitorCtrl', function($scope) {
	function updateValues(v, i) {
		$scope.lastV = v;
		$scope.lastI = i;
		$scope.lastP = v*i;
		$scope.lastR = isNaN(v/i) ? 0 : v/i;

		$scope.voltages   .push($scope.lastV);
		$scope.currents   .push($scope.lastI);
		$scope.powers     .push($scope.lastP);
		$scope.resistances.push($scope.lastR);
	}

	var socket = io();

	$scope.currentInput = "";
	$scope.requestedCurrent = 0;
	$scope.lastV = $scope.lastI = $scope.lastP = $scope.lastR = 0;

	$scope.voltages = [];
	$scope.currents = [];
	$scope.powers = [];
	$scope.resistances = [];

	$scope.onKeyUp = function(ev) {
		var value;

		if (ev.keyCode == 13) {
			value = parseFloat($scope.currentInput, 10) || 0; 
			socket.emit('setCurrentMillis', value * 1000);
			$scope.currentInput = '';
		}
	};

	socket.on('setCurrentMillis', function(currentMillis) {
		$scope.$apply(function() {
			$scope.requestedCurrent = currentMillis / 1000;
			$scope.currentInput = '' + currentMillis / 1000;
		});
	});

	socket.on('commPort', function(portName) {
		$scope.$apply(function() {
			$scope.commPort = portName;
		});
	});

	socket.on('vi', function(i, v) {
		$scope.$apply(function() { 
			updateValues(v / 1000, i / 1000) 
		});
	});
});
