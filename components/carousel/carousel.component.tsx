import { Colors } from "@/constants/Colors";
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import Swiper from "react-native-swiper";
import { LinearGradient } from "../linear-gradient/LinearGradient";
import {
  ArrowLeftRounded,
  Hop,
  Onboarding1,
  Onboarding2,
  OnboardingHopper,
  OnboardingHoppy,
} from "@/assets/svg";
import { Text } from "../text/text.component";
import { VStack } from "../ui/vstack";
import { Box } from "../ui/box";
import { HStack } from "../ui/hstack";
import { Button } from "../button/button.component";
import { Animated } from "react-native";
import {
  useDottedBorderAnimation,
  usePulsingAnimation,
} from "@/hooks/animation.hook";
import { useTranslation } from "react-i18next";
import { i18NextType } from "@/utils/types/i18n.type";
import { router } from "expo-router";
import { AuthRoutesLink } from "@/utils/enum/auth.routes";
import { Fab, FabIcon } from "../ui/fab";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const PulsingEffect = () => {
  const { scale, opacity } = usePulsingAnimation();
  return (
    <Animated.View
      style={{
        position: "absolute",
        top: 28,
        left: 48,
        width: 60,
        height: 60,
        backgroundColor: Colors.PRIMARY,
        borderRadius: 100,
        transform: [{ scale }],
        opacity,
        zIndex: -1,
      }}
    />
  );
};

const DottedBorderEffect = () => {
  const { scale } = useDottedBorderAnimation();

  return (
    <Animated.View
      style={{
        position: "absolute",
        top: 28,
        left: 48,
        width: 60,
        height: 60,
        borderWidth: 2,
        borderColor: Colors.PRIMARY,
        borderStyle: "dotted",
        borderRadius: 100,
        transform: [{ scale }],
        zIndex: -2,
      }}
    />
  );
};

const FirstItemCarousel = () => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient locations={[0, 0.3]}>
      <Fab
        placement="top left"
        onPress={() => router.back()}
        className="bg-[#E1F5F3] w-[24px] h-[24px]"
        style={{
          marginTop: insets.top,
        }}
      >
        <FabIcon as={ArrowLeftRounded} width={30} />
      </Fab>
      <Box className="flex-1 items-center pt-6">
        <Hop color={Colors.SECONDARY} />
        <VStack space="lg" className="items-center mt-[32px] mb-[48px]">
          <Text textColor={Colors.DARK_GREEN} fontSize={28} fontWeight={600}>
            {t("onboarding.first_item_carousel.welcome_title")}
          </Text>
          <Text fontSize={16} fontWeight={400} textAlign="center">
            {t("onboarding.first_item_carousel.welcome_text")}{" "}
            <Text fontWeight={600} fontSize={16}>
              {t("onboarding.first_item_carousel.hopper")}
            </Text>
          </Text>
        </VStack>
        <Onboarding1 />
        <Box className="mt-[48px]">
          <Text textAlign="center" fontWeight={400}>
            {t("onboarding.first_item_carousel.hoppers_description")}
          </Text>
        </Box>
      </Box>
    </LinearGradient>
  );
};

const SecondItemCarousel = () => {
  const { t } = useTranslation();

  const insets = useSafeAreaInsets();

  return (
    <LinearGradient locations={[0, 0.3]}>
      <Fab
        placement="top left"
        onPress={() => router.back()}
        className="bg-[#E1F5F3] w-[24px] h-[24px]"
        style={{
          marginTop: insets.top,
        }}
      >
        <FabIcon as={ArrowLeftRounded} width={30} />
      </Fab>
      <Box className="flex-1 items-center pt-6">
        <Hop color={Colors.SECONDARY} />
        <VStack space="lg" className="items-center mt-[32px] mb-[48px]">
          <Text textColor={Colors.DARK_GREEN} fontSize={28} fontWeight={600}>
            {t("onboarding.second_item_carousel.welcome_title")}
          </Text>
          <Text fontSize={16} fontWeight={400} textAlign="center">
            {t("onboarding.second_item_carousel.welcome_text")}{" "}
            <Text fontWeight={600} fontSize={16}>
              {t("onboarding.first_item_carousel.hoppy")}
            </Text>
          </Text>
        </VStack>
        <Onboarding2 />
        <Box className="mt-[48px]">
          <Text textAlign="center" fontWeight={400}>
            {t("onboarding.second_item_carousel.hoppers_description")}
          </Text>
        </Box>
      </Box>
    </LinearGradient>
  );
};

const ThirdItemCarousel = () => {
  const { t } = useTranslation();

  const insets = useSafeAreaInsets();

  return (
    <LinearGradient locations={[0, 0.3]}>
      <Fab
        placement="top left"
        onPress={() => router.back()}
        className="bg-[#E1F5F3] w-[24px] h-[24px]"
        style={{
          marginTop: insets.top,
        }}
      >
        <FabIcon as={ArrowLeftRounded} width={30} />
      </Fab>
      <Box className="flex-1 items-center pt-[24px]">
        <Hop color={Colors.SECONDARY} />
        <VStack space="lg" className="items-center mt-[32px] mb-[48px]">
          <Text
            textColor={Colors.DARK_GREEN}
            fontSize={28}
            fontWeight={600}
            textAlign="center"
          >
            {t("onboarding.third_item_carousel.welcome_title")}
          </Text>
          <Text fontSize={16} fontWeight={400} textAlign="center">
            {t("onboarding.third_item_carousel.welcome_text")}
          </Text>
        </VStack>
        <HStack className="items-center justify-center gap-3">
          <VStack className="items-center w-[45%] pt-[18px]">
            <PulsingEffect />
            <DottedBorderEffect />
            <OnboardingHoppy />
            <Button
              style={styles.button}
              onPress={() =>
                router.push({
                  pathname: AuthRoutesLink.SIGN_UP,
                  params: { user_type: "hoppy" },
                })
              }
            >
              {t("onboarding.third_item_carousel.register_as_hoppy")}
            </Button>
          </VStack>
          <VStack className="items-center w-[45%] pt-[18px]">
            <PulsingEffect />
            <DottedBorderEffect />
            <OnboardingHopper />
            <Button
              style={styles.button}
              onPress={() =>
                router.push({
                  pathname: AuthRoutesLink.SIGN_UP,
                  params: { user_type: "hopper" },
                })
              }
            >
              {t("onboarding.third_item_carousel.register_as_hopper")}
            </Button>
          </VStack>
        </HStack>
      </Box>
    </LinearGradient>
  );
};

export const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalSlides = 3;

  const handleIndexChanged = (index: number) => {
    if (index < totalSlides) {
      setCurrentIndex(index);
    }
  };

  return (
    <Swiper
      dotColor="#999"
      activeDotColor="#fff"
      dotStyle={styles.dot}
      activeDotStyle={styles.activeDot}
      onIndexChanged={handleIndexChanged}
      loop={false}
      scrollEnabled={true}
    >
      <FirstItemCarousel />
      <SecondItemCarousel />
      <ThirdItemCarousel />
    </Swiper>
  );
};

const styles = StyleSheet.create({
  slide: {
    flex: 1,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 20,
    backgroundColor: Colors.PRIMARY,
  },
  activeDot: {
    width: 50,
    height: 14,
    borderRadius: 20,
    backgroundColor: Colors.SECONDARY,
  },
  button: {
    marginTop: 64,
    width: "100%",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
