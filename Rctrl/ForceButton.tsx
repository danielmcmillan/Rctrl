/**
 * ForceButton component
 */
import React from 'react';
import {StyleSheet, View, StyleProp, ViewStyle, LayoutChangeEvent, LayoutRectangle} from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const styles = StyleSheet.create({
  view: {
    backgroundColor: '#aaaaaa',
  },
});

export interface TouchState {
  x: number;
  y: number;
  force: number | undefined;
}
interface Props {
  style?: StyleProp<ViewStyle>;
  touchState: TouchState | null;
}

function useLayout(): [LayoutRectangle | null, (event: LayoutChangeEvent) => void, React.MutableRefObject<View | null>] {
  const [layout, setLayout] = React.useState<LayoutRectangle | null>(null);
  const viewRef = React.useRef<View | null>(null);
  const handleLayout = React.useCallback(() => {
    if (viewRef.current) {
      viewRef.current.measure((_x, _y, width, height, pageX, pageY) => {
        setLayout({
          x: pageX,
          y: pageY,
          width,
          height,
        });
      });
    }
  }, []);
  return [layout, handleLayout, viewRef];
}

function usePrevious<V, D>(value: V, initial: D): V | D {
  const ref = React.useRef<V>();
  React.useEffect(() => {
    ref.current = value;
  });

  return ref.current !== undefined ? ref.current : initial;
}

export default function ForceButton({style, touchState}: Props): JSX.Element {
  const [layout, handleLayout, viewRef] = useLayout();

  const force = touchState ? (touchState.force === undefined ? 1 : touchState.force) : 0;
  const prevForce = usePrevious(force, 0);
  let contained = false;
  if (layout != null && touchState != null) {
    if (
      touchState.x >= layout.x && touchState.x < layout.x + layout.width
      && touchState.y >= layout.y && touchState.y < layout.y + layout.height
    ) {
      contained = true;
    }
  }

  const [isDown, setIsDown] = React.useState(false);
  React.useEffect(() => {
    if (!contained) {
      setIsDown(false);
    }
  }, [contained, setIsDown]);

  const [maxForce, setMaxForce] = React.useState(0);
  React.useEffect(() => {
    if (force > maxForce) {
      setMaxForce(force);
    }
  }, [force, maxForce]);

  const wasContained = usePrevious(contained, false);
  const somewhereWasPressed = usePrevious(touchState !== null, false);
  React.useEffect(() => {
    if (contained && !wasContained && somewhereWasPressed) {
      ReactNativeHapticFeedback.trigger(`impactLight`);
    }
  }, [contained, wasContained, somewhereWasPressed])

  React.useEffect(() => {
    const pressForce = 0.35;
    const justPressed = contained && force >= pressForce && prevForce < pressForce;
    const justReleased = isDown && contained && force < pressForce && prevForce >= pressForce;
    if (justPressed) {
      setIsDown(true);
      setMaxForce(force);
      ReactNativeHapticFeedback.trigger(`impactMedium`);
    } else if (justReleased) {
      setIsDown(false);
      ReactNativeHapticFeedback.trigger(`impactLight`);
    }
  }, [isDown, contained, force, prevForce, setIsDown, maxForce, setMaxForce]);

  const pressAmount = contained ? force : 0;
  return (
    <View
      ref={viewRef}
      style={[styles.view, style, {
        backgroundColor: `hsl(${isDown ? 90 : 0}, 100%, ${pressAmount * 50 + 25}%)`,
      }]}
      onLayout={handleLayout}
    >
    </View>
  );
}
