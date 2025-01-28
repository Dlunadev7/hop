import { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";

const usePulsingAnimation = () => {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.delay(1000),
        Animated.parallel([
          Animated.timing(scale, {
            toValue: 2,
            duration: 500,
            easing: Easing.out(Easing.exp),
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.3,
            duration: 500,
            easing: Easing.out(Easing.exp),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scale, {
            toValue: 3,
            duration: 1000,
            easing: Easing.out(Easing.exp),
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 1000,
            easing: Easing.out(Easing.exp),
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(scale, {
          toValue: 1,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );

    pulse.start();

    return () => pulse.stop();
  }, [scale, opacity]);

  return { scale, opacity };
};

const useDottedBorderAnimation = () => {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const borderPulse = Animated.loop(
      Animated.sequence([
        Animated.delay(1250),
        Animated.parallel([
          Animated.timing(scale, {
            toValue: 2,
            duration: 1000,
            easing: Easing.out(Easing.exp),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scale, {
            toValue: 2.5,
            duration: 1000,
            easing: Easing.out(Easing.exp),
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(scale, {
          toValue: 1,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );

    borderPulse.start();

    return () => borderPulse.stop();
  }, [scale]);

  return { scale };
};

export { usePulsingAnimation, useDottedBorderAnimation };
