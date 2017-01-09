var pageViewController = function(sb, input){
	var thisIsMobileDevice = true, albumContainerJS=null, storyEditHappening = false, documentEditHappening = false, placeHolderContainer=sb.dom.find("#jstemplate-pageViewController-placeHolderContainer").html(), relPathIn = input.relPath, appname=input.appname, streamSize = input.streamSize;
	
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
	   }
	   
	function addPagesToRightPanel(snippetResponse){
		   var pageListHtml = tmpl("template-documentItemList", snippetResponse);
		   sb.dom.find("#rightPanel").find("#documentPageList").html(sb.utilities.htmlDecode(pageListHtml));
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
		   sb.dom.find('.container').first().show();
	   }

	    function openOverlay() {
	        var overLayDiv = sb.dom.find('.subContainer').first();	        
	        if (sb.dom.find('#overlay-shade').length == 0)
	            sb.dom.find('body').prepend('<div id="overlay-shade"></div>');

	        sb.dom.find('#overlay-shade').fadeTo(300, 0.6, function() {
	            var props = {
	                oLayWidth       : overLayDiv.width(),
	                scrTop          : sb.dom.find(window).scrollTop(),
	                viewPortWidth   : sb.dom.find(window).width()
	            };

	            var leftPos = (props.viewPortWidth - props.oLayWidth) / 2;

	            overLayDiv
	                .css({
	                    display : 'block',
	                    opacity : 0,
	                    top : '-=300',
	                    left : leftPos+'px'
	                })
	                .animate({
	                    top : props.scrTop + 40,
	                    opacity : 1
	                }, 600);
	        });
	    }
		
	   function _snippetResponseReceived(snippetResponse){
		   if(snippetResponse != null){
			   sb.dom.find('.placeHolderContainer').remove();
			   sb.dom.find('#containerDiv').prepend(snippetResponse);
			   sb.dom.find('#containerDiv').find('.container').first().find('.containerBackButton').show();
			   sb.dom.find('#containerDiv').find('.container').first().find('.containerBackButton').bind('click', _containerBackButtonClicked);
			   sb.dom.find('.container').first().find('.storyItemBody').show();
			   openOverlay();
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
					   window.scrollTo(0, 0);
					   sb.utilities.get(snippetUrl,null,_snippetResponseReceived);			
			}else{
				updateFooterMessage('no view snippet url has been set');
			}
			sb.dom.find("#rightPanel").panel("close");
		}catch(err){
			updateFooterMessage(err);	
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
					Core.publish("startStoryItemController", {appname: appname, lastUpdatedStreamDate: snippetResponse.streamResponse.storyItemList[snippetResponse.streamResponse.storyItemList.length-1].storyTimeStampStringFormat});					
				}else{
					updateFooterMessage("No Stories Received");
				}
			   if(snippetResponse.documentListResponse && snippetResponse.documentListResponse.documentItemList && snippetResponse.documentListResponse.documentItemList.length > 0){
						try{
						addPagesToRightPanel(snippetResponse);
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
			if(sb.dom.find('.grid').length > 0){
				var gridList = sb.dom.find('.grid').masonry({
					  itemSelector: '.grid-item',
					  percentPosition: true,
					  columnWidth: '.grid-sizer'
					});
			}
			sb.dom.find('.toggleFullScreen').on('click',_toggleFullScreenEvent);
			sb.dom.find('.timeago').timeago();
		   }else{
			   updateFooterMessage("There was a problem loading the Page. Please try again after some time. " + snippetResponse.antahResponseMessage);
			}
	}
	

	function updateFooterMessage(msg){
		document.getElementById("message1").innerHTML = msg;
	}
	
	function _loadAppPage(appPage){
		   if(appPage != null){			   
			   sb.dom.find('#containerDiv').find("#mainContainer").find("#storiesDiv").html(appPage);
				var token = sb.dom.find("meta[name='_csrf']").attr("content");
				var header = sb.dom.find("meta[name='_csrf_header']").attr("content");
			
				var tokenHtml =  '<meta name="_csrf" content="'+token+'"/>';
				var headerHtml =  '<meta name="_csrf_header" content="'+header+'"/>';
				
				sb.dom.find('head').prepend(tokenHtml);
				sb.dom.find('head').prepend(headerHtml);
				
			   updateFooterMessage("Getting data stream");
			   var snippetUrl = relPathIn+"appView?mediaType=json";
			   var data = {appname: appname, streamSize: streamSize};
			   setTimeout(function(){sb.utilities.postV2(snippetUrl, data, _loadMainPage, _errorStartController);}, 5000);
		   }else{
			   sb.dom.find('#message1').html("There was a problem loading the Page. Please try again after some time.");
			}
	}
	function _errorStartController(request, errorMessage, errorObj){
		document.getElementById("message1").innerHTML = JSON.stringify(request) + " " + errorMessage;
	}
	function _startControllerV2(){
		var screenHeight = sb.dom.find(window).height();
		sb.dom.find('.appBody').css("height", screenHeight + " px");
		document.getElementById("message1").innerHTML = "Loading "+appname+"..";
		var appPageUrl = relPathIn + "appPage/"+appname+"/"+input.appmaintitle+"/"+input.appextendedtitle+"?mediaType=text";
		sb.utilities.appGet(appPageUrl,_loadAppPage,_errorStartController);
        console.log('snippet : 2' + appPageUrl);
	}
	
	 function _initializePicturePresentation(){
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
	function _reloadStream(){
		sb.dom.find(".appFooter").find("#message1").html("");
		sb.dom.find("#mainContainer").find("#storiesDiv").html("<i class='fa fa-spinner fa-pulse nd fa-3x fa-fw'></i>");
		sb.dom.find("#rightPanel").find("#documentPageList").html("Please wait while the section is loading..");	
		sb.dom.find("#storiesDivTrailer").find("#showMore").addClass("nd");
		sb.dom.find("#leftPanel").panel("close");
		_startControllerV2();
	}
   return{
	   init:function() {
       	try{
			console.log('starting page view controller..');
       		Core.subscribe('storyEditStatusUpdate', _storyEditStatusUpdateMessageReceived);
       		Core.subscribe('documentEditStatusUpdate', _documentEditStatusUpdateMessageReceived);
       		window.onbeforeunload = confirmExit;
			_startControllerV2();
			sb.dom.find("#reloadApp").click(_reloadStream);
       	}catch(err){
			updateFooterMessage('Problem starting App..'+err);
       	}
   		
       },
   	  destroyModule:  function() {
   			sb.utilities.trace("Module destroyed");
   		}	   
     }
    };