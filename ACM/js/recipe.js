var ClipBoard = [];
var fs = require("fs");
var recipedir = "../recipe";
var unSaveRecipeList = {};

function addOneStep()
{
	var num = parseInt(jQuery(".recipevaluebox").find("div:first").children("div:last").find("label").text()) + 1;
	if (isNaN(num))
	{
		num = 1;
	}
	var stepstr = '<div>' +
					'<span>' +
						'<input type="checkbox"/><label>' + num + '<label>' +
					'</span>' +
					'<ul>' +
						'<li><input type="text" value=""/></li>' +
						'<li><input type="text" value="0"/></li>' +
						'<li>' +
							'<select>' +
								'<option value="position">position</option>' +
								'<option value="pressure">pressure</option>' +
							'</select>' +
						'</li>' +
						'<li><input type="text" value="0"/></li>' +
						'<li><input type="text" value="0"/></li>' +
						'<li><input type="text" value="0"/></li>' +
						'<li>' +
							'<select>' +
								'<option value="none">none</option>' +
								'<option value="chamber">chamber</option>' +
								'<option value="By pass">By pass</option>' +
							'</select>' +
						'</li>' +
						'<li><input type="text" value="0"/></li>' +
						'<li>' +
							'<select>' +
								'<option value="none">none</option>' +
								'<option value="chamber">chamber</option>' +
								'<option value="By pass">By pass</option>' +
							'</select>' +
						'</li>' +
						'<li><input type="text" value="0"/></li>' +
						'<li><input type="text" value="0"/></li>' +
						'<li><input type="text" value="0"/></li>' +
					'</ul>' +
				'</div>';
	jQuery(".recipevaluebox").find("div:first").append(stepstr);
	jQuery(".recipeselect").css("color", "#AF0505");
	jQuery(".recipeselect").attr("isSave", "false");
	
	jQuery(".recipevaluebox").children("div").children("div").children("ul").find("input").change(function() {
		jQuery(".recipeselect").css("color", "#AF0505");
		jQuery(".recipeselect").attr("isSave", "false");
	});
		
	jQuery(".recipevaluebox").find("select").change(function() {
		jQuery(".recipeselect").css("color", "#AF0505");
		jQuery(".recipeselect").attr("isSave", "false");
	});
}

function deleteStep()
{
	var flag = false;
	jQuery(".recipevaluebox").find("div:first").children("div").each(function(){
		if (jQuery(this).find("span").find("input")[0].checked)
		{
			flag = true;
			return false;
		}
	});
	
	if (!flag)
	{
		Dialog.alert("<label style='font-size:14px;'>Please select the step you want to delete</label>");
		return;
	}
	
	Dialog.confirm("<label style='font-size:14px;'>Do you want to delete this Step?</label>", function(){
		jQuery(".recipevaluebox").find("div:first").children("div").each(function(){
			if (jQuery(this).find("span").find("input")[0].checked)
			{
				jQuery(this).remove();
			}
		});
		
		var i = 1;
		jQuery(".recipevaluebox").find("div:first").children("div").each(function(){
			jQuery(this).find("span").find("label").text(i);
			i = i + 1;
		});
		
		jQuery(".recipeselect").css("color", "#AF0505");
		jQuery(".recipeselect").attr("isSave", "false");
	});
}

function copyStep()
{
	jQuery(".recipevaluebox").find("div:first").children("div").each(function(){
		if (jQuery(this).find("span").find("input")[0].checked)
		{
			ClipBoard.push(this);
		}
	});
}

function pasteStep()
{
	var num = parseInt(jQuery(".recipevaluebox").find("div:first").children("div:last").find("label").text()) + 1;
	if (isNaN(num))
	{
		num = 1;
	}
	
	var length = ClipBoard.length;
	while (0 != ClipBoard.length)
	{
		var This = ClipBoard.shift().cloneNode(true);
		This = jQuery(This);
		This.find("span").find("label").text(num);
		This.find("span").find("input")[0].checked = false;
		jQuery(".recipevaluebox").find("div:first")[0].appendChild(jQuery(This)[0]);
		num = num + 1;
	}
	
	if (0 != length)
	{
		jQuery(".recipeselect").css("color", "#AF0505");
		jQuery(".recipeselect").attr("isSave", "false");
		
		jQuery(".recipevaluebox").children("div").children("div").children("ul").find("input").change(function() {
				jQuery(".recipeselect").css("color", "#AF0505");
				jQuery(".recipeselect").attr("isSave", "false");
			});
			
		jQuery(".recipevaluebox").find("select").change(function() {
			jQuery(".recipeselect").css("color", "#AF0505");
			jQuery(".recipeselect").attr("isSave", "false");
		});
	}
}

