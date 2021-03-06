import { a as _objectSpread, b as _classCallCheck, c as _createClass, d as _possibleConstructorReturn, e as _getPrototypeOf, f as _inherits, g as MapContext, h as pick, i as withNavermaps, j as bridgeEventHandlers, k as injectNaverRef, l as withMap, m as _extends } from './hocs-cc75d7f3.js';
import React from 'react';
import PropTypes from 'prop-types';
import invariant from 'invariant';
import { compose } from 'recompose';
import shallowequal from 'shallowequal';
import loadJs from 'load-js';
import 'create-react-context';
import 'lodash.camelcase';
import 'hoist-non-react-statics';
import 'warning';
import 'react-resize-detector';

var mapOptionKeys = ['background', 'baseTileOpacity', 'disableDoubleClickZoom', 'disableDoubleTapZoom', 'disableKineticPan', 'disableTwoFingerTapZoom', 'draggable', 'keyboardShortcuts', 'logoControl', 'logoControlOptions', 'mapDataControl', 'mapDataControlOptions', 'mapTypeControl', 'mapTypeControlOptions', 'mapTypes', 'maxBounds', 'maxZoom', 'minZoom', 'padding', 'pinchZoom', 'resizeOrigin', 'scaleControl', 'scaleControlOptions', 'scrollWheel', 'overlayZoomEffect', 'tileSpare', 'tileTransition', 'zoomControl', 'zoomControlOptions', 'zoomOrigin', 'useStyleMap'];
var kvoKeys = ['mapTypeId', 'size', 'bounds', 'center', 'centerPoint', 'zoom'];
var defaultKVOKeyMap = {
  defaultMapTypeId: 'mapTypeId',
  defaultSize: 'size',
  defaultBounds: 'bounds',
  defaultCenter: 'center',
  defaultCenterPoint: 'centerPoint',
  defaultZoom: 'zoom'
};
var defaultKVOKeys = kvoKeys.map(function (key) {
  return 'default' + key[0].toUpperCase() + key.substring(1, key.length);
});
var pickMapOptions = pick(mapOptionKeys);
var pickKVOOptions = pick(kvoKeys);
var pickDefaultKVOKeys = pick(defaultKVOKeys);

