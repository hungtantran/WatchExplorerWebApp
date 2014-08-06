// HelperProvider constructor
HelperProvider = function() {};

// Function redirect to main page
HelperProvider.prototype.redirectTo = function(res, location) {
    res.writeHead(301, {Location: location});
    res.end();
};

// Function that convert a given string into a url parameter
HelperProvider.prototype.convertStringToParam = function(str) {
    var param = str.toLowerCase();

    while (param.indexOf(' ') != -1) { 
        param = param.replace(' ','-');
    }

    while (param.indexOf('--') != -1) { 
        param = param.replace('--','-');
    }

    return param;
};

// Function that given the current page and total number of page, return an array
// of page numbers that should be displayed
HelperProvider.prototype.displayPageArray = function(curPage, totalPageNum) {
    var displayPages = new Array();
    var maxPagesDisplay = 10;

    // If there are less than max number of pages can be displayed
    if (totalPageNum < maxPagesDisplay) {
        for (var i = 0; i < totalPageNum; i++) displayPages.push(i+1);
        return displayPages;
    }

    // If the current page is out of range
    if (curPage < 1 || curPage > totalPageNum) {
        for (var i = 0; i < maxPagesDisplay; i++) displayPages.push(i+1);
        return displayPages;    
    }

    // If the current page is in the range
    displayPages.push(1);
    displayPages.push(2);
    if (curPage-2 > 2) displayPages.push(curPage-2);
    if (curPage-1 > 2 && curPage-1 < totalPageNum-1) displayPages.push(curPage-1);
    if (curPage > 2 && curPage < totalPageNum-1) displayPages.push(curPage);
    if (curPage+1 > 2 && curPage+1 < totalPageNum-1) displayPages.push(curPage+1);
    if (curPage+2 < totalPageNum-1) displayPages.push(curPage+2);
    displayPages.push(totalPageNum-1);
    displayPages.push(totalPageNum);

    return displayPages;
};

exports.HelperProvider = HelperProvider;