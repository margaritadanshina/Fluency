import React, { useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import Tooltip from "react-native-walkthrough-tooltip";

import { Camera } from "react-native-feather";

//expo install @expo-google-fonts/cedarville-cursive
import {
  useFonts,
  CedarvilleCursive_400Regular,
} from "@expo-google-fonts/cedarville-cursive";

function HomeScreen({ navigation }) {
  const [screenTooltip, setScreenTooltip] = useState(false);

  let [fontsLoaded, error] = useFonts({
    CedarvilleCursive_400Regular,
  });

  if (!fontsLoaded) {
    return <ActivityIndicator />;
  }

  const handleCameraPress = () => {
    navigation.navigate("Camera");
  };
  const handleTranslatePress = () => {
    navigation.navigate("Translate");
  };
  const handleNavBarPress = () => {
    navigation.navigate("NavBar");
  };

  return (
    <ImageBackground
      source={require("../assets/homescreen.jpg")}
      style={styles.background}
    >
      <View style={styles.topView}>
        <View style={styles.HelpButton}>
          <TouchableOpacity
            onPress={() => {
              setScreenTooltip(true);
            }}
          >
            <MaterialIcons name="help" size={35} color="#032D38" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.middleView}>
        <Text
          style={{
            //marginTop: 15,
            fontSize: 25,
            fontFamily: "CedarvilleCursive_400Regular",
            textAlign: "center",
          }}
        >
          welcome to
        </Text>
        <Text
          style={{
            fontSize: 55,
            fontWeight: "bold",
            textAlign: "center",
            fontFamily: "CedarvilleCursive_400Regular",
          }}
        >
          Fluency
        </Text>
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/homegif2.gif")}
            style={styles.logo}
          />
        </View>
      </View>

      <View style={styles.mainBox}>
        <View style={styles.CameraButton}>
          <Camera
            onPress={handleCameraPress}
            stroke="black"
            width={60}
            height={60}
          >
            Camera
          </Camera>
        </View>

        <View style={styles.TextButton}>
          <Text
            onPress={handleTranslatePress}
            style={{
              fontSize: 23,
              fontWeight: "bold",
            }}
          >
            Translate
          </Text>
        </View>
      </View>
      <View style={styles.tooltipView}>
        <Tooltip
          isVisible={screenTooltip}
          content={
            <View>
              <Text style={styles.Tooltip}>
                Welcome to{" "}
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    textAlign: "center",
                    fontFamily: "CedarvilleCursive_400Regular",
                  }}
                >
                  {" "}
                  Fluency{" "}
                </Text>
                , the place for all of your translation needs!
              </Text>

              <Text style={styles.Tooltip}>
                You can click the camera icon to capture text from any image to
                translate.
              </Text>

              <Text style={styles.Tooltip}>
                You can also click the "Translate" button to type your desired
                text for translation. After your text is translated, you can
                also have it read to you.
              </Text>

              <Text style={styles.Tooltip}>
                You can translate up to 100 lines of text at once!
              </Text>

              <Text style={styles.Tooltip}>
                Start by clicking either the camera icon or the "Translate"
                button!
              </Text>
            </View>
          }
          onClose={() => {
            setScreenTooltip(false);
          }}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  topView: {
    //10
    height: "10%",
    paddingTop: "5%",
    paddingRight: "5%",
    alignSelf: "flex-end",
  },
  middleView: {
    //50
    height: "50%",
    top: 15,
  },
  mainBox: {
    //30
    opacity: 0.8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    height: "40%",
  },

  CameraButton: {
    width: 130,
    height: 130,
    backgroundColor: "#DD8138",
    marginRight: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  TextButton: {
    width: 130,
    height: 130,
    backgroundColor: "#439654",
    marginLeft: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 200,
    height: 200,
  },
  logoContainer: {
    alignItems: "center",
    width: 300,
    height: 300,
    // position: "relative",
    // opacity: 0.8,
    // backgroundColor: "#FFF4EB",
    // borderRadius: 10,
  },
  HelpButton: {
    alignSelf: "flex-end",
    //marginTop: 10,
    //marginBottom: 40,
  },
  tooptipView: {
    borderColor: "pink",
  },
  Tooltip: {
    fontSize: 16,
    fontWeight: "bold",
    lineHeight: 30,
    paddingBottom: 12,
    //padding: "3%",
    fontFamily: "Georgia",
  },
  tooltipView: {
    borderColor: "pink",
  },
});

export default HomeScreen;
