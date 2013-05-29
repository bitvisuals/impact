(function(){
	"use strict";

	var ListItem, $, $M;

	$ = window.jQuery;
	$M = window.Modernizr;

	ListItem = (function() {
		var ownerModule, itemTitle, itemCount, itemID, itemSynonyms, itemSynonymStatus, itemSynonymTimeout, itemIsChecked;

		// Constructor
		function ListItem(item, moduleRef) {
			this.itemTitle   = item.itemTitle;
			this.ownerModule = moduleRef;
			
			if(item) {
				if(item.hasOwnProperty('itemCount')) {
					this.itemCount = item.itemCount;
				} else {
					this.itemCount = 1;
				}

				if(item.hasOwnProperty('itemID')) {
					this.itemID = item.itemID;
				} else {
					this.itemID = "item_" + (new Date().getTime()).toString();
				}

				if(item.hasOwnProperty('itemSynonymTimeout')) {
					this.itemSynonymTimeout = item.itemSynonymTimeout;
				} else {
					this.itemSynonymTimeout = 0;
				}

				if(item.hasOwnProperty('itemSynonymStatus')) {
					this.itemSynonymStatus = item.itemSynonymStatus;
				} else {
					this.itemSynonymStatus = "unknown";
				}

				if(item.hasOwnProperty('itemSynonyms')) {
					this.itemSynonyms = item.itemSynonyms;
				} else {
					this.itemSynonyms = [];
				}

				if(item.hasOwnProperty('itemIsChecked')) {
					this.itemIsChecked = item.itemIsChecked;
				} else {
					this.itemIsChecked = false;
				}
			}
		}

		// Render and return the html for this item
		ListItem.prototype.getElement = function() {
			var out;
			
			if(this.itemIsChecked) {
				out = '<li id="' + this.itemID + '" class="list-item checked">';
			} else {
				out = '<li id="' + this.itemID + '" class="list-item">';
			}
			
			out += '<span class="item-title">' + this.itemTitle + '</span>';
			out += '<span class="item-count">' + this.itemCount + '</span>';
			
			if(this.itemSynonymStatus === "unknown") {
				out += '<span class="item-synonym-indicator"></span>';
			} else if(this.itemSynonymStatus === "hasSynonyms") {
				out += '<span class="item-synonym-indicator synonyms"></span>';
			} else {
				out += '<span class="item-synonym-indicator no-synonyms"></span>';
			}

			out += '</li>';

			out = $(out);

			out.on('touchstart', this.touchStartHandler);
			out.on('touchend', this.touchEndHandler);
			out.on('touchmove', this.touchEndHandler);
			out.find('.item-title').tap(this.itemSelected.bind(this));
			out.find('.item-synonym-indicator').tap(this.actionSelected.bind(this));

			this.checkForSynonyms();

			return out;
		};

		// Return the JSON representation of this module
		ListItem.prototype.getJSON = function() {
			var out = {};
			out.itemID                = this.itemID;
			out.itemTitle             = this.itemTitle;
			out.itemCount             = this.itemCount;
			out.itemSynonyms          = this.itemSynonyms;
			out.itemIsChecked         = this.itemIsChecked;
			out.itemSynonymStatus     = this.itemSynonymStatus;
			out.itemSynonymTimeout = this.itemSynonymTimeout;
			return out;
		};

		// Increments the item count
		ListItem.prototype.addOne = function() {
			this.itemCount += 1;
			this.update();
		};

		// INTERNAL METHODS
		ListItem.prototype.checkForSynonyms = function() {
			var now, offset;
			// If in offline mode, don't check for synonyms
			if(!window.navigator.onLine) {
				this.update();
				return false;
			}
			
			// Only update synonyms every week
			now = parseInt(new Date().getTime(), 10);
			
			if(this.itemSynonymTimeout > 0 && this.itemSynonymTimeout > now) {
				this.update();
				return true;
			}

			// Check for synonyms
			this.ownerModule.checkForSynonym(this.itemTitle, function(service, response, nativeEvent) {
				// Set the synonyms
				this.itemSynonyms = response;
				// Add a timestamp (Update synonyms once every day)
				this.itemSynonymTimeout = parseInt(new Date().getTime(), 10) + (60*60*24*1000);
				// Update the UI and save data
				this.update();
			}.bind(this));
		};

		// Runs all update fuctions
		ListItem.prototype.update = function() {
			window.setTimeout(function() {
				this.render();
				this.ownerModule.cacheData();
			}.bind(this),0);
		};

		// Updates the visual part of this item
		ListItem.prototype.render = function() {
			// Update the title and item count
			$('#'+this.itemID).find('.item-title').text(this.itemTitle);
			$('#'+this.itemID).find('.item-count').text(this.itemCount.toString(10));

			// Set classes for checked or not
			if(this.itemIsChecked) {
				$('#'+this.itemID).addClass('checked');
			} else {
				$('#'+this.itemID).removeClass('checked');
			}

			// Set classes for synonyms
			if(this.itemSynonyms.length > 1) {
				$('#'+this.itemID).find('.item-synonym-indicator').addClass('synonyms');
			} else {
				$('#'+this.itemID).find('.item-synonym-indicator').addClass('no-synonyms');
			}
		};

		// Touch methods
		ListItem.prototype.itemSelected = function(e) {
			if(this.itemIsChecked) {
				this.itemIsChecked = false;
			} else {
				this.itemIsChecked = true;
			}
			this.update();
		};
		ListItem.prototype.actionSelected = function(e) {
			if(this.itemIsChecked) {
				this.log('Action delete');
			} else if(this.itemSynonyms.length > 1) {
				this.log('Action show synonyms');
			}
			
		};

		ListItem.prototype.touchStartHandler = function(e) {
			$(e.currentTarget).addClass('touchDown');
		};

		ListItem.prototype.touchEndHandler = function(e) {
			$(e.currentTarget).removeClass('touchDown');
		};

		ListItem.prototype.log = function(message) {
			if(window.console) {
				window.console.log(message);
			}
		};

		return ListItem;
	}());

	window.ListItem = ListItem;
	
}());