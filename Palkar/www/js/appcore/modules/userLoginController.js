var userLoginController = function(sb, input){
	var relPathIn=input.relPath;
   
   function _userLoginSuccess(txnResponse){
	   console.log("Login - " + txnResponse.txnStatus);
   }
   
   return{
	   init:function() {
       	try{
				sb.utilities.get(relPathIn+'userloginsuccess.pvt?mediaType=json',null,_userLoginSuccess);
       	}catch(err){
       		sb.utilities.log("Error while initializing userLogoModule: " + err);
       	}
   		
       },
   	  destroyModule:  function() { 
   			sb.utilities.trace("Module destroyed");
   		}	   
     }
    };