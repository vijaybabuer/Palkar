var userLoginController = function(sb, input){
	var relPathIn=input.relPath, loginSlidesContainer=null, loginSlideScrollBar=null, currentNavBtn=null, prevNavBtn=null;
   
   function _userLoginSuccess(txnResponse){
	   if(txnResponse.authorizationSuccess && txnResponse.authorizationSuccess == 'SUCCESS'){
			alert('Authorization ' + txnResponse.authorization);  
			//Core.utilities.setUserInfo(txnResponse.username, txnResponse.authorization);
		}else{
			navigator.notification.alert("Information you provided did not match our records. Please provide valid username and password. If you do not have an username and password, please click on Register Button", null, input.pageHandle, "Ok"); 
		}
   }
   
   function _errorLogin(request, errorMessage, errorObj){
			navigator.notification.alert("There was a problem processing your request. Please try again later.", null, input.pageHandle, "Ok"); 
	}
   function _loginUser(e){
	   e.preventDefault();
	   var userName = sb.dom.find('#username').val();
	   var password = sb.dom.find('#password').val();	   
	   var token = userName+":"+password;
	   alert(token);
	   if(userName && userName != "" && password && password != "" && userName != null && password != null){
		   	   sb.utilities.postV2(relPathIn+'api/userLogin?a='+token+'&pageHandle='+input.pageHandle+'&mediaType=json',{appname: input.pageHandle},_userLoginSuccess, _errorLogin);
	   }else{
			navigator.notification.alert("Please Enter User Name and Password.", null, input.pageHandle, "Ok");   
		}
	}
	function _initializeLoginSlides(){
		try{
		loginSlideScrollBar = sb.dom.find("#loginSlideScrollBar");
	   loginSlidesContainer = document.getElementById('loginRegisterPageSlides');
   		window.loginSlides=Swipe(loginSlidesContainer, {
   			startSlide: 0,
   			auto: 0,
   			continuous: false,
   			disableScroll: true,
   			stopPropagation: false,
   			callback: function(index, containerHandle){
				prevNavBtn = loginSlideScrollBar.find('.activeButton');
   				if(prevNavBtn != null){
   					prevNavBtn.removeClass('activeButton');
   				}
   				currentNavBtn = sb.dom.find('#loginSlideScrollBar').find('#'+index);
   				currentNavBtn.addClass('activeButton');
   				prevNavBtn = currentNavBtn;  
   			},
   			transitionEnd: function(index, containerHandle){
				;
   			}
   		});	
		}catch(e){
			alert(e);	
		}
	}
	
	function _registerButtonClick(e){
		setTimeout(_initializeLoginSlides, 1000);
	}
	
	
   return{
	   init:function() {
       	try{
			sb.dom.find("#loginDiv").find('#authorizeUser').on('click', _loginUser);
			sb.dom.find("#loginRegisterButton").on('click', _registerButtonClick);
       	}catch(err){
       		sb.utilities.log("Error while initializing userLogoModule: " + err);
       	}
   		
       },
   	  destroyModule:  function() { 
   			sb.utilities.trace("Module destroyed");
   		}	   
     }
    };