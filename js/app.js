'use strict';

var _$list = null;
var _$createMenu = null;
var _$listMenu = null;
var _$createSubMenu = null;
var _$listSubMenu = null;
var _$newPlanNameInput = null;
var _$newPlanError = null;

function _cacheElements() {
  _$list = $('#plans');
  _$createMenu = $('#create-menu');
  _$listMenu = $('#list-menu');
  _$createSubMenu = $('#create-sub-menu');
  _$listSubMenu = $('#list-sub-menu');
  _$newPlanNameInput = $('#new-plan-name');
  _$newPlanError = $('#new-plan-error');
}

function _switchToCreateMode() {
  _$createMenu.addClass('active');
  _$listMenu.removeClass('active');
  _$createSubMenu.removeClass('hidden');
  _$listSubMenu.addClass('hidden');
  _$newPlanNameInput.val('My New Plan');
  DroneFlightPlanner.startPlan();
}

function _switchToListMode() {
  _$createMenu.removeClass('active');
  _$listMenu.addClass('active');
  _$createSubMenu.addClass('hidden');
  _$listSubMenu.removeClass('hidden');
  _$list.children().removeClass('active');
  DroneFlightPlanner.stopPlan();
}

function _addNewPlanListElement(name, coordinates) {
  var $li = $('<li class="plan list-group-item">' + name + '</li>');
  $li.data('coordinates', coordinates);
  $li.data('name', name);
  _$list.append($li);
  return $li;
}

function _saveAction() {
  var coordinates = DroneFlightPlanner.getPlan();
  var name = _$newPlanNameInput.val();

  if (name.length > 0) {
    if (coordinates.length > 0) {
      coordinates = DroneFlightPlanner.stopPlan();
      var $li = _addNewPlanListElement(name, coordinates);
      _switchToListMode();
      $li.trigger('click');
      _$newPlanError.html('').hide();
    } else {
      _$newPlanError.html('A plan must contain at least one point').show();
    }
  } else {
    _$newPlanError.html('The name is required').show();
  }
}

function _planClickAction(event) {
  var $li = $(event.currentTarget);
  var coordinates = $li.data('coordinates');
  DroneFlightPlanner.showPlan(coordinates);
  $li.addClass('active');
  $li.siblings().removeClass('active');
}

function _setupEvents() {
  _$list.on('click', '.plan', _planClickAction);
  _$listMenu.on('click', _switchToListMode);
  _$createMenu.on('click', _switchToCreateMode);
  $('#save-button').on('click', _saveAction);
}

function _loadSamplePlans() {
  _addNewPlanListElement('Example 1', EXAMPLE1);
  _addNewPlanListElement('Example 2', EXAMPLE2);
  _addNewPlanListElement('Example 3', EXAMPLE3);
}

function init() {
  DroneFlightPlanner.init('map');
  _cacheElements();
  _setupEvents();
  _switchToListMode();
  _loadSamplePlans();
}
