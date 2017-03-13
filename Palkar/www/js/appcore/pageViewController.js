var pageViewController = function(sb, input){
	var thisIsMobileDevice = true, storyEditorInitialized=false, albumContainerJS=null, storyEditHappening = false, documentEditHappening = false, placeHolderContainer=sb.dom.find("#jstemplate-pageViewController-placeHolderContainer").html(), relPathIn = input.relPath, appname=input.appname, streamSize = input.streamSize, newStream = null, userLoggedIn = false, storyItemControllerPublish = true;
	
	function _enableBigScreenFeatures(){
		sb.dom.find(".bigScreenItem").show();
	}
	
	function _setFontSize75EM(){
		sb.dom.find(this).css("font-size", "0.75em");
	}
	function _setFontSize1EM(){
		sb.dom.find(this).css("font-size", "1em");
	}
	
	function _setFontSize2EM(){
		sb.dom.find(this).css("font-size", "2em");
	}
	function _enableMobileScreenFeatures(){
		sb.dom.find('body').css('font-size', 'large');
		sb.dom.find('.storyItemBody').each(_setFontSize2EM);
		sb.dom.find('.storyItemFooter').each(_setFontSize2EM);
		sb.dom.find("#GContacts").css("font-size", "2em");
	}
	function _ShowStream(data){
		console.log('data received..' + JSON.stringify(data));
		sb.dom.find('#message').html(data);
	}

	function _toggleFullScreenEvent(e){
		var picturePanel = sb.dom.find('#picturePanel');
		if(sb.dom.find(this).hasClass('fullScreenEnabled')){
			
			picturePanel.removeClass('fullScreenPicturePanel');

			picturePanel.find('#pictureList').removeClass('fullScreenPictureList');

			picturePanel.find('.slideShowPicture').each(function(){
				sb.dom.find(this).removeClass('fullScreenPicture');
			});
			
			sb.dom.find('.subContainer').removeClass('fullScreenSubContainer');
			
			_initializePicturePresentation();			
			sb.dom.find(this).removeClass('fullScreenEnabled');					
		}else{
			picturePanel.addClass('fullScreenPicturePanel');

			picturePanel.find('#pictureList').addClass('fullScreenPictureList');

			picturePanel.find('.slideShowPicture').each(function(){
				sb.dom.find(this).addClass('fullScreenPicture');
			});
			
			sb.dom.find('.subContainer').addClass('fullScreenSubContainer');
			
			_initializePicturePresentation();			
			sb.dom.find(this).addClass('fullScreenEnabled');					
		}

	}
	
	   function addStoryItemToView(storyItem){
		   var storyItemHtml = tmpl("template-storyTemplate", storyItem);	   
		   sb.dom.find("#mainContainer").find("#storiesDiv").append(sb.utilities.htmlDecode(storyItemHtml));
			if(storyItem.storyDocumentPageId){
	   		   sb.dom.find("#mainContainer").find("#storiesDiv").find("#storyItem-"+storyItem.storyDocumentPageId).find('a').each(_setAnchorClickEvent);
			   if(!storyItemControllerPublish){
				   Core.publish("newStoryAdded", {storyItemDivId: "#storyItem-"+storyItem.storyDocumentPageId});
				}
		   }

	   }
	   
	function processPageInformation(snippetResponse){
		   var pageListHtml = tmpl("template-documentItemList", snippetResponse);
		   sb.dom.find("#rightPanel").find("#documentPageList").html(sb.utilities.htmlDecode(pageListHtml));
		   if(userLoggedIn){
			   var optionsHtml = "";
			   var showWriteToButton = false;
			   for(var i=0; i < snippetResponse.documentListResponse.documentItemList.length; i++){
					  if(snippetResponse.documentListResponse.documentItemList[i].acceptPosts){
						optionsHtml = optionsHtml + '<option value="'+snippetResponse.documentListResponse.documentItemList[i].documentId+'">'+snippetResponse.documentListResponse.documentItemList[i].documentTitle+'</option>';
						showWriteToButton = true;
					  } 
			   }
			   optionsHtml = optionsHtml + "</select>";
			   if(showWriteToButton){
					sb.dom.find("#createStoryDocument").html(sb.dom.wrap(optionsHtml));
					sb.dom.find("#createStoryDocument").selectmenu();
					sb.dom.find("#newMessageButton").fadeIn();
					sb.dom.find("#submitButtonForm").removeClass('nd');
					sb.dom.find("#attachPictures").removeClass('nd');
					sb.dom.find("#removePictures").removeClass('nd');	
					sb.dom.find("#loginRegisterButton").fadeOut();   
					sb.dom.find("#guestWelcome").fadeOut();  					
				}else{
					sb.dom.find("#createStoryDocument").html("Currently no sections accept user posts.");				
				}
		   }else{
				sb.dom.find("#loginRegisterButton").fadeIn();   
				sb.dom.find("#guestWelcome").fadeIn();   
			}
	}
	
	function _setAnchorClickEvent(){
		sb.dom.find(this).tap(_anchorClickEvent);		
	}
	    
	 function closeOverlay() {
	        sb.dom.find('.subContainer').first().animate({
	            top : '-=300',
	            opacity : 0
	        }, 600, function() {
	            sb.dom.find('#overlay-shade').fadeOut(300);
	            sb.dom.find(this).css('display','none');
	        });
	    }
		
		function _containerBackButtonClicked(e){		   
		   closeOverlay();		
		   sb.dom.find(this).parents('.subContainer').slideUp();
		   sb.dom.find(this).parents('.subContainer').remove();
		   var nextContainer = sb.dom.find('.container').first();		   
/*		   var nextContainerScrollTop = nextContainer.attr("data-scroll-top");
		   if(nextContainerScrollTop){
			   alert('have scroll top ' + nextContainerScrollTop);
			   nextContainer.scrollTop(nextContainerScrollTop);
		   }*/
		   nextContainer.show();
	   }
	   
		function _containerBackButtonClickedV2(e){		   
		   closeOverlay();		
		   sb.dom.find('.containers').find('.subContainer').first().slideUp();
		   sb.dom.find('.containers').find('.subContainer').first().remove();
		   if(sb.dom.find('.containers').find('.subContainer').length == 0){
				sb.dom.find(this).hide();  
		   }
		   var nextContainer = sb.dom.find('.container').first();		   
/*		   var nextContainerScrollTop = nextContainer.attr("data-scroll-top");
		   if(nextContainerScrollTop){
			   alert('have scroll top ' + nextContainerScrollTop);
			   nextContainer.scrollTop(nextContainerScrollTop);
		   }*/
		   nextContainer.show();
	   }	   

	    function openOverlay() {
	        var overLayDiv = sb.dom.find('.subContainer').first();	        
	        if (sb.dom.find('#overlay-shade').length == 0)
	            sb.dom.find('#containerDiv').prepend('<div id="overlay-shade"></div>');

	        sb.dom.find('#overlay-shade').fadeTo(300, 0.6, function() {
	            var props = {
	                oLayWidth       : overLayDiv.width(),
	                scrTop          : sb.dom.find('.appBody').scrollTop(),
	                viewPortWidth   : sb.dom.find(window).width()
	            };

	            var leftPos = (props.viewPortWidth - props.oLayWidth) / 2;

	            overLayDiv
	                .css({
	                    display : 'block',
	                    opacity : 0,
	                    top : props.scrTop
	                })
	                .animate({	                    
	                    opacity : 1
	                }, 600);
	        });
	    }
		
    	function _containerCloseButtonClicked(e){
		   closeOverlay();
		   sb.dom.find('.appHeader').find('#containerBackButton').hide();
		   var subContainerList = sb.dom.find('.subContainer');
		   for(var i= subContainerList.length - 1; i >=0 ; i--){
			  sb.dom.find(subContainerList[i]).slideUp();
			  sb.dom.find(subContainerList[i]).remove();			  
		   }
		   var nextContainer = sb.dom.find('.container').first();		   
		   /*var nextContainerScrollTop = nextContainer.attr("data-scroll-top");
		   if(nextContainerScrollTop){
			   nextContainer.scrollTop(nextContainerScrollTop);
		   }*/
		   nextContainer.show();			
		}
		
	   function _snippetResponseReceived(snippetResponse){
		   if(snippetResponse != null){
			   try{
			   sb.dom.find('.placeHolderContainer').remove();
			   sb.dom.find('#containerDiv').prepend(snippetResponse);
			   sb.dom.find('#containerDiv').find('.container').first().find('.containerBackButton').show();
			   sb.dom.find('#containerDiv').find('.container').first().find('.containerBackButton').bind('click', _containerBackButtonClicked);
			   sb.dom.find('#containerDiv').find('.container').first().find('.containerCloseButton').show();
			   sb.dom.find('#containerDiv').find('.container').first().find('.containerCloseButton').bind('click', _containerCloseButtonClicked);		
			   sb.dom.find('#containerDiv').find('.container').first().find('.CommentsSummary').removeClass('yui3-button');
			   sb.dom.find('#containerDiv').find('.container').first().find('.RepliesSummary').removeClass('yui3-button');
			   sb.dom.find('#containerDiv').find('.container').first().find('.HighlightSummary').removeClass('yui3-button');
			   sb.dom.find('#containerDiv').find('.container').first().find('.ViewSummary').removeClass('yui3-button');
			   sb.dom.find('#containerDiv').find('.container').first().find('.ShareSummary').removeClass('yui3-button');
			   sb.dom.find('#containerDiv').find('.container').first().find('.WhatsAppShare').removeClass('yui3-button');
			   sb.dom.find('.container').first().find('.storyItemBody').show();			   
			   sb.dom.find('.appHeader').find('#containerBackButton').show();
			   openOverlay();
			   }
			   catch(error){
					alert('exception ' + error);   
				}
		   }else{
			   sb.dom.find('.placeHolderContainer').remove();
			   sb.dom.find(this).parents('.subContainer').slideUp();
			   sb.dom.find(this).parents('.subContainer').remove();
			   sb.dom.find('.container').first().show();			   
			   Core.publish("displayMessage",{message: "Operation could not be completed. Please try again later.", messageType: "failure"});
		   }
	   		   
	   }

	   function _hideContainer(){
		   sb.dom.find(this).hide();
	   }
	   
	function _anchorClickEvent(e){
		try{			
			var snippetUrl = sb.dom.find(this).attr('data-snippet-url');
			if(snippetUrl){
					   e.preventDefault();
					   sb.dom.find('.container').each(_hideContainer);
					   sb.dom.find('#containerDiv').prepend(placeHolderContainer);		
					   //alert(sb.dom.find('#containerDiv').scrollTop());
					   //alert(sb.dom.find(this).scrollTo(0, 0));
					   //window.scrollTo(0, 0);
					   sb.utilities.get(snippetUrl,null,_snippetResponseReceived);			
			}
			sb.dom.find("#rightPanel").panel("close");
		}catch(err){
			updateFooterMessage(err);	
		}
	}
	
	function _newStoryAddedToView(message){
		try{		
		var storyItemNode =sb.dom.find(message.storyItemDivId);
		scrollListContainer=storyItemNode.find('#scrollListContainer');
		sb.dom.find(message.storyItemDivId).find('.toggleFullScreen').on('click',_toggleFullScreenEvent);
	   	sb.dom.find(message.storyItemDivId).find('a').each(_setAnchorClickEvent);
		setTimeout(_initializePicturePresentation, 1500);
		}catch(err){
			console.log(err);
		}
	}
	

	function _loadMainPage(snippetResponse){
		   if(snippetResponse != null && snippetResponse.antahRequestStatus == "SUCCESS"){	
			   updateFooterMessage("");
			   sb.dom.find('#containerDiv').find("#mainContainer").find("#storiesDiv").html("");
			   if(snippetResponse.streamResponse && snippetResponse.streamResponse.storyItemList && snippetResponse.streamResponse.storyItemList.length > 0){
					for(var i =0; i<snippetResponse.streamResponse.storyItemList.length;i++){
						try{
						addStoryItemToView(snippetResponse.streamResponse.storyItemList[i]);
						}catch(e){
							updateFooterMessage('problem loading story ' + snippetResponse.streamResponse.storyItemList[i].storyDocumentPageId + " " + e);
						}							
					} 
					if(storyItemControllerPublish){
						storyItemControllerPublish = false;
					Core.publish("startStoryItemController", {appname: appname, lastUpdatedStreamDate: snippetResponse.streamResponse.storyItemList[snippetResponse.streamResponse.storyItemList.length-1].storyTimeStampStringFormat, sseDetails: snippetResponse.sseHostDetails});
					}
				}else{
					updateFooterMessage("No Stories Received");
				}
			   if(snippetResponse.documentListResponse && snippetResponse.documentListResponse.documentItemList && snippetResponse.documentListResponse.documentItemList.length > 0){
						try{
						processPageInformation(snippetResponse);
						
						}catch(e){
							updateFooterMessage('problem loading page ' + snippetResponse.streamResponse.storyItemList[i].storyDocumentPageId + " " + e);
						}
				}else{
					updateFooterMessage("No Pages Received");
				}
			   sb.dom.find("#rightPanel").find("#documentPageList").find('a').each(_setAnchorClickEvent);			
			   sb.dom.find('#containerDiv').find('#mainContainer').find('div').first().removeClass('subContainer');
   			   sb.dom.find('#containerDiv').find('#mainContainer').find('div').first().removeClass('container');
			   sb.dom.find('#containerDiv').find('#mainContainer').find('div').first().find('.containerHeader').remove();
			   sb.dom.find("#storiesDivTrailer").find("#showMore").show();
			if(sb.dom.find('.grid').length > 0){
				var gridList = sb.dom.find('.grid');
				setTimeout(function(){gridList.each(_enableGrid)}, 5000);
			}
			sb.dom.find('.toggleFullScreen').on('click',_toggleFullScreenEvent);
			sb.dom.find('.timeago').timeago();
		   }else{
			   updateFooterMessage("There was a problem loading the Page. Please try again after some time. " + snippetResponse.antahResponseMessage);
			}
	}
	

	function _enableGrid(){
			sb.dom.find(this).masonry({
				itemSelector: '.grid-item',
				percentPosition: true,
				columnWidth: 250
			});	
	}
	function updateFooterMessage(msg){
		document.getElementById("message1").innerHTML = msg;
	}
	
	function _loadAppTemplates(){
		sb.dom.find('body').append(sb.dom.find(this));
	}
	
	function _triggerMainPageRequest(){
			_checkLoginStatus();		
			updateFooterMessage("Proceeding after check login status");
			var snippetUrl = null;
			var data = null;
			if(userLoggedIn){
				var userData = sb.utilities.getUserInfo();				
				snippetUrl = relPathIn+"api/appView?mediaType=json&a="+userData.authorization;
				data = {username: userData.username, appname: appname, streamSize: streamSize};
			}else{
			   snippetUrl = relPathIn+"appView?mediaType=json";
			   data = {appname: appname, streamSize: streamSize};				
			}
			appendFooterMessage("Getting data stream");
			sb.utilities.postV2(snippetUrl, data, _loadMainPage, _errorStartController);
	}
	function _loadAppPage(appPage){
		   if(appPage != null){	
 			    sb.dom.find('#containerDiv').find("#mainContainer").find("#storiesDiv").html(appPage);
				var token = sb.dom.find("meta[name='_csrf']").attr("content");
				var header = sb.dom.find("meta[name='_csrf_header']").attr("content");
			
				var tokenHtml =  '<meta name="_csrf" content="'+token+'"/>';
				var headerHtml =  '<meta name="_csrf_header" content="'+header+'"/>';
				
				sb.dom.find('#containerDiv').find("#mainContainer").find("#storiesDiv").find('script').each(_loadAppTemplates);
				sb.dom.find('head').prepend(tokenHtml);
				sb.dom.find('head').prepend(headerHtml);
			   try{
					if(sb.utilities.getUserInfo() != null){
						_triggerMainPageRequest();
						appendFooterMessage("User Info Not Null");						
					}else{
						appendFooterMessage("User Info Null");
						setTimeout(function(){_triggerMainPageRequest()}, 500);
					}
			   }catch(error){
					alert('error while logging in ' + error);   
				}
   
		   }else{
			   sb.dom.find('#message1').html("There was a problem loading the Page. Please try again after some time.");
			}
	}
	function _errorStartController(request, errorMessage, errorObj){
		document.getElementById("message1").innerHTML = JSON.stringify(request) + " " + JSON.stringify(errorObj);
	}
	
	function _leftPanelButtonClickEvent(e){
		if(sb.dom.find('.subContainer').length > 0){
			sb.dom.find('#leftPanel').panel({disabled: true});
			_containerCloseButtonClicked(e);
		}else{
			sb.dom.find('#leftPanel').panel({disabled: false});
		}
	}
	
	function _checkLoginStatus(){
		if(sb.utilities.getUserInfo()){		
			if(sb.utilities.getUserInfo().username == 'guest' || sb.utilities.getUserInfo().username == 'undefined' || sb.utilities.getUserInfo().username == null){
				userLoggedIn = false;
			}else{
				userLoggedIn = true;	
			}
		}else{
			userLoggedIn = false;	
		}
	}
	
	function _startControllerV2(){
		try{			
			var screenHeight = sb.dom.find(window).height();
			sb.dom.find('.appBody').css("height", screenHeight + " px");
			document.getElementById("message1").innerHTML = "Loading "+appname+"..";
			var appPageUrl = relPathIn + "appPage/"+appname+"/"+input.appmaintitle+"/"+input.appextendedtitle+"?mediaType=text";
			sb.dom.find('#refreshPanel').on('click', _refreshButtonClick);
			sb.utilities.appGet(appPageUrl,_loadAppPage,_errorStartController);
			console.log('snippet : 2' + appPageUrl);
			sb.dom.find('.appHeader').find('#containerBackButton').on('click', _containerBackButtonClickedV2);
			sb.dom.find('.appHeader').find('#palpostr-url').on('click', _leftPanelButtonClickEvent);
			sb.dom.find('#rightPanel').removeClass('nd');
			sb.dom.find('#leftPanel').removeClass('nd');
			sb.dom.find('#mainPage').page({
				domCache: true							  
			});
		}catch(error){
			alert(error);	
		}
		
	}
	
	function _refreshButtonClick(e){
			var snippetUrl = relPathIn+"appView?mediaType=json";
			var data = {appname: appname, streamSize: streamSize};
			sb.dom.find(this).find('.fa').addClass('fa-spin');
			sb.utilities.postV2(snippetUrl, data, _processNewStream, _errorProcessNewStream);
	}
	 function _initializePicturePresentation(){
		 try{
		   albumContainerJS = document.getElementById('pictureList');
	   		window.myAlbumView=Swipe(albumContainerJS, {
	   			startSlide: 0,
	   			auto: 3000,
	   			continuous: true,
	   			disableScroll: false,
	   			stopPropagation: false,
	   			callback: function(index, containerHandle){
	   				if(prevNavBtn != null){
	   					prevNavBtn.css('background-color','inherit');
	   				}
	   				currentNavBtn = sb.dom.find('#scrollBar').find('#'+index);
	   				currentNavBtn.css('background-color','#ffcc33');
	   				prevNavBtn = currentNavBtn;   				
	   			},
	   			transitionEnd: function(index, containerHandle){
	   				if(prevNavBtn != null){
	   					prevNavBtn.css('background-color','inherit');
	   	   				scrollListContainer.scrollLeft(prevNavBtn.position().left);
	   				}
	   				currentNavBtn = sb.dom.find('#scrollBar').find('#'+index);
	   				currentNavBtn.css('background-color','#ffcc33');
	   				prevNavBtn = currentNavBtn;

	   			}
	   		});
		 }catch(err){
			console.log(err);	 
		 }
	   }
	
	   function confirmExit(e){
		   console.log('confirn exit ' + storyEditHappening + " " + documentEditHappening);
		   if(storyEditHappening || documentEditHappening){
			   return sb.dom.find("#DocumentDialog-ConfirmNavigation").html();
		   }
	   }
	   
	   function _storyEditStatusUpdateMessageReceived(message){
		   console.log('story edit status ' + message.storyEditHappening);
		   storyEditHappening = message.storyEditHappening;
	   }
	   
	   function _documentEditStatusUpdateMessageReceived(message){
		   console.log('document edit status ' + message.documentEditHappening);
		   documentEditHappening = message.documentEditHappening;
	   }
	   
	function appendFooterMessage(msg){
		sb.dom.find("#message1").append("<br>"+msg);
	}

	function _pageSnippetAddedReceived(message){
   		//defaultClickReactionsDivList = sb.dom.find('.storyItemFooter');
   		//_loadPageReactionList(defaultClickReactionsDivList);
		console.log("Click Reactions Controller Snippet Added Recieved : MEssage ID " + JSON.stringify(message));
   		sb.dom.find(message.snippetId).find('.storyItem').each(
   				function(){
		   		   sb.dom.find(this).find('a').each(_setAnchorClickEvent);
				}
   		);
	}
	
	function _errorProcessNewStream(msg){
		appendFooterMessage(msg);
	}
	
	function _processNewStream(newStreamResponse){
		   if(newStreamResponse != null && newStreamResponse.antahRequestStatus == "SUCCESS"){
				_loadMainPage(newStreamResponse);
				sb.dom.find('#refreshPanel').prop('disabled', true);
				sb.dom.find('#refreshPanel').find('.fa').removeClass('fa-spin');
				sb.dom.find('#refreshPanel').hide();
		   }else{
			   _errorProcessNewStream('There was a problem getting message ' + antahResponseMessage);
			}
	}
	function _streamUpdateReceived(message){
		 if(sb.dom.find('#refreshPanel').is(":disabled")){				
			 sb.dom.find('#refreshPanel').prop('disabled', false);
			 sb.dom.find('#refreshPanel').show();
		  }
	}
	
	function disconnectAlertDismissed(){
		;
	}
	
	function _stompClientDisconnectMessageReceived(message){
		navigator.notification.alert('We are currently upgrading the ' + message.pageHandle + ' server. Your App may be slow or unresponsive. Please Restart the App in a few minutes to restore full set of features. See you soon!', disconnectAlertDismissed, message.pageHandle, 'Ok, Thanks');
	}
	
	function exitAppConfirm(button){
		if(button == 2){
			if(navigator.app){				
				navigator.app.exitApp();
			}else if(navigator.device){
				navigator.device.exitApp();
			}else{
				navigator.notification.alert('Your Operating System does not support this feature. Please close the App by pressing the home button on your Device', disconnectAlertDismissed, input.appname, 'Ok, Thanks');		
			}
		}else{
			;	
		}
	}
	
	function _deviceBackButtonClicked(e){
		var exitApp = false;
	
		if(sb.dom.find('.subContainer').length > 0){
		   e.preventDefault();
		   closeOverlay();		
		   var firstSubContainer = sb.dom.find('.subContainer').first();
		   firstSubContainer.slideUp();
		   firstSubContainer.remove();
		   var nextContainer = sb.dom.find('.container').first();		   
		   nextContainer.show();
			if(sb.dom.find('.subContainer').length == 0){
				sb.dom.find('#containerBackButton').hide();
			}			   
	   }else{
			exitApp = true;   
		}
		if(sb.dom.find('.placeHolderContainer').length > 0){
		   e.preventDefault();
		   closeOverlay();		
		   var firstSubContainer = sb.dom.find('.placeHolderContainer').first();
		   firstSubContainer.slideUp();
		   firstSubContainer.remove();
		   var nextContainer = sb.dom.find('.container').first();		   
		   nextContainer.show();
		}

		if(exitApp){
			try{
			sb.utilities.setUserInfo("guest", null, null);
			navigator.notification.confirm('Close the App?', exitAppConfirm, input.appname, 'Keep Browsing, Close');
			}catch(err){
				alert(err);	
			}
		}
		
	}

	function onResume(e) {
		e.preventDefault();
	}

	function _userLoginEventReceivedRetry(obj1, obj2, obj3){
		var userData = sb.utilities.getUserInfo();
		var snippetUrl = null;
		var data = null;
		snippetUrl = relPathIn+"api/appView?mediaType=json&a="+userData.authorization;
		data = {username: userData.username, appname: appname, streamSize: streamSize};			
		alert('There was a problem loggin in. Performing retry.' + JSON.stringify(data));
		sb.utilities.postV2(snippetUrl, data, _loadMainPage, _errorStartController);			
	}
	function _userLoginEventReceived(message){
		try{
				userLoggedIn=true;
				sb.dom.find("#storiesDivTrailer").find("#showMore").hide();
				sb.dom.find('#containerDiv').find("#mainContainer").find("#storiesDiv").html('<i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>');		   
				var userData = sb.utilities.getUserInfo();
				var snippetUrl = null;
				var data = null;
				snippetUrl = relPathIn+"api/appView?mediaType=json&a="+userData.authorization;
				data = {username: userData.username, appname: appname, streamSize: streamSize};			
				sb.utilities.postV2(snippetUrl, data, _loadMainPage, _userLoginEventReceivedRetry);	
		}catch(err){
			alert(err);	
		}
	}
	
	function _unAuthorizedFunctionalityResponse(button){
		if(button == 1){
			try{
			sb.dom.find("#loginRegisterButtonHidden").click();
			}catch(e){alert(e);}
		}else{
			;	
		}		
	}
	function _unAuthorizedFunctionality(message){
		try{
			var unAuthHtml = sb.dom.find("#jstemplate-unAuthorizedAccessDialog").html();
			var unAuthHtmlDom = sb.dom.wrap(unAuthHtml);
			_snippetResponseReceived(unAuthHtml);
		}catch(e){
			alert(e);	
		}
	}
   return{
	   init:function() {
       	try{
			console.log('starting page view controller..');
       		Core.subscribe('storyEditStatusUpdate', _storyEditStatusUpdateMessageReceived);
       		Core.subscribe('documentEditStatusUpdate', _documentEditStatusUpdateMessageReceived);
			Core.subscribe('newStoryAdded', _newStoryAddedToView);
			Core.subscribe('pageSnippetAdded', _pageSnippetAddedReceived);
			Core.subscribe('streamUpdateReceived', _streamUpdateReceived);
			Core.subscribe('userLoginEvent', _userLoginEventReceived);	
			Core.subscribe('unAuthorizedFunctionality', _unAuthorizedFunctionality);
			document.addEventListener("resume", onResume, false);
			document.addEventListener("backbutton", _deviceBackButtonClicked, true);
			Core.subscribe('stompClientDisconnect', _stompClientDisconnectMessageReceived);
       		window.onbeforeunload = confirmExit;
			_startControllerV2();
       	}catch(err){
			updateFooterMessage('Problem starting App..'+err);
       	}
   		
       },
   	  destroyModule:  function() {
   			sb.utilities.trace("Module destroyed");
   		}	   
     }
    };