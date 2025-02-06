import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { SWRConfig } from "swr";
import { useColorScheme } from "@/hooks/useColorScheme";
import { AppState, AppStateStatus } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { initializeI18next } from "@/i18n/i18next";
import { getLocales } from "expo-localization";
import { AuthProvider } from "@/context/auth.context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DrawerProvider } from "@/context/drawer.context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as Notifications from "expo-notifications";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [token, setToken] = useState<{
    token: string;
    refreshToken: string;
  } | null>({
    token: "",
    refreshToken: "",
  });

  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    "Outfit-Black": require("../assets/fonts/Outfit-Black.ttf"),
    "Outfit-Bold": require("../assets/fonts/Outfit-Bold.ttf"),
    "Outfit-ExtraBold": require("../assets/fonts/Outfit-ExtraBold.ttf"),
    "Outfit-ExtraLight": require("../assets/fonts/Outfit-ExtraLight.ttf"),
    "Outfit-Light": require("../assets/fonts/Outfit-Light.ttf"),
    "Outfit-Medium": require("../assets/fonts/Outfit-Medium.ttf"),
    "Outfit-Regular": require("../assets/fonts/Outfit-Regular.ttf"),
    "Outfit-Thin": require("../assets/fonts/Outfit-Thin.ttf"),
    "Outfit-SemiBold": require("../assets/fonts/Outfit-SemiBold.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    const language = getLocales()[0].languageCode;

    const setupI18n = async () => {
      await initializeI18next(language ?? "es");
    };

    const loadToken = async () => {
      const token: { token: string; refreshToken: string } =
        (await AsyncStorage.getItem("auth_token")) as unknown as {
          token: string;
          refreshToken: string;
        };
      setToken(token || null);
    };

    loadToken();
    setupI18n();
  }, []);

  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });

    const response = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("🔔 Notificación recibida:", notification);
      }
    );

    const responseSubscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        try {
          console.log("🔔 Notificación tocada:", response);
        } catch (error) {
          console.error(
            "❌ Error al manejar la respuesta de la notificación:",
            error
          );
        }
      });

    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("Notificación recibida:", notification);
      }
    );

    return () => {
      subscription.remove();
      responseSubscription.remove();
      response.remove();
    };
  }, []);

  // useEffect(() => {
  //   sendTestNotification();
  // }, []);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <SWRConfig
        value={{
          provider: () => new Map(),
          isVisible: () => {
            return true;
          },
          initFocus(callback) {
            let appState = AppState.currentState;

            const onAppStateChange = (nextAppState: AppStateStatus) => {
              if (
                appState.match(/inactive|background/) &&
                nextAppState === "active"
              ) {
                callback();
              }
              appState = nextAppState;
            };

            const subscription = AppState.addEventListener(
              "change",
              onAppStateChange
            );

            return () => {
              subscription.remove();
            };
          },
          initReconnect(callback) {
            const unsubscribe = NetInfo.addEventListener((state) => {
              if (state.isConnected && state.isInternetReachable) {
                callback();
              }
            });

            return () => {
              unsubscribe();
            };
          },
        }}
      >
        <GestureHandlerRootView>
          <GluestackUIProvider mode="light">
            <DrawerProvider>
              <Stack
                screenOptions={{
                  headerShown: false,
                }}
              >
                {Boolean(token?.token) ? (
                  <Stack.Screen
                    name="(tabs)"
                    options={{ headerShown: false }}
                  />
                ) : (
                  <Stack.Screen
                    name="(auth)"
                    options={{ headerShown: false }}
                  />
                )}
                <Stack.Screen name="+not-found" />
                <Stack.Screen name="error" />
              </Stack>
              <StatusBar style="auto" />
            </DrawerProvider>
          </GluestackUIProvider>
        </GestureHandlerRootView>
      </SWRConfig>
    </AuthProvider>
  );
}
