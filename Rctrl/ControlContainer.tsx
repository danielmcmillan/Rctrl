/**
 * ControlContainer component
 */
import React from 'react';
import {StyleSheet, View, GestureResponderEvent, StyleProp, ViewStyle} from 'react-native';
import ForceButton, {TouchState} from './ForceButton';

const styles = StyleSheet.create({
  view: {
    flex: 1,
    flexDirection: `row`,
    flexWrap: `wrap`,
  },
  button: {
    flex: 1,
    margin: 5,
  },
  column: {
    flex: 1,
    flexDirection: `column`,
  },
});

interface Props {
  style?: StyleProp<ViewStyle>;
}

export default function ControlContainer({style}: Props): JSX.Element {
  const [touchState, setTouchState] = React.useState<TouchState | null>(null);

  const handleStartShouldSetResponder = React.useCallback(() => true, []);
  const handleResponderStart = React.useCallback((event: GestureResponderEvent) => {
    const {
      pageX,
      pageY,
      force,
    } = event.nativeEvent;
    setTouchState({
      x: pageX,
      y: pageY,
      force,
    });
  }, [setTouchState]);
  const handleResponderMove = React.useCallback((event: GestureResponderEvent) => {
    const {
      pageX,
      pageY,
      force,
    } = event.nativeEvent;
    setTouchState({
      x: pageX,
      y: pageY,
      force,
    });
  }, [setTouchState]);
  const handleResponderRelease = React.useCallback(() => {
    setTouchState(null);
  }, [setTouchState]);

  return (
    <View
      style={[styles.view, style]}
      onStartShouldSetResponder={handleStartShouldSetResponder}
      onResponderStart={handleResponderStart}
      onResponderMove={handleResponderMove}
      onResponderRelease={handleResponderRelease}
      onResponderTerminate={handleResponderRelease}
    >
      <View style={styles.column}>
        <ForceButton style={styles.button} touchState={touchState} />
        <View style={styles.button} />
        <View style={styles.button} />
        <ForceButton style={styles.button} touchState={touchState} />
        <View style={styles.button} />
        <ForceButton style={styles.button} touchState={touchState} />
        <ForceButton style={styles.button} touchState={touchState} />
      </View>
      <View style={styles.column}>
        <ForceButton style={styles.button} touchState={touchState} />
        <View style={styles.button} />
        <ForceButton style={styles.button} touchState={touchState} />
        <ForceButton style={styles.button} touchState={touchState} />
        <ForceButton style={styles.button} touchState={touchState} />
        <ForceButton style={styles.button} touchState={touchState} />
        <ForceButton style={styles.button} touchState={touchState} />
      </View>
      <View style={styles.column}>
        <ForceButton style={styles.button} touchState={touchState} />
        <View style={styles.button} />
        <View style={styles.button} />
        <ForceButton style={styles.button} touchState={touchState} />
        <View style={styles.button} />
        <ForceButton style={styles.button} touchState={touchState} />
        <ForceButton style={styles.button} touchState={touchState} />
      </View>
    </View>
  );
}
