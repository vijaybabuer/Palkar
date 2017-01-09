var sseController = function(sb, input){
	var relPathIn=input.relPath, stompClient = null; 
   
	function setConnected(connected){
		console.log('connected : ' + connected);
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
        console.log("Disconnected");
    }
    
    function _storyUpdateMessageReceived(message) {
    	Core.publish('getNewStories', null);
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
    	console.log(JSON.stringify(response));
    }
   return{
	   init:function() {
       	try{
       		sb.utilities.postV2(relPathIn+'sseParameters?mediaType=json', null, _parameterResponseReceived);  
       	}catch(err){
       		sb.utilities.log("Error while initializing sse controller: " + err);
       	}
   		
       },
   	  destroyModule:  function() { 
   			sb.utilities.trace("Module destroyed");
   		}	   
     }
    };