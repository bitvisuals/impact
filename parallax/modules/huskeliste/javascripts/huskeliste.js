// This file imports the listItem class
// @codekit-prepend "listItem.js"

(function () {
	"use strict";
	var $, $M, Huskeliste, ListItem, transEndEventNames, transEndEventName;

	ListItem = window.ListItem;
	$ = window.jQuery;
	$M = window.Modernizr;
	
	transEndEventNames = {
        'WebkitTransition'  : 'webkitTransitionEnd',
        'MozTransition'     : 'transitionend',
        'OTransition'       : 'oTransitionEnd',
        'msTransition'      : 'msTransitionEnd',
        'transition'        : 'transitionEnd'
    }, transEndEventName = transEndEventNames[ $M.prefixed('transition') ];

	Huskeliste = {

		// Config
		id : "huskeliste", // Same as in the stylesheet file
		applicationController : window.Application, // Shortcut to owner
		acceptsDatatype : "com.ng.product", // Set the filetype if any (null is valid)
		usesServices: ['liveSearch','synonyms'], // List of services used by this module (can be empty)
		isStartupModule : true, // Is this the module which should autoload at startup?
		
		// Do not set these manually
		isActive: false, // Is the module in the DOM and visible
		data: null, // Any data this module wants to store

		// Temp storage for localStorage data
		JSONArray : [],

		// Variables for swipe actions
		sidebarAdded : null, // Object
		targetPoint : null, // Point Object
		isSwipeing : false, // Bool
		startPosition : 0, // start pos of the animating panel
		startPoint : 0, // Initial point of finger
		didAnimateToShowModule : false, // Did an animate to open a module action occur

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
					this.JSONArray = JSON.parse(window.localStorage[this.id]);
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
			if(nativeEvent && nativeEvent === 'dataEvent') {
				this.addItem({itemTitle:data.title}, true);
			}
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

			this.isActive = true;

			// Setup the header bar
			$('#headerBar').html('<button class="pane-button left"></button><span class="header-title">Handleliste</span><button class="pane-button right"></button>');

			HTMLOutput = '<section id=' + this.id + '>';
			HTMLOutput += '<div id="action-bar"><span class="action-button add-item-button">Legg til</span>';
			HTMLOutput += '<span class="action-button edit-list-button">Rediger</span>';
			HTMLOutput += '<span class="action-button clear-list-button">Tøm</span>';
			HTMLOutput += '<span class="action-button done-editing-button">Ferdig</span></div>';
			HTMLOutput += '<ul></ul></section>';

			// Return any HTML that will be rendered
			return HTMLOutput;
		},

		// Gets called when the inital HTML has been added after
		// the "moduleWillShow" method
		moduleWasAdded : function() {
			var i,len;
			this.addEventListeners();

			// Initialize the items
			if(this.JSONArray) {
				len = this.JSONArray.length;
				for(i=0;i<len;i++) {
					this.addItem(this.JSONArray[i],false);
				}
			}
		},

		// Call this for every update to the data property to store the data
		// gets called automatically when moduleWillHide is called
		cacheData : function() {
			var JSONArray, i, len;

			// Sort the list
			//this.sortList();

			if(window.localStorage && this.data !== null) {
				JSONArray = [];
				len = this.data.length;
				for(i=0;i<len;i++) {
					JSONArray.push(this.data[i].getJSON());
				}
                window.localStorage[this.id] = JSON.stringify(JSONArray);
            }
		},

		// Sorts the items in the list
		sortList : function() {
			this.data.sort(function(a,b) {
				if(a.itemIsChecked && !b.itemIsChecked) {
					return -1;
				}
				if(!a.itemIsChecked && b.itemIsChecked) {
					return 1;
				}
				return 0;
			});


		},

		// Adds and removes any event listeners
		// used by this modules
		addEventListeners : function() {
			$('#'+this.id+' .add-item-button').tap(this.addItemHandler.bind(this));
			$('#'+this.id+' .clear-list-button').tap(this.clearListHandler.bind(this));

			$('.pane-button.left').tap(this.leftPaneButtonHandler.bind(this));
			$('.pane-button.right').tap(this.rightPaneButtonHandler.bind(this));

			$('#'+this.id+' .action-button').on('touchstart', this.touchDownHandler);
			$('#'+this.id+' .action-button').on('touchend', this.touchUpHandler);
			$('#'+this.id+' .action-button').on('touchcancel', this.touchUpHandler);

			$("#appViewport").swipe({
				swipeStatus:function(event, phase, direction, distance, duration, fingerCount) {
				//Here we can check the:
				//phase : 'start', 'move', 'end', 'cancel'
				//direction : 'left', 'right', 'up', 'down'
				//distance : Distance finger is from initial touch point in px
				//duration : Length of swipe in MS
				//fingerCount : the number of fingers used
				var target, animTime, targetPointX, distanceFromStartTouch;

				// Cancel if vertical movement
				if(direction === 'up' || direction === 'down') {
					return "noswipe";
				}

				target = $('#appViewport');
				
				if(phase === 'start') {
					this.startPoint = event.touches[0].pageX;
					this.startPosition = target.position().left;
				}
				
				if(phase === 'move' && (direction === 'left' || direction === 'right')) {
					if((this.startPoint > 50) && (this.startPoint < (target.width() - 50))) {
						return false;
					}
					this.isSwipeing = true;
					
					if(direction === 'right') {
						distanceFromStartTouch = this.startPosition + distance;
						if(this.sidebarAdded === null) {
							this.targetPoint = this.applicationController.pushNewModule("panel-left", this.applicationController.kModulePresentationType.animatedFromLeft, true);
							this.sidebarAdded = "panel-left";
						}
						target.css($M.cssprefixed('transform'),'translate3d('+distanceFromStartTouch+'px,0,0)');
					} else if(direction === 'left') {
						distanceFromStartTouch = this.startPosition - distance;
						if(this.sidebarAdded === null) {
							this.targetPoint = this.applicationController.pushNewModule("panel-right", this.applicationController.kModulePresentationType.animatedFromRight, true);
							this.sidebarAdded = "panel-right";
						}
						target.css($M.cssprefixed('transform'),'translate3d('+distanceFromStartTouch+'px,0,0)');
					}

				}
				// When the user lifts the finger and has swiped
				if((phase === 'cancel' || phase === 'end') && this.isSwipeing) {
					this.isSwipeing = false;
					if((distance * 100 / target.width()) >= 30 && !this.didAnimateToShowModule) {
						// Open the panel the rest of the way
						animTime = 300 * (100 - (distance * 100 / Math.abs(this.targetPoint.x))) / 100 / 1000;
						targetPointX = this.targetPoint.x;
						this.didAnimateToShowModule = true;
					} else {
						// Reclose the panel as the user did not drag it far enough
						animTime = 0.2;
						targetPointX = 0;
						this.applicationController.dismissPushedModule(this.sidebarAdded,0, true);
						this.sidebarAdded = null;
						this.didAnimateToShowModule = false;
					}
					
					target.css($M.prefixed('transition'),$M.cssprefixed('transform') + ' ' + animTime + 's ease-out');

					target.on(transEndEventName, function(e) {
						target.off(transEndEventName);
						target.css($M.prefixed('transition'),'none');
					}.bind(this));

					window.setTimeout(function() {
						target.css($M.cssprefixed('transform'),'translate3d('+targetPointX+'px,0,0)');
					}.bind(this),0);
				}
				
				}.bind(this),

				threshold:400,
				maxTimeThreshold:5000,
				fingers:'all',
				allowPageScroll:'vertical'
			});
		},
		removeEventListeners : function() {
			$('#'+this.id).off();
			$('#'+this.id+' .add-item-button').off();
			$('#'+this.id+' .clear-list-button').off();
			$('#'+this.id+' .action-button').off();
			$('.pane-button.left').off();
			$('.pane-button.right').off();
		},

		// Initates the native search
		addItemHandler : function(e) {
			this.applicationController.requestDataFromService(this.id,"liveSearch","");
		},

		// Pressed the clear list button
		clearListHandler : function(e) {
			var shouldEmpty;
			window.setTimeout(function() {
				shouldEmpty = window.confirm('Dette vil slette alle varer i handlelisten din!');
				if(shouldEmpty) {
					this.removeItem(null, true);
				}
			}.bind(this),0);
		},

		// Left pane (heart) button click handler
		leftPaneButtonHandler : function(e) {
			this.targetPoint = this.applicationController.pushNewModule("panel-left", this.applicationController.kModulePresentationType.animatedFromLeft);
			if(!this.targetPoint) {
				this.targetPoint = null;
				this.sidebarAdded = null;
				this.didAnimateToShowModule = false;
			} else {
				this.didAnimateToShowModule = true;
				this.sidebarAdded = "panel-left";
			}
		},

		// Right pane (lightbulb) button click handler
		rightPaneButtonHandler : function(e) {
			this.targetPoint = this.applicationController.pushNewModule("panel-right", this.applicationController.kModulePresentationType.animatedFromRight);
			if(!this.targetPoint) {
				this.targetPoint = null;
				this.sidebarAdded = null;
				this.didAnimateToShowModule = false;
			} else {
				this.didAnimateToShowModule = true;
				this.sidebarAdded = "panel-right";
			}
		},

		// Adds an item in the correct manner
		addItem : function(data, isNewItem) {
			var i, len, item, currentItem;
			
			// If this was an abort button event
			// don't add anything
			if(!data.itemTitle) {
				return false;
			}

			item = new ListItem(data, this);
			
			if(!this.data || this.data === null) {
				this.data = [];
			}

			// Check if this item already exists
			currentItem = this.findListItem(item);

			if(currentItem) {
				// The item exists, add one to the count
				currentItem.addOne();
			} else {
				$("#" + this.id).find('ul').append(item.getElement());
				this.data.push(item);
			}
		},

		// Checks whether an item alredy has been added
		// If the item exists it is returned
		findListItem : function(listItem) {
			var i, len, item;
			len = this.data.length;
			for(i=0;i<len;i++) {
				item = this.data[i];
				if(item.itemTitle === listItem.itemTitle) {
					return item;
				}
			}
			return false;
		},

		// Removes an item from the list
		removeItem : function(itemID, clearAll) {
			if(clearAll) {
				if(window.localStorage && window.localStorage[this.id]) {
					window.localStorage.removeItem(this.id);
				}
				this.JSONArray = [];
				this.data = null;
				$("#" + this.id).find('ul li').each(function(index, element) {
					if(index > 0) {
						$(element).remove();
					}
				});
			} else {
				// Remove one item
			}
		},

		//
		checkForSynonym : function(synonym, callback) {
			this.applicationController.requestDataFromService(this.id,'synonyms','?searchExpression=' + synonym, callback);
		},

		// Event handlers
		touchDownHandler : function(e) {
			$(e.currentTarget).addClass('touchDown');
		},
		touchUpHandler : function(e) {
			$(e.currentTarget).removeClass('touchDown');
		}
	}; // End Huskeliste

	Huskeliste.init();
}());