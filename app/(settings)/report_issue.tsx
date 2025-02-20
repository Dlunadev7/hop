import React, { useEffect, useState } from "react";
import { router, useNavigation } from "expo-router";
import { Container, Header, Input } from "@/components";
import { useTranslation } from "react-i18next";
import { Text } from "@/components/text/text.component";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/button/button.component";
import { ActivityIndicator, View } from "react-native";
import { InfoCircle } from "@/assets/svg";
import { HStack } from "@/components/ui/hstack";
import { createReport } from "@/services/report.service";
import { useToast } from "@/hooks/use-toast";
import { getUserLogged } from "@/services/auth.service";
import useSWR from "swr";
import * as Yup from "yup";
import { Formik } from "formik";
import { i18NextType } from "@/utils/types/i18n.type";
import { Colors } from "@/constants/Colors";

const validationSchema = (t: i18NextType) =>
  Yup.object().shape({
    issueDescription: Yup.string().required(
      t("settings.field_required", { ns: "utils" })
    ),
  });

export default function ReportIssue() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { showToast } = useToast();
  const { data } = useSWR("user/logged", getUserLogged);
  const [loading, setLoading] = useState(false);
  const schema = validationSchema(t);

  useEffect(() => {
    navigation.setOptions({
      header: () => (
        <Header
          title={t("settings.report_issue", { ns: "utils" })}
          arrow
          onPressArrow={() => router.back()}
        />
      ),
    });
  }, [navigation]);

  const handleSubmitReport = async ({
    issueDescription,
  }: {
    issueDescription: string;
  }) => {
    setLoading(true);

    try {
      await createReport({
        content: issueDescription,
        user: {
          id: data?.id!,
        },
      });

      router.back();
    } catch (error) {
      showToast({
        message: t("server_error", { ns: "utils" }),
        action: "error",
        duration: 3000,
        placement: "bottom",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Formik
      initialValues={{ issueDescription: "" }}
      validationSchema={schema}
      onSubmit={(values) => handleSubmitReport(values)}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
      }) => (
        <Container extraHeight>
          <View className="flex-1 justify-between">
            <Box className="mt-8">
              <Input
                label=""
                onBlur={handleBlur("issueDescription")}
                onChangeText={handleChange("issueDescription")}
                value={values.issueDescription}
                placeholder={t("settings.issue_describe", { ns: "utils" })}
                style={{
                  height: 200,
                  paddingTop: 12,
                }}
                multiline
                error={touched.issueDescription && errors.issueDescription}
                touched={touched.issueDescription}
              />
              <HStack className="gap-2 items-start mt-4">
                <InfoCircle />
                <Text className="w-[90%]">
                  {t("settings.issue_info", { ns: "utils" })}
                </Text>
              </HStack>
            </Box>
            <Button onPress={() => handleSubmit()} stretch disabled={loading}>
              {loading ? (
                <ActivityIndicator color={Colors.WHITE} />
              ) : (
                t("send", { ns: "utils" })
              )}
            </Button>
          </View>
        </Container>
      )}
    </Formik>
  );
}