var NaverMap =
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(NaverMap, _React$PureComponent);

  function NaverMap(props) {
    var _this;

    _classCallCheck(this, NaverMap);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(NaverMap).call(this, props));
    _this.state = {};
    return _this;
  }

  _createClass(NaverMap, [{
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (this.instance) {
        this.instance.destroy();
      }
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.createMap();
      this.forceUpdate();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var dirtyKvos = this.pickDirtyKvos(prevProps);

      if (Object.keys(dirtyKvos).length > 0) {
        this.updateKvos(dirtyKvos);
      }

      if (this.shouldMapOptionsUpdate(prevProps)) {
        this.updateMapOptions();
      }
    }
  }, {
    key: "pickDirtyKvos",
    value: function pickDirtyKvos(prevProps) {
      var _this$props = this.props,
          mapTypeId = _this$props.mapTypeId,
          size = _this$props.size,
          bounds = _this$props.bounds,
          center = _this$props.center,
          centerPoint = _this$props.centerPoint,
          zoom = _this$props.zoom;
      var dirties = {};

      if (mapTypeId !== prevProps.mapTypeId && this.getMapTypeId() !== mapTypeId) {
        dirties.mapTypeId = mapTypeId;
      }

      if (size !== prevProps.size && !this.getSize().equals(size)) {
        dirties.size = size;
      }

      if (zoom !== prevProps.zoom && this.getZoom() !== zoom) {
        dirties.zoom = zoom;
      }

      if (bounds !== prevProps.bounds && !this.getBounds().equals(bounds)) {
        dirties.bounds = bounds;
      }

      if (center !== prevProps.center && !this.getCenter().equals(center)) {
        dirties.center = center;
      }

      if (centerPoint !== prevProps.centerPoint && !this.getCenterPoint().equals(centerPoint)) {
        dirties.centerPoint = centerPoint;
      }

      if (zoom !== prevProps.zoom && this.getZoom() !== zoom) {
        dirties.zoom = zoom;
      }

      return dirties;
    }
  }, {
    key: "updateKvos",
    value: function updateKvos(kvos) {
      var transitionOptions = this.props.transitionOptions;
      var mapTypeId = kvos.mapTypeId,
          size = kvos.size,
          bounds = kvos.bounds,
          center = kvos.center,
          centerPoint = kvos.centerPoint,
          zoom = kvos.zoom;

      if (mapTypeId) {
        this.setMapTypeId(mapTypeId);
      }

      if (size) {
        this.updating = true;
        this.setSize(size);
      }

      if (centerPoint) {
        this.updating = true;
        this.setCenterPoint(centerPoint);
      }

      if (bounds) {
        this.updating = true;
        this.panToBounds(bounds);
      } else {
        if (center && zoom) {
          this.updating = true;
          this.morph(center, zoom, transitionOptions);
        } else {
          if (center) {
            this.updating = true;
            this.panTo(center, transitionOptions);
          }

          if (zoom) {
            this.updating = true;
            this.setZoom(zoom);
          }
        }
      }
    }
  }, {
    key: "shouldMapOptionsUpdate",
    value: function shouldMapOptionsUpdate(prevProps) {
      return !shallowequal(pickMapOptions(this.props), pickMapOptions(prevProps));
    }
  }, {
    key: "updateMapOptions",
    value: function updateMapOptions() {
      var mapOptions = pickMapOptions(this.props);
      this.setOptions(_objectSpread({}, mapOptions));
    }
    /**
     * createMap
     *
     * create map instance with props.
     */

  }, {
    key: "createMap",
    value: function createMap() {
      var _this2 = this;

      var _this$props2 = this.props,
          navermaps = _this$props2.navermaps,
          id = _this$props2.id,
          registerEventInstance = _this$props2.registerEventInstance;
      invariant(id, 'react-naver-maps: <Map /> - props.id is required');
      var mapOptions = pickMapOptions(this.props);
      var kvoOptions = pickKVOOptions(this.props);
      var defaultKVOOptions = pickDefaultKVOKeys(this.props);

      var allMapOptions = _objectSpread({}, mapOptions, kvoOptions);

      Object.keys(defaultKVOOptions).forEach(function (defaultKey) {
        allMapOptions[defaultKVOKeyMap[defaultKey]] = defaultKVOOptions[defaultKey];
      });

      try {
        this.instance = new navermaps.Map(id, allMapOptions);
      } catch (e) {
        invariant(false, "react-naver-maps: <Map /> - please check <div id=#".concat(id, "> is correctly mounted"));
      } // alias


      this.map = this.instance;
      registerEventInstance(this.map); // clear updating state

      this.map.addListener('idle', function () {
        _this2.updating = false;
      });
    }
    /**
     * Add pane
     * @public
     * @param {string} name
     * @param {HTMLElement|number} elementOrZIndex
     */

  }, {
    key: "addPane",
    value: function addPane() {
      var _this$map;

      return (_this$map = this.map).addPane.apply(_this$map, arguments);
    }
    /**
     * @public
     */

  }, {
    key: "destroy",
    value: function destroy() {
      return this.map.destroy();
    }
    /**
     * fit bounds
     * @public
     * @param  {object} bounds
     * @param  {object} margin
     */

  }, {
    key: "fitBounds",
    value: function fitBounds() {
      var _this$map2;

      return (_this$map2 = this.map).fitBounds.apply(_this$map2, arguments);
    }
    /**
     *
     * @param  {...any} args
     * @public
     */

  }, {
    key: "getBounds",
    value: function getBounds() {
      return this.map.getBounds();
    }
    /**
     *
     * @param  {...any} args
     * @public
     */

  }, {
    key: "getCenter",
    value: function getCenter() {
      return this.map.getCenter();
    }
    /**
     *
     * @param  {...any} args
     * @public
     */

  }, {
    key: "getCenterPoint",
    value: function getCenterPoint() {
      return this.map.getCenterPoint();
    }
    /**
     *
     * @param  {...any} args
     * @public
     */

  }, {
    key: "getElement",
    value: function getElement() {
      return this.map.getElement();
    }
    /**
     *
     * @param  {...any} args
     * @public
     */

  }, {
    key: "getMapTypeId",
    value: function getMapTypeId() {
      return this.map.getMapTypeId();
    }
    /**
     *
     * @param  {...any} args
     * @public
     */

  }, {
    key: "getOptions",
    value: function getOptions() {
      return this.map.getOptions();
    }
    /**
     *
     * @param  {...any} args
     * @public
     */

  }, {
    key: "getPanes",
    value: function getPanes() {
      return this.map.getPanes();
    }
    /**
     *
     * @param  {...any} args
     * @public
     */

  }, {
    key: "getPrimitiveProjection",
    value: function getPrimitiveProjection() {
      return this.map.getPrimitiveProjection();
    }
    /**
     *
     * @param  {...any} args
     * @public
     */

  }, {
    key: "getProjection",
    value: function getProjection() {
      return this.map.getProjection();
    }
    /**
     *
     * @param  {...any} args
     * @public
     */

  }, {
    key: "getSize",
    value: function getSize() {
      return this.map.getSize();
    }
    /**
     *
     * @param  {...any} args
     * @public
     */

  }, {
    key: "getZoom",
    value: function getZoom() {
      return this.map.getZoom();
    }
    /**
     *
     * @param  {...any} args
     * @public
     */

  }, {
    key: "morph",
    value: function morph() {
      var _this$map3;

      return (_this$map3 = this.map).morph.apply(_this$map3, arguments);
    }
    /**
     *
     * @param  {...any} args
     * @public
     */

  }, {
    key: "panBy",
    value: function panBy() {
      var _this$map4;

      return (_this$map4 = this.map).panBy.apply(_this$map4, arguments);
    }
    /**
     *
     * @param  {...any} args
     * @public
     */

  }, {
    key: "panTo",
    value: function panTo() {
      var _this$map5;

      return (_this$map5 = this.map).panTo.apply(_this$map5, arguments);
    }
    /**
     *
     * @param  {...any} args
     * @public
     */

  }, {
    key: "panToBounds",
    value: function panToBounds() {
      var _this$map6;

      return (_this$map6 = this.map).panToBounds.apply(_this$map6, arguments);
    }
    /**
     *
     * @param  {...any} args
     * @public
     */

  }, {
    key: "refresh",
    value: function refresh() {
      var _this$map7;

      return (_this$map7 = this.map).refresh.apply(_this$map7, arguments);
    }
    /**
     *
     * @param  {...any} args
     * @public
     */

  }, {
    key: "removePane",
    value: function removePane() {
      var _this$map8;

      return (_this$map8 = this.map).removePane.apply(_this$map8, arguments);
    }
    /**
     *
     * @param  {...any} args
     * @public
     */

  }, {
    key: "setCenter",
    value: function setCenter() {
      var _this$map9;

      return (_this$map9 = this.map).setCenter.apply(_this$map9, arguments);
    }
    /**
     *
     * @param  {...any} args
     * @public
     */

  }, {
    key: "setCenterPoint",
    value: function setCenterPoint() {
      var _this$map10;

      return (_this$map10 = this.map).setCenterPoint.apply(_this$map10, arguments);
    }
    /**
     *
     * @param  {...any} args
     * @public
     */

  }, {
    key: "setMapTypeId",
    value: function setMapTypeId() {
      var _this$map11;

      return (_this$map11 = this.map).setMapTypeId.apply(_this$map11, arguments);
    }
    /**
     *
     * @param  {...any} args
     * @public
     */

  }, {
    key: "setOptions",
    value: function setOptions() {
      var _this$map12;

      return (_this$map12 = this.map).setOptions.apply(_this$map12, arguments);
    }
    /**
     *
     * @param  {...any} args
     * @public
     */

  }, {
    key: "setSize",
    value: function setSize() {
      var _this$map13;

      return (_this$map13 = this.map).setSize.apply(_this$map13, arguments);
    }
    /**
     *
     * @public
     * @param  {...any} args
     */

  }, {
    key: "setZoom",
    value: function setZoom() {
      var _this$map14;

      return (_this$map14 = this.map).setZoom.apply(_this$map14, arguments);
    }
    /**
     *
     * @public
     * @param  {...any} args
     */

  }, {
    key: "updateBy",
    value: function updateBy() {
      var _this$map15;

      return (_this$map15 = this.map).updateBy.apply(_this$map15, arguments);
    }
    /**
     *
     * @param  {...any} args
     * @public
     */

  }, {
    key: "zoomBy",
    value: function zoomBy() {
      var _this$map16;

      return (_this$map16 = this.map).zoomBy.apply(_this$map16, arguments);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props3 = this.props,
          id = _this$props3.id,
          style = _this$props3.style,
          className = _this$props3.className,
          children = _this$props3.children;
      return React.createElement(MapContext.Provider, {
        value: this.map
      }, React.createElement("div", {
        id: id,
        className: className,
        style: style
      }, children));
    }
  }]);

  return NaverMap;
}(React.PureComponent);
/**
 *  @visibleName NaverMap
 */


