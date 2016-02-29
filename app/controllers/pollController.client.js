'use strict';
(function(data) {
var apiUrl = 'https://mongoose-kevinvan1990.c9users.io/';
//function to generate a bar
function genBar(height, width, distFromLeft, color, item, iter) {
  /****************************************************************
  * The height and width of the bars is determined by the         *
  * number of bars and the total number of data points, and the   *
  * bars relative share of data points                            *
  ****************************************************************/
  var bar = document.createElement('div');
  bar.setAttribute('class', 'barClass');
  bar.style.height = height + 'px';
  bar.style.width = width + 'px';
  bar.id = iter;
  var graph = document.getElementById('xyAxis' + iter);
  graph.appendChild(bar);
  var fromTop = (300 - height) + "px"; 
  bar.style.top = fromTop;
  bar.style.left = distFromLeft + 'px';
  bar.style.backgroundColor = color;
  
  //create list item and set color
  // var listItem = document.createElement('li');
  // listItem.innerHTML = item;
  // listItem.style.color = color;
  // document.getElementById('list' + iter).appendChild(listItem);
  }
//genBar(120, 50, 0);
function genAll(arr, iter) {
  /******************************************************
  * Total width of entire graph is 400px, as bars are   *
  * added, bars will need to be closer to the y axis.   *
  * Takes and array of objects                          *
  * e.g. arr = [ {'option': 'option name', 'votes': 1}] *
  ******************************************************/
  var colors = ['red', 'blue', 'green', 'yellow'];
  var numberOfBars = arr.length;
  //set the width of the bars
  var barWidth = (400/numberOfBars) -10;
  //Sort the array from highest to lowest
  arr.sort(function(a, b) {
    if (a.votes > b.votes) {
      return -1;
    } 
    if (a.votes < b.votes) {
      return 1;
    }
    return 0;
  });
  //Total height is 300px. First element will always be full height
  //Subsequent bars will be same height if same number of votes
  for (var i = 0; i < arr.length; i++) {
    // Distance from left is the number of bars thus far 
    // Multiplied by the width
    /*genBar(barHeight, barWidth, distFromLeft, colors[i], arr[i].option); */
    var barHeight = (arr[i].votes / arr[0].votes) * 300;
    var distFromLeft = barWidth * i;
    genBar(barHeight, barWidth, distFromLeft, colors[i], arr[i].option, iter);
  }
}
//removes a form
function removeForm() {
	var node = document.getElementById('formContainer');
	node.parentNode.removeChild(node);
}

//Helper function to dynically generate the vote data for each poll
function genVoteData(data) {
	var option = data.option;
	var votes = data.votes;
}
// Generates the display for the polls resturned
function genPanelContent(iter, data, main) {

	var div2 = document.createElement('div');
	div2.setAttribute('class', 'panel panel-default');

	var div3 = document.createElement('div');
	div3.setAttribute('class', 'panel-heading');
	div3.setAttribute('role', 'tab');
	div3.setAttribute('id', 'heading' + iter);

	var head = document.createElement('h4');
	head.setAttribute('class', 'panel-title');

	var link = document.createElement('a');
	link.setAttribute('role', 'button');
	link.setAttribute('data-toggle', 'collapse');
	link.setAttribute('data-parent', '#accordian');
	link.setAttribute('href', '#collapse' + iter);
	link.setAttribute('aria-expanded', 'true');
	link.setAttribute('aria-controls', 'collapse' + iter);
	link.innerHTML = data.title;

	var div4 = document.createElement('div');
	div4.setAttribute('id', 'collapse' + iter);
	div4.setAttribute('class', 'panel-collapse collapse');
	div4.setAttribute('role', 'tabpanel');
	div4.setAttribute('aria-labelledby', 'heading' + iter);

	var div5 = document.createElement('div');
	div5.setAttribute('class', 'panel-body');
	div5.innerHTML = 'Poll Title: ' + data.title + '<br/>' + 'Poll URL: '+ data.url;
	for (var i in data.choices) {
		var info = document.createElement('p');
		info.innerHTML = 'Option Name: ' + data.choices[i].option + ', ' + 'votes: ' + data.choices[i].votes; 
		div5.appendChild(info);
	}
	//Generate tags for graph
	var mainGraph = document.createElement('div');
	mainGraph.id = 'graph'+iter;
	mainGraph.setAttribute('class', 'graph');
	//x and y axis
	var axis = document.createElement('div');
	axis.id = 'xyAxis' + iter;
	axis.setAttribute('class', 'xyAxis');
	//generate list
	//var list = document.createElement('ul');
	//list.id = 'list' + iter;
	
	mainGraph.appendChild(axis);
	div5.appendChild(mainGraph);
	//div5.appendChild(list);
	div4.appendChild(div5);

	head.appendChild(link);

	div3.appendChild(head);

	div2.appendChild(div3);

	div2.appendChild(div4);

	main.appendChild(div2);
}
function returnData(response) {
	var div1 = document.createElement('div');
	div1.setAttribute('class', 'panel-group');
	div1.setAttribute('id', 'accordian');
	div1.setAttribute('role', 'tablist');
	div1.setAttribute('aria-multiselectable', 'true');

	console.log(response);
	var data = JSON.parse(response);
	var main = document.getElementById('allPollContent');
	var listDiv = document.createElement('div');
	main.appendChild(div1);
	console.log(data);
	for (var i=0; i<data.length;i++) {
		var pollData = data[i];
		genPanelContent(i, pollData, div1);
		console.log(pollData.choices);
		genAll(pollData.choices, i);
	}
}
function returnUrl(response) {
	// clear form 
	document.getElementById('myForm').reset();
	
	/*
	var first = document.getElementById('myForm');

	while (first.firstChild) {
		if (first.firstChild.id !== "questionDiv" && first.firstChild.id !== "choiceDiv") first.removeChild(first.firstChild);
		if (first.firstChild.id === "submitPoll")  break;
	} */	
	var link = document.createElement('a');
	var text = document.createTextNode(response);
	link.appendChild(text);
	link.href = response.toString();
	link.title ="poll url";
	document.getElementById('placeUrl').appendChild(link);
	console.log(link);
	}	 

function sendPoll() {
	var createForm = document.getElementById('myForm');
	var enc = '';
	var encPairs = [];
	var data = document.getElementsByTagName('input');
       		for (var i=0; i< data.length;i++) {
       			encPairs.push(encodeURIComponent(data[i].id) + '=' + encodeURIComponent(data[i].value));
       		}
       	enc = encPairs.join('&').replace(/%20/g, '+');
	ajaxFunctions.ajaxRequest('POST', apiUrl, enc, returnUrl);
}
//Gathers data in form fields
$(document).ready(function() {
	
	//hide initially
	$('#allPollContent').hide();
	//Toggle user polls and create poll form
	$('#myPolls').click(function() {
		
		$('#allPollContent').show();
		$('#createPollContent').hide();
		$('#placeUrl').hide();
		getPolls();
	});
	$('#createPoll').click(function() {
		$('#createPollContent').show();
		$('#allPollContent').hide();
	});

	//hide create account content initially
	$('#createUserContainer').hide();
	// Toggle login in and create account content
	$('#signUp').click(function() {
		$('#createUserContainer').show();
		$('#loginFormContainer').hide();
	});
	$('#home').click(function() {
		$('#loginFormContainer').show();
		$('#createUserContainer').hide();
	});
	
	$('#submitPoll').click(function() {
		$('#createPollContent').hide();
		sendPoll();
	});
	
	$('#createAccount').click(function() {
		signUpUser();
	});
        var inc = 2;
        $('#addChoice').click(function() {
                var i = inc++; 
                $("#choiceDiv").append(
                        $('<div>', {
                                class: 'form-group',
                                id: 'choiceDiv'+i
                        }).append(
                        $('<label>', {
                                for: 'inpChoice'+ i
                        }).html('Choice '+ i))
                                .append(
                        $('<input>', {
                                type: 'text',
                                class: 'form-control',
                                id: 'inpChoice' + i,
                        })))
        });
});
function getPolls() {
	//start by checking if allPollContent has any children and delete is so
	var parDiv = document.getElementById("allPollContent");

	while (parDiv.firstChild) {
		parDiv.removeChild(parDiv.firstChild);
	}
	
	var url = window.location.href + 'polls/admin';
	ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', url, null, returnData));
}



//listens for a vote
if (document.getElementById('voteButton')) {
var submitVote = document.getElementById('voteButton');

submitVote.addEventListener("click", function(event) {
	event.preventDefault();
	var enc = '';
	var encPairs = [];
	var data = document.getElementsByTagName('input');
	var title = document.getElementById('title').innerHTML;
	encPairs.push(encodeURIComponent('title') + '=' + encodeURIComponent(title));
	for (var i=0; i<data.length;i++) {
		if (data[i].checked) {
			encPairs.push(encodeURIComponent('option') + '=' + encodeURIComponent(data[i].value));
			break;
		}
	}
	apiUrl = window.location.href;
	enc = encPairs.join('&').replace(/%20/g, '+');
	console.log(enc);
	ajaxFunctions.ajaxRequest('Post', apiUrl, enc, null);
});
}
//function for the sign up
function signUpUser() {
	var verifyPass = document.getElementById('verifyPassField').value;
	 if (verifyPass.length<6) {
		var passMatch = document.createElement('p');
		passMatch.innerHTML = 'passwords must be at least 6 characters';
		passMatch.style.color = 'red';
		document.getElementById('confirmPass').appendChild(passMatch);
		console.log(passMatch);
	} else if (document.getElementById('verifyPassField').value=== document.getElementById('passField').value) { 
		var encPairs = [];
		encPairs.push(encodeURIComponent('username') + '=' + encodeURIComponent(document.getElementById('username').value));
		encPairs.push(encodeURIComponent('password') + '=' + encodeURIComponent(document.getElementById('verifyPassField').value));
		var enc = encPairs.join('&').replace(/%20/g, '+');
		apiUrl = window.location.href + '/create';
		ajaxFunctions.ajaxRequest('POST', apiUrl, enc, function() { 
			window.location = 'https://mongoose-kevinvan1990.c9users.io/';	
		});
	} 
}
})();
