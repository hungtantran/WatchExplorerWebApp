function autoComplete() {
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
           if(xmlhttp.status == 200){
                console.log(xmlhttp.responseText);
                displayAutoCompleteResult(xmlhttp.responseText)
           }
           else if(xmlhttp.status == 400) {
              //alert('Error 400')
           }
           else {
               //alert('non-200 returned')
           }
        }
    }

    // Get the value of the search
    var searchInput = document.getElementById('searchInput');
    // Try to find all the topics with the requested prefix
    xmlhttp.open("GET", "/topic/getPrefixTopic/"+searchInput.value, true);
    xmlhttp.send();
}

function displayAutoCompleteResult(responseText) {
    var displayText = '';
    var results = JSON.parse(responseText);

    for (var i = 0; i < results.length; i++) {
        var urlParam = results[i]['topic'].toLowerCase();
        urlParam = urlParam.replace(' ', '-');
        urlParam = urlParam.replace('--', '-');

        displayText += '<a href=\"/topic/'+urlParam+'\">'+results[i]['topic']+'</a><br/>';
    }

    document.getElementById('searchResult').innerHTML = displayText;
}