NaverMap.propTypes = {
  navermaps: PropTypes.object.isRequired,
  registerEventInstance: PropTypes.func.isRequired,
  id: PropTypes.string,
  style: PropTypes.object,
  className: PropTypes.string,
  children: PropTypes.node,
  events: PropTypes.arrayOf(PropTypes.string),
  disableDoubleClickZoom: PropTypes.bool,
  disableDoubleTapZoom: PropTypes.bool,
  disableKineticPan: PropTypes.bool,
  disableTwoFingerTapZoom: PropTypes.bool,
  draggable: PropTypes.bool,
  keyboardShortcuts: PropTypes.bool,
  logoControl: PropTypes.bool,
  mapDataControl: PropTypes.bool,
  mapTypeControl: PropTypes.bool,
  maxBounds: PropTypes.object,
  pinchZoom: PropTypes.bool,
  resizeOrigin: PropTypes.number,
  scaleControl: PropTypes.bool,
  scrollWheel: PropTypes.bool,
  overlayZoomEffect: PropTypes.string,
  tileSpare: PropTypes.number,
  tileTransition: PropTypes.bool,
  zoomControl: PropTypes.bool,
  zoomOrigin: PropTypes.object,
  mapTypeId: PropTypes.number,
  size: PropTypes.object,
  bounds: PropTypes.object,
  center: PropTypes.object,
  centerPoint: PropTypes.object,
  zoom: PropTypes.number,
  transitionOptions: PropTypes.object
};
NaverMap.defaultProps = {
  events: ['addLayer', 'click', 'dblclick', 'doubletap', 'drag', 'dragend', 'dragstart', 'idle', 'keydown', 'keyup', 'longtap', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'panning', 'pinch', 'pinchend', 'pinchstart', 'removeLayer', 'resize', 'rightclick', 'tap', 'tilesloaded', 'touchend', 'touchmove', 'touchstart', 'twofingertap', 'zooming', 'mapType_changed', 'mapTypeId_changed', 'size_changed', 'bounds_changed', 'center_changed', 'centerPoint_changed', 'projection_changed', 'zoom_changed'],
  id: 'react-naver-map',
  disableDoubleClickZoom: false,
  disableDoubleTapZoom: false,
  disableKineticPan: true,
  disableTwoFingerTapZoom: false,
  draggable: true,
  keyboardShortcuts: false,
  logoControl: true,
  mapDataControl: true,
  mapTypeControl: false,
  maxBounds: null,
  pinchZoom: true,
  resizeOrigin: 0,
  scaleControl: true,
  scrollWheel: true,
  overlayZoomEffect: null,
  tileSpare: 0,
  tileTransition: true,
  zoomControl: false,
  zoomOrigin: null,
  transitionOptions: null
};
var NaverMap$1 = compose(withNavermaps, bridgeEventHandlers, injectNaverRef)(NaverMap);

