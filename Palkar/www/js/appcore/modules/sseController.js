var sseController = function(sb, input){
	var relPathIn=input.relPath, stompClient = null, stompClientConnected = false; 
   
	function setConnected(connected){
		console.log('connected : ' + connected);
		stompClientConnected = connected;
	}
	
    function connect(sseConnectionParameters) {
    	var host, authorization, sseUrl;
    	host = sseConnectionParameters.parameterInfoList[0].parameterValue;
    	authorization = sseConnectionParameters.parameterInfoList[1].parameterValue;
    	sseUrl = host+'/sseevents?a='+authorization;
        var socket = new SockJS(sseUrl);
        stompClient = Stomp.over(socket); 
        var headers  = {};
		var token = $("meta[name='_csrf']").attr("content");
		var headerName = $("meta[name='_csrf_header']").attr("content");
        headers[headerName] = token;
        stompClient.connect(headers, function(frame) {
            setConnected(true);
            console.log('Connected: ' + frame);
            stompClient.subscribe('/user/story/updates', function(message){
                _storyUpdateMessageReceived(message);
            });
            stompClient.subscribe('/user/pulse/updates', function(message){
                _pulseUpdateMessageReceived(message);
            });
        });
    }
    
    function disconnect() {
        if (stompClient != null) {
            stompClient.disconnect();
        }
        setConnected(false);
    }
    
    function _storyUpdateMessageReceived(message) {
		Core.publish('streamUpdateReceived', null);
    	//Core.publish('getNewStories', null);
    }
    
    function _pulseUpdateMessageReceived(message){
    	console.log('pulse update message');
    	Core.publish('newReactionAdded', null);
    }
    
    function _parameterResponseReceived(response){
    	if(response.txnStatus == "SUCCESS"){		
    		connect(response);
    	}else{
    		console.log("Error getting host parameter..");
    	}
    }
    
    function _authResponse(response){
    	//console.log(JSON.stringify(response));
    }
    
	function stompClientDisconnect(message){
		if(stompClientConnected){
			disconnect();
			Core.publish('stompClientDisconnect', {pageHandle: input.pageHandle});
		}else{
			console.log(message);	
		}
	}
    function publicConnect(sseHostIp){
		try{
    	var host, sseUrl;
    	host = sseHostIp;
    	sseUrl = host+'publicssevents';
        var socket = new SockJS(sseUrl);
        stompClient = Stomp.over(socket); 
        var headers  = {};
		var token = $("meta[name='_csrf']").attr("content");
		var headerName = $("meta[name='_csrf_header']").attr("content");
        headers[headerName] = token;		
        stompClient.connect(headers, function(frame) {
            setConnected(true);		
            stompClient.subscribe('/pageHandle/'+input.pageHandle, function(message){																	
                _storyUpdateMessageReceived(message);
            });
			sb.dom.find('#refreshPanel').prop('disabled', true);
        }, stompClientDisconnect);
        appendFooterMessage('publis connect..2');
		}catch(err){
			console.log('App may have problems in getting stories in real time.');	
		}
        	
    }
	
	function appendFooterMessage(msg){
		//sb.dom.find("#message1").append("<br>"+msg);
	}	
	

	function _initSseController(message){
       		if(input.userAuthenticated && input.userAuthenticated == 'true'){
       			sb.utilities.postV2(relPathIn+'sseParameters?mediaType=json', null, _parameterResponseReceived);	
       		}       		 
       		if(input.pageHandle && input.pageHandle != null){
           		publicConnect(message.sseDetails.parameterInfoList[0].parameterValue);
           		appendFooterMessage('publis connect..4');
       		}
		  if (window.webkitNotifications.checkPermission() == 0) { // 0 is PERMISSION_ALLOWED
			// function defined in step 2

		  } else {
			window.webkitNotifications.requestPermission();
		  }			
		}
   return{
	   init:function() {
       	try{
			Core.subscribe('startStoryItemController', _initSseController);
       	}catch(err){
       		sb.utilities.log("Error while initializing sse controller: " + err);
       	}
   		
       },
   	  destroyModule:  function() { 
   			sb.utilities.trace("Module destroyed");
   		}	   
     }
    };