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
function vB_AJAX_QuickEdit_Init(C){if(AJAX_Compatible){if(typeof C=="string"){C=fetch_object(C)}var B=fetch_tags(C,"a");for(var A=0;A<B.length;A++){if(B[A].name&&B[A].name.indexOf("vB::QuickEdit::")!=-1){B[A].onclick=vB_AJAX_QuickEditor_Events.prototype.editbutton_click}}}}function vB_AJAX_QuickEditor(){this.postid=null;this.messageobj=null;this.container=null;this.originalhtml=null;this.editstate=false;this.editorcounter=0;this.ajax_req=null;this.show_advanced=true}vB_AJAX_QuickEditor.prototype.ready=function(){if(this.editstate||YAHOO.util.Connect.isCallInProgress(this.ajax_req)){return false}else{return true}};vB_AJAX_QuickEditor.prototype.edit=function(A){if(typeof vb_disable_ajax!="undefined"&&vb_disable_ajax>0){return true}var B=A.substr(A.lastIndexOf("::")+2);if(YAHOO.util.Connect.isCallInProgress(this.ajax_req)){return false}else{if(!this.ready()){if(this.postid==B){this.full_edit();return false}this.abort()}}this.editorcounter++;this.editorid="vB_Editor_QE_"+this.editorcounter;this.postid=B;this.messageobj=fetch_object("post_message_"+this.postid);this.originalhtml=this.messageobj.innerHTML;this.unchanged=null;this.unchanged_reason=null;this.fetch_editor();this.editstate=true;return false};vB_AJAX_QuickEditor.prototype.fetch_editor=function(){if(fetch_object("progress_"+this.postid)){fetch_object("progress_"+this.postid).style.display=""}document.body.style.cursor="wait";YAHOO.util.Connect.asyncRequest("POST","ajax.php?do=quickedit&p="+this.postid,{success:this.display_editor,failure:this.error_opening_editor,timeout:vB_Default_Timeout,scope:this},SESSIONURL+"securitytoken="+SECURITYTOKEN+"&do=quickedit&p="+this.postid+"&editorid="+PHP.urlencode(this.editorid))};vB_AJAX_QuickEditor.prototype.error_opening_editor=function(A){vBulletin_AJAX_Error_Handler(A);window.location="editpost.php?"+SESSIONURL+"do=editpost&postid="+this.postid};vB_AJAX_QuickEditor.prototype.handle_save_error=function(A){vBulletin_AJAX_Error_Handler(A);this.show_advanced=false;this.full_edit()};vB_AJAX_QuickEditor.prototype.display_editor=function(C){if(C.responseXML){if(fetch_object("progress_"+vB_QuickEditor.postid)){fetch_object("progress_"+vB_QuickEditor.postid).style.display="none"}document.body.style.cursor="auto";if(fetch_tag_count(C.responseXML,"disabled")){window.location="editpost.php?"+SESSIONURL+"do=editpost&postid="+this.postid}else{if(fetch_tag_count(C.responseXML,"error")){}else{var B=fetch_tags(C.responseXML,"editor")[0];if(typeof B=="undefined"){window.location="editpost.php?"+SESSIONURL+"do=editpost&postid="+this.postid;return false}var D=B.getAttribute("reason");this.messageobj.innerHTML=B.firstChild.nodeValue;if(fetch_object(this.editorid+"_edit_reason")){this.unchanged_reason=PHP.unhtmlspecialchars(D);fetch_object(this.editorid+"_edit_reason").value=this.unchanged_reason;fetch_object(this.editorid+"_edit_reason").onkeypress=vB_AJAX_QuickEditor_Events.prototype.reason_key_trap}vB_Editor[this.editorid]=new vB_Text_Editor(this.editorid,B.getAttribute("mode"),B.getAttribute("parsetype"),B.getAttribute("parsesmilies"));if(fetch_object(this.editorid+"_editor")&&fetch_object(this.editorid+"_editor").scrollIntoView){fetch_object(this.editorid+"_editor").scrollIntoView(true)}vB_Editor[this.editorid].set_editor_width("100%",true);vB_Editor[this.editorid].check_focus();this.unchanged=vB_Editor[this.editorid].get_editor_contents();fetch_object(this.editorid+"_save").onclick=this.save;fetch_object(this.editorid+"_abort").onclick=this.abort;fetch_object(this.editorid+"_adv").onclick=this.full_edit;var A=fetch_object(this.editorid+"_delete");if(A){A.onclick=this.show_delete}}}}};vB_AJAX_QuickEditor.prototype.restore=function(B,A){this.hide_errors(true);if(this.editorid&&vB_Editor[this.editorid]&&vB_Editor[this.editorid].initialized){vB_Editor[this.editorid].destroy()}if(A=="tableobj"){fetch_object("edit"+this.postid).innerHTML=B}else{this.messageobj.innerHTML=B}this.editstate=false};vB_AJAX_QuickEditor.prototype.abort=function(A){if(fetch_object("progress_"+vB_QuickEditor.postid)){fetch_object("progress_"+vB_QuickEditor.postid).style.display="none"}document.body.style.cursor="auto";vB_QuickEditor.restore(vB_QuickEditor.originalhtml,"messageobj");PostBit_Init(fetch_object("post"+vB_QuickEditor.postid),vB_QuickEditor.postid)};vB_AJAX_QuickEditor.prototype.full_edit=function(B){var A=new vB_Hidden_Form("editpost.php?do=updatepost&postid="+vB_QuickEditor.postid);A.add_variable("do","updatepost");A.add_variable("s",fetch_sessionhash());A.add_variable("securitytoken",SECURITYTOKEN);if(vB_QuickEditor.show_advanced){A.add_variable("advanced",1)}else{A.add_variable("quickeditnoajax",1)}A.add_variable("postid",vB_QuickEditor.postid);A.add_variable("wysiwyg",vB_Editor[vB_QuickEditor.editorid].wysiwyg_mode);A.add_variable("message",vB_Editor[vB_QuickEditor.editorid].get_editor_contents());A.add_variable("reason",fetch_object(vB_QuickEditor.editorid+"_edit_reason").value);A.submit_form()};vB_AJAX_QuickEditor.prototype.save=function(B){var C=vB_Editor[vB_QuickEditor.editorid].get_editor_contents();var A=vB_Editor[vB_QuickEditor.editorid];if(C==vB_QuickEditor.unchanged&&A==vB_QuickEditor.unchanged_reason){vB_QuickEditor.abort(B)}else{fetch_object(vB_QuickEditor.editorid+"_posting_msg").style.display="";document.body.style.cursor="wait";pc_obj=fetch_object("postcount"+vB_QuickEditor.postid);this.ajax_req=YAHOO.util.Connect.asyncRequest("POST","editpost.php?do=updatepost&postid="+this.postid,{success:vB_QuickEditor.update,failure:vB_QuickEditor.handle_save_error,timeout:vB_Default_Timeout,scope:vB_QuickEditor},SESSIONURL+"securitytoken="+SECURITYTOKEN+"&do=updatepost&ajax=1&postid="+vB_QuickEditor.postid+"&wysiwyg="+vB_Editor[vB_QuickEditor.editorid].wysiwyg_mode+"&message="+PHP.urlencode(C)+"&reason="+PHP.urlencode(fetch_object(vB_QuickEditor.editorid+"_edit_reason").value)+(pc_obj!=null?"&postcount="+PHP.urlencode(pc_obj.name):""));vB_QuickEditor.pending=true}};vB_AJAX_QuickEditor.prototype.show_delete=function(){vB_QuickEditor.deletedialog=fetch_object("quickedit_delete");if(vB_QuickEditor.deletedialog&&vB_QuickEditor.deletedialog.style.display!=""){vB_QuickEditor.deletedialog.style.display="";vB_QuickEditor.deletebutton=fetch_object("quickedit_dodelete");vB_QuickEditor.deletebutton.onclick=vB_QuickEditor.delete_post;if(fetch_object("del_reason")){fetch_object("del_reason").onkeypress=vB_AJAX_QuickEditor_Events.prototype.delete_items_key_trap}if(!is_opera&&!is_saf){vB_QuickEditor.deletebutton.disabled=true;vB_QuickEditor.deleteoptions=new Array();vB_QuickEditor.deleteoptions.leave=fetch_object("rb_del_leave");vB_QuickEditor.deleteoptions.soft=fetch_object("rb_del_soft");vB_QuickEditor.deleteoptions.hard=fetch_object("rb_del_hard");for(var A in vB_QuickEditor.deleteoptions){if(YAHOO.lang.hasOwnProperty(vB_QuickEditor.deleteoptions,A)&&vB_QuickEditor.deleteoptions[A]){vB_QuickEditor.deleteoptions[A].onclick=vB_QuickEditor.deleteoptions[A].onchange=vB_AJAX_QuickEditor_Events.prototype.delete_button_handler;vB_QuickEditor.deleteoptions[A].onkeypress=vB_AJAX_QuickEditor_Events.prototype.delete_items_key_trap}}}}};vB_AJAX_QuickEditor.prototype.delete_post=function(){var A=fetch_object("rb_del_leave");if(A&&A.checked){vB_QuickEditor.abort();return }var B=new vB_Hidden_Form("editpost.php");B.add_variable("do","deletepost");B.add_variable("s",fetch_sessionhash());B.add_variable("securitytoken",SECURITYTOKEN);B.add_variable("postid",vB_QuickEditor.postid);B.add_variables_from_object(vB_QuickEditor.deletedialog);B.submit_form()};vB_AJAX_QuickEditor.prototype.update=function(C){if(C.responseXML){vB_QuickEditor.pending=false;document.body.style.cursor="auto";fetch_object(vB_QuickEditor.editorid+"_posting_msg").style.display="none";if(fetch_tag_count(C.responseXML,"error")){var D=fetch_tags(C.responseXML,"error");var A="<ol>";for(var B=0;B<D.length;B++){A+="<li>"+D[B].firstChild.nodeValue+"</li>"}A+="</ol>";vB_QuickEditor.show_errors("<ol>"+A+"</ol>")}else{vB_QuickEditor.restore(C.responseXML.getElementsByTagName("postbit")[0].firstChild.nodeValue,"tableobj");PostBit_Init(fetch_object("post"+vB_QuickEditor.postid),vB_QuickEditor.postid)}}return false};vB_AJAX_QuickEditor.prototype.show_errors=function(A){set_unselectable("ajax_post_errors_closebtn");fetch_object("ajax_post_errors_message").innerHTML=A;var B=fetch_object("ajax_post_errors");B.style.width="400px";B.style.zIndex=500;var C=(is_saf?"body":"documentElement");B.style.left=(is_ie?document.documentElement.clientWidth:self.innerWidth)/2-200+document[C].scrollLeft+"px";B.style.top=(is_ie?document.documentElement.clientHeight:self.innerHeight)/2-150+document[C].scrollTop+"px";B.style.display=""};vB_AJAX_QuickEditor.prototype.hide_errors=function(A){this.errors=false;fetch_object("ajax_post_errors").style.display="none";if(A!=true){vB_Editor[this.editorid].check_focus()}};function vB_AJAX_QuickEditor_Events(){}vB_AJAX_QuickEditor_Events.prototype.editbutton_click=function(A){return vB_QuickEditor.edit(this.name)};vB_AJAX_QuickEditor_Events.prototype.delete_button_handler=function(A){if(this.id=="rb_del_leave"&&this.checked){vB_QuickEditor.deletebutton.disabled=true}else{vB_QuickEditor.deletebutton.disabled=false}};vB_AJAX_QuickEditor_Events.prototype.reason_key_trap=function(A){A=A?A:window.event;switch(A.keyCode){case 9:fetch_object(vB_QuickEditor.editorid+"_save").focus();return false;break;case 13:vB_QuickEditor.save();return false;break;default:return true}};vB_AJAX_QuickEditor_Events.prototype.delete_items_key_trap=function(A){A=A?A:window.event;if(A.keyCode==13){if(vB_QuickEditor.deletebutton.disabled==false){vB_QuickEditor.delete_post()}return false}return true};var vB_QuickEditor=new vB_AJAX_QuickEditor();