import { StyleSheet, View } from "react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Formik } from "formik";
import { validationSchemaS1 } from "@/schemas/register.schema";
import { VStack } from "@/components/ui/vstack";
import { Input } from "@/components/input/input.component";
import { accountTypes } from "@/constants/account.constants";
import { Select } from "@/components/select/select.component";
import { StepControl } from "@/components/step-controls/step-control.component";
import { useTranslation } from "react-i18next";
import { Text } from "@/components/text/text.component";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetFlatList,
  ActionsheetItem,
  ActionsheetItemText,
} from "@/components/ui/actionsheet";
import { ChevronDownIcon, SearchIcon } from "@/components/ui/icon";
import useSWR from "swr";
import { getBanks } from "@/services/bank.service";
import { API_URL } from "@/config";
import { SvgUri } from "react-native-svg";
import { Colors } from "@/constants/Colors";
import { RegisterType } from "@/utils/types/register.type";
import { updateUser } from "@/services/auth.service";
import { User, UserInfo } from "@/utils/interfaces/auth.interface";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth.context";
import { validateRut } from "@/helpers/validate-rut";
import { formatRut } from "rutlib";

type formProps = {
  payloadValues: RegisterType;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  payload: React.Dispatch<React.SetStateAction<{}>>;
  extraData: string;
  role: string;
};

