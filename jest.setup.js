
// Mocking native modules that might cause issues in Jest

// Mock expo-font
jest.mock('expo-font', () => ({
  loadAsync: jest.fn(),
  isLoaded: jest.fn(() => true),
  isLoading: jest.fn(() => false),
}));

// Mock expo-modules-core
jest.mock('expo-modules-core', () => ({
  requireNativeModule: jest.fn(),
  NativeModulesProxy: {},
  EventEmitter: jest.fn(),
}));

// Mock @expo/vector-icons
jest.mock('@expo/vector-icons', () => ({
  AntDesign: 'AntDesign',
  Ionicons: 'Ionicons',
  MaterialIcons: 'MaterialIcons',
}));

// Mock Header to avoid navigation state issues in screen tests
jest.mock('./src/components/layout/Header', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    Header: () => React.createElement(Text, null, 'Mock Header'),
  };
});

// Mock react-native-maps
jest.mock('react-native-maps', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: (props) => React.createElement(View, props),
    Marker: (props) => React.createElement(View, props),
    Polyline: (props) => React.createElement(View, props),
  };
});

// Mock react-leaflet
jest.mock('react-leaflet', () => ({
  MapContainer: (props) => props.children,
  TileLayer: () => null,
  Marker: (props) => props.children,
  Popup: (props) => props.children,
  Circle: (props) => props.children,
  Polyline: (props) => props.children,
}));

// Mock leaflet
jest.mock('leaflet', () => {
  const Icon = jest.fn(function() {
    this.mergeOptions = jest.fn();
  });
  Icon.Default = {
    prototype: {
      _getIconUrl: jest.fn(),
    },
    mergeOptions: jest.fn(),
  };
  return {
    icon: jest.fn(),
    divIcon: jest.fn(),
    latLng: jest.fn(),
    latLngBounds: jest.fn(),
    Icon: Icon,
  };
});
