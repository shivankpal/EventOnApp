'use strict';
import React, { Component } from 'react';
import { View,StatusBar,Platform,StyleSheet } from 'react-native';
export default class CustomStatusBar extends Component {
  render() {
    return (
      <View style={styles.statusBar}>
           <StatusBar barStyle="light-content" translucent backgroundColor={this.props.backgroundColor} />
      </View>
    )
  }
}
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;
const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusBar: {
    height: STATUSBAR_HEIGHT,
  },
  appBar: {
    backgroundColor:'#79B45D',
    height: APPBAR_HEIGHT,
  },
  content: {
    flex: 1,
    backgroundColor: '#33373B',
  },
});
