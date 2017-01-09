var userLogo = function(sb, input){
	var htmlBody = sb.dom.find(input.elemHandle), relPathIn=input.relPath, profilepictureid=input.profilepictureid, userToolTipCard = null,
	    userLogoHtml = null, changePictureLinkNode=null, profilepicalbumid=input.profilepicalbumid,timeout=null, tStamp=1, profpicurl=null,
		userLogoNode=null, userLogoPanelHtml=null, userLogoPanelNode=null, userLogoNodePos=null, userLogoNameNode=null;
 

   function _userLogoClick(){
	   _showUserLogoPanel();
   } 
   
   function _showUserLogoPanel(){ 
	   userLogoNodePos=userLogoNode.position();
	   userLogoNode.toggleClass("expandView");
	   userLogoPanelNode.slideToggle("nd");   
   }
   
   function _hideUserLogoPanel(){
	   userLogoPanelNode.slideUp();
	   userLogoNode.removeClass("expandView");	 
   }

   function _notifyToUserLogo(message){
	  sb.utilities.trace(message);  
   }
   
   function _showUserLogoOptionsPanel(){
	   
   }
   
   function _receiveAlbumUpdatePublish(publishData){
	   console.log('prof pic album update received..');
	   if(publishData.documenttype == "PROFPICS"){
		   if(publishData.actioncode == "ADD"){
			   console.log('add prof pic album update received..'+"album-"+publishData.documentid+"-"+publishData.documenttype);
			   var profpicContainer = sb.dom.find(".profpicturecapturediv");
			   profpicContainer.attr("id", "album-"+publishData.documentid+"-"+publishData.documenttype);	
			   profpicContainer.fadeIn();
		   }else{
			   var profpicContainer = sb.dom.find(".profpicturecapturediv");
			   profpicContainer.fadeOut();
				tStamp = tStamp + 1;
				profpicurl = relPathIn+'profpic/'+tStamp;
				
				userLogoNode.find('#user-button').css("background-image", "url("+profpicurl+")");
				console.log("userPicPopUp " + sb.dom.find("#userPicPopUp").length);
				userToolTipCard.find("#userPicPopUp").css("background-image", "url("+profpicurl+")");
				Core.publish("getNewStories", null);			   
		   }
	   }
   }
   
   function _changeProfilePicture(){
	   console.log("profilepicalbumid : " + profilepicalbumid);
	   if(profilepicalbumid && profilepicalbumid > 0){
	   Core.publish('addPictureFromWebCam',{documentid: profilepicalbumid, documenttype: "PROFPICS"});
	   }else{
	   Core.publish("addAlbum",{documenttype: "PROFPICS", documentname: ''});
	   }
   }
   
   function _hideUserLogoPanelAfterTimeout(){
	   timeout=setTimeout(_hideUserLogoPanel, 2000);
   }
   
   function _clearTimeoutOnPanel(){
	   clearTimeout(timeout);
   }

   function _refreshProfilePicture(data){
	   userLogoNode.find('#user-button').css("background-image", "url("+data+")");
   }
   
   function _setUserToolTip(){
	   console.log('user tool tip setting');
	   try{
		   var userJsonObject = {
				   "username": "",
				   "userFullName": "",
				   "userHasProfPic": ""
		   };

		   var userToolTipCardHtml = tmpl('template-userPanel', userJsonObject);

		   userToolTipCard = sb.dom.wrap(userToolTipCardHtml);
		   userToolTipCard.find("#changePictureLink").on('click', _changeProfilePicture);

		   userLogoNode.find('#user-button').data('powertipjq', userToolTipCard);
		   userLogoNode.find('#user-button').powerTip({
			  placement: 'sw',
			  mouseOnToPopup: true,
			  smartPlacement: true
		   });
		   
		   userToolTipCard.find(".ui-btn").bind("mouseover", _uiButtonMouseOver);
		   userToolTipCard.find(".ui-btn").bind("mouseout", _uiButtonMouseOut);
		   userToolTipCard.find("#userDetailsText").change(_userDetailsChanged);
		   userToolTipCard.find("#userLocationText").change(_userLocationChanged);		   
		   
	   }catch(err){
		   console.log('error while setting user tool tip'+err);
	   }


   }
   
   function _userDetailsUpdateSuccess(data){
	   Core.publish('getNewStories', null);
   }
   
   function _userLocationUpdateSuccess(data){
	   Core.publish('getNewStories', null);
   }
   
   function _userDetailsChanged(e){
	   var userDetailsText = sb.dom.find(this).val();
	   sb.utilities.postV2(relPathIn+"userdetailsText?mediaType=json",{detailsText: userDetailsText},_userDetailsUpdateSuccess);
   }
   
   function _userLocationChanged(e){
	   var userLocationText = sb.dom.find(this).val();
	   sb.utilities.postV2(relPathIn+"userlocation?mediaType=json",{location: userLocationText},_userLocationUpdateSuccess);
   }
   
   
   function _uiButtonMouseOver(e){
	   if(!sb.dom.find(this).hasClass('noeffect')){
		   sb.dom.find(this).toggleClass("ui-btn-b");
		   sb.dom.find(this).find(".label").toggleClass("cw");
	   }
   }
   
   function _uiButtonMouseOut(e){
	   if(!sb.dom.find(this).hasClass('noeffect')){
		   sb.dom.find(this).toggleClass("ui-btn-b");
		   sb.dom.find(this).find(".label").toggleClass("cw");
	   }
   }
   
   
   
   return{
	   init:function() {
       	try{
       			userLogoHtml=sb.dom.find('#template-user-logo').html();	
       			htmlBody.find("#tempUserLogoPanel").remove();
				htmlBody.append(userLogoHtml);
				userLogoNode=sb.dom.find('#user-logo');
				console.log("Prof Pic Album : " + profilepicalbumid);
				if(profilepictureid){
					profpicurl = relPathIn+'profpic/'+tStamp;			
				}else{
					profpicurl = relPathIn+'images/User.gif';
				}

				userLogoNode.find('#user-button').css("background-image", "url("+profpicurl+")");
				userLogoNode.find('#user-button').css("background-repeat","no-repeat"); 
				userLogoNode.find('#user-button').css("background-size","5em auto");
				userLogoNode.find('#user-button').css("background-position","center center");	
				
				Core.subscribe('albumUpdate', _receiveAlbumUpdatePublish);
				_setUserToolTip();

       	}catch(err){
       		sb.utilities.log("Error while initializing userLogoModule: " + err.stack);
       	}
   		
       },
   	  destroyModule:  function() { 
   			sb.utilities.trace(counter);
   			sb.utilities.trace("Module destroyed");
   		}	   
     }
    };