var Overlay =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Overlay, _React$Component);

  function Overlay() {
    _classCallCheck(this, Overlay);

    return _possibleConstructorReturn(this, _getPrototypeOf(Overlay).apply(this, arguments));
  }

  _createClass(Overlay, [{
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (this.overlay) this.overlay.setMap(null);
    }
  }, {
    key: "createOverlay",
    value: function createOverlay() {
      var _this$props = this.props,
          OverlayView = _this$props.OverlayView,
          map = _this$props.map,
          registerEventInstance = _this$props.registerEventInstance;
      var overlay = new OverlayView({
        map: map
      });
      registerEventInstance(overlay);
      return overlay;
    }
  }, {
    key: "updateOverlay",
    value: function updateOverlay(overlay) {
      var overlayOptions = this.props.pickOverlayOptions(this.props);

      if (this.props.map !== this.overlay.getMap()) {
        overlayOptions.map = this.props.map;
      }

      overlay.setOptions(overlayOptions);
    }
  }, {
    key: "render",
    value: function render() {
      if (!this.overlay) {
        this.overlay = this.createOverlay();
      }

      this.updateOverlay(this.overlay);
      return null;
    }
  }]);

  return Overlay;
}(React.Component);

Overlay.propTypes = {
  OverlayView: PropTypes.func,
  map: PropTypes.object,
  registerEventInstance: PropTypes.func,
  pickOverlayOptions: PropTypes.func
};
var Overlay$1 = compose(withMap, bridgeEventHandlers)(Overlay);