function cutStep()
{
	var flag = false;
	jQuery(".recipevaluebox").find("div:first").children("div").each(function(){
		if (jQuery(this).find("span").find("input")[0].checked)
		{
			flag = true;
			ClipBoard.push(this);
			jQuery(this).remove();
		}
	});
	
	if (flag)
	{
		jQuery(".recipeselect").css("color", "#AF0505");
		jQuery(".recipeselect").attr("isSave", "false");
	}
}

function loadRecipe()
{
	fs.readdir(recipedir, function(err, files){
		if (err)
		{
			//Dialog.alert("<label style='font-size:14px;'>Read The dir '" + recipedir + "' ERROE:" + err + "</label>");
			return;
		}
		
		var li = "";
		for (var i = 0; i < files.length; ++i)
		{
			var file = files[i];
			var recipeName = file.substring(0, file.lastIndexOf("."));
			li += "<li>" + recipeName + "</li>";
		}
		
		jQuery(".recipelist").append(li);
		jQuery(".recipelist").children("li").click(function(){
			checkUnSavedRecipe(this);
		});
	});
}

function checkUnSavedRecipe(This)
{
	var saveFlag = jQuery(".recipeselect").attr("isSave");
	var rName = jQuery(".recipeselect").text();
	if (saveFlag && saveFlag == "false" && !jQuery(This).hasClass("recipeselect"))
	{
		Dialog.confirm("<label style='font-size:14px;'>The " + rName + " is unsaved, do you want to save it?</label>", function(){
			function hasSaved()
			{
				jQuery(".recipeselect").attr("isSave", "true");
				jQuery(".recipeselect").css("color", "#fff");
				showSelectRecipe(fs, This);
			}
			recipeSave(hasSaved);
		}, function(){
			unSaveRecipeList[rName] = domToJson();
			showSelectRecipe(fs, This);
		});
	}
	else
	{
		showSelectRecipe(fs, This);
	}
}

