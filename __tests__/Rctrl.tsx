import 'react-native';
import React from 'react';
import Rctrl from '../Rctrl';
import renderer from 'react-test-renderer';

test('renders correctly', () => {
  renderer.create(<Rctrl />);
});
