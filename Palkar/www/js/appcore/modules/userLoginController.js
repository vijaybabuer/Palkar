var userLoginController = function(sb, input){
	var relPathIn=input.relPath, loginSlidesContainer=null, loginSlideScrollBar=null, currentNavBtn=null, prevNavBtn=null;
   
   function _userLoginSuccess(txnResponse){
	   if(txnResponse.authorizationSuccess && txnResponse.authorizationSuccess == 'SUCCESS'){
			try{
			sb.utilities.setUserInfo(txnResponse.userName, txnResponse.authorization, "api", txnResponse.userDetails);
			sb.dom.find("#guestWelcome").hide();
			sb.dom.find("#loginRegisterButton").hide();
			Core.publish('userLoginEvent', null);
			sb.dom.find("#loginDiv").find("#authorizeUser").val(sb.dom.find("#jstemplate-login-success-label").html());
			sb.dom.find("#loginDiv").find("#message").html(sb.dom.find("#jstemplate-login-success-message").html());
			sb.dom.find("#loginDiv").find("#authorizeUser").button('enable');
			sb.dom.find("#loginDiv").find("#authorizeUser").unbind('click', _loginUser);
			sb.dom.find("#loginDiv").find("#loginForm").slideUp();
			var userPanelPromptHtml =  tmpl("template-user-logo-prompt", txnResponse);
			sb.dom.find("#loginDiv").prepend(userPanelPromptHtml);
			
			}catch(e){
				alert(e);	
			}
		}else{	
		
			Materialize.toast("Unable to login. " + txnResponse.txtStatusReason, 2000);
			//navigator.notification.alert("Information you provided did not match our records. Please provide valid username and password. If you do not have an username and password, please click on Register Button", null, input.pageHandle, "Ok"); 
			sb.dom.find("#loginDiv").find("#authorizeUser").button('enable');
		}
   }
   
   function _errorLogin(request, errorMessage, errorObj){
	   sb.dom.find("#loginDiv").prepend(JSON.stringify(request));	   
			navigator.notification.alert("There was a problem. Please restart your App. " + JSON.stringify(errorMessage) + " : " + JSON.stringify(errorObj), null, input.pageHandle, "Ok"); 
			sb.dom.find("#loginDiv").find("#authorizeUser").button('enable');
	}
	
   function _userRegistrationFailure(request, errorMessage, errorObj){
			navigator.notification.alert(errorMessage, null, input.pageHandle, "Ok"); 
			sb.dom.find("#registrationDiv").find("#registerUser").button('enable');
	}
	
	
   function _loginUser(e){
	   e.preventDefault();
	   loginButtonClickEvent = e;
	   var userName = sb.dom.find('#username').val();
	   var password = sb.dom.find('#password').val();	   
	   var token = userName+":"+password;
	   if(userName && userName != "" && password && password != "" && userName != null && password != null){
			   sb.dom.find("#loginDiv").find("#authorizeUser").button('disable');		   
		   	   sb.utilities.postPublic(relPathIn+'apipublic/userLogin?&mediaType=json',{userName: userName, password: password, communityName: input.pageHandle},_userLoginSuccess, _errorLogin);
	   }else{
//			navigator.notification.alert("Please Enter User Name and Password.", null, input.pageHandle, "Ok");   
			Materialize.toast("Please Enter User Name and Password.", 2000);
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
   			disableScroll: false,
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
	
	function _initializeLoginSlidesV2(){
		try{
			sb.dom.find("#loginRegisterPageSlides").find("ul.tabs").tabs();
		}catch(e){
			alert(e);	
		}
	}	
	
	function _invalidRegistrationPromtResponse(){
		;
	}
	function _registrationSubmit(e){	
		e.preventDefault();

		if(_registrationFormValid()){
			var registrationInfo = {
				fullName: sb.dom.find("#ruserFullName").val(),
				emailAddress: sb.dom.find("#remailAddress").val(),
				userName: sb.dom.find("#rusername").val(),
				password: sb.dom.find("#rpassword").val(),
				vPassword: sb.dom.find("#rpassword").val(),
				communityName: input.pageHandle,
				acceptTermsAndConditions: true
			};
			sb.utilities.postPublic(relPathIn+'apipublic/membership?mediaType=json',registrationInfo,_userRegistrationSuccess, _userRegistrationFailure);
		}else{			
			var invalidRegistrationInfoText = sb.dom.find('#invalidRegistrationInfoText').html();		
			navigator.notification.alert(invalidRegistrationInfoText, _invalidRegistrationPromtResponse, input.pageHandle, 'Ok');				
		}
	}
	
	function _userRegistrationSuccess(response){
		if(response.authorizationSuccess == "SUCCESS"){
			sb.dom.find('#loginDiv').find('#message').html('Registration was successful');
			sb.utilities.setUserInfo(response.userName, response.authorization, "api", response.userDetails);
			sb.dom.find("#guestWelcome").hide();
			sb.dom.find("#loginRegisterButton").hide();
			Core.publish('userLoginEvent', null);
			sb.dom.find("#registrationDiv").find("#registrationForm").slideUp();
			var userPanelPromptHtml =  tmpl("template-user-logo-prompt", response);
			sb.dom.find("#registrationDiv").prepend(userPanelPromptHtml);			
		}else{
			if(response.errorInfoList && response.errorInfoList.length == 1 && response.errorInfoList[0].code == 'UserAlreadyMember'){
				sb.dom.find('#loginDiv').find('#message').html('Welcome back, ' + response.errorInfoList[0].reason.split(":")[1] +'!, please login.');
				sb.dom.find('#loginDiv').find('#username').val(response.errorInfoList[0].reason.split(":")[0]);
				sb.dom.find("ul.tabs").tabs("select_tab", "loginDiv");
			}else{
				var responseHtml = "<h3>Registration was not successful. Please correct the below and retry.</h3>"
				if(response.errorInfoList && response.errorInfoList.length > 0){
					for(var i=0; i<response.errorInfoList.length; i++){
						responseHtml = responseHtml+"<p>"+response.errorInfoList[i].reason+"</p>"
					}
				}
				sb.dom.find("#registrationDiv").find("#message").html(responseHtml);
			}
		}
	}
	function _registerButtonClick(e){
		try{
		setTimeout(_initializeLoginSlidesV2, 1000);
		sb.dom.find("#loginDiv").find("#authorizeUser").val(sb.dom.find("#jstemplate-login-label").html());
		sb.dom.find("#loginDiv").find("#message").html(sb.dom.find("#jstemplate-login-message").html());
		sb.dom.find("#loginDiv").find("#authorizeUser").unbind('click', _loginUser);
		sb.dom.find("#loginDiv").find("#authorizeUser").on('click', _loginUser);
		sb.dom.find("#registrationDiv").find("#registerUser").unbind('click', _registrationSubmit);
		sb.dom.find("#registrationDiv").find("#registerUser").on('click', _registrationSubmit);	
		//sb.dom.find("#loginDiv").find("#authorizeUser").button('enable');
		}catch(e){
			alert(e);	
		}
	}
	
	function isValid(str){
		if(str == null || str == ''){
			return false;	
		}
		var pattern = new RegExp(/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\:<>\?]/); //unacceptable chars
			if (pattern.test(str)) {
				return false;
			}
			return true; //good user input
	}	
	
	function _validateRegistrationEmail(email){
		if(email == null || email == ''){
			return false;	
		}
		if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
			return true;
		}else{
			return false;
		}
	}
	
	function _emailAddressChange(e){
		sb.dom.find("#rusername").val(sb.dom.find(this).val().split("@")[0]);	
	}
	
	function isNotEmpty(str){
		if(str == null || str == '' || str == 'undefined'){
			return false;	
		}else{
			return true;	
		}
	}
	function _registrationFormValid(){
		var validEmail = _validateRegistrationEmail(sb.dom.find("#remailAddress").val());
		var validName = isValid(sb.dom.find("#ruserFullName").val());
		var validUserName = isValid(sb.dom.find("#rusername").val());
		var validPassword = isNotEmpty(sb.dom.find("#rpassword").val());
		//sb.dom.find('#registrationDiv').find('#message').html(validEmail + " " + validName + " " +  validUserName + " " + validPassword);
		if(validEmail && validName && validUserName && validPassword){
			return true;	
		}
		var message = ""
		if(!validEmail){
			message = message + "Valid Email, ";
		}
		if(!validName){
			message = message + "Valid Name, ";			
		}
		if(!validUserName){
			message = message + "Valid Username, ";
		}
		if(!validPassword){
			message = message + "Valid Password";			
		}
		message = message + " required to register."
		sb.dom.find('#registrationDiv').find('#message').html(message);
		return false;
	}
	function _registrationInputChange(e){
		if(_registrationFormValid()){
			sb.dom.find('#registrationDiv').find('#message').html("Tap the Register button to Confirm your details and Register.");
			sb.dom.find("#registerUser").button('enable');
		}
	}
	
	function _alreadyHaveAccount(e){
		e.preventDefault();
		sb.dom.find("ul.tabs").tabs("select_tab", "loginDiv");
	}
	function _registerClick(e){	
		e.preventDefault();	
		sb.dom.find("ul.tabs").tabs("select_tab", "registrationDiv");
	}	
   return{
	   init:function() {
       	try{
			sb.dom.find("#loginDiv").find('#authorizeUser').on('click', _loginUser);
			sb.dom.find("#loginRegisterButton").on('click', _registerButtonClick);
			sb.dom.find("#remailAddress").change(_emailAddressChange);
			sb.dom.find("#registrationDiv").find('.invalidInfo').keyup(_registrationInputChange);
			sb.dom.find("#registerUser").click(_registrationSubmit);
			sb.dom.find("#alreadyHaveAccount").click(_alreadyHaveAccount);
			sb.dom.find("#register").click(_registerClick);			
			Core.subscribe('initializeUserRegistration', _registerButtonClick);
			setTimeout(_initializeLoginSlidesV2, 500);
       	}catch(err){
       		sb.utilities.log("Error while initializing userLogoModule: " + err);
       	}
   		
       },
   	  destroyModule:  function() { 
   			sb.utilities.trace("Module destroyed");
   		}	   
     }
    };