function showSelectRecipe(fs, This)
{
	jQuery(".recipeselect").removeClass("recipeselect");
	jQuery(This).addClass("recipeselect");
	var rName = jQuery(This).text();
	if (rName == "")
	{
		return;
	}
	
	var rJson = {};
	if (unSaveRecipeList[rName])
	{
		rJson = unSaveRecipeList[rName];
	}
	else
	{
		try
		{
			var rJsonStr = fs.readFileSync(recipedir + '/' + rName + '.rcp');
			if (rJsonStr == "")
			{
				jQuery(".recipevaluebox").find("div:first").children().remove();
				return;
			}
			rJson = jQuery.parseJSON(rJsonStr);
		}
		catch (e)
		{
			Dialog.alert("<label style='font-size:12px;'>" + e + "</label>");
			return;
		}
	}
			
	if (rJson && typeof rJson == "object")
	{
		jQuery(This).attr("version", rJson["Version"]);
		var steps = rJson["Steps"];
		var steplist = "";
		for (var i = 0; i < steps.length; ++i)
		{
			steplist += '<div>' +
							'<span>' +
								'<input type="checkbox"/><label>' + (i + 1) + '<label>' +
							'</span>' +
							'<ul>' +
								'<li><input type="text" value="' + steps[i].Name + '"/></li>' +
								'<li><input type="text" value="' + steps[i].Time + '"/></li>' +
								'<li>';
			if (steps[i]["APC Mode"] == "position")
			{
				steplist += '<select>' +
								'<option value="position" selected = "selected">position</option>' +
								'<option value="pressure">pressure</option>' +
							'</select>';
			}
			else
			{
				steplist += '<select>' +
								'<option value="position">position</option>' +
								'<option value="pressure" selected = "selected">pressure</option>' +
							'</select>';
			}
					
			steplist += '</li>' +
						'<li><input type="text" value="' + steps[i].Position + '"/></li>' +
						'<li><input type="text" value="' + steps[i].Pressure + '"/></li>' +
						'<li><input type="text" value="' + steps[i]["Rotate Speed"] + '"/></li>' +
						'<li>';
			var select1 = "";
			var select2 = "";
			var select3 = "";
			switch (steps[i]["HF Bypass"])
			{
				case 'none':
					select1 = 'selected = "selected"';
					break;
				case 'chamber':
					select2 = 'selected = "selected"';
					break;
				case 'By pass':
					select3 = 'selected = "selected"';
					break;
				default:
			}
			
			steplist += '<select>' +
							'<option value="none" ' + select1 + '>none</option>' +
							'<option value="chamber" ' + select2 + '>chamber</option>' +
							'<option value="By pass" ' + select3 + '>By pass</option>' +
						'</select>' + 
					'</li>' +
					'<li><input type="text" value="' + steps[i]["HF"] + '"/></li>';
			
			select1 = "";
			select2 = "";
			select3 = "";
			switch (steps[i]["EtOH Bypass"])
			{
				case 'none':
					select1 = 'selected = "selected"';
					break;
				case 'chamber':
					select2 = 'selected = "selected"';
					break;
				case 'By pass':
					select3 = 'selected = "selected"';
					break;
				default:
			}
			
			steplist += '<li>' +
							'<select>' +
								'<option value="none" ' + select1 + '>none</option>' +
								'<option value="chamber" ' + select2 + '>chamber</option>' +
								'<option value="By pass" ' + select3 + '>By pass</option>' +
							'</select>' +
						'</li>' +
						'<li><input type="text" value="' + steps[i]["EtOH"] + '"/></li>' +
						'<li><input type="text" value="' + steps[i]["N2"] + '"/></li>' +
						'<li><input type="text" value="' + steps[i]["N2 Purge"] + '"/></li>' +
						'</ul>' +
						'</div>';
		}
				
		jQuery(".recipevaluebox").find("div:first").children().remove();
		jQuery(".recipevaluebox").find("div:first").append(steplist);
		
		jQuery(".recipevaluebox").children("div").children("div").children("ul").find("input").change(function() {
			jQuery(".recipeselect").css("color", "#AF0505");
			jQuery(".recipeselect").attr("isSave", "false");
		});
		
		jQuery(".recipevaluebox").find("select").change(function() {
			jQuery(".recipeselect").css("color", "#AF0505");
			jQuery(".recipeselect").attr("isSave", "false");
		});
	}
}

function domToJson()
{
	var rJson = {};
	var This = jQuery(".recipeselect");
	var version = This.attr("Version");
	
	rJson["Version"] = version ? version : "1.0";
	rJson["Steps"] = [];
	
	jQuery(".recipevaluebox").find("div:first").children("div").each(function(){
		var stepObj = {};
		var lis = jQuery(this).children("ul").children("li");
		stepObj["Name"] = jQuery(lis[0]).children("input").val();
		stepObj["Time"] = jQuery(lis[1]).children("input").val();
		stepObj["APC Mode"] = jQuery(lis[2]).children("select").val();
		stepObj["Position"] = jQuery(lis[3]).children("input").val();
		stepObj["Pressure"] = jQuery(lis[4]).children("input").val();
		stepObj["Rotate Speed"] = jQuery(lis[5]).children("input").val();
		stepObj["HF Bypass"] = jQuery(lis[6]).children("select").val();
		stepObj["HF"] = jQuery(lis[7]).children("input").val();
		stepObj["EtOH Bypass"] = jQuery(lis[8]).children("select").val();
		stepObj["EtOH"] = jQuery(lis[9]).children("input").val();
		stepObj["N2"] = jQuery(lis[10]).children("input").val();
		stepObj["N2 Purge"] = jQuery(lis[11]).children("input").val();
		rJson["Steps"].push(stepObj);
	});
	
	return rJson;
}

function dirCheckAndMK()
{
	var flag = fs.existsSync(recipedir);
	if (!flag)
	{
		fs.mkdirSync(recipedir);
	}
}

