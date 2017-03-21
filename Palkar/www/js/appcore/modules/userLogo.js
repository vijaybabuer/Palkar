var userLogo = function(sb, input){
	var htmlBody = sb.dom.find(input.elemHandle), relPathIn=input.relPath, userToolTipCard = null,
	    userLogoHtml = null, changePictureLinkNode=null, timeout=null, tStamp=1, profpicurl=null, profilepicalbumid = null,
		userLogoNode=null, userLogoPanelHtml=null, userLogoPanelNode=null, userLogoNodePos=null, userLogoNameNode=null, tempUserDetail = null, tempLocation = null;
 

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
   
    function _refreshProfilePicture(message){
		try{
				tStamp = tStamp + 1;
				profpicurl = relPathIn+'api/profpic/'+tStamp+'?a='+sb.utilities.getUserInfo().authorization;
			   var newProfPicture = sb.dom.wrap('<img>');
			   newProfPicture.attr({'src': profpicurl});
			   sb.dom.find(userToolTipCard).find('.card-image').find('img').remove();
			   sb.dom.find(userToolTipCard).find('.card-image').prepend(newProfPicture);
		}catch(e){
					alert(e);   
		}		
	}
    function _removeProfilePicture(message){
		try{	
		   sb.dom.find(userToolTipCard).find('.card-image').find('img').remove();	   
		}catch(e){
					alert(e);   
		}		
	}	
   function _receiveAlbumUpdatePublish(publishData){
	try{
	   if(publishData.documenttype == "PROFPICS"){
		   if(publishData.actioncode == "ADD"){
			   profilepicalbumid = publishData.documentid;
			   console.log('add prof pic album update received..'+"album-"+publishData.documentid+"-"+publishData.documenttype);
			   var profpicContainer = sb.dom.find(".profpicturecapturediv");			   
			   profpicContainer.attr("id", "album-"+publishData.documentid+"-"+publishData.documenttype);	
			   profpicContainer.fadeIn();			   
		   }else{
			   try{
				tStamp = tStamp + 1;
				profpicurl = relPathIn+'api/profpic/'+tStamp+'?a='+sb.utilities.getUserInfo().authorization;
			   var newProfPicture = sb.dom.wrap('<img>');
			   newProfPicture.attr({'src': profpicurl, 'height' : '300px'});
			   sb.dom.find(userToolTipCard).find('.card-image').find('img').remove();
			   sb.dom.find(userToolTipCard).find('.card-image').prepend(newProfPicture);
			   }catch(e){
					alert(e);   
				}
		   }
	   }
	}catch(e){
		alert(e);	
	}
   }
   
   function _changeProfilePicture(){
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
   
   function _changeProfilePictureFromGallery(e){
	   if(profilepicalbumid && profilepicalbumid > 0){
	   Core.publish('addProfPictureFromDevice',{documentid: profilepicalbumid, documenttype: "PROFPICS"});
	   }else{
	   Core.publish("addAlbum",{documenttype: "PROFPICS", documentname: ''});
	   }
	}
   function _changeProfilePictureFromCamera(e){
	   if(profilepicalbumid && profilepicalbumid > 0){
	   Core.publish('addProfPictureFromWebCam',{documentid: profilepicalbumid, documenttype: "PROFPICS"});
	   }else{
	   Core.publish("addAlbum",{documenttype: "PROFPICS", documentname: ''});
	   }	   
	}	
   function _setUserToolTip(){
	   console.log('user tool tip setting');
	   try{		   
		   sb.dom.find(userToolTipCard).find("#updateDetailsText").click(_userDetailsChanged);
		   sb.dom.find(userToolTipCard).find("#updateLocation").click(_userLocationChanged);
		   sb.dom.find(userToolTipCard).find("#changeProfilePicture").click(_changeProfilePicture);		   
		   sb.dom.find(userToolTipCard).find("#changeProfilePictureFromGallery").click(_changeProfilePictureFromGallery);
		   sb.dom.find(userToolTipCard).find("#changeProfilePictureFromCamera").click(_changeProfilePictureFromCamera);	
		   if(profilepicalbumid && profilepicalbumid > 0){
			    sb.dom.find(userToolTipCard).find("#changeProfilePicture").hide();
				Core.publish('albumUpdate', {documentid: profilepicalbumid, documenttype: 'PROFPICS', actioncode: 'UPDATE'});
		   }else{
			   sb.dom.find(userToolTipCard).find("#changeProfilePictureFromGallery").hide();
			   sb.dom.find(userToolTipCard).find("#changeProfilePictureFromCamera").hide();
			}
	   }catch(err){
		   console.log('error while setting user tool tip'+err);
	   }


   }
   
   function _userDetailsUpdateSuccess(data){
	   Materialize.toast('Saved!', 2000);
	   sb.utilities.getUserInfo().userDetails.userAccount.detailsText = tempUserDetail;
	   sb.utilities.getUserInfo().userDetails.userDetailsText = tempUserDetail;	
   }
   
   function _userLocationUpdateSuccess(data){
	   Materialize.toast('Saved!', 2000);
	   sb.utilities.getUserInfo().userDetails.userAccount.location = tempLocation;
   }
   
   function _userDetailsChanged(e){
	   tempUserDetail = sb.dom.find(this).parent().find('textarea').val();
	   sb.utilities.postV2("userdetailsText?mediaType=json",{detailsText: tempUserDetail},_userDetailsUpdateSuccess);
   }
   
   function _userLocationChanged(e){
	   tempLocation = sb.dom.find(this).parent().find('textarea').val();
	   sb.utilities.postV2("userlocation?mediaType=json",{location: tempLocation},_userLocationUpdateSuccess);
   }
   
   
   function _setupProfile(message){
				var userPreferencesCard = tmpl('template-user-panel-edit', sb.utilities.getUserInfo());
				sb.dom.find('#profileContainer').html(userPreferencesCard);
				sb.dom.find('#profileContainerTab').prop('disabled', false);
				Core.subscribe('albumUpdate', _receiveAlbumUpdatePublish);
				userToolTipCard = sb.dom.find('#profileContainer').find('#userProfileCard');
				profilepicalbumid = sb.utilities.getUserInfo().userDetails.profilePictureAlbumId;					
				_setUserToolTip();
	}
   function _userLoginEvent(message){				
		_setupProfile(message);		
	}
   
   function _startUserLogoController(message){				
		_setupProfile(message);		
	}
	
	function _profilePreferencesClick(message){
		sb.dom.find('#containerDiv').find('ul.tabs').tabs('select_tab', 'profileContainer');
	}
   return{
	   init:function() {
       	try{
			Core.subscribe('userLoginEvent', _userLoginEvent);		
			Core.subscribe('startUserLogo', _startUserLogoController);		
			Core.subscribe('profilePreferencesClick', _profilePreferencesClick);		
			Core.subscribe('refreshProfilePicture', _refreshProfilePicture);
			Core.subscribe('removeProfilePicture', _removeProfilePicture);			
       	}catch(err){
       		alert("Error while initializing userLogoModule: " + err);
       	}
   		
       },
   	  destroyModule:  function() { 
   			sb.utilities.trace(counter);
   			sb.utilities.trace("Module destroyed");
   		}	   
     }
    };