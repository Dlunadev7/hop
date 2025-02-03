import { Notification } from "@/assets/svg";
import {
  Balance,
  TakeABooking,
  Container,
  Header,
  Services,
  Booking,
} from "@/components";
import { Button } from "@/components/button/button.component";
import { KeyboardContainer } from "@/components/keyboard/keyboard.component";
import { VStack } from "@/components/ui/vstack";
import { useAuth } from "@/context/auth.context";
import capitalizeWords from "@/helpers/capitalize-words";
import { getUserLogged } from "@/services/auth.service";
import { router, useNavigation } from "expo-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import useSWR from "swr";

export default function HomeScreen() {
  const navigator = useNavigation();
  const { t } = useTranslation();
  const { token } = useAuth();
  const { data, error } = useSWR("/user/logged", getUserLogged, {
    revalidateOnFocus: true,
  });

  useEffect(() => {
    navigator.setOptions({
      header: () => (
        <Header
          title={`${t("home.header", { ns: "home" })} ${capitalizeWords(
            data?.userInfo.firstName || ""
          )}!`}
          icon={<Notification />}
          onPressIcon={() => router.push("/notification")}
        />
      ),
    });
  }, [navigator, data]);

  return (
    <Container>
      <KeyboardContainer>
        <VStack className="mt-4">
          <Balance />
          <TakeABooking />
          <Services />
          <Booking />
        </VStack>
      </KeyboardContainer>
    </Container>
  );
}
