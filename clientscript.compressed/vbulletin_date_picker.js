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
var default_weekday=0;var default_day_names=new Array("Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday");var default_month_names=new Array("January","February","March","April","May","June","July","August","September","October","November","December");vBulletin.events.systemInit.subscribe(function(){if(vBulletin.elements.vB_DatePicker){for(var B=0;B<vBulletin.elements.vB_DatePicker.length;B++){var A=vBulletin.elements.vB_DatePicker[B];new vB_DatePicker(A[0],A[1],A[2])}vBulletin.elements.vB_DatePicker=null}});function vB_DatePicker(A,E,B){var F=arguments[1].match(/^(\d+),?(\w*)$/);if(F){B=F[1];E=F[2];console.log("vB_DatePicker '%s' :: Week start day '%s', Base name '%s'",E,B,E)}this.button_sibling=YAHOO.util.Dom.get(A);this.base_id=E;if(!this.button_sibling){console.error("vB_DatePicker '%s' :: Button sibling missing",this.base_id);return false}this.datestring=YAHOO.util.Dom.get(this.base_id+"datestring");if(!this.datestring){this.month_element=YAHOO.util.Dom.get(this.base_id+"month");this.date_element=YAHOO.util.Dom.get(this.base_id+"date");this.year_element=YAHOO.util.Dom.get(this.base_id+"year");if(!this.month_element||!this.date_element||!this.year_element){console.error("vB_DatePicker '%s' :: Form elements missing",this.base_id);return false}}this.hidden_selects=new Array();this.selected_date=this.read_input();this.current_month=new Date(this.selected_date);this.current_month.setFullYear(this.selected_date.getFullYear(),this.selected_date.getMonth(),1);var D=new Date();this.today=new Date(0);this.today.setFullYear(D.getFullYear(),D.getMonth(),D.getDate());this.today.setHours(0,0,0);B=(parseInt(B)-1)%7;if(B<0){B=0}this.userweek=new Array();while(this.userweek.length<7){this.userweek[this.userweek.length]=B++;if(B>=7){B=default_weekday}}if(typeof (vbphrase.sunday)!="undefined"){this.daynames=new Array(vbphrase.sunday,vbphrase.monday,vbphrase.tuesday,vbphrase.wednesday,vbphrase.thursday,vbphrase.friday,vbphrase.saturday)}else{this.daynames=default_day_names}if(typeof (vbphrase.january)!="undefined"){this.monthnames=new Array(vbphrase.january,vbphrase.february,vbphrase.march,vbphrase.april,vbphrase.may,vbphrase.june,vbphrase.july,vbphrase.august,vbphrase.september,vbphrase.october,vbphrase.november,vbphrase.december)}else{if(!this.datestring&&this.month_element){this.monthnames=new Array();for(var C=0;C<this.month_element.options.length;C++){if(this.month_element.options[C].value>=1&&this.month_element.options[C].value<=12){this.monthnames[this.month_element.options[C].value-1]=this.month_element.options[C].text}}}else{this.monthnames=default_month_names}}if(this.button_sibling){YAHOO.util.Event.on(document,"click",this.close_popup,this,true);if(!is_ie){YAHOO.util.Event.on(window,"resize",this.close_popup,this,true)}this.button=this.button_sibling.parentNode.insertBefore(document.createElement("a"),this.button_sibling.nextSibling);this.button.href="#";this.buttonimg=this.button.appendChild(document.createElement("img"));this.buttonimg.src=IMGDIR_MISC+"/calendar_popup.png";if(is_ie){this.buttonimg.style.verticalAlign="text-bottom"}else{this.buttonimg.style.verticalAlign="bottom"}this.buttonimg.border="0";YAHOO.util.Event.on(this.button,"click",this.toggle_calendar,this,true);this.popup=this.button_sibling.parentNode.appendChild(document.createElement("div"));this.popup.style.position="absolute";this.popup.style.display="none";this.popup_state=false;this.select_handler=new vB_Select_Overlay_Handler(this.popup);this.build_calendar()}}vB_DatePicker.prototype.build_calendar=function(){if(this.table&&this.table.parentNode){this.table.parentNode.removeChild(this.table)}var C=document.createElement("span");C.className="page";C.innerHTML="&nbsp;";this.button_sibling.parentNode.appendChild(C);var B=YAHOO.util.Dom.getStyle(C,"backgroundColor");var G=YAHOO.util.Dom.getStyle(C,"color");C.parentNode.removeChild(C);this.table=document.createElement("table");this.table.cellSpacing=1;this.table.className="tborder vB_DatePicker page";this.table.style.background=B;var I=this.table.appendChild(document.createElement("thead"));var K=I.appendChild(document.createElement("tr"));var H=K.appendChild(document.createElement("th"));this.tabletitle=K.appendChild(document.createElement("th"));var J=K.appendChild(document.createElement("th"));K.align="center";this.tabletitle.className="tcat smallfont";this.tabletitle.colSpan=5;this.tabletitle.innerHTML="&nbsp;";H.className="tcat smallfont";H.innerHTML="&lt;";H.style.cursor="pointer";H.increment=-1;YAHOO.util.Event.on(H,"click",this.change_month,this,true);J.className="tcat smallfont";J.innerHTML="&gt;";J.style.cursor="pointer";J.increment=1;YAHOO.util.Event.on(J,"click",this.change_month,this,true);K=I.appendChild(document.createElement("tr"));K.align="center";K.className="page smallfont";var D;for(var F in this.userweek){if(YAHOO.lang.hasOwnProperty(this.userweek,F)){D=K.appendChild(document.createElement("td"));D.className="smallfont";D.appendChild(document.createTextNode(this.daynames[this.userweek[F]].substring(0,1)))}}K=I.appendChild(document.createElement("tr"));D=K.appendChild(document.createElement("td"));D.colSpan=7;D.className="page";var A=D.appendChild(document.createElement("div"));A.style.background=G;var E=A.appendChild(document.createElement("img"));E.src=(typeof (CLEARGIFURL)!="undefined"?CLEARGIFURL:"clear.gif");this.tbody=this.table.appendChild(document.createElement("tbody"));this.draw_date_cells(this.selected_date.getMonth()+1,this.selected_date.getFullYear());this.popup.appendChild(this.table)};vB_DatePicker.prototype.draw_date_cells=function(F,H){this.current_month=new Date(0);this.current_month.setFullYear(H,F-1,1);this.tabletitle.innerHTML=this.monthnames[this.current_month.getMonth()]+" "+this.current_month.getFullYear();while(this.tbody.hasChildNodes()){this.tbody.removeChild(this.tbody.firstChild)}var B=this.current_month.getDay();var A=0,E;for(E in this.userweek){if(!YAHOO.lang.hasOwnProperty(this.userweek,E)){continue}if(B==this.userweek[E]){break}else{A++}}var C=new Date(0);C.setFullYear(this.current_month.getFullYear(),this.current_month.getMonth(),1-A);for(var I=0;I<6;I++){var G=this.tbody.appendChild(document.createElement("tr"));G.align="center";for(E in this.userweek){if(!YAHOO.lang.hasOwnProperty(this.userweek,E)){continue}var D=G.appendChild(document.createElement("td"));D.innerHTML=(C.getDate()<10?"&nbsp;":"")+C.getDate();D.dateobj=new Date(C);D.title=D.dateobj.toString();D.style.cursor="pointer";YAHOO.util.Event.on(D,"click",this.date_click,this,true);YAHOO.util.Event.on(D,"mouseover",this.date_mouseover,this,true);YAHOO.util.Event.on(D,"mouseout",this.date_mouseover,this,true);C.setDate(C.getDate()+1);C.setHours(0,0,0)}}this.apply_date_classes()};vB_DatePicker.prototype.apply_date_classes=function(){var B=this.tbody.getElementsByTagName("td");for(var A=0;A<B.length;A++){if(B[A].dateobj.valueOf()==this.selected_date.valueOf()){B[A].className="tfoot smallfont"}else{if(B[A].dateobj.getMonth()==this.current_month.getMonth()){B[A].className="smallfont"}else{B[A].className="time smallfont"}}if(B[A].dateobj.valueOf()==this.today.valueOf()){B[A].className+=" today"}}};vB_DatePicker.prototype.select_date=function(A){this.selected_date=new Date(A);if(A.getMonth()!=this.current_month.getMonth()||A.getFullYear()!=this.current_month.getFullYear()){this.draw_date_cells(this.selected_date.getMonth()+1,this.selected_date.getFullYear())}else{this.apply_date_classes()}this.set_input()};vB_DatePicker.prototype.read_input=function(){var B;if(this.datestring){B=Date.parse(this.datestring.value)}else{if(this.year_element.value<100){var A=1900+Math.abs(parseInt(this.year_element.value,10));if(!isNaN(A)){this.year_element.value=A}}B=new Date(0);B.setFullYear(parseInt(this.year_element.value),(parseInt(this.month_element.value)-1),parseInt(this.date_element.value)).valueOf()}if(isNaN(B)||B.getFullYear()<0){if(this.selected_date){return this.selected_date}else{return new Date()}}else{return new Date(B)}};vB_DatePicker.prototype.set_input=function(){if(this.datestring){this.datestring.value=this.monthnames[this.selected_date.getMonth()]+" "+this.selected_date.getDate()+" "+this.selected_date.getFullYear()}else{this.month_element.value=this.selected_date.getMonth()+1;this.date_element.value=this.selected_date.getDate();if(this.year_element.tagName=="SELECT"){var C=this.selected_date.getFullYear();for(var B=0;B<this.year_element.options.length;B++){if(this.year_element.options[B].value==C){this.year_element.selectedIndex=B;return }}var A=this.year_element.appendChild(document.createElement("option"));A.value=C;A.appendChild(document.createTextNode(C));this.year_element.selectedIndex=this.year_element.options.length-1}else{this.year_element.value=this.selected_date.getFullYear()}}};vB_DatePicker.prototype.open_popup=function(){this.selected_date=this.read_input();this.select_date(this.selected_date);this.popup.style.display="block";var A=YAHOO.util.Dom.getXY(this.button_sibling);A[1]+=this.button_sibling.offsetHeight;if(document.getElementsByTagName("html")[0].getAttribute("dir").toLowerCase()=="ltr"){A[0]=A[0]-this.popup.offsetWidth+this.button_sibling.offsetWidth+this.button.offsetWidth}else{A[0]=A[0]-this.button.offsetWidth}YAHOO.util.Dom.setXY(this.popup,A);this.popup_state=true;this.select_handler.hide()};vB_DatePicker.prototype.close_popup=function(){this.popup.style.display="none";this.popup_state=false;this.select_handler.show()};vB_DatePicker.prototype.toggle_calendar=function(A){YAHOO.util.Event.stopEvent(A);if(this.popup_state){this.close_popup()}else{this.open_popup()}};vB_DatePicker.prototype.change_month=function(A){YAHOO.util.Event.stopEvent(A);this.draw_date_cells(this.current_month.getMonth()+YAHOO.util.Event.getTarget(A).increment+1,this.current_month.getFullYear())};vB_DatePicker.prototype.date_click=function(A){YAHOO.util.Event.stopEvent(A);this.select_date(YAHOO.util.Event.getTarget(A).dateobj);this.close_popup();this.button_sibling.focus();try{this.button_sibling.select()}catch(A){}};vB_DatePicker.prototype.date_mouseover=function(A){var B=YAHOO.util.Event.getTarget(A);if(A.type=="mouseover"){YAHOO.util.Dom.replaceClass(B,"page","alt2")}else{YAHOO.util.Dom.replaceClass(B,"alt2","page")}};vB_DatePicker.prototype.set_today=function(A){this.select_date(this.today)};vB_DatePicker.prototype.fetch_offset=function(A){var B=YAHOO.util.Dom.getXY(A);return{left:B[0],top:B[1]}};