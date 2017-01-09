var albumsController = function(sb, input){
	var albuminfo=null, relPathIn=input.relPath, documentid=null, documenttype=null, albumcontainer=null, picturecontainer=null, pictures=null, thumnailhtmltemplate=null, loadingHtml=null, thumnailhtml=null;
	
	function _addPics(e){
	 try{
		albuminfo=e.currentTarget.id.split("-");
		documentid=albuminfo[1];
		documenttype=albuminfo[2];
		if(documentid != '0'){
			Core.publish("addPictureFromDevice",{documentid: documentid, documenttype: documenttype});
		}else{
			if(documenttype == 'PROFPICS'){
				Core.publish("addAlbum",{documenttype: documenttype, documentname: ''});
			}
		}
	 }
	 catch(err){
		 serverLog(err);
	 }
		
	}

	function _receivePublish(input){
		try{
			if(input.actioncode == "ADD"){
				if(input.documenttype == 'PROFPICS'){
					_paintProfilePictures(input);
				}
			}else{
				if(input.actioncode == "UPDATE"){
					_paintPictures(input);
				}
			}
		}catch(err){
			serverLog(err);
		}
	}
	
	function _paintProfilePictures(input){
		albumcontainer=sb.dom.find("#album-0"+"-"+input.documenttype);
		sb.dom.find('#button-0-PROFPICS').remove();
		albumcontainer.attr('id','#album-'+input.documentid+'-'+input.documenttype);
		picturecontainer = albumcontainer.find(".albumpictures");
		picturecontainer.append(loadingHtml);
		_getPicturesFromServer(input);
		
	}
	
	function _paintPictures(input){
		albumcontainer=sb.dom.find("#album-"+input.documentid+"-"+input.documenttype);
		picturecontainer = albumcontainer.find(".albumpictures");
		picturecontainer.append(loadingHtml);
		_getPicturesFromServer(input);
		

	}
	
	function _paintAlbumPictures(data){
		
		//Update picture list.
		albumcontainer.find("#pictureLoading").remove();
		picturecontainer.html("");
		for(var i=0; i<data.documentPageIDList.length; i++){
			thumnailhtml = thumnailhtmltemplate;
			thumnailhtml=thumnailhtml.replace("albumpicid",relPathIn+"alb/"+data.documentPageIDList[i]);
			thumnailhtml=thumnailhtml.replace("pictureurl","data:image/gif;base64,"+data.base64AlbumPhotos[i]);
			picturecontainer.append(sb.dom.wrap(thumnailhtml));
		}		
		albumcontainer.show();
		
		//Update picture list in Send Message Dialog
		var attachmentAlbumContainer = sb.dom.find("#attachments-"+data.albumDocumentId+"-"+data.albumDocumentTypeCd);
		var attachmentPictureContainer = attachmentAlbumContainer.find(".albumpictures");
		attachmentPictureContainer.html("");
		for(var i=0; i<data.documentPageIDList.length; i++){
			thumnailhtml = thumnailhtmltemplate;
			thumnailhtml=thumnailhtml.replace("albumpicid",relPathIn+"alb/"+data.documentPageIDList[i]);
			thumnailhtml=thumnailhtml.replace("pictureurl","data:image/gif;base64,"+data.base64AlbumPhotos[i]);
			attachmentPictureContainer.append(sb.dom.wrap(thumnailhtml));
		}	
		
		//Update picture list in DocumentEdit dialog
		var editDocumentAlbumContainer = sb.dom.find("#EditDocument").find("#album-"+data.albumDocumentId+"-"+data.albumDocumentTypeCd);
		var editDocumentPictureContainer = editDocumentAlbumContainer.find(".albumpictures");
		editDocumentPictureContainer.html("");
		for(var i=0; i<data.documentPageIDList.length; i++){
			thumnailhtml = thumnailhtmltemplate;
			thumnailhtml=thumnailhtml.replace("albumpicid",relPathIn+"alb/"+data.documentPageIDList[i]);
			thumnailhtml=thumnailhtml.replace("pictureurl","data:image/gif;base64,"+data.base64AlbumPhotos[i]);
			editDocumentPictureContainer.append(sb.dom.wrap(thumnailhtml));
		}
	}
	
	function _loadingPictureError(){
		serverLog("albumsController.js -- Error while loading picture for album " + err);
		albumcontainer.find("#pictureLoading").remove();
	}
	
	function _getPicturesFromServer(input){
		try{
			sb.utilities.get(relPathIn+"galb/"+input.documentid+".5?mediaType=json",_paintAlbumPictures);
		}catch(err){
			serverLog(err);
		}
		
	}
	   function serverLog(err){
		   sb.utilities.log("Error Message From Module - Albums Controller : " + err);
	   }
	   
	   function _storyItemAddedReceived(message){
		   sb.dom.find(message.storyItemDivId).find('.addpics').bind('click', _addPics);
	   }
	   
   return{
	   init:function() {
       	try{
       		thumnailhtmltemplate=sb.dom.find("#template-albumpicturethumbnail").html();
       		loadingHtml=sb.dom.find("#template-loading").html();
       		sb.dom.find('.addpics').bind('click',_addPics);       		
       		Core.subscribe('albumUpdate',_receivePublish);
       		Core.subscribe("newStoryAdded", _storyItemAddedReceived);
       	}catch(err){       		
       		serverLog(err);
       	}
       },
   	  destroyModule:  function() { 
   			console.log(counter);
   			console.log("Module destroyed");
   		}	   
     }
    };