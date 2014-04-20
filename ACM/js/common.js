function getJsonData(obj) {
    var fs = require('fs');
    fs.readFile('./../data/parameters.json', function (err, data) {
        alert(data);
        obj.Data = $.parseJSON(data);
    });
}

function setPropertyChange(func) {
    setInterval(function () {
        var data = getSyncJsonData();
        func(data);
    },500);
}

        function getSyncJsonData() {
            var fs = require('fs');
           return $.parseJSON(fs.readFileSync('./../data/parameters.json'));
       }

       function getSyncXmlData() {
           var fs = require('fs');
           var str = fs.readFileSync('./../data/parameters.xml');
           var parser = new DOMParser();
           return parser.parseFromString(str, "text/xml");
       }



       //去掉左边的空白 
       function trimLeft(s) {
           if (s == null) {
               return "";
           }
           var whitespace = new String(" \t\n\r");
           var str = new String(s);
           if (whitespace.indexOf(str.charAt(0)) != -1) {
               var j = 0, i = str.length;
               while (j < i && whitespace.indexOf(str.charAt(j)) != -1) {
                   j++;
               }
               str = str.substring(j, i);
           }
           return str;
       }
       //去掉右边的空白 
       function trimRight(s) {
           if (s == null) return "";
           var whitespace = new String(" \t\n\r");
           var str = new String(s);
           if (whitespace.indexOf(str.charAt(str.length - 1)) != -1) {
               var i = str.length - 1;
               while (i >= 0 && whitespace.indexOf(str.charAt(i)) != -1) {
                   i--;
               }
               str = str.substring(0, i + 1);
           }
           return str;
       } 