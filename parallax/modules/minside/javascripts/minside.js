// This is an example JavaScript for this module.
// All JS will need to be concatinated into the "modules.js" file
// in the "javascript" folder at the root level of this application
// This file should never be refered to directly in any html file

(function () {
	"use strict";
	var Minside, $, _, $M;

	// Initiate any Application scope vars
    $ = window.jQuery;
    _ = window._;
    $M = window.Modernizr;

	Minside = {
		// Holder for empty template
		template : null,
		// Holder for a card item template
		cardTemplate : null,
		// When was the profile last updated
		profileTimestamp : 0,

		// Current page index
		currentPaneIndex : 0,
		// Current selected member
		currentMember: null,
		// The width of the viewport
		viewPortWidth : 0,
		// Pane holder (this one animates)
		panesHolder : null,

		// Panes
		panes : {
			0 : "minside-first",
			1 : "minside-second",
			2 : "minside-third"
		},

		// Event triggers
		backButton : null,
		headerTitle: null,

		// ## Everything below this line is required unless otherwise specified ##

		// Config
		id : "minside", // Same as in the stylesheet file
		applicationController : window.Application, // Shortcut to owner
		acceptsDatatype : "com.ng.product", // Set the filetype if any (null is valid)
		usesServices: ['minSide'], // List of services used by this module (can be empty)
		isStartupModule : false, // Is this the module which should autoload at startup?
		
		// Do not set these manually
		isActive: false, // Is the module in the DOM and visible
		data: null, // Any data this module wants to store

		// Init
		// Registers this module as a part of this application
		init : function () {
			this.applicationController.registerModule(this);
		},

		// Delegate - Called when the module has been registered
		moduleRegistered : function () {
			// The module was registred
		},

		// Initiates/resets all variables
		resetVars : function() {
			this.currentPaneIndex = 0;
			this.currentMember = null;
			this.data = null;
            this.template = null;
            this.isActive = false;
		},

		// Delegate - Called when another module shares
		// data that this module understands
		// This is required if this module defines a datatype
		// other than null
		addDataOfType : function (data, datatype) {
			// Grab any existing data before
			// appending the new data
			if(this.data === null) {
				this.initiateBeforeDisplay();
			}
			
			// ::TODO
			// Append the new data to the existing data
			// property

			// If this module is not active
			// dealloc it's data from memory
			if(!this.isActive) {
				this.moduleWillHide();
			}
		},

		// Delegate - Initiate the module
		// This will initiate the module
		// Gets called before moduleWillShow is called
		initiateBeforeDisplay : function () {
			if(window.localStorage && this.data === null) {
				if(window.localStorage[this.id]) {
					this.data = JSON.parse(window.localStorage[this.id]);
					window.localStorage.removeItem(this.id);
				}
				if(window.localStorage[this.id+"_template"]) {
					this.template = JSON.parse(window.localStorage[this.id+"_template"]);
					window.localStorage.removeItem(this.id+"_template");
				}
				if(window.localStorage[this.id+"_timestamp"]) {
					this.profileTimestamp = parseInt(window.localStorage[this.id+"_timestamp"], 10);
					window.localStorage.removeItem(this.id+"_timestamp");
				}
			}
			return this;
		},

		// Delegate - Gets called when a service returns data
		// "service" is the name of the service passed
		// "data" is the data returned
		// "nativeEvent" is the name of the native method if this
		// was a native service, else this will be null
		serviceResponseHandler : function(service, data, nativeEvent) {
			if(service === "minSide") {
				this.data = data;
			}

			this.cacheData();
			this.renderTemplate();
		},

		// Delegate - Gets called before this module is
		// removed from the DOM
		moduleWillHide : function () {
			this.removeEventListeners();
            this.cacheData();
            this.resetVars();
			return this;
		},

		// Delegate - Gets called before this module is
		// shown and / or added to the DOM
		// Return - HTML to display
		moduleWillShow : function (data) {
			var HTMLOutput;

			// Initialize the module
			if(this.data) {
				// Do something with the data
			}
			this.isActive = true;

			// Setup the header bar
			$('#headerBar').html('<button class="back-button">Tilbake</button><span class="header-title">Test</span>');

			// Load the template if empty
			if(this.template || this.template === "" || this.template === null) {
				this.applicationController.loadTemplate('minside_main.html', function(data) {
					this.template = data;
					this.cacheData();
					// Load the data
					this.getData();
				}.bind(this));
			} else {
				this.getData();
			}

			// Return the framework holder
			HTMLOutput = '<section id="'+this.id+'""><div class="loading"></div></section>';

			// Return any HTML that will be rendered
			return HTMLOutput;
		},

		//
		getData : function() {
			if(this.data && this.isDataValid()) {
				this.renderTemplate();
			} else if(window.navigator.onLine && this.applicationController.userToken !== null) {
				this.applicationController.requestDataFromService(this.id,"minSide","");
				this.profileTimestamp = parseInt(new Date().getTime(), 10) + (60*60*24*1000);
			} else {
				$('#'+this.id).html('<p class="offline">Denne funksjonen krever at du er logget inn og er koblet til internett</p>');
			}
		},

		//
		renderTemplate : function(returnData) {
			var tmp = _.template(this.template);
			$('#'+this.id).html(tmp(this.data));

			// Add event listeners
			window.setTimeout(function(){
				// Setup the rest of the elements
				this.setupElements();
			}.bind(this),0);
		},

		// Call this for every update to the data property to store the data
		// gets called automatically when moduleWillHide is called
		cacheData : function() {
			if(window.localStorage) {
				if(this.data !== null) {
					window.localStorage[this.id] = JSON.stringify(this.data);
				}
				
				window.localStorage[this.id+"_timestamp"] = this.profileTimestamp.toString();

				if(this.template && this.template !== null && this.template !== "") {
					window.localStorage[this.id+"_template"] = JSON.stringify(this.template);
                }
            }
		},

		//
		isDataValid : function() {
			var now = parseInt(new Date().getTime(), 10);
			if(this.profileTimestamp <= now) {
				// Data has expired
				return false;
			}
			return true;
		},

		// Gets called when the inital HTML has been added after
		// the "moduleWillShow" method
		moduleWasAdded : function() {
			//
		},

		setupElements : function() {

			this.viewPortWidth = $('#'+this.id).width();
			this.panesHolder = $('#'+this.id+' .panes-holder');
			this.backButton = $('#headerBar .back-button');
			this.headerTitle = $('#headerBar .header-title');

			// Add the transition to the panes holder
			this.panesHolder.css($M.prefixed('transition'),$M.cssprefixed('transform') + ' 0.3s ease-in-out');

			// Set the initial header title
			this.paneTransitionStart();

			this.addEventListeners();
		},

		// Adds and removes any event listeners
		// used by this modules
		addEventListeners : function() {
			this.backButton.tap(this.backButtonTapHandler.bind(this));
			$('#'+this.id+' ul.members li').tap(this.showDetailsPageHandler.bind(this));
			$('#'+this.id+' .Media').tap(this.showCardsPageHandler.bind(this));

			$('#'+this.id+' ul > li.nav').on('touchstart', this.touchElementDownHandler);
			$('#'+this.id+' ul > li.nav').on('touchend', this.touchElementUpHandler);
		},
		removeEventListeners : function() {
			if(this.backButton) {
				this.backButton.off();
			}
			$('#'+this.id+' ul.members li').off();
			$('#'+this.id+' .Media').off();
			$('#'+this.id+' ul > li.nav').off();
		},

		touchElementDownHandler : function(e) {
			$(e.currentTarget).addClass('touchDown');
		},
		touchElementUpHandler : function(e) {
			$(e.currentTarget).removeClass('touchDown');
		},

		// Event handlers
		backButtonTapHandler : function(e) {
			if(this.currentPaneIndex > 0) {
				this.currentPaneIndex -= 1;
			}
			this.moveToPaneAnimated();
		},

		// Go to details page handler
		showDetailsPageHandler : function(e) {
			var item;
			if(this.currentPaneIndex > 0) {
				return false;
			}

			this.currentMember = this.data.Medlemmer[parseInt($(e.currentTarget).attr('id'), 10)];
			
			for(item in this.currentMember) {
				switch(item) {
					case 'SamtykkeSMS' :
						if(this.currentMember[item] === 'J') {
							$('#'+this.id+' .'+item).attr('checked', true);
						} else {
							$('#'+this.id+' .'+item).attr('checked', false);
						}
					break;
					case 'SamtykkeNyhetsbrev' :
						if(this.currentMember[item] === 'J') {
							$('#'+this.id+' .'+item).attr('checked', true);
						} else {
							$('#'+this.id+' .'+item).attr('checked', false);
						}
					break;
					case 'Kjonn' :
						$('#'+this.id+' .'+this.currentMember[item]).attr('checked', true);
					break;
					case 'Media' :
						//
					break;
					default :
						$('#'+this.id+' .'+item).html(this.currentMember[item]);
					break;
				}
			}
			
			// Remove "cards" if no cards present
			if(!this.currentMember.hasOwnProperty('Media') || this.currentMember.Media.length < 1) {
				$('#'+this.id+' .Media').css('display','none');
				$('#'+this.id+' .Media').prev().addClass('no-border');
			} else {
				$('#'+this.id+' .Media').css('display','block');
				$('#'+this.id+' .Media').prev().removeClass('no-border');
			}

			this.currentPaneIndex += 1;
			this.moveToPaneAnimated();
		},

		//
		showCardsPageHandler : function(e) {
			var cardItem,i, len, item;
			if(this.currentPaneIndex > 1) {
				return false;
			}

			if(this.cardTemplate === null) {
				this.cardTemplate = $('#'+this.id+' .card-template');
			}
			$('#'+this.id+' #minside-third > ul').empty();

			len = this.currentMember.Media.length;
			for(i=0;i<len;i++) {
				cardItem = this.cardTemplate.clone();
				for(item in this.currentMember.Media[i]) {
					cardItem.find('.'+item).html(this.currentMember.Media[i][item]);
				}
				$('#'+this.id+' #minside-third > ul').append(cardItem);
			}

			this.currentPaneIndex += 1;
			this.moveToPaneAnimated();
		},

		// Pane transitions
		moveToPaneAnimated : function() {
			var dest = this.currentPaneIndex * this.viewPortWidth * -1;
			if(this.currentPaneIndex > 0) {
				this.backButton.css('display','block');
			} else {
				this.backButton.css('display','none');
			}
			this.panesHolder.css($M.prefixed('transform'),'translate3d('+dest+'px,0px,0px)');
			this.paneTransitionStart();
		},

		// Update after transition
		paneTransitionStart : function(e) {
			if(this.currentPaneIndex === 0) {
				this.headerTitle.text('Trumf');
				this.backButton.text("-");
			} else if(this.currentPaneIndex === 1) {
				this.headerTitle.text(this.currentMember.Fornavn + " " + this.currentMember.Etternavn);
				this.backButton.text('Trumf');
			} else {
				this.headerTitle.text('Mine kort');
				this.backButton.text(this.currentMember.Fornavn + " " + this.currentMember.Etternavn);
			}
		},

		// Helper functions
		// Outputs a jQuery element's HTML code
		getHTMLFromJQElement : function(jqElem) {
			var out = jqElem[0].outerHTML.replace(new RegExp("&lt;", 'g'),"<");
			out = out.replace(new RegExp("&gt;", 'g'),">");
			return out;
		}
	}; // End Testmodule

	Minside.init();
}());