var pickCircleOptions = pick(['center', 'radius', 'strokeWeight', 'strokeOpacity', 'strokeColor', 'strokeStyle', 'strokeLineCap', 'strokeLineJoin', 'fillColor', 'fillOpacity', 'clickable', 'visible', 'zIndex']);
/**
 *
 * @param {*} props
 */

function Circle(props) {
  return React.createElement(Overlay$1, _extends({}, props, {
    OverlayView: props.navermaps.Circle,
    pickOverlayOptions: pickCircleOptions
  }));
}

Circle.defaultProps = {
  events: ['center_changed', 'click', 'clickable_changed', 'dblclick', 'mousedown', 'mouseout', 'mouseover', 'mouseup', 'radius_changed', 'visible_changed', 'zIndex_changed'],
  radius: 0,
  strokeWeight: 1,
  strokeOpacity: 1,
  strokeColor: '#007EEA',
  strokeStyle: 'solid',
  strokeLineCap: 'butt',
  strokeLineJoin: 'miter',
  fillColor: 'none',
  fillOpacity: 1,
  clickable: false,
  visible: true,
  zIndex: 0
};
Circle.propTypes = {
  navermaps: PropTypes.object,
  events: PropTypes.arrayOf(PropTypes.string),
  center: PropTypes.object.isRequired,
  radius: PropTypes.number,
  strokeWeight: PropTypes.number,
  strokeOpacity: PropTypes.number,
  strokeColor: PropTypes.string,
  strokeStyle: PropTypes.string,
  strokeLineCap: PropTypes.string,
  strokeLineJoin: PropTypes.string,
  fillColor: PropTypes.string,
  fillOpacity: PropTypes.number,
  clickable: PropTypes.bool,
  visible: PropTypes.bool,
  zIndex: PropTypes.number
};
var Circle$1 = withNavermaps(Circle);

var pickEllipseOptions = pick(['bounds', 'strokeWeight', 'strokeOpacity', 'strokeColor', 'strokeStyle', 'strokeLineCap', 'strokeLineJoin', 'fillColor', 'fillOpacity', 'clickable', 'visible', 'zIndex']);
/**
 *
 * @param {*} props
 */

function Ellipse(props) {
  return React.createElement(Overlay$1, _extends({}, props, {
    OverlayView: props.navermaps.Ellipse,
    pickOverlayOptions: pickEllipseOptions
  }));
}

Ellipse.defaultProps = {
  events: ['bounds_changed', 'click', 'clickable_changed', 'dblclick', 'mousedown', 'mouseout', 'mouseover', 'mouseup', 'visible_changed', 'zIndex_changed'],
  strokeWeight: 1,
  strokeOpacity: 1,
  strokeColor: '#007EEA',
  strokeStyle: 'solid',
  strokeLineCap: 'butt',
  strokeLineJoin: 'miter',
  fillColor: 'none',
  fillOpacity: 1,
  clickable: false,
  visible: true,
  zIndex: 0
};
Ellipse.propTypes = {
  navermaps: PropTypes.object,
  events: PropTypes.arrayOf(PropTypes.string),
  bounds: PropTypes.object.isRequired,
  strokeWeight: PropTypes.number,
  strokeOpacity: PropTypes.number,
  strokeColor: PropTypes.string,
  strokeStyle: PropTypes.string,
  strokeLineCap: PropTypes.string,
  strokeLineJoin: PropTypes.string,
  fillColor: PropTypes.string,
  fillOpacity: PropTypes.number,
  clickable: PropTypes.bool,
  visible: PropTypes.bool,
  zIndex: PropTypes.number
};
var Ellipse$1 = withNavermaps(Ellipse);

