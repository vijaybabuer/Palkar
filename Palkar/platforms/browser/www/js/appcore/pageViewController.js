var pageViewController = function(sb, input){
	var thisIsMobileDevice = true, albumContainerJS=null, storyEditHappening = false, documentEditHappening = false;
	
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
	
	function _snippetResponseReceived(snippetResponse){
		   if(snippetResponse != null){
			   sb.dom.find('.placeHolderContainer').remove();
			   sb.dom.find('#containerDiv').prepend(snippetResponse);
			   sb.dom.find('#containerDiv').find('.container').first().find('.containerBackButton').show();
			   sb.dom.find('#containerDiv').find('.container').first().find('.containerBackButton').bind('click', _containerBackButtonClicked);
			   sb.dom.find('.container').first().find('.storyItemBody').show();
		   }else{
			   sb.dom.find('.placeHolderContainer').remove();
			   sb.dom.find(this).parents('.subContainer').slideUp();
			   sb.dom.find(this).parents('.subContainer').remove();
			   sb.dom.find('.container').first().show();			   
			   sb.dom.find('.appBody').append('there was a problem. please try again later.');
			   Core.publish("displayMessage",{message: "Operation could not be completed. Please try again later.", messageType: "failure"});
		   }
	   		   
	   }
	   
	function _startController(){
		console.log('starting controller..');
		document.getElementById("message1").innerHTML = "PALKAR App Loading";
		alert('getting content ' + snippetUrl);
		var snippetUrl = "http://192.168.0.107:8080/palpostr/Magazine/snippet/page/710545732705082509?viewAllStories=false&mediaType=text";
		
		
		sb.utilities.get(snippetUrl,null,_snippetResponseReceived);
        
		if(!sb.utilities.isMobile()){
			thisIsMobileDevice = false;
			_enableBigScreenFeatures();
		}else{
			thisIsMobileDevice = true;
			_enableMobileScreenFeatures();
		}
		try{
			if(input.initializeMediaPresentation){
				_initializePicturePresentation();
			}
		}catch(err){
			console.log("Error whole initializing Picture Controller.." + err);
		}
	}
	
	function _newStoryAddedToView(message){
		try{		
		var storyItemNode =sb.dom.find(message.storyItemDivId);
		if(sb.utilities.isMobile()){
			storyItemNode.find('.storyItemBody').each(_setFontSize2EM);
			storyItemNode.find('.storyItemFooter').each(_setFontSize2EM);
		}else{
			storyItemNode.find(".HighlightSummary").each(_setFontSize75EM);
			storyItemNode.find(".CommentsSummary").each(_setFontSize75EM);
			storyItemNode.find(".RepliesSummary").each(_setFontSize75EM);
			storyItemNode.find(".ShareSummary").each(_setFontSize75EM);
			storyItemNode.find(".ViewSummary").each(_setFontSize75EM);
		}

		}catch(err){
			console.log(err);
		}
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
	   
   return{
	   init:function() {
       	try{
       		Core.subscribe('newStoryAdded', _newStoryAddedToView);
       		Core.subscribe('storyEditStatusUpdate', _storyEditStatusUpdateMessageReceived);
       		Core.subscribe('documentEditStatusUpdate', _documentEditStatusUpdateMessageReceived);
       		window.onbeforeunload = confirmExit;
       	}catch(err){
			alert(problem starting controller..'+err);
			sb.dom.find('.app').prepend('<p>there was a problem ' + err +'</p>');
       		sb.utilities.log("Error while initializing page view controller: " + err);
       	}
   		
       },
   	  destroyModule:  function() {
   			sb.utilities.trace("Module destroyed");
   		}	   
     }
    };