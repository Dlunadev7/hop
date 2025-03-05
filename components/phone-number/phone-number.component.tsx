import { View, StyleSheet, Pressable } from "react-native";
import React, { useCallback, useState } from "react";
import useAllCountries from "@/hooks/use-get-countries.hook";
import Input from "../input/input.component";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetFlatList,
  ActionsheetItem,
  ActionsheetItemText,
} from "../ui/actionsheet";
import { SvgUri } from "react-native-svg";
import { SearchIcon } from "../ui/icon";
import { Text } from "../text/text.component";
import { Colors } from "@/constants/Colors";
import { Image } from "react-native";

export const PhoneNumber = (props: any) => {
  const {
    value,
    error,
    onBlur,
    onChangeText,
    placeholder,
    phoneNumber,
    handleChangeCode,
  } = props;
  const { countries } = useAllCountries();
  const [showActionsheet, setShowActionsheet] = useState(false);
  const [searchText, setSearchText] = useState<string>("");
  const [countryCodeSelected, setCountryCodeSelected] = useState(phoneNumber);
  const parsedCountries = countries.map((country) => ({
    label: country.name,
    value: country.codeNumber,
    image: country.flag,
    id: country.codeNumber,
  }));

  const handleInputChange = (text: string) => {
    setSearchText(text);
  };

  const filteredData = useCallback(() => {
    return parsedCountries?.filter(
      (item) =>
        item.label.toLowerCase().includes(searchText.toLowerCase()) ||
        item.value.includes(searchText)
    );
  }, [parsedCountries, searchText]);

  const handleClose = (number: string) => {
    setShowActionsheet(false);
    setCountryCodeSelected(number);
    handleChangeCode(number);
    setSearchText("");
  };

  console.log(countries);

  const Item: React.FC<{ title: string; image: string; id: string }> =
    useCallback((value) => {
      return (
        <ActionsheetItem
          onPress={() => handleClose(value.id)}
          className="h-12 p-2 items-center gap-4"
        >
          <View className="w-10 h-10">
            <SvgUri uri={value?.image} width={40} height={40} />
          </View>
          <Text textColor={Colors.BLACK}>{value.title}</Text>
        </ActionsheetItem>
      );
    }, []);

  return (
    <>
      <Input
        label={"Contacto"}
        onBlur={onBlur}
        onChangeText={onChangeText}
        placeholder={placeholder}
        value={value}
        error={error}
        custom={
          <Pressable
            style={{
              height: 40,
              borderEndWidth: 1,
              borderColor: Colors.PRIMARY,
              minWidth: 40,
            }}
            className="items-center justify-center pr-3"
            onPress={() => setShowActionsheet(true)}
          >
            <Text fontWeight={400}>{countryCodeSelected}</Text>
          </Pressable>
        }
        leftIcon
        touched={false}
        {...props}
      />
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
              placeholder="Search..."
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
              <Item id={item.id} title={item.value} image={item.image} />
            )}
            contentContainerClassName="gap-4"
            keyExtractor={(item: any) => item.id.toString()}
          />
        </ActionsheetContent>
      </Actionsheet>
    </>
  );
};

const styles = StyleSheet.create({
  search_bar_container: {
    width: "100%",
    marginBottom: 24,
    marginTop: 24,
  },
});
