// This is an example JavaScript for this module.
// All JS will need to be concatinated into the "modules.js" file
// in the "javascript" folder at the root level of this application
// This file should never be refered to directly in any html file

(function () {
	"use strict";
	var Testmodule;

	Testmodule = {
		// Your code
		// ...

		// ## Everything below this line is required unless otherwise specified ##

		// Config
		id : "panel-left", // Same as in the stylesheet file
		applicationController : window.Application, // Shortcut to owner
		acceptsDatatype : "com.ng.product", // Set the filetype if any (null is valid)
		usesServices: ['minSide', 'liveSearch'], // List of services used by this module (can be empty)
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
			}
			return this;
		},

		// Delegate - Gets called when a service returns data
		// "service" is the name of the service passed
		// "data" is the data returned
		// "nativeEvent" is the name of the native method if this
		// was a native service, else this will be null
		serviceResponseHandler : function(service, data, nativeEvent) {
			// ::TODO
			// 1. Check if this is a native service (nativeEvent)
			// 2. Check which service this is if not a native service
			
			// E.G: Update any DOM nodes if it's a GET service
			// $("#" + this.id).find('p').html(data.something);
		},

		// Delegate - Gets called before this module is
		// removed from the DOM
		moduleWillHide : function () {
			// ::TODO
			// 1. Append any data to be stored to the data property
			this.removeEventListeners();

            this.cacheData();
            this.data = null;
            
            this.isActive = false;
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

			// Request any data from a service (e.g)
			// When the service replies, serviceResponseHandler gets called
			//this.applicationController.requestDataFromService(this.id,"liveSearch");

			HTMLOutput = '<section id=' + this.id + '><p>Venstre panel</p></section>';

			// Return any HTML that will be rendered
			return HTMLOutput;
		},

		// Call this for every update to the data property to store the data
		// gets called automatically when moduleWillHide is called
		cacheData : function() {
			if(window.localStorage && this.data !== null) {
                window.localStorage[this.id] = JSON.stringify(this.data);
            }
		},

		// Gets called when the inital HTML has been added after
		// the "moduleWillShow" method
		moduleWasAdded : function() {
			this.addEventListeners();
		},

		// Adds and removes any event listeners
		// used by this modules
		addEventListeners : function() {
			$('#'+this.id+' p').tap(function(e) {
				this.applicationController.pushNewModule("loginmodule", this.applicationController.kModulePresentationType.animatedFromBottom);
			}.bind(this));
		},
		removeEventListeners : function() {

		}
	}; // End Testmodule

	Testmodule.init();
}());