/**
 *
 * @param {*} props
 */

var GroundOverlay =
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(GroundOverlay, _React$PureComponent);

  function GroundOverlay() {
    _classCallCheck(this, GroundOverlay);

    return _possibleConstructorReturn(this, _getPrototypeOf(GroundOverlay).apply(this, arguments));
  }

  _createClass(GroundOverlay, [{
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (this.overlay) this.overlay.setMap(null);
    }
  }, {
    key: "createGroundOverlay",
    value: function createGroundOverlay() {
      var _this$props = this.props,
          navermaps = _this$props.navermaps,
          map = _this$props.map,
          bounds = _this$props.bounds,
          url = _this$props.url,
          clickable = _this$props.clickable,
          registerEventInstance = _this$props.registerEventInstance;
      var groundOverlay = new navermaps.GroundOverlay(url, bounds, {
        map: map,
        clickable: clickable
      });
      registerEventInstance(groundOverlay);
      return groundOverlay;
    }
  }, {
    key: "updateGroundOverlay",
    value: function updateGroundOverlay(groundOverlay) {
      var opacity = this.props.opacity;
      groundOverlay.setOpacity(opacity);
    }
  }, {
    key: "render",
    value: function render() {
      if (!this.overlay) {
        this.overlay = this.createGroundOverlay();
      }

      this.updateGroundOverlay(this.overlay);
      return null;
    }
  }]);

  return GroundOverlay;
}(React.PureComponent);

GroundOverlay.defaultProps = {
  events: ['click', 'dblclick']
};
GroundOverlay.propTypes = {
  events: PropTypes.arrayOf(PropTypes.string),
  bounds: PropTypes.object.isRequired,
  url: PropTypes.string.isRequired,
  clickable: PropTypes.bool,
  opacity: PropTypes.number,
  map: PropTypes.object,
  navermaps: PropTypes.object,
  registerEventInstance: PropTypes.func
};
var GroundOverlay$1 = compose(withNavermaps, withMap, bridgeEventHandlers)(GroundOverlay);

var pickMarkerOptions = pick(['position', 'animation', 'icon', 'shape', 'title', 'cursor', 'clickable', 'draggable', 'visible', 'zIndex']);
/**
 *
 * @param {*} props
 */

function Marker(props) {
  return React.createElement(Overlay$1, _extends({}, props, {
    OverlayView: props.navermaps.Marker,
    pickOverlayOptions: pickMarkerOptions
  }));
}

Marker.defaultProps = {
  events: ['animation_changed', 'click', 'clickable_changed', 'dblclick', 'draggable_changed', 'icon_changed', 'mousedown', 'mouseout', 'mouseover', 'mouseup', 'position_changed', 'shape_changed', 'title_changed', 'visible_changed', 'zIndex_changed'],
  title: null,
  cursor: 'pointer',
  clickable: true,
  draggable: false,
  visible: true
};
Marker.propTypes = {
  navermaps: PropTypes.object,
  events: PropTypes.arrayOf(PropTypes.string),
  position: PropTypes.any.isRequired,
  animation: PropTypes.number,
  icon: PropTypes.any,
  shape: PropTypes.object,
  title: PropTypes.string,
  cursor: PropTypes.string,
  draggable: PropTypes.bool,
  clickable: PropTypes.bool,
  visible: PropTypes.bool,
  zIndex: PropTypes.number
};
var Marker$1 = withNavermaps(Marker);

var pickPolygonOptions = pick(['paths', 'strokeWeight', 'strokeOpacity', 'strokeColor', 'strokeStyle', 'strokeLineCap', 'strokeLineJoin', 'fillColor', 'fillOpacity', 'clickable', 'visible', 'zIndex']);
/**
 *
 * @param {*} props
 */

function Polygon(props) {
  return React.createElement(Overlay$1, _extends({}, props, {
    OverlayView: props.navermaps.Polygon,
    pickOverlayOptions: pickPolygonOptions
  }));
}