function recipeSave(fn)
{
	dirCheckAndMK();
	var rJson = domToJson();
	var This = jQuery(".recipeselect");
	var rName = This.text();

	if (rName)
	{
		fs.writeFile(recipedir + '/' + rName + '.rcp', JSON.stringify(rJson), function(err){
			if (err)
			{
				Dialog.alert("<label style='font-size:14px;'>The " + rName + " save failed£¡</label>");
			}
			else
			{
				/*
				Dialog.alert("<label style='font-size:14px;'>The " + rName + " save successfully</label>", function(){
					delete unSaveRecipeList[rName];
					if (fn)
					{
						fn();
					}
					else
					{
						jQuery(".recipeselect").attr("isSave", "true");
						jQuery(".recipeselect").css("color", "#fff");
					}
				});
				*/
				delete unSaveRecipeList[rName];
				jQuery(".messagealert").text("The " + rName + " save successfully");
				setTimeout("jQuery('.messagealert').slideUp(1000)",3000);
				jQuery(".messagealert").slideDown(500);
				if (fn)
				{
					fn();
				}
				else
				{
					jQuery(".recipeselect").attr("isSave", "true");
					jQuery(".recipeselect").css("color", "#fff");
				}
				
			}
		});
	}
}

function recipeDelete()
{
	if (!fs.existsSync(recipedir))
	{
		jQuery(".recipevaluebox").find("div:first").children().remove();
		jQuery(".recipeselect").remove();
		return;
	}
	
	var rselect = jQuery(".recipeselect");
	if (rselect.length != 0)
	{
		Dialog.confirm("<label style='font-size:14px;'>Do you want to delete this Recipe?</label>", function(){
			var rName = jQuery(".recipeselect").text();
			fs.unlink(recipedir + '/' + rName + ".rcp", function(err){
				jQuery(".recipevaluebox").find("div:first").children().remove();
				jQuery(".recipeselect").remove();
			});
		});
	}
}

function recipeAdd()
{
	var lis = jQuery(".recipelist").children("li");
	var rName = "NewRecipe";
	for (var i = 1; 1; ++i)
	{
		var j = 0;
		for (; j < lis.length; ++j)
		{
			if (rName == jQuery(lis[j]).text())
			{
				break;
			}
		}
		
		if (j == lis.length)
		{
			break;
		}
		
		rName = "NewRecipe";
		rName += i;
	}
	var li = "<li><input class='rnameedit' style='padding-left:5px;width:80%;background-color:#C6F0FB;border:none;' value='" + rName + "'/></li>";
	
	jQuery(".recipelist").append(li);
	jQuery(".rnameedit").focus();
	jQuery(".rnameedit").blur(function(){
		rName = jQuery(this).val();
		dirCheckAndMK();
		fs.writeFileSync(recipedir + '/' + rName + ".rcp", "");
		var li = jQuery(this).parent();
		jQuery(this).parent().text(rName);
		jQuery(".recipeselect").removeClass("recipeselect");
		li.addClass("recipeselect");
		li.click(function(){
			showSelectRecipe(fs, this);
		});
		jQuery(".recipevaluebox").find("div:first").children().remove();
		jQuery(this).remove();
	});
}

function recipeSaveAs()
{
	var rselect = jQuery(".recipeselect");
	var orName = rselect.text();
	var input = "<input class='rnameedit' style='padding-left:5px;width:80%;background-color:#C6F0FB;border:none;' value='" + orName + "'/>";
	rselect.text("");
	rselect.append(input);
	jQuery(".rnameedit").focus();
	jQuery(".rnameedit").blur(function(){
		var nrName = jQuery(this).val();
		rselect.text(nrName);
		dirCheckAndMK();
		fs.renameSync(recipedir + '/' + orName + ".rcp", recipedir + '/' + nrName + ".rcp");
		jQuery(".recipeselect").removeClass("recipeselect");
		rselect.addClass("recipeselect");
		jQuery(this).remove();
	});
}

/*
function checkRecipeSave(){
	var str = "";
	jQuery(".recipelist").children("li").each(function(){
		var flag = jQuery(this).attr("isSave");
		if (flag && flag == "false")
		{
			str += jQuery(this).text() + ",";
		}
	});
	
	if (str != "")
	{
		Dialog.confirm("The " + str + "  haven't saved, do you want save its?", function(){
			
		});
	}
}*/