export default function Step2(props: formProps) {
  const { setStep, payloadValues, extraData, payload } = props;
  const formikRef = useRef<any>(null);
  const { t } = useTranslation();
  const schema = validationSchemaS1(t);
  const [showActionsheet, setShowActionsheet] = React.useState(false);
  const [searchText, setSearchText] = useState<string>("");
  const [bankSelected, setBankSelected] = useState<{
    name: string;
    id: string;
  }>({
    name: "",
    id: "",
  });
  const [loading, setLoading] = useState(false);
  const { data } = useSWR("/banks", getBanks);
  const [rutError, setRutError] = useState("");
  const { showToast } = useToast();

  const handleInputChange = (text: string) => {
    setSearchText(text);
  };

  const filteredData = useCallback(() => {
    return data?.filter((item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [data, searchText]);

  const handleClose = ({ name, id }: { name: string; id: string }) => {
    setShowActionsheet(false);
    setBankSelected({ name, id });
    if (formikRef.current) {
      formikRef.current?.setFieldValue("bank_name", "name");
    }
    setSearchText("");
  };

  const Item: React.FC<{ title: string; image: string; id: string }> =
    useCallback(({ title, image, id }) => {
      return (
        <ActionsheetItem
          onPress={() => handleClose({ name: title, id: id })}
          className="h-12 p-2 items-center gap-2"
        >
          <SvgUri
            uri={`${API_URL.replace("/api", "/")}${image}`}
            width={40}
            height={40}
          />
          <ActionsheetItemText className="text-xl">{title}</ActionsheetItemText>
        </ActionsheetItem>
      );
    }, []);

  const handleRegisterStep2 = async (values: Partial<UserInfo>) => {
    setLoading(true);
    try {
      payload(values);
      await updateUser(extraData, values);
      setStep(3);
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

  useEffect(() => {
    if (formikRef.current) {
      formikRef.current?.setFieldValue(
        "bank_name",
        payloadValues.userInfo.bank_name.name
      );
    }
  }, []);

  return (
    <View style={styles.formulary} className="pb-4">
      <Text fontSize={16} fontWeight={400}>
        {t("signup.step_2.title", { ns: "auth" })}
      </Text>
      <Formik
        innerRef={formikRef}
        initialValues={{
          bank_account_holder: payloadValues.userInfo.bank_account_holder,
          bank_name: payloadValues.userInfo.bank_name,
          bank_account_rut: payloadValues.userInfo.bank_account_rut,
          bank_account_type: payloadValues.userInfo.bank_account_type,
          bank_account: payloadValues.userInfo.bank_account,
        }}
        validationSchema={schema}
        onSubmit={(values) => {
          if (!Boolean(rutError.length > 0)) {
            handleRegisterStep2({
              ...values,
              bank_name: {
                id: bankSelected.id || payloadValues.userInfo.bank_name.id,
                name:
                  bankSelected.name || payloadValues.userInfo.bank_name.name,
              },
            });
          }
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
          values,
          errors,
          touched,
        }) => {
          useEffect(() => {
            const formattedRUT = formatRut(values.bank_account_rut);

            setFieldValue("bank_account_rut", formattedRUT);
            if (
              values.bank_account_rut &&
              !validateRut(values.bank_account_rut)
            ) {
              setRutError(
                t("validations.signup.rut.validate", {
                  ns: "auth",
                })
              );
            } else {
              setRutError("");
            }
          }, [values.bank_account_rut, setRutError]);

          console.log(errors);

          return (
            <VStack space="md" className="mt-[32px]">
              <Input
                label={t("signup.step_2.fields.accountHolder.label", {
                  ns: "auth",
                })}
                onBlur={handleBlur("bank_account_holder")}
                onChangeText={handleChange("bank_account_holder")}
                placeholder=""
                value={values.bank_account_holder}
                error={
                  touched.bank_account_holder && errors.bank_account_holder
                }
                touched={touched.bank_account_holder}
              />

              <Input
                label={t("signup.step_2.fields.bankName.label", {
                  ns: "auth",
                })}
                onBlur={handleBlur("bank_name")}
                onChangeText={handleChange("bank_name")}
                placeholder=""
                value={
                  bankSelected.name ||
                  (payloadValues.userInfo.bank_name.name as any)
                }
                error={(touched.bank_name as any) && errors.bank_name}
                touched={touched.bank_name as any}
                editable={false}
                pressable
                onPress={() => setShowActionsheet(true)}
                icon={ChevronDownIcon}
                rightIcon
              />

              <Input
                label={t("signup.step_2.fields.accountNumber.label", {
                  ns: "auth",
                })}
                onBlur={handleBlur("bank_account")}
                onChangeText={(text) => {
                  const numericText = text.replace(/[^0-9]/g, "");
                  if (text.trim().length > 10) {
                    return;
                  }
                  handleChange("bank_account")(numericText);
                }}
                placeholder=""
                value={values.bank_account}
                error={touched.bank_account && errors.bank_account}
                touched={touched.bank_account}
                keyboardType="number-pad"
              />

              <Select
                label={t("signup.step_2.fields.accountType.label", {
                  ns: "auth",
                })}
                placeholder=""
                onSelect={handleChange("bank_account_type")}
                options={accountTypes.map((type) => ({
                  label: t(
                    `validations.step_2.bank_account_type.${type.value}`
                  ),
                  value: type.value,
                }))}
                value={
                  values.bank_account_type.length > 0
                    ? t(
                        `validations.step_2.bank_account_type.${values.bank_account_type}`
                      )
                    : ""
                }
                touched={touched.bank_account_type}
                error={touched.bank_account_type && errors.bank_account_type}
              />

              <Input
                label={t("signup.step_2.fields.rut.label", {
                  ns: "auth",
                })}
                onBlur={handleBlur("bank_account_rut")}
                onChangeText={(text) => {
                  if (text.length <= 12) {
                    handleChange("bank_account_rut")(text);
                  }
                }}
                placeholder=""
                value={values.bank_account_rut}
                error={
                  (touched.bank_account_rut && errors.bank_account_rut) ||
                  rutError
                }
                touched={touched.bank_account_rut}
                maxLength={11}
                keyboardType="numbers-and-punctuation"
              />

              <StepControl
                handleBack={() => setStep(3)}
                handleNext={handleSubmit}
                textBack={t("signup.step_2.buttons.skip", {
                  ns: "auth",
                })}
                textNext={t("signup.step_2.buttons.next", {
                  ns: "auth",
                })}
                color={Colors.GRAY}
                vertical
                loading={loading}
              />
            </VStack>
          );
        }}
      </Formik>
      <Actionsheet
        isOpen={showActionsheet}
        onClose={() => setShowActionsheet(false)}
        snapPoints={[70]}
      >
        <ActionsheetBackdrop />
        <ActionsheetContent className="pb-10">
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          <View style={styles.search_bar_container}>
            <Input
              placeholder="Buscar banco"
              label=""
              onBlur={() => {}}
              onChangeText={handleInputChange}
              className=""
              icon={SearchIcon}
              rightIcon
              size="sm"
            />
          </View>
          <ActionsheetFlatList
            data={filteredData()}
            renderItem={({ item }: any) => (
              <Item id={item.id} title={item.name} image={item.image} />
            )}
            contentContainerClassName="gap-4"
            keyExtractor={(item: any) => item.id.toString()}
          />
        </ActionsheetContent>
      </Actionsheet>
    </View>
  );
}

const styles = StyleSheet.create({
  formulary: {
    gap: 16,
    flexGrow: 1,
  },
  search_bar_container: {
    width: "100%",
    marginBottom: 24,
    marginTop: 24,
  },
});
