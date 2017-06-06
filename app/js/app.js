'use strict';

var DroneFlightPlannerApp = (function(map, dataSource, _) {

  var _$list = null;
  var _$createMenu = null;
  var _$listMenu = null;
  var _$createSubMenu = null;
  var _$listSubMenu = null;
  var _$newPlanNameInput = null;
  var _$newPlanError = null;

  /**
   * Cache the jQuery Object to avoid multiple queries
   */
  function _cacheElements() {
    _$list = $('#plans');
    _$createMenu = $('#create-menu');
    _$listMenu = $('#list-menu');
    _$createSubMenu = $('#create-sub-menu');
    _$listSubMenu = $('#list-sub-menu');
    _$newPlanNameInput = $('#new-plan-name');
    _$newPlanError = $('#new-plan-error');
  }

  /**
   * Enables the "Create" section of the application
   */
  function _switchToCreateMode() {
    _$createMenu.addClass('active');
    _$listMenu.removeClass('active');
    _$createSubMenu.removeClass('hidden');
    _$listSubMenu.addClass('hidden');
    _$newPlanNameInput.val('My New Plan');
    map.startPlan();
  }

  /**
   * Enables the "List" section of the application
   * @param  {String} [Optional] if a name is passed as parameter the plan with the corresponding name will be selected
   */
  function _switchToListMode(pName) {

    _$list.children().remove();
    _$createMenu.removeClass('active');
    _$listMenu.addClass('active');
    _$createSubMenu.addClass('hidden');
    _$listSubMenu.removeClass('hidden');
    _$list.children().removeClass('active');
    map.stopPlan();

    var $li = null;

    // we fetch the list of plans from the server
    dataSource.getPlans(function(plans) {
      _.each(plans, function(plan) {
        $li = _addNewPlanListElement(plan.name, plan.coordinates);
        if (plan.name === pName) {
          $li.trigger('click');
        }
      });
    });

  }

  /**
   * @param {String} The name of the plan
   * @param {Array} The coordinates of the plan
   * @returns {jQuery} The generated jQuery Object
   */
  function _addNewPlanListElement(pName, pCoordinates) {
    var $li = $('<li class="plan list-group-item"><span class="badge">' + pCoordinates.length + '</span>' + pName + '</li>');
    // we attach the data to the jQuery data map
    $li.data('coordinates', pCoordinates);
    $li.data('name', pName);
    _$list.append($li);
    return $li;
  }

  /**
   * Executed when the user click the save button in the "Create" section
   */
  function _saveAction() {
    var coordinates = map.getPlan();
    var name = _$newPlanNameInput.val();

    if (name.length > 0) {
      if (coordinates.length > 0) {

        dataSource.createPlan(name, coordinates, function(response) {
          // if the plan has been sucessfully created we got to the plans list
          if (response === true) {
            _$newPlanError.html('').hide();
            map.stopPlan();
            _switchToListMode(name);
          } else { // we display the error message (this is a very basic error handling)
            _$newPlanError.html(response).show();
          }
        });

      } else {
        _$newPlanError.html('A plan must contain at least one point').show();
      }
    } else {
      _$newPlanError.html('The name is required').show();
    }
  }

  /**
   * Executed when the user click on a plan name in the "List" section
   * @param   {Object} the event that is triggered
   */
  function _planClickAction(pEvent) {
    var $li = $(pEvent.currentTarget);
    var coordinates = $li.data('coordinates');
    map.showPlan(coordinates);
    $li.addClass('active');
    $li.siblings().removeClass('active');
  }

  /**
   * Set up the events on the elements
   */
  function _setupEvents() {
    _$list.on('click', '.plan', _planClickAction);
    _$listMenu.on('click', _switchToListMode);
    _$createMenu.on('click', _switchToCreateMode);
    $('#save-button').on('click', _saveAction);
  }

  /**
   * Called as a callback when the google map api is loaded 
   */
  function _init() {
    map.init('map', function() {
      _cacheElements();
      _setupEvents();
      _switchToListMode();
    });
  }

  /**
   * Methods that are visible to the outside
   */
  return {
    init: _init
  };

})(DroneFlightPlannerMap, DroneFlightPlannerDataSource, _);
