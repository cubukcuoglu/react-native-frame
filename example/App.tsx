import "react-native-gesture-handler";

import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

import Frame from "react-native-frame";

const App = () =>
  <SafeAreaView style={styles.wrapper}>
    <Frame.Container style={styles.container}>
      <Frame.Box
        style={{ width: "100%", minWidth: 100, minHeight: 50, aspectRatio: 3 }}
        points={{
          "top": { type: "scale" },
          "right": { type: "scale" },
          "bottom": { type: "scale" },
          "left": { type: "scale" },
          "top-left": { type: "scale" },
          "bottom-left": { type: "scale" },
          "top-right": { type: "scale" },
          "bottom-right": { type: "scale" },
        }} />
    </Frame.Container>
  </SafeAreaView>

const styles = StyleSheet.create({
  wrapper: {
    flex: 1
  },
  container: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    backgroundColor: "yellow"
  }
});

export default App;
