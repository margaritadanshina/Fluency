import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  Alert,
  StyleSheet,
} from "react-native";
import { Camera } from "expo-camera";
import { Picker } from "@react-native-picker/picker";
import Languages from "../languages";
import styles from "./styles";
import GOOGLE_CLOUD_VISION_API_KEY from "../config/environment";

var photo;
var output;
var translatedText;
var detectedSourceLang;

export default function App({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  // const [detectedSourceLang, setDetectedSourceLang] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("af");

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const createTwoButtonAlert = (output) =>
    Alert.alert("Hey! Below, is this the text you want translated?", output, [
      {
        text: "No! Re-take",
        onPress: () => setPreviewVisible(false),
        style: "cancel",
      },
      {
        text: "Yes, translate",
        onPress: async () => {
          {
            await submitToGoogleTranslate();
            handleTranslatePress(output, translatedText);
          }
          setPreviewVisible(false);
        },
      },
    ]);

  const takePicture = async () => {
    if (!camera) return;
    const options = {
      base64: true,
    };
    photo = await camera.takePictureAsync(options);
    setCapturedImage(photo);
    setPreviewVisible(true);
    submitToGoogleVision();
  };

  const submitToGoogleVision = async () => {
    try {
      let body = JSON.stringify({
        requests: [
          {
            features: [{ type: "DOCUMENT_TEXT_DETECTION", maxResults: 5 }],
            image: {
              content: photo.base64,
            },
          },
        ],
      });
      let response = await fetch(
        "https://vision.googleapis.com/v1/images:annotate?key=" +
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
      const capturedText = await response.json();
      const capturedTextParsed = JSON.parse(JSON.stringify(capturedText));
      output = capturedTextParsed.responses[0].fullTextAnnotation.text.replace(
        /&quot;|&#39;/g,
        "'"
      );
      detectedSourceLang =
        capturedTextParsed.responses[0].textAnnotations[0].locale;
      console.log("detected source language: ", detectedSourceLang);
      createTwoButtonAlert(output);
    } catch (error) {
      console.log(error);
    }
  };

  const submitToGoogleTranslate = async () => {
    console.log("Selected language", selectedLanguage);
    try {
      let body = JSON.stringify({
        target: selectedLanguage,
        q: output,
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
      const text = await response.json();
      // console.log("JSON before parsing -->", text)
      const textParsed = await JSON.parse(JSON.stringify(text));
      // console.log("parsed response -->", responseParsed)
      // translatedText = await responseParsed.data.translations[0].translatedText;
      translatedText = textParsed.data.translations[0].translatedText;
      // replace(/&quot;|&#39;/g,"'")
    } catch (error) {
      console.error(error);
    }
  };

  const handleTranslatePress = (output, translatedText) => {
    submitToGoogleTranslate(output);
    // console.log("detected source!!!-->", detectedSourceLang)
    // console.log("selected lang in handleTranslatePress!!!-->", selectedLanguage)
    let prop = { output, translatedText, detectedSourceLang, selectedLanguage };
    navigation.navigate("Camera Translation", prop);
  };

  return (
    <View style={styles.mainView}>
      {previewVisible ? (
        <ImageBackground
          source={{ uri: capturedImage && capturedImage.uri }}
          style={styles.capturedImage}
        ></ImageBackground>
      ) : (
        <Camera
          style={{ flex: 1 }}
          type={type}
          ref={(ref) => {
            camera = ref;
          }}
        >
          <View style={styles.cameraView}>
            <TouchableOpacity
              style={styles.cameraType}
              onPress={() => {
                setType(
                  type === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back
                );
              }}
            >
              <Text style={styles.textFlip}> Flip </Text>
            </TouchableOpacity>

            <View style={styles.languagePicker}>
              <Text style={styles.chooseLanguage}>Choose Language</Text>
              <View style={styles.pickerHolder}></View>
              <Picker
                selectedValue={selectedLanguage}
                style={styles.camerajsPicker}
                onValueChange={(itemValue) => setSelectedLanguage(itemValue)}
              >
                {Object.keys(Languages).map((key) => {
                  return (
                    <Picker.Item
                      key={key}
                      label={Languages[key]}
                      value={key}
                      color="white"
                    />
                  );
                })}
              </Picker>
            </View>
            <View style={styles.generalView}>
              <View style={styles.alignmentView}>
                <TouchableOpacity
                  onPress={takePicture}
                  style={styles.takePicture}
                />
              </View>
            </View>
          </View>
        </Camera>
      )}
    </View>
  );
}
