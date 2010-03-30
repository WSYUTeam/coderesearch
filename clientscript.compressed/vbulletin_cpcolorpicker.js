/*======================================================================*\
|| #################################################################### ||
|| # vBulletin [#]version[#]
|| # ---------------------------------------------------------------- # ||
|| # Copyright �2000-[#]year[#] Jelsoft Enterprises Ltd. All Rights Reserved. ||
|| # This file may not be redistributed in whole or significant part. # ||
|| # ---------------- VBULLETIN IS NOT FREE SOFTWARE ---------------- # ||
|| # http://www.vbulletin.com | http://www.vbulletin.com/license.html # ||
|| #################################################################### ||
\*======================================================================*/
var activeElementId=0;var colorPickerType=0;var pickerReady=false;var colors=new Array("00","33","66","99","CC","FF");var specialColors=new Array("#000000","#333333","#666666","#999999","#CCCCCC","#FFFFFF","#FF0000","#00FF00","#0000FF","#FFFF00","#00FFFF","#FF00FF");function init_color_preview(){if(typeof (numColors)!="undefined"){for(var A=0;A<numColors;A++){preview_color(A)}if(colorPickerType!=0){init_color_picker(colorPickerType)}pickerReady=true}}function preview_color(G){var B=fetch_object("color_"+G);var A=fetch_object("preview_"+G);var E=new RegExp(/url\(('|"|)((http:\/\/|\/)?)(.*)\1\)/i);if(is_transparent(B.value)){A.style.background="none";A.style.borderStyle="dashed";A.title=window.status=""}else{var C=B.value;var F;if(F=B.value.match(E)){if(typeof F[3]=="undefined"||F[3]==""){C=B.value.replace(F[4],(bburl+F[4]))}}try{A.style.background=C;A.style.borderStyle="inset";A.title=window.status=""}catch(D){A.style.background="url('../cpstyles/"+cpstylefolder+"/cp_help.gif') no-repeat center";A.style.borderStyle="dashed";A.title=window.status=construct_phrase(vbphrase.css_value_invalid,C)}}}function set_swatch_color(A,C,B){fetch_object("sw"+A+"-"+C).style.backgroundColor=B}function init_color_picker(C){colorPickerType=C;fetch_object("colorPickerType").value=C;var H,B,E,D,G,F,A;if(C<2){for(H=0;H<12;H++){set_swatch_color(0,H,"#000000");set_swatch_color(1,H,specialColors[H]);set_swatch_color(2,H,"#000000")}}switch(C){case 0:green=new Array(5,4,3,2,1,0,0,1,2,3,4,5);blue=new Array(0,0,0,5,4,3,2,1,0,0,1,2,3,4,5,5,4,3,2,1,0);for(H=0;H<12;H++){for(B=3;B<21;B++){G=Math.floor((20-B)/6)*2+Math.floor(H/6);F=green[H];A=blue[B];set_swatch_color(B,H,"#"+colors[G]+colors[F]+colors[A])}}break;case 1:green=new Array(0,0,0,0,1,2,3,4,5,0,1,2,3,4,5,0,1,2,3,4,5);blue=new Array(0,1,2,3,4,5,0,1,2,3,4,5);for(H=0;H<12;H++){for(B=3;B<21;B++){G=Math.floor((B-3)/6)+Math.floor(H/6)*3;F=green[B];A=blue[H];set_swatch_color(B,H,"#"+colors[G]+colors[F]+colors[A])}}break;case 2:E=255;D=-1;for(H=0;H<12;H++){for(B=0;B<21;B++){set_swatch_color(B,H,"rgb("+E+","+E+","+E+")");E--;if(E==4){E=0}}}break;case 3:case 4:case 5:case 6:case 7:case 8:E=255;D=255;for(H=0;H<12;H++){for(B=0;B<21;B++){acolor=Math.round(D);bcolor=Math.round(E);if(acolor<0){acolor=0}switch(C){case 3:G=acolor;F=bcolor;A=bcolor;break;case 4:G=bcolor;F=acolor;A=bcolor;break;case 5:G=bcolor;F=bcolor;A=acolor;break;case 6:G=acolor;F=acolor;A=bcolor;break;case 7:G=acolor;F=bcolor;A=acolor;break;case 8:G=bcolor;F=acolor;A=acolor;break}set_swatch_color(B,H,"rgb("+G+","+F+","+A+")");if(E>1){E-=2.03174}else{E=0;if(D>1.03){D-=2.03174}}}}break;default:return false}pickerReady=true;return true}function switch_color_picker(A){if(A>0){if(colorPickerType<8){colorPickerType++}else{colorPickerType=0}}else{if(colorPickerType>0){colorPickerType--}else{colorPickerType=8}}init_color_picker(colorPickerType)}function open_color_picker(B,A){if(!pickerReady){alert(vbphrase.color_picker_not_ready);return }pickerElement=fetch_object("colorPicker");if(activeElementId==B&&pickerElement.style.display!="none"){pickerElement.style.display="none"}else{activeElementId=B;colorElement=fetch_object("color_"+B);previewElement=fetch_object("preview_"+B);var C=null;if(previewElement.style.background){C=previewElement.style.backgroundColor}else{C=previewElement.style.backgroundColor}fetch_object("oldColor").style.background=C;fetch_object("newColor").style.background=C;fetch_object("txtColor").value=colorElement.value;if(!A){A=window.event}if(typeof (A.pageX)=="number"){xpos=A.pageX;ypos=A.pageY}else{if(typeof (A.clientX)=="number"){xpos=A.clientX+document.documentElement.scrollLeft;ypos=A.clientY+document.documentElement.scrollTop}}xpos+=10;ypos+=5;if((xpos+colorPickerWidth)>=document.body.clientWidth){xpos=document.body.clientWidth-colorPickerWidth-5}pickerElement.style.left=xpos+"px";pickerElement.style.top=ypos+"px";pickerElement.style.display=""}}function close_color_picker(){activeElementId=0;fetch_object("colorPicker").style.display="none"}function swatch_over(A){col_over(this)}function swatch_click(A){col_click(this)}function col_over(A){color=fetch_hex_color(A.style.backgroundColor);fetch_object("newColor").style.background=color;fetch_object("txtColor").value=color}function col_click(A){if(A=="transparent"){color=A}else{color=fetch_hex_color(A.style.backgroundColor)}fetch_object("color_"+activeElementId).value=color;preview_color(activeElementId);close_color_picker()}function fetch_hex_color(A){if(A.substr(0,1)=="r"){colorMatch=A.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/i);for(var B=1;B<4;B++){colorMatch[B]=parseInt(colorMatch[B]).toString(16);if(colorMatch[B].length<2){colorMatch[B]="0"+colorMatch[B]}}A="#"+(colorMatch[1]+colorMatch[2]+colorMatch[3]).toUpperCase()}return A.toUpperCase()}function is_transparent(A){if(A==""||A=="none"||A=="transparent"){return true}else{return false}};