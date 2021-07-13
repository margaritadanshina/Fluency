import React, { useEffect, useState } from "react";
import {
  Text,
  SafeAreaView,
  StyleSheet,
  TextInput,
  Button,
  View,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Languages from "../languages";
import GOOGLE_CLOUD_VISION_API_KEY from "../config/environment";



const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

export default function VoiceAndTextTranslate() {
  const [text, setText] = useState("");
  const [translated, setTranslated] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("af");

  useEffect(() => {
    submitToGoogleTranslate(text)
  }, [selectedLanguage])

  const onChangeText = async (text) => {
    (text) => setText(text);
    if (text === "") {
      setTranslated("");
    }
    submitToGoogleTranslate(text);
    // console.log("text in-->", text);
  };

  const handleSubmit = () => {};

  const submitToGoogleTranslate = async (text) => {
    console.log("selected language in submitToGoogleTranslate-->", selectedLanguage)
    try {
      let body = JSON.stringify({
        target: selectedLanguage,
        q: text,
      });
      let response = await fetch(
        "https://translation.googleapis.com/language/translate/v2?key=" +
          GOOGLE_CLOUD_VISION_API_KEY,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          method: "POST",
          body: body,
        }
      );
      const initialText = await response.json();
      const initialTextParsed = await JSON.parse(JSON.stringify(initialText));
      //console.log("responseParsed-->", responseParsed);
      let result = await initialTextParsed.data.translations[0].translatedText.replace(/&quot;|&#39;/g,"'");
      setTranslated(result);
      //console.log("text in google->", text);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <DismissKeyboard>
      <SafeAreaView style={{ marginTop: 20, marginBottom: 20 }}>
        {/* <View>
          <Text style={styles.language}>Detected Language</Text>
        </View> */}
        <View style={styles.languagePicker}>
            <Picker
            
            style={{ height: 100, width: 200 }}
            onValueChange={itemValue => {
              setSelectedLanguage(itemValue)
              console.log("Item value in onValueChange??", itemValue)
              console.log("Selected language in onValueChange?", selectedLanguage)
              submitToGoogleTranslate(text)
            }}
            selectedValue={selectedLanguage}
            
            >
                {Object.keys(Languages).map((key) => {
                 return (
                 <Picker.Item key={key} label={Languages[key]} value={key} color="black"/>
                 )
                 })}
            </Picker>
        </View>

        <TextInput
        multiline
          style={styles.input}
          onChangeText={onChangeText}
          defaultValue={text}
          placeholder="Type here to translate!"
        />

        {/* <Button title="Translate" onPress={handleSubmit} /> */}
        <Text multiline style={styles.output}>{translated}</Text>
      </SafeAreaView>
    </DismissKeyboard>
  );
}
const styles = StyleSheet.create({
  input: {
    height: 200,
    margin: 12,
    borderWidth: 1,
    fontSize: 20,
    padding: 20,
  },
  output: {
    height: 350,
    margin: 12,
    borderWidth: 1,
    fontSize: 20,
    padding: 20,
  },
  language: {
    height: 50,
    margin: 12,
    borderWidth: 1,
    fontSize: 20,
    padding: 10,
    textAlign: "center",
  },
  languagePicker: {
    marginTop: -130,
    padding: 40,
    alignItems: "center",
    paddingBottom: 80
  }
});

