/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
		
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
		

	
	Core.register('userLogo',userLogo,{elemHandle: '#hdrrp', profilepicalbumid: "${profilePictureAlbumId}", relPath: "${relPath}", profilepictureid: "${profilePictureId}"});
	Core.register('siteLogo',siteLogo,{elemHandle: '#site-logo2', relPath: "${relPath}"});
	Core.register('photoUploadController',photoUploadController, {relPath: "${relPath}", containerDiv: "#photoUploadContainerDiv"});
	Core.register('storyEditController',storyEditController,{elemHandle: '#createStory', relPath: "${relPath}", addPostTextAreaHandle: ".addPostTextArea", storiesDiv: "#storiesDiv", storyJSTemplateName: "template-storyTemplate"});
	Core.register('albumsController',albumsController,{relPath: "${relPath}"});
	Core.register('messageDisplayController',messageDisplayController,'#main');
	Core.register('clickReactionsController',clickReactionsController,{relPath: "${relPath}", reactionCountPerPage: "${welcomePageClickReactionCount}"});
	Core.register('textReactionsController',textReactionsController,{relPath: "${relPath}", reactionCountPerPage: "${welcomePageTextReactionCount}"});
	Core.register('contactListController',contactListController, {elemHandle: "#searchArea", suggestHandle: "#suggestcontactlist", relPath: "${relPath}", searchResultsHandle: "#contactList", contactSearchHeight: 100, username: "${userAccount.userName}", contactListTemplate: "tmpl-userSuggestlist", suggestListTemplate: "tmpl-newContactSuggestlist", loadListFlag: true, suggestContactsFlag: "true"});
	Core.register('storyItemController',storyItemController, {relPath: "${relPath}", storyPage: false, authenticatedUser: "${authenticatedUser}", username: "${userAccount.userName}", lastUpdatedStreamDate: "${lastUpdatedStreamDate}", getMoreStories: true, numberOfStoriesToGet: "10", storiesDivId: "#storiesDiv", storyJSTemplateName: "template-storyTemplate", overRideHomeUrl: true, newestUpdatedStreamDate: "${mostRecentStoryDate}"});
	Core.register('headerController',headerController, {elemHandle: "#hdrrp", relPath: "${relPath}"});
	Core.register('DocumentController',DocumentController, {elemHandle: "#EditDocument", relPath: "${relPath}", panelContainer: "#editDocumentPanelContainer", documentItemHeaderMinHeight: "${documentItemPictureHeight}"});
	Core.register('DocumentRoleController',DocumentRoleController, {relPath: "${relPath}", parentDivId: "#main"});
	Core.register('invitationsController', invitationsController, {relPath: "${relPath}", scopes: "https://www.googleapis.com/auth/contacts.readonly", contactApiUrl: "https://www.google.com/m8/feeds/contacts/default/full?alt=json"});
	Core.register('pageViewController', pageViewController, {relPath: "http://www.palpostr.com/", loadingText: "Welcome, ${userAccount.userFullName}. <br> We are downloading your stream."});
	Core.register('contactAddController',contactAddController, {relPath: "${relPath}", username: "${userAccount.userName}"});
	Core.register('pulseController',pulseController, {relPath: "${relPath}", notificationPageId: "${notificationPageId}", authenticatedUser: "${authenticatedUser}", username: "${userAccount.userName}", numberOfStoriesToGet: "${storiesPageSize}", storiesDivId: "#notificationList", storyJSTemplateName: "template-pulseTemplate", inputUserName: "${userAccount.userName}"});
	Core.register('sseController',sseController, {relPath: "${relPath}", username: "${userAccount.userName}"});
	
	Core.start('siteLogo');
	Core.start('userLogo');
	Core.start('photoUploadController');
	Core.start('storyEditController');
	Core.start('storyItemController');	
	Core.start('albumsController');
	Core.start('messageDisplayController');
	Core.start('contactListController');
	Core.start('clickReactionsController');
	Core.start('textReactionsController');
	Core.start('headerController');
	Core.start('DocumentController');
	Core.start('DocumentRoleController');
	Core.start('invitationsController');
	Core.start('pageViewController');
	Core.start('contactAddController');
	Core.start('pulseController');
	Core.start('sseController');
	
	Core.publish('contactToolTipAdded', {divId: "#ShareRequestActionPanel"});
	Core.publish('contactToolTipAdded', {divId: "#storiesDiv"});	
	
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
		receivedElement.setAttribute('style', 'display: none;');
        console.log('Received Event: ' + id);
    }
};
