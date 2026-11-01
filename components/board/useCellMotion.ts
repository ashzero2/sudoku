import { useEffect, useRef } from 'react';
import {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

interface CellMotionInput {
  isSelected: boolean;
  isGiven: boolean;
  value: number;
  isConflict: boolean;
}

/**
 * Three short cues on the UI thread: the selected cell pops, a newly entered digit fades in,
 * and a digit that turns out wrong shakes. None run when reduced motion is on.
 */
export function useCellMotion({ isSelected, isGiven, value, isConflict }: CellMotionInput) {
  const reduceMotion = useReducedMotion();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const shake = useSharedValue(0);
  const previous = useRef({ value, isConflict });

  useEffect(() => {
    if (isSelected && !reduceMotion) {
      scale.set(withSequence(withTiming(1.08, { duration: 80 }), withTiming(1, { duration: 100 })));
    }
  }, [isSelected, reduceMotion, scale]);

  useEffect(() => {
    const before = previous.current;
    previous.current = { value, isConflict };
    if (reduceMotion) return;

    if (!isGiven && value !== 0 && before.value !== value) {
      opacity.set(0);
      opacity.set(withTiming(1, { duration: 150 }));
    }
    if (isConflict && !before.isConflict) {
      shake.set(
        withSequence(
          withTiming(-4, { duration: 40 }),
          withTiming(4, { duration: 60 }),
          withTiming(-3, { duration: 60 }),
          withTiming(0, { duration: 40 }),
        ),
      );
    }
  }, [isGiven, value, isConflict, reduceMotion, opacity, shake]);

  return useAnimatedStyle(() => ({
    opacity: opacity.get(),
    transform: [{ translateX: shake.get() }, { scale: scale.get() }],
  }));
}
