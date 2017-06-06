'use strict';

var DroneFlightPlannerMap = (function(_) {

  var _map = null;
  var _drawingManager = null;
  var _polyline = null;
  var _markers = [];
  var _path = [];
  var _overlays = [];
  var _marker_icon_option = null;
  var _google = null;

  /**
   * Init the Drone Flight Planner Map
   * @param  {[type]} the id of the element that will 
   * @param  {[type]} a callback function that must be called once the map is initialized
   */
  function _init(pElement, pCallback) {

    _google = window.google;

    // we check the google map is loaded
    if (_google) {
      _marker_icon_option = {
        path: _google.maps.SymbolPath.CIRCLE,
        fillColor: '#E74C3C',
        fillOpacity: 1,
        scale: 4.5,
        strokeColor: 'white',
        strokeWeight: 1
      };

      _map = new _google.maps.Map(document.getElementById(pElement), {
        center: {
          lat: 46.5190557,
          lng: 6.5667576
        },
        zoom: 18
      });

      _drawingManager = new _google.maps.drawing.DrawingManager({
        drawingMode: _google.maps.drawing.OverlayType.MARKER,
        drawingControl: false,
        markerOptions: {
          icon: _marker_icon_option
        },

      });

      _google.maps.event.addListener(_drawingManager, 'markercomplete', function(marker) {
        _path.push(marker.position);
        _polyline.setPath(_path);
      });

      _google.maps.event.addListener(_drawingManager, 'overlaycomplete', function(e) {
        _overlays.push(e);
      });

      if (pCallback) {
        pCallback();
      }
    } else {
      console.error('Google Map is not loaded');
    }
  }

  /**
   * Turn the polyline path to a list of coordinates (lat, lng)
   * @return {Array} An array of objects with lat and lng properties
   */
  function _getPathCoordinates() {
    var coordinates = [];

    _.each(_path, function(latLng) {
      coordinates.push({
        lat: latLng.lat(),
        lng: latLng.lng()
      });
    });

    return coordinates;
  }

  /**
   * Convert a list of coordinates to a list of LatLng objects understandable by google map
   * @param  {Array} An array of objects that represents the coordinates (lat, lng)
   * @return {Array} An array of LatLng objects
   */
  function _parseCoordinates(pCoordinates) {
    var path = [];

    _.each(pCoordinates, function(coordinate) {
      if (coordinate && coordinate.lat && coordinate.lng) {
        path.push(new _google.maps.LatLng(coordinate.lat, coordinate.lng));
      }
    });

    return path;
  }

  /**
   * Remove all the elements from the map
   */
  function _clear() {
    if (_polyline) {
      _polyline.setMap(null);
    }

    _.each(_markers, function(marker) {
      marker.setMap(null);
    });

    _polyline = null;
    _markers = [];
    _path = [];
  }

  /**
   * Create a new Polyline Object with the current path
   * @return {Polyline} A google map polyline object
   */
  function _createNewPolyline() {
    return new _google.maps.Polyline({
      path: _path,
      geodesic: true,
      strokeColor: '#E74C3C',
      strokeOpacity: 1,
      strokeWeight: 2,
      map: _map
    });
  }

  /**
   * Start the "drawing" mode
   */
  function _startPlan() {
    _clear();
    _drawingManager.setMap(_map);
    _polyline = _createNewPolyline();
  }

  /**
   * Return the current plan coordinates
   * @return {Array} An array of objects representing the plan coordinates (lat, lng)
   */
  function _getPlan() {
    return _getPathCoordinates();
  }

  /**
   * Stop the "drawing" mode and return the current plan coordinates
   * @return {Array} An array of objects representing the plan coordinates (lat, lng)
   */
  function _stopPlan() {
    var plan = _getPathCoordinates();
    _clear();
    _drawingManager.setMap(null);
    _.each(_overlays, function(overlay) {
      overlay.overlay.setMap(null);
    });
    return plan;
  }

  /**
   * Display a plan according to the coordinates provide as parameters
   * @param  {Array} An array of objects representing the plan coordinates (lat, lng)
   */
  function _showPlan(pCoordinates) {

    _clear();

    _path = _parseCoordinates(pCoordinates);

    // then we render the new plan
    _polyline = _createNewPolyline();

    _.each(_path, function(latLng) {
      var marker = new _google.maps.Marker({
        position: latLng,
        map: _map,
        icon: _marker_icon_option,
        draggable: true
      });
      _markers.push(marker);
    });
  }

  /**
   * Methods that are visible to the outside
   */
  return {
    init: _init,
    startPlan: _startPlan,
    getPlan: _getPlan,
    stopPlan: _stopPlan,
    showPlan: _showPlan
  };

})(_);
