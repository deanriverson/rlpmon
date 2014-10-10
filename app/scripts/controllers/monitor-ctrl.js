'use strict';

angular.module('reloadApp')

.controller('MonitorCtrl', function($scope, $interval, $timeout, chartService) {
	var MAX_TEMP = 150,
		powerID = chartService.createChart('power', 'power'),
		voltageID = chartService.createChart('voltage', 'voltage'),
		resistanceID = chartService.createChart('resistance', 'resistance'),
		actCurrentID = chartService.createChart('actual-current', 'current'),
		reqCurrentID = chartService.createChart('requested-current', 'current');

	function updateValues(v, i) {
		$scope.requestedCurrent = chartService.tick(reqCurrentID, $scope.requestedCurrent);
		$scope.lastI = chartService.tick(actCurrentID, i);
		$scope.lastV = chartService.tick(voltageID, v);
		$scope.lastP = chartService.tick(powerID, v*i);
		$scope.lastR = chartService.tick(resistanceID, isNaN(v/i) ? 0 : v/i);
	}

	var socket = io();

	$scope.currentInput = 0;
	$scope.requestedCurrent = 0;
	$scope.lastV = $scope.lastI = $scope.lastP = $scope.lastR = 0;

	$scope.inputDisabled = true;
	$scope.commPort = "No Connection"
	$scope.connectionClass = "not-connected";

	$scope.temp = 25;
	$scope.degreeUnit = 'C';

    $scope.maxValue = MAX_TEMP;
 	$scope.animationTime = 30;
	$scope.gaugeOptions = {
        lines: 10,
        angle: 0,
        lineWidth: 0.44,
        pointer: {
            length: 0.7,
            strokeWidth: 0.035,
            color: '#a0a0a0'
        },
        limitMax: 'true',
		percentColors: [[0.0, "#00a000" ], [0.6, "#00a000" ], [0.75, "#ffff00"], [0.95, "#ff0000"]],
        strokeColor: '#E0E0E0',
        generateGradient: true
    };

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
			$scope.currentInput = currentMillis / 1000;
		});
	});

	socket.on('commPort', function(portName) {
		if (!portName) return;
		$scope.$apply(function() {
			$scope.inputDisabled = false;
			$scope.connectionClass = "connected";
			$scope.commPort = portName;
		});
	});

	socket.on('vit', function(v, i, t) {
		$scope.$apply(function() { 
			$scope.temp = t > MAX_TEMP ? MAX_TEMP : t;
			updateValues(v / 1000, i / 1000);
		});
	});
});
