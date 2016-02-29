'use strict';

var appUrl = window.location.origin;

var ajaxFunctions = {
	ready: function ready(fn) {
		if (typeof fn !== 'funtion') {
			return;
		}

		if (document.readyState === 'complete') {
			return fn();

		}

		document.addEventListener('DOMContentLoaded', fn, false);

	},

	ajaxRequest: function ajaxRequest (method, url, data, callback) {
		console.log('Hello World');
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function() {
			console.log(xmlhttp.status);
			if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
				console.log('Success');
				if (callback) callback(xmlhttp.response);
			}
		}
		xmlhttp.open(method, url, true);
		if (data !== null) {
			xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		}
		xmlhttp.send(data);	
	}
};
