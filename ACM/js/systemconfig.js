$(document).ready(function () {
    var xmlDom = getSyncXmlData();
    getHtml(xmlDom.firstChild, $('#tree')[0]);
    var tree = $('#tree').goodtree({ 'reveal': $('.focus') });
});

function bindClick() {
    $("button").each(function () {
        this.onclick = function () {
            var min = parseInt(this.getAttribute("min"));
            console.log("min:" + min);
            var max = parseInt(this.getAttribute("max"));
            console.log("max:" + max);
            console.log("value:" + $("#" + this.getAttribute("txtID")).val());
            var value = Number($("#" + this.getAttribute("txtID")).val());
            console.log("value:" + value);
            if (!isNaN(value)) {
                if (value > max || value < min) {
                    alert("请输入正确范围的值");
                }
                else {
                    alert("输入成功");
                }
            }
            else {
                alert("请输入合法字符")
            }
        };
    });
}

function buttonClick(obj) {
    var min = parseInt(obj.getAttribute("min"));
    console.log("min:" + min);
    var max = parseInt(obj.getAttribute("max"));
    console.log("max:" + max);
    console.log("value:" + $("#" + obj.getAttribute("txtID")).val());
    var value = Number($("#" + obj.getAttribute("txtID")).val());
    console.log("value:" + value);
    if (!isNaN(value)) {
        if (value > max || value < min) {
            alert("请输入正确范围的值");
        }
        else {
            alert("输入成功");
        }
    }
    else {
        alert("请输入合法字符")
    }
}
function isLeaf(node) {
    var _isLeaf = true;
    for (var i = 0; i < node.children.length; i++) {
        if ((node.children[i].attributes.length > 0 && node.children[i].attributes[0].name == "type") || (node.attributes.length > 0 && node.attributes[0].name == "type")) {
        
        }
        else {
            return false;
        }
    }
    return true;
}

function getHtml(node, element) {
    if (isLeaf(node)) {
        if (node.attributes.length == 0) {
            var el = document.createElement("li");
            el.onclick = function () {
                $("#data").empty();
                createFromGroup(node);
            }
            var textnode = document.createTextNode(node.tagName);
            el.appendChild(textnode);
            element.appendChild(el);
        }
    }
    else {
        var li = document.createElement("li");
        var span = document.createElement("span");
        var textnode = document.createTextNode(node.tagName);
        span.appendChild(textnode);
        li.appendChild(span);
        var ul = document.createElement("ul");
        for (var i = 0; i < node.children.length; i++) {
            getHtml(node.children[i], ul);
        }
        li.appendChild(ul);
        element.appendChild(li);
        span.onclick = function () {
            $("#data").empty();
            createFromGroup(node);
        }
    }
}

function createFromGroup(node) {
    for (var i = 0; i < node.children.length; i++) {
        if (node.children[i].attributes.length > 0) {
            createDataEx(node.children[i], i);
        }
    }
}




function createData(node,i) {
    var div = document.createElement("div");
    var span = document.createElement("span");
    span.setAttribute("title", node.children[1].textContent);
    var name = document.createTextNode(node.nodeName);
    span.appendChild(name);
    var input = document.createElement("input");
    input.setAttribute("value", node.children[4].textContent);
    input.setAttribute("id","textbox"+i);
    var unitText;
    if (node.children[5].textContent == "") {
        unitText = "   ";
    }
    else {
        unitText = node.children[5].textContent;
    }
    var unit = document.createTextNode(unitText);
    var buttonSpan = document.createElement("span");
    var button = document.createElement("button");
    button.style.display = "block";
    button.style.height = "22px";
    button.style.width = "30px";
    button.setAttribute("value", "Set");
    button.setAttribute("type", "button");
    button.setAttribute("min", node.children[2].textContent);
    button.setAttribute("max", node.children[3].textContent);
    button.setAttribute("txtID", "textbox" + i);

    button.onclick = function () {
        var min = parseInt(node.children[2].textContent);
        console.log("min:" + min);
        var max = parseInt(node.children[3].textContent);
        console.log("max:" + max);
        var value;
        if (trimRight(trimLeft($("#textbox" + i).val())) == "")
        {
          value = NaN;
        }
        else {
         value = Number($("#textbox"+i).val());
        }
        console.log("value:" + value);
        if (!isNaN(value)) {
            if (value > max || value < min) {
                alert("请输入正确范围的值");
            }
            else {
                alert("输入成功");
            }
        }
        else {
            alert("请输入合法字符")
        }
    };
    div.appendChild(span);
    div.appendChild(input);
    div.appendChild(unit);
    div.appendChild(button);
    document.getElementById("data").appendChild(div);
}

function getContent(title,name, text,unit, min, max,i) {
    return '<div><span title="' + title + '">' + name + ':<input  type="text" id="textbox' + i + '" value="' + text + '" />' + unit
     + '<input max="' + max + '" min="' + min + '"  txtID="textbox' + i + '" type="button" onclick="buttonClick(this);" value="set" /></span></div>';
}

function createDataEx(node, i) {
    var unitText;
    if (node.children[5].textContent == "") {
        unitText = "   ";
    }
    else {
        unitText = node.children[5].textContent;
    }
    $("#data").append(getContent(node.children[1].textContent, node.nodeName, node.children[4].textContent, unitText, node.children[2].textContent, node.children[3].textContent,i));
}