/* 
* CORE-SANDBOX-MODULE Pattern implementation
* see readme.md for references.
*/

/*
* @description Sandbox object, the API of this object is available to modules.
*              see readme.md for reference.
*/
Sandbox = Class.extend({
	initialize: function(core) {
		this.publish = core.publish;
		this.subscribe = core.subscribe;
		this.dom = core.dom;
		this.utilities=core.utilities;
	}
});


/*
* @description Core object, the API of this object is available to sandboxes.
*              see readme.md for reference.
* @static
* @param {object} base: base library (jquery is used here).
*/
Core = function(_$) {
	var moduleData = {},
		cache = {}, 
		_dom = {
			find: function(selector) {
				return _$(selector);
			},
			wrap: function(element) {
				return _$(element);
			},
			disable: function(element){
				element.attr('disabled','disabled');
				element.removeClass('ab');
				element.addClass('ba');
			},
			enable: function(element){
				element.removeAttr('disabled');
				element.removeClass('ba');
				element.addClass('ab');
			},
			shake: function(){
				return _$.effect('shake');
			}
		},
		_utilities = {
			merge: _$.extend,
			map: _$.map,
			data: _$.data,
			grep: _$.grep,
			inArray: _$.inArray,
			each: _$.each,
			trigger: _$.trigger,
			post: _$.post,
			postJSON: function(url, data, successMethod){
				var token = $("meta[name='_csrf']").attr("content");
				var header = $("meta[name='_csrf_header']").attr("content");
				_$.ajax({
					url: url,
					type: 'POST',
					data: JSON.stringify(data),
					contentType: 'application/json',
					success: successMethod,
					dataType: 'json',
			        beforeSend: function(xhr) {
			            xhr.setRequestHeader(header, token);
			        }
				});				
			},
			isMobile: function(){
				if( /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()) ) {
					 return true;
				}else{
					return false;
				}
			},
			userAgent: function(){
				return navigator.userAgent; 
			},
			postV2: function(url, data, successMethod, errorMethod){
				var token = $("meta[name='_csrf']").attr("content");
				var header = $("meta[name='_csrf_header']").attr("content");
				_$.ajax({
					url: url,
					type: 'POST',
					data: data,
					contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
					success: successMethod,
					error: errorMethod,
					dataType: 'json',
					encoding: 'UTF-8',
			        beforeSend: function(xhr) {
			            xhr.setRequestHeader(header, token);
			        }
				});				
			},			
			ajax: _$.ajax,
			appGet: function(url, successMethod, failureMethod){
				_$.ajax({
					url: url,
					type: 'GET',
					success: successMethod,
					failure: failureMethod
				});				
			},
			put: function(url, data, successMethod){
				var token = $("meta[name='_csrf']").attr("content");
				var header = $("meta[name='_csrf_header']").attr("content");				
				_$.ajax({					
					url: url,
					type: 'PUT',
					data: JSON.stringify(data),
					contentType: 'application/json',
					success: successMethod,
			        beforeSend: function(xhr) {
			            xhr.setRequestHeader(header, token);
			        }
				});
			},
			get: _$.get,
			serverDelete: function(url, data, successMethod){
				var token = $("meta[name='_csrf']").attr("content");
				var header = $("meta[name='_csrf_header']").attr("content");
				_$.ajax({
					url: url,
					type: "DELETE",
					data: data,
					success: successMethod,
			        beforeSend: function(xhr) {
			            xhr.setRequestHeader(header, token);
			        }
				});
			},
			browser: _$.browser,
			setTimeout: setTimeout,
			clearTimeout: _$.clearTimeout,
			wysiwyg: function(selector){
				return _$(selector).wysiwyg();
			},
			log: function(msg){
				//_$.get('reportjsissue.'+message+'.pvt', function(){console.log('Issue reported to the service administrator.')});
				//_$.get('reportjsissue/'+msg,function(){console.trace('Issue reported to the service administrator.')});
				console.log(msg);
			},
			trace: function(message){
				console.trace(message);
			},
			pageReload: function(){
				location.reload();
			},
			htmlEncode: function(data){
				return Encoder.htmlEncode(data);
			},
			htmlDecode: function(data){
				return Encoder.htmlDecode(data);
			}
		},
		_json = {
			each: _$.each,
			parse: _$.parseJSON
		};

	return {
		dom: _dom,
		utilities: _utilities,
		myjson: _json,
		register: function(moduleId, creator, options) {
			moduleData[moduleId] = {
				creator: creator,
				instance: null,
				options: options || {}
			};
		},
		/**
		 * Starts a single module
		 * @param {string} moduleId The module identifier
		 */
		start: function(moduleId) {
			moduleData[moduleId].instance = new moduleData[moduleId].creator(new Sandbox(this), moduleData[moduleId].options);
			moduleData[moduleId].instance.init();
		},
		stop: function(moduleId) {
			var data = moduleData[moduleId];
			if (data.instance) {
				data.instance.destroy();
				data.instance = null;
			}
		},
		startAll: function() {
			for (var moduleId in moduleData) {
				if (moduleData.hasOwnProperty(moduleId)) {
					this.start(moduleId);
				}
			}
		},
		stopAll: function() {
			for (var moduleId in moduleData) {
				if (moduleData.hasOwnProperty(moduleId)) {
					this.stop(moduleId);
				}
			}
		},
		publish: function(message, args) {
			try {
					var i;
					for (i = 0; i < cache[message].length; i++) {
						if (typeof args === "undefined") { args = []; }
						if (!(args instanceof Array)) {
							args = [args];
						}
						cache[message][i].apply(this, args);
					};
			} catch (err) {
				console.log(err);
			}
		},
		subscribe: function(message, callback) {
			if (!cache[message]) {
				cache[message] = [];
			}
			cache[message].push(callback);
			return [message, callback];
		},
		unsubscribe: function(handle) {
			var t = handle[0];
			base.each(cache[t], function(idx) {
				if (this == handle[1]) {
					cache[t].splice(idx, 1);
				}
			});
		}
	};
} (jQuery);