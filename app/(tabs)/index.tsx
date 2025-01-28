import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/context/auth.context";
import { getUserLogged } from "@/services/auth.service";
import { AuthRoutesLink } from "@/utils/enum/auth.routes";
import { router } from "expo-router";
import { SafeAreaView } from "react-native";
import useSWR, { mutate } from "swr";

export default function HomeScreen() {
  const { clearToken } = useAuth();
  const { data, error } = useSWR("/user/logged", getUserLogged, {
    revalidateOnFocus: false,
  });

  return (
    <SafeAreaView className="flex-1 mb-28">
      <Text className="text-[35px] mt-5">
        Holis {`${data?.userInfo.firstName} ${data?.userInfo.lastName}`}
      </Text>
      <Button
        onPress={() => {
          clearToken();
          mutate(() => true, undefined, { revalidate: false });

          router.replace(AuthRoutesLink.SIGN_IN);
        }}
      >
        <ButtonText>Logout</ButtonText>
      </Button>
    </SafeAreaView>
  );
}
