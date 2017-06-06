'use strict';

var _$list = null;
var _$createMenu = null;
var _$listMenu = null;
var _$createSubMenu = null;
var _$listSubMenu = null;
var _$newPlanNameInput = null;

function _cacheElements() {
  _$list = $('#plans');
  _$createMenu = $('#create-menu');
  _$listMenu = $('#list-menu');
  _$createSubMenu = $('#create-sub-menu');
  _$listSubMenu = $('#list-sub-menu');
  _$newPlanNameInput = $('#new-plan-name');
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
  DroneFlightPlanner.stopPlan();
}

function _setupEvents() {

  _$list.on('click', '.plan', function() {
    var $li = $(this);
    var plan = $li.data('plan');
    DroneFlightPlanner.showPlan(plan);
    $li.addClass('active');
    $li.siblings().removeClass('active');
  });

  _$listMenu.on('click',_switchToListMode);
  _$createMenu.on('click', _switchToCreateMode);

  $('#save-button').on('click', function() {
    var plan = DroneFlightPlanner.stopPlan();
    var name = _$newPlanNameInput.val();

    var $li = $('<li class="plan list-group-item">' + name + '</li>');
    $li.data('plan', plan);
    $li.data('name', name);
    _$list.append($li);
    _switchToListMode();
    $li.trigger('click');
  });

}


function init() {
  DroneFlightPlanner.init('map');
  _cacheElements();
  _setupEvents();
  _switchToCreateMode();
}