Polygon.defaultProps = {
  events: ['click', 'clickable_changed', 'dblclick', 'mousedown', 'mouseout', 'mouseover', 'mouseup', 'visible_changed', 'zIndex_changed'],
  strokeWeight: 1,
  strokeOpacity: 1,
  strokeColor: '#007EEA',
  strokeStyle: 'solid',
  strokeLineCap: 'butt',
  strokeLineJoin: 'miter',
  fillColor: 'none',
  fillOpacity: 1,
  clickable: false,
  visible: true,
  zIndex: 0
};
Polygon.propTypes = {
  navermaps: PropTypes.object,
  events: PropTypes.arrayOf(PropTypes.string),
  paths: PropTypes.any.isRequired,
  strokeWeight: PropTypes.number,
  strokeOpacity: PropTypes.number,
  strokeColor: PropTypes.string,
  strokeStyle: PropTypes.string,
  strokeLineCap: PropTypes.string,
  strokeLineJoin: PropTypes.string,
  fillColor: PropTypes.string,
  fillOpacity: PropTypes.number,
  clickable: PropTypes.bool,
  visible: PropTypes.bool,
  zIndex: PropTypes.number
};
var Polygon$1 = withNavermaps(Polygon);

var pickPolylineOptions = pick(['path', 'strokeWeight', 'strokeOpacity', 'strokeColor', 'strokeStyle', 'strokeLineCap', 'strokeLineJoin', 'clickable', 'visible', 'zIndex', 'startIcon', 'startIconSize', 'endIcon', 'endIconSize']);
/**
 *
 * @param {*} props
 */

function Polyline(props) {
  return React.createElement(Overlay$1, _extends({}, props, {
    OverlayView: props.navermaps.Polyline,
    pickOverlayOptions: pickPolylineOptions
  }));
}

Polyline.defaultProps = {
  events: ['click', 'clickable_changed', 'dblclick', 'mousedown', 'mouseout', 'mouseover', 'mouseup', 'visible_changed', 'zIndex_changed'],
  strokeWeight: 1,
  strokeOpacity: 1,
  strokeColor: '#007EEA',
  strokeStyle: 'solid',
  strokeLineCap: 'butt',
  strokeLineJoin: 'miter',
  clickable: false,
  visible: true,
  zIndex: 0
};
Polyline.propTypes = {
  navermaps: PropTypes.object,
  events: PropTypes.arrayOf(PropTypes.string),
  path: PropTypes.any.isRequired,
  strokeWeight: PropTypes.number,
  strokeOpacity: PropTypes.number,
  strokeColor: PropTypes.string,
  strokeStyle: PropTypes.string,
  strokeLineCap: PropTypes.string,
  strokeLineJoin: PropTypes.string,
  clickable: PropTypes.bool,
  visible: PropTypes.bool,
  zIndex: PropTypes.number,
  startIcon: PropTypes.number,
  startIconSize: PropTypes.number,
  endIcon: PropTypes.number,
  endIconSize: PropTypes.number
};
var Polyline$1 = withNavermaps(Polyline);

var pickRectangleOptions = pick(['bounds', 'strokeWeight', 'strokeOpacity', 'strokeColor', 'strokeStyle', 'strokeLineCap', 'strokeLineJoin', 'fillColor', 'fillOpacity', 'clickable', 'visible', 'zIndex']);
/**
 *
 * @param {*} props
 */

function Rectangle(props) {
  return React.createElement(Overlay$1, _extends({}, props, {
    OverlayView: props.navermaps.Rectangle,
    pickOverlayOptions: pickRectangleOptions
  }));
}

Rectangle.defaultProps = {
  events: ['bounds_changed', 'click', 'clickable_changed', 'dblclick', 'mousedown', 'mouseout', 'mouseover', 'mouseup', 'visible_changed', 'zIndex_changed'],
  strokeWeight: 1,
  strokeOpacity: 1,
  strokeColor: '#007EEA',
  strokeStyle: 'solid',
  strokeLineCap: 'butt',
  strokeLineJoin: 'miter',
  fillColor: 'none',
  fillOpacity: 1,
  clickable: false,
  visible: true,
  zIndex: 0
};
Rectangle.propTypes = {
  navermaps: PropTypes.object,
  events: PropTypes.arrayOf(PropTypes.string),
  bounds: PropTypes.object.isRequired,
  strokeWeight: PropTypes.number,
  strokeOpacity: PropTypes.number,
  strokeColor: PropTypes.string,
  strokeStyle: PropTypes.string,
  strokeLineCap: PropTypes.string,
  strokeLineJoin: PropTypes.string,
  fillColor: PropTypes.string,
  fillOpacity: PropTypes.number,
  clickable: PropTypes.bool,
  visible: PropTypes.bool,
  zIndex: PropTypes.number
};
var Rectangle$1 = withNavermaps(Rectangle);

