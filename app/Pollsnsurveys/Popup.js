'use strict';
import React, { Component } from 'react';
import { View,  Text,  ScrollView,  ActivityIndicator, TouchableOpacity, Modal, Image, Dimensions  } from 'react-native';
import styles from './Style';
var {height, width} = Dimensions.get('window');
const imageSource = {
          votes_icon : require(".././Assets/Img/polls_votes.png"),
          time_icon : require(".././Assets/Img/polls_time.png"),
          close_icon: require(".././Assets/Img/postback_close.png"),
};
export default class Index extends Component {
    constructor(props) {
      super(props);
      this.state = {   popdata:this.props.popdata }
    }
    render() {
      var data = '';
      return (
              <View style={{width:width-60,padding:10}}>
                  <View style={{padding:3}}>
                      <Text style={[styles.textf,{fontSize:16}]}>{this.state.popdata.poll_question}</Text>
                  </View>
                  <View style={{padding:5,paddingLeft:10,flexDirection:'row'}}>
                      <View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
                            <Image source={imageSource.votes_icon} style={{width:15,height:15,marginRight:10}}/>
                            <Text style={styles.textf}>{this.state.popdata.total_votes}</Text>
                      </View>
                      <View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
                            <Image source={imageSource.time_icon} style={{width:15,height:15,marginRight:10}}/>
                            <Text style={styles.textf}>{this.state.popdata.ago}</Text>
                      </View>
                  </View>
                  <View style={{flexDirection:'column',marginBottom:10,marginTop:10}}>
                    <ScrollView style={{maxHeight:height-250}}>
                        {
                          this.state.popdata.answers.map((o,i) => {
                              return (
                                  <TouchableOpacity key={i} onPress={()=>this.props.savePoll(this.state.popdata.id,o.id)} style={{backgroundColor:'#F1F5F8',padding:15,justifyContent:'center',alignItems:'center',borderWidth:1,borderColor:'#EAEAEA'}}>
                                        <Text style={[styles.textf,{color:'#333'}]}>{o.answer}</Text>
                                  </TouchableOpacity>
                              )
                          })
                        }
                    </ScrollView>
                  </View>
            </View>

      )
    }
}
