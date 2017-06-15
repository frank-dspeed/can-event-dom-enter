'use strict';

var domData = require('can-util/dom/data/data');
var getCid = require("can-util/js/cid/get-cid");

var baseEventType = 'keyup';

function isEnterEvent (event) {
	var hasEnterKey = event.key === 'Enter';
	var hasEnterCode = event.keyCode === 13;
	return hasEnterKey || hasEnterCode;
}

function getHandlerKey (eventType, handler) {
	return eventType + ':' + getCid(handler);
}

function associateHandler (target, eventType, handler, otherHandler) {
	var key = getHandlerKey(eventType, handler);
	domData.set.call(target, key, otherHandler);
}

function disassociateHandler (target, eventType, handler) {
	var key = getHandlerKey(eventType, handler);
	var otherHandler = domData.get.call(target, key);
	if (otherHandler) {
		domData.clean.call(target, key);
	}
	return otherHandler;
}

/**
 * @module {events} can-event-dom-enter
 * @parent can-infrastructure
 *
 * Watch for when enter keys are pressed on a DomEventTarget.
 *
 * ```js
 * var events = require("can-util/dom/events/events");
 * var input = document.createElement("input");
 *
 * function enterEventHandler() {
 * 	console.log("enter key pressed");
 * }
 *
 * events.addEventHandler.call(input, "enter", enterEventHandler);
 * events.dispatch.call(input, {
 *   type: 'keyup',
 *   keyCode: keyCode
 * });
 */
module.exports = {
	defaultEventType: 'enter',

	addEventListener: function (target, eventType, handler) {
		var keyHandler = function (event) {
			if (isEnterEvent(event)) {
				return handler.apply(this, arguments);
			}
		};

		associateHandler(target, eventType, handler, keyHandler);
		target.addEventListener(baseEventType, keyHandler);
	},

	removeEventListener: function (target, eventType, handler) {
		var keyHandler = disassociateHandler(target, eventType, handler);
		if (keyHandler) {
			target.removeEventListener(baseEventType, keyHandler);
		}
	}
};