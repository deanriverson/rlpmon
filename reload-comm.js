module.exports = (function() {
	var sp = require("serialport");
	var SerialPort = sp.SerialPort;
	var serialPort;

	var isOpen = false;
	var openCallback;
	var readCallback;

	var portName;
	var requestedCurrent;

	var readInterval;

	function onData(data) {
		var tokens = data.trim().split(' ');
		// console.log('>>>>>', tokens);

		switch (tokens[0]) {
			case 'set':
				requestedCurrent = tokens[1];
				break;

			case 'read':
			 	readCallback && readCallback(tokens[1], tokens[2]);
				break;
		}
	}

	function onPortOpen() {
		console.log('sp open');
		isOpen = true;

		serialPort.on('data', onData);
		serialPort.write('set\n', function() {
			openCallback && openCallback(portName);
		});
	}

	function searchForReloadPro(cb, opts) {
		sp.list(function(err, ports) {
			var rlpPort = ports.filter(function(port) {
				return port.manufacturer === 'Arachnid Labs Ltd';
			});

			console.log('Re:load Pro is on port', rlpPort[0].comName);
			cb(rlpPort[0].comName, opts);
		});
	}

	function openReloadPro(commName, opts) {
		portName = commName;
		serialPort = new SerialPort(commName, opts);
		serialPort.on('open', onPortOpen);
	}

	return {
		init: function(opencb, commName, opts) {
			opts = opts || { baudrate: 115200 };
			opts.parser = sp.parsers.readline('\n');
			openCallback = opencb;

			if (commName) {
				openReloadPro(commName, opts);
			} else {
				searchForReloadPro(openReloadPro, opts);
			}
		},

		getCommPort: function() {
			return portName;
		},

		setCurrentMillis: function(currentMillis, cb) {
			if (!isOpen) return;

			requestedCurrent = Math.max(0, Math.min(6000, currentMillis));

			serialPort.write('set ' + requestedCurrent + '\n', function(err, results) {
				cb && cb(requestedCurrent, err, results);
			});
		},

		getRequestedCurrent: function() {
			return requestedCurrent;
		},

		startReading: function(interval, cb) {
			readCallback = cb;

			readInterval = setInterval(function() {
				serialPort.write('read\n', function(err, results) {
					err && clearInterval(readInterval);
				});
			}, interval);
		},

		stopReading: function() {
			clearInterval(readInterval);
		}
	}
})();
