var messageDisplayController = function(sb, elemHandle){
	var htmlBody = sb.dom.find("#message-dialog"), messageType=null, timeout=null, controllerInput=null;
	     
   function _showMessage(input){
	   try{
	   controllerInput=input;
		   if(controllerInput.messageType == 'alert-success' ||  controllerInput.messageType == 'alert-failure'){
			   window.alert(controllerInput.message);
		   }else{
			   htmlBody = sb.dom.find("#messageDisplayDialog-"+controllerInput.messageType);
			   htmlBody.find('.message').html(controllerInput.message);
			   var title = controllerInput.messageTitle;
			   if(!controllerInput.messageTitle){
				   title = sb.dom.find("#jstemplate-MessageDisplayController-GeneralNote").html();
			   }
      			htmlBody.dialog({
      				closeOnEscape: true,
      				title: title,
      				position: {my: "center bottom", at: "center bottom", of: window}
       			});
      			timeout=setTimeout(_hideMessage,5000);
		   }
		   
	   }catch(err){
		   serverLog(err);
	   }
   }
   
   function _hideMessage(){
	   try{
	   htmlBody.dialog("close");
	   htmlBody.removeClass(controllerInput.messageType);
	   clearTimeout(timeout);
	   }catch(err){
		   serverLog(err);
	   }
   }
   
   function serverLog(err){
	   sb.utilities.log("Error Message From Module - MessageDisplayController : " + err);
   }
   return{
	   init:function() {
       	try{
       			sb.utilities.trace('initializing module: message display'); 
	    		Core.subscribe('displayMessage', _showMessage);
       	}catch(err){
       		serverLog(err);
       	}
   		
       },
   	  destroyModule:  function() { 
   		  serverLog("Module destroyed");
   		}	   
     }
    };