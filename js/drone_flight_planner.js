'use strict';

var DroneFlightPlanner = (function() {

  var _map = null;
  var _drawingManager = null;
  var _polyline = null;
  var _markers = [];
  var _path = [];
  var _overlays = [];
  var _marker_icon_option = null;

  /**
   * Init the Drone Flight Planner
   * @param  {String} element the id of the element that will contains the map
   * @return {Object}         the object with the available features of the planner
   */
  function _init(element) {

    _marker_icon_option = {
      path: window.google.maps.SymbolPath.CIRCLE,
      fillColor: '#E74C3C',
      fillOpacity: 1,
      scale: 4.5,
      strokeColor: 'white',
      strokeWeight: 1
    };

    _map = new window.google.maps.Map(document.getElementById(element), {
      center: {
        lat: 46.5190557,
        lng: 6.5667576
      },
      zoom: 18
    });

    _drawingManager = new window.google.maps.drawing.DrawingManager({
      drawingMode: window.google.maps.drawing.OverlayType.MARKER,
      drawingControl: false,
      markerOptions: {
        icon: _marker_icon_option
      },

    });

    window.google.maps.event.addListener(_drawingManager, 'markercomplete', function(marker) {
      _path.push(marker.position);
      _polyline.setPath(_path);
    });

    window.google.maps.event.addListener(_drawingManager, 'overlaycomplete', function(e) {
      _overlays.push(e);
    });

  }

  function _getPathCoordinates() {
    var coordinates = [];

    for (var index in _path ){
      coordinates.push({
        lat : _path[index].lat(),
        lng : _path[index].lng()
      });
    }

    return coordinates;
  }

  function _parseCoordinates(coordinates) {
    var path = [];
    for ( var index in coordinates ) {
      path.push(new google.maps.LatLng(coordinates[index].lat,coordinates[index].lng));
    }
    return path;
  }

  function _clear() {
    if (_polyline) {
      _polyline.setMap(null);
    }

    for (var index in _markers) {
      _markers[index].setMap(null);
    }

    _polyline = null;
    _markers = [];
    _path = [];
  }

  function _createNewPolyline() {
    return new window.google.maps.Polyline({
      path: _path,
      geodesic: true,
      strokeColor: '#E74C3C',
      strokeOpacity: 1,
      strokeWeight: 2,
      map: _map
    });
  }

  function _startPlan() {
    _clear();
    _drawingManager.setMap(_map);
    _polyline = _createNewPolyline();
  }

  function _getPlan() {
    return _getPathCoordinates();
  }

  function _stopPlan() {
    var plan = _getPathCoordinates();
    _clear();
    _drawingManager.setMap(null);
    for (var index in _overlays) {
      _overlays[index].overlay.setMap(null);
    }
    _overlays = [];
    return plan;
  }

  function _showPlan(coordinates) {

    _clear();

    _path = _parseCoordinates(coordinates);

    // then we render the new plan
    _polyline = _createNewPolyline();

    for (var index in _path) {
      var marker = new window.google.maps.Marker({
        position: _path[index],
        map: _map,
        icon: _marker_icon_option
      });
      _markers.push(marker);
    }
  }

  return {
    init: _init,
    startPlan: _startPlan,
    getPlan: _getPlan,
    stopPlan: _stopPlan,
    showPlan: _showPlan
  };

})();