var _loadNavermapsScript = function _loadNavermapsScript(_ref) {
  var clientId = _ref.clientId,
      submodules = _ref.submodules,
      ncpClientId = _ref.ncpClientId;
  invariant(clientId || ncpClientId, 'clientId or ncpClientId is required'); // build naver maps v3 api url

  var requestUrl = "https://openapi.map.naver.com/openapi/v3/maps.js";
  requestUrl += "?ncpClientId=".concat(clientId || ncpClientId);

  if (submodules) {
    requestUrl += "&submodules=".concat(submodules.join(','));
  }

  return loadJs(requestUrl).then(function () {
    var navermaps = window.naver.maps;

    if (navermaps.jsContentLoaded) {
      return navermaps;
    }

    var loadingJsContent = new Promise(function (resolve) {
      navermaps.onJSContentLoaded = function () {
        resolve(navermaps);
      };
    });
    return loadingJsContent;
  });
};

var loadScriptPromise = null;

var loadNavermapsScript = function loadNavermapsScript(_ref2) {
  var clientId = _ref2.clientId,
      submodules = _ref2.submodules,
      ncpClientId = _ref2.ncpClientId;
  invariant(clientId || ncpClientId, 'loadNavermapsScript: clientId or ncpClientId is required');

  if (loadScriptPromise) {
    return loadScriptPromise;
  }

  loadScriptPromise = _loadNavermapsScript({
    clientId: clientId,
    ncpClientId: ncpClientId,
    submodules: submodules
  });
  return loadScriptPromise;
};

var RenderAfterNavermapsLoaded =
/*#__PURE__*/
function (_React$Component) {
  _inherits(RenderAfterNavermapsLoaded, _React$Component);

  function RenderAfterNavermapsLoaded(props) {
    var _this;

    _classCallCheck(this, RenderAfterNavermapsLoaded);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(RenderAfterNavermapsLoaded).call(this, props));
    _this.state = {
      loading: true
    };
    return _this;
  }

  _createClass(RenderAfterNavermapsLoaded, [{
    key: "render",
    value: function render() {
      if (this.state.loading) {
        return this.props.loading;
      }

      if (this.state.error) {
        return this.props.error;
      }

      return this.props.children;
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      var _this$props = this.props,
          clientId = _this$props.clientId,
          ncpClientId = _this$props.ncpClientId,
          submodules = _this$props.submodules;
      loadNavermapsScript({
        clientId: clientId,
        ncpClientId: ncpClientId,
        submodules: submodules
      }).then(function () {
        _this2.setState({
          loading: false
        });
      }).catch(function () {
        _this2.setState({
          loading: false,
          error: true
        });
      });
    }
  }]);

  return RenderAfterNavermapsLoaded;
}(React.Component);

var cliendIdRequired = function cliendIdRequired(props, propName, componentName) {
  invariant(props.clientId || props.ncpClientId, "react-naver-maps: One of props 'clientId' or 'ncpClientId' should be specified in '".concat(componentName, "'."));
};

RenderAfterNavermapsLoaded.propTypes = {
  loading: PropTypes.node,
  error: PropTypes.node,
  clientId: cliendIdRequired,
  ncpClientId: cliendIdRequired,
  submodules: PropTypes.arrayOf(PropTypes.string),
  children: PropTypes.node
};
RenderAfterNavermapsLoaded.defaultProps = {
  loading: null,
  error: null
};

export { NaverMap$1 as NaverMap, Overlay$1 as Overlay, Circle$1 as Circle, Ellipse$1 as Ellipse, GroundOverlay$1 as GroundOverlay, Marker$1 as Marker, Polygon$1 as Polygon, Polyline$1 as Polyline, Rectangle$1 as Rectangle, RenderAfterNavermapsLoaded, loadNavermapsScript };
