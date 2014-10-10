angular.module('reloadApp')

.factory('chartService', function() {
	var charts = {}, chartCount = 0;

	function chart(parentDiv, className) {
		var data = [];

		var margin = {top: 25, right: 0, bottom: 8, left: 40},
			width = 500 - margin.right,
			height = 98 - margin.top - margin.bottom;

		var time = d3.scale.linear()
			.domain([0, 1])
			.range([0, width]);

		var y = d3.scale.linear()
			.domain([0, 1])
			.range([height, 0]);

		var line = d3.svg.line()
			.interpolate('linear')
			.x(function(d, i) { return time(i); })
			.y(function(d, i) { return y(d); });

		var svg = d3.select('#'+parentDiv).append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.append('g')
				.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

		var yAxis = d3.svg.axis().scale(y).ticks(5).orient('left');

		svg.append('defs').append('clipPath')
			.attr('id', 'clip')
			.append('rect')
				.attr('width', width)
				.attr('height', height);

		svg.append('g')
			.attr('class', 'y axis')
			.call(yAxis);

		var path = svg.append('g')
			.attr('clip-path', 'url(#clip)')
			.append('path')
				.datum(data)
				.attr('class', 'line '+className)
				.attr('d', line);

		return {
			yMin: 0,
			yMax: 0,

			yAxis: yAxis,
			yScale: y,
			time: time,

			svg: svg,
			path: path,
			line: line,
			data: data 
		};
	}

	function rescaleYAxis(chart) {
		chart.yScale.domain([chart.yMin, chart.yMax]);
		chart.svg.select('.y.axis').call(chart.yAxis);
	}

	return {
		createChart: function(parentDiv, className) {
			charts[++chartCount] = chart(parentDiv, className);
			return chartCount;
		},

		tick: function(chartID, datum) {
			var chart = charts[chartID];

			if (!chart) return;

			chart.data.push(datum);

			if (chart.data.length > 10000) {
				chart.data.shift();
			} else {
				chart.time.domain([0, chart.data.length]);
			}

			if (datum > chart.yMax) {
				chart.yMax = datum;
				rescaleYAxis(chart)
			} 

			if (datum < chart.yMin) {
				chart.yMin = datum;
				rescaleYAxis(chart)
			}

			chart.path.transition().attr('d', chart.line);

			return datum;
		}
	}
})