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
    _$newPlanNameInput.val('');
    _$newPlanError.html('').hide();
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
    dataSource.getPlans().then(function(plans) {
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
    var $li = $('<li class="plan list-group-item"><span class="delete glyphicon glyphicon-trash"></span><span class="update glyphicon glyphicon-floppy-disk"></span><span class="badge">' + pCoordinates.length + '</span><span>' + pName + '</span></li>');
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

        dataSource.createPlan(name, coordinates).then(function() {
          _$newPlanError.html('').hide();
          map.stopPlan();
          _switchToListMode(name);
        }, function(error) {
          _$newPlanError.html(error).show();
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
    $li.siblings().removeClass('edited');
  }

  /**
   * Executed when the user click on the delete icon of the selected Plan
   * @param  {Object} the event that is triggered
   */
  function _deletePlanAction(pEvent) {
    var $li = $(pEvent.currentTarget).parent();
    var name = $li.data('name');
    dataSource.deletePlan(name).then(_switchToListMode);
  }

  /**
   * Executed when the user click on the save icon of the selected Plan
   * @param  {Object} the event that is triggered
   */
  function _updatePlanAction(pEvent) {
    var $li = $(pEvent.currentTarget).parent();
    var name = $li.data('name');
    var coordinates = map.getPlan();
    dataSource.updatePlan(name, coordinates).then(function(){
      _switchToListMode(name);
    });
  }

  /**
   * Set up the events on the elements
   */
  function _setupEvents() {
    _$list.on('click', '.plan', _planClickAction);
    _$list.on('click', '.delete', _deletePlanAction);
    _$list.on('click', '.update', _updatePlanAction);
    _$listMenu.on('click', _switchToListMode);
    _$createMenu.on('click', _switchToCreateMode);
    $('#save-button').on('click', _saveAction);

    // detect when a point of a selected plan is changed
    map.on("edited", function() {
      var $li = _$list.find('.active');
      $li.addClass('edited');
    });
  }

  /**
   * Called as a callback when the google map api is loaded 
   */
  function _init() {
    map.init('map').then(function() {
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
