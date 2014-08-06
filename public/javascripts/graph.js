// Load the Visualization API and the piechart package.
google.load('visualization', '1.0', {'packages':['corechart']});

// Set a callback to run when the Google Visualization API is loaded.
google.setOnLoadCallback(getTopicDistribution);

// Get the topic distribution
function getTopicDistribution() {
  var url = document.URL;
  var topic = getTopic(url);

  if (topic != null) {
    var xmlhttp;

    if (window.XMLHttpRequest) {
      // code for IE7+, Firefox, Chrome, Opera, Safari
      xmlhttp = new XMLHttpRequest();
    } else {
      // code for IE6, IE5
      xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4 ) {
        if(xmlhttp.status == 200) {
          console.log(xmlhttp.responseText);
          drawChart(xmlhttp.responseText)
        } else if(xmlhttp.status == 400) {
          //console.log('Error 400')
        } else {
          //console.log('non-200 returned')
        }
      }
    }

    // Try to find all the topics with the requested prefix
    xmlhttp.open("GET", "/topic/getTopicDistribution/"+topic, true);
    xmlhttp.send();
  }
}

// Parse the topic out of url
function getTopic(url) {
  var topicStr = 'topic/';

  var index = url.indexOf(topicStr);
  if (index == -1)
    return null;
  var topic = url.substring(index+topicStr.length);
  index = topic.indexOf('/');
  if (index == -1)
    return topic;
  topic = topic.substring(0, index);
  return topic;
}

// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.
function drawChart(topicDistData) {
  var distData = JSON.parse(topicDistData);
  // Create the data table.
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'Price Range');
  data.addColumn('number', 'Number of Watches');

  data.addRow(['<='+distData['1_5th_price'], distData['1_5th_number']]);
  for (var i = 1; i < 19; i++) {
    data.addRow(['[$'+distData[''+i+'_5th_price']+' - $'+distData[''+(i+1)+'_5th_price']+']', distData[''+(i+1)+'_5th_number']]);
  }
  data.addRow(['>'+distData['19_5th_price'], distData['20_5th_number']]);

  // Set chart options
  var options = {'title':'Price Distribution',
  'width':900,
  'height':600};

  // Instantiate and draw our chart, passing in some options.
  var chart = new google.visualization.BarChart(document.getElementById('chart_div'));
  chart.draw(data, options);
}