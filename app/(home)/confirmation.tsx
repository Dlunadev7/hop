import { StyleSheet, View, Animated, Easing } from "react-native";
import React, { useEffect, useRef } from "react";
import { VStack } from "@/components/ui/vstack";
import { LinearGradient } from "@/components";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/button/button.component";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Text } from "@/components/text/text.component";
import { Round } from "@/assets/svg";
import { scaleSize } from "@/helpers/scale-size";
import { useRoute } from "@react-navigation/native";

export default function Confirmation() {
  const params = useRoute().params as {
    commission: number;
    title: string;
    subtitle: string;
  };
  const { t } = useTranslation();
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startAnimation = () => {
      rotation.setValue(0);
      Animated.timing(rotation, {
        toValue: 1,
        duration: 5000,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => startAnimation());
    };

    startAnimation();

    return () => rotation.stopAnimation();
  }, [rotation]);

  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const animatedStyle = {
    transform: [{ rotate: rotateInterpolate }],
  };

  return (
    <LinearGradient>
      <View style={styles.container}>
        <VStack space="lg" className="items-center mb-9">
          <Text
            fontSize={28}
            fontWeight={600}
            textColor={Colors.DARK_GREEN}
            textAlign="center"
          >
            {params.title}
          </Text>
          <Text fontSize={20} fontWeight={400} textAlign="center">
            {params.subtitle}
          </Text>
        </VStack>

        <View style={styles.centerContainer}>
          <View style={styles.middleElement}>
            <Text fontSize={32} textColor={Colors.DARK_GREEN} fontWeight={600}>
              ${" "}
              {params.commission ? Number(params?.commission)?.toFixed(2) : "1"}
            </Text>
          </View>

          <Animated.View style={[animatedStyle]}>
            <Round width={scaleSize(300)} height={scaleSize(300)} />
          </Animated.View>
        </View>

        <VStack space="lg" className="mt-28 w-full">
          <Button
            onPress={() => {
              router.replace({
                pathname: "/(tabs)/wallet",
                params: { step: 4 },
              });
            }}
            stretch
          >
            {t("home.confirmation.go_payments", { ns: "home" })}
          </Button>
          <Button
            onPress={() => {
              router.replace({
                pathname: "/(tabs)",
                params: { step: 4 },
              });
              router.dismissAll();
            }}
            type="ghost"
          >
            {t("home.confirmation.go_home", { ns: "home" })}
          </Button>
        </VStack>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    flexGrow: 1,
    alignItems: "center",
  },
  centerContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 48,
  },
  middleElement: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    backgroundColor: Colors.PRIMARY,
    borderColor: Colors.SECONDARY,
    borderWidth: 6,
    borderRadius: 12,
    paddingHorizontal: 36,
    paddingVertical: 16,
    minWidth: scaleSize(160),
  },
  middleText: {
    fontSize: 32,
    fontWeight: 600,
    color: Colors.DARK_GREEN,
  },
});
