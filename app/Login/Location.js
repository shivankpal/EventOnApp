'use strict';
import React, { Component } from 'react';
import { View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  AsyncStorage,
  StyleSheet,
  StatusBar,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Animated,
  Dimensions,
  BackHandler,
  Keyboard
  } from 'react-native';
  import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
  import ToastAndroid from '@remobile/react-native-toast';
  import CustomStatusBar from '.././Common/CustomStatusBar';
  import Permissions from 'react-native-permissions';
  const imageSource = {
        search: require(".././Assets/Img/ico_search.png"),
        location: require(".././Assets/Img/detect_location.png"),
        tick: require(".././Assets/Img/pfile_tick.png"),
  };
  const {height, width} = Dimensions.get('window');
  export default class Location extends Component {
        constructor(props) {
          super(props);
          this.state = {
              user: this.props.user,
              latitude: null,
              longitude: null,
              error: null,
              text:'Detecting your location....',
              loading:false,
          }
        }
        componentDidMount() {
          this.detectYourCurrentLocation();
        }
        detectYourCurrentLocation = () => {
         Permissions.request('location').then(response => {
           if(response=='authorized')
           {
               navigator.geolocation.getCurrentPosition(
                 (position) => {
                   this.setState({
                     latitude: position.coords.latitude,
                     longitude: position.coords.longitude,
                     error: null,
                   },()=>{
                      this.getCity(position.coords.latitude, position.coords.longitude);
                   })
                 },
                 (error) => this.setState({ error: error.message }),
                 { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 },
               );
           }
          });
        }
        getCity = async (lat, long) => {
          await fetch('https://api.eventonapp.com/api/detectCity/'+lat+'/'+long, {
               method: 'GET',
            }).then((response) => response.json()).then((responseJson) => {
                  if(responseJson.status)
                  {
                      this.setState({text:responseJson.city}, () => {
                          this.setState({loading:true})
                      })
                  }
                  else
                  {
                      this.setState({text:"Couldn't not detect your location"},() => {
                          ToastAndroid.show("Couldn't not detect your location", ToastAndroid.LONG);
                      })
                  }
             });
        }
        nextToScreen = async () => {
          await fetch('https://api.eventonapp.com/api/updateLocation/'+this.state.user.id+'?city='+encodeURIComponent(this.state.text), {
               method: 'GET',
            }).then((response) => response.json()).then((responseJson) => {
                  if(responseJson.status)
                  {
                      AsyncStorage.setItem('USER', JSON.stringify(responseJson.data.user),()=>{
                            if(responseJson.data.myevents.length > 0){
                                AsyncStorage.setItem('MYEVENTS', JSON.stringify(responseJson.data.myevents));
                            }
                            setTimeout(()=>{
                              this.props.navigator.resetTo({ id: 'Connect'  });
                            },300)
                      })
                  }
                  else{
                      this.setState({text:"Couldn't not detect your location"},() => {
                          ToastAndroid.show("Couldn't not detect your location", ToastAndroid.LONG)
                      })
                  }
             });
        }
        render(){
            return (
            <View style={{backgroundColor:'#292E39',flex:1}}>
              <CustomStatusBar backgroundColor="#292E39" barStyle="light-content"/>
                <View style={styles.header}>
                    <View style={styles.header_left}>
                        <View style={{width:50,height:25}}></View>
                    </View>
                    <View style={styles.header_center}>
                        <Text style={{color:'#FFF',fontFamily:'Roboto-Medium',fontSize:14,textAlign:'center'}} >Location</Text>
                    </View>
                    <View style={styles.header_right}>
                        { (this.state.loading) ? <TouchableOpacity onPress={()=> this.nextToScreen() }><Text style={{textAlign:'center',color:'#9c9fa6',fontFamily:'Roboto-Regular',width:50}}>Next >></Text></TouchableOpacity> : <View style={{width:50,height:25}}></View> }
                    </View>
                </View>
              <GooglePlacesAutocomplete
                placeholder={this.state.text}
                minLength={2} // minimum length of text to search
                autoFocus={false}
                returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                listViewDisplayed='false'    // true/false/undefined
                fetchDetails={true}
                renderDescription={(row) => row.description} // custom description render
                onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                  this.setState({text: data.description,loading:true})
                }}
                getDefaultValue = {() => {
                  return ''; // text input default value
                }}
                query={{
                  key: 'AIzaSyB1pX0Xsyn6qe1Z2Gi3HRuQvxWfGLJqtDg',
                  language: 'en', // language of the results
                  types: '(cities)', // default: 'geocode'
                }}
                styles={{
                  description: {
                    fontFamily: 'Roboto-Regular',
                    color:'#EAEAEA',
                  },
                  predefinedPlacesDescription: {
                    color: '#9c9fa6',
                  },
                  container:{
                    backgroundColor:'#292E39',
                    flex:1,
                  },
                  textInputContainer:{
                    backgroundColor:'#292E39',
                    alignItems:'center',
                    justifyContent:'center',
                  },
                  textInput:{
                    backgroundColor:'#292E39',
                    color:'#9c9fa6',
                    marginTop:0,
                    height:40,
                  },
                  separator:{
                    //borderWidth:0
                  }
                }}
                currentLocation={false} // Will add a 'Current location' button at the top of the predefined places list
                currentLocationLabel={"currentLocation"}
                filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
                debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
                renderLeftButton={() => <Image source={imageSource.search} style={{width:25,height:25,marginRight:-10}}/> }
                renderRightButton={() => <TouchableOpacity onPress={()=>this.detectYourCurrentLocation()} style={{padding:5}}><Image source={imageSource.location} style={{width:30,height:30}}/></TouchableOpacity> }
              />
            </View>
            )
        }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#FFF',
  },
  form:{
    margin:20
  },
  label:{
    fontFamily:'Roboto-Regular',
    color:'#888',
  },
  header:{
     height:50,
     flexDirection:'row',
     alignItems:'center',
     borderBottomWidth:1,
     borderColor:'#363a4f'
  },
  header_left:{
    justifyContent: 'center',
    padding:10,
  },
  header_center:{
     flex:1,
     justifyContent: 'center',
     alignItems: 'center',
  },
  header_right:{
    justifyContent: 'center',
    padding:10,
    flexDirection:'row',
  },
  header_center_title:{
    color: 'white',
    fontSize: 16,
    fontFamily:'Roboto-Medium',
  }

});
