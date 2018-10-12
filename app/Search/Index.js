'use strict';
import React, { Component } from 'react';
import { View,Alert,  Text,Image,  TouchableOpacity,  ScrollView,  ActivityIndicator,  TextInput,  Modal,  Dimensions, AsyncStorage,ViewPagerAndroid,TouchableWithoutFeedback,StatusBar  } from 'react-native';
import styles from './Style';
import Popup from './Popup';
import Info from './SudoInfo';
import {ActionConst,Actions} from 'react-native-router-flux';
import CustomStatusBar from '.././Common/CustomStatusBar';
import LinearGradient from 'react-native-linear-gradient';
import Permissions from 'react-native-permissions';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ToastAndroid from '@remobile/react-native-toast';
const imageSource = {
          search_icon: require(".././Assets/Img/head_search.png"),
          pro_icon: require(".././Assets/Img/pro_name.png"),
          arrow_left: require(".././Assets/Img/arrow_left.png"),
          home: require(".././Assets/Img/ico_home.png"),
          event_default : require(".././Assets/Img/event_default_banner.png"),
          close_icon: require(".././Assets/Img/postback_close.png"),
};
const {height, width} = Dimensions.get('window');
const extraFilter = ['All','Nearby','This Week','Popular'];
export default class Index extends Component {
    constructor(props) {
      super(props);
      this.state = {
          user:this.props.user,
          sudotopevent:this.props.sudotopevent,
          data: [],
          loading:true,
          modalVisible:false,
          visible:false,
          checked:[],
          filters:[],
          search:'',
          category:[],
      }
      this.checked = [];
      this.inputCategory = [];
      this.hidemodel = this.hidemodel.bind(this);
      this.hideShowFilter = this.hideShowFilter.bind(this);
      this.generateQuery = this.generateQuery.bind(this);
      this.page = 1;
    }
    componentWillMount() {
        setTimeout(()=>{  this.getEvents(''); },1000);
        if(this.props.deeplink)
        {
           this.setState({visible:true})
        }

    }
    nearbyquery = async () => {
      this.setState({loading:true,showload:false});
      this.setState({data:[]},() => {
          this.page = 1;
          Permissions.request('location').then(response => {
               if(response=='authorized')
               {
                   navigator.geolocation.getCurrentPosition (
                       (position) => {
                           this.getEvents('nearby=true&x='+position.coords.latitude+'&y='+position.coords.longitude);
                       },
                       (error)    => { this.setState({loading:false},()=>{ ToastAndroid.show("Sorry, we couldn't determine your location",ToastAndroid.LONG) }) },
                       {
                           enableHighAccuracy: true,
                           timeout:            20000,
                           maximumAge:         10000
                       }
                   )
             }
             else{
               this.setState({loading:false});
             }
          })
      })
    }

    getFilters = async () => {
      await fetch('https://api.eventonapp.com/api/defaultParameter/3', {
         method: 'GET'
      }).then((response) => response.json())
      .then((responseJson) => {
          this.setState({
            category: responseJson.data[0].values,
          })
      }).catch((error) => {  })
    }
    getEvents = async (query) => {
       this.setState({animating:true});
       await fetch('https://api.eventonapp.com/api/search/'+this.state.user.id+'/'+this.page+'/?'+query, {
          method: 'GET'
       }).then((response) => response.json())
       .then((responseJson) => {
            let param = true;
            if (responseJson.data.length < 15) {
                param = false;
            }
            this.setState({
              data: this.page === 1 ? responseJson.data : [...this.state.data, ...responseJson.data],
              loading: false,
              showload: param,
              animating: false,
            }, () => {
              this.page = this.page + 1;
              this.getFilters()
            })
       }).catch((error) => {  });
    }
    generateQuery = (f,search) => {
        this.setState({modalVisible:false,filters:f,search:search},() => {
          var query = 'query='+search+'&filters='+encodeURIComponent(f.join(' '));
          this.setState({data:[]},() => {
              this.page = 1;
              this.getEvents(query);
          })
        })
    }
    directSearch = (search) => {
      this.setState({loading:true});
      extraFilter.map((o,i)=>{
        this.inputCategory[o].setNativeProps({
          style: {
            backgroundColor: "transparent"
          }
        })
        this.inputCategory['TEXT'+o].setNativeProps({
          style: {
            color: "#27ccc0"
          }
        })
      })
      this.state.category.map((o,i) => {
          this.inputCategory[o.value].setNativeProps({
            style: {
              backgroundColor: "transparent"
            }
          })
          this.inputCategory['TEXT'+o.value].setNativeProps({
            style: {
              color: "#27ccc0"
            }
          })
      })
      this.inputCategory[search].setNativeProps({
        style: {
          backgroundColor: "#27ccc0"
        }
      })
      this.inputCategory['TEXT'+search].setNativeProps({
        style: {
          color: "#FFF"
        }
      })
      var query = 'filters='+encodeURIComponent(search);
      if(search=='All')
      {
          query='';
      }
      if(search=='Nearby')
      {
          this.nearbyquery();
      }
      if(search=='This Week')
      {
          query = 'thisweek=1';
      }
      if(search=='Popular')
      {
          query = 'popular=true';
      }
      this.setState({data:[]},() => {
          this.page = 1;
          if(search!='Nearby')
          {
              this.getEvents(query);
          }
      })
    }
    moveToSplash = (o) => {
      this.setState({sudotopevent:o},()=>{
          this.setState({visible:true});
      })
    }
    hidemodel = () => {
        this.setState({visible:false},()=>{
          this.getEvents();
        });
    }
    hideShowFilter = (p) => {
      this.setState({modalVisible:p});
    }
    pushBack = () => {
      this.setState({loading:true},()=>{
        this.props.navigator.pop();
      })
    }
    renderRows = () => {
      if(this.state.loading){
        return (
          <View style={[styles.box,{flex:1,justifyContent:'center',alignItems:'center'}]}>
            <ActivityIndicator
              style={styles.centering}
              color="#FFF"
              size="large"
            />
          </View>
        )
      }
      if(this.state.data.length){
          return this.state.data.map((o,i) => {
                var imgurl = imageSource.event_default;
                if(o.image_cover!='')
                {
                    imgurl = {uri:o.image_cover}
                }

               return(
                       <Image key={i} borderRadius={10} source={imgurl} style={styles.listrow} >
                             <LinearGradient
                                 start={{x: 0.5, y: 0.25}} end={{x: 0.5, y: 1}}
                                 locations={[0,1]}
                                 colors={['rgba(0,0,0,0)','rgba(0,0,0,0.9)']}
                                 style={styles.listrowtop}>
                                 <TouchableWithoutFeedback onPress={()=>{this.moveToSplash(o)}} key={i} >
                                     <View style={styles.textboxrow}>
                                         <Text style={styles.textboxtitle}>{o.title}</Text>
                                         {(o.category) ? <Text style={styles.textboxsubtext}>{o.category}</Text> :  null }
                                         { (o.str_date!='') ? <Text style={styles.textboxsubtext}>{o.str_date}</Text> : <Text style={styles.textboxsubtext}>{o.format_day}, {o.format_date}</Text>}
                                         <Text style={[styles.textboxsubtext,{marginTop:15}]}>{o.location}</Text>
                                     </View>
                                 </TouchableWithoutFeedback>
                             </LinearGradient>
                       </Image>

               )
            })
       }
       else {
         return (
            <View style={[styles.box,{justifyContent:'center',alignItems:'center',backgroundColor:'#FFF',height:300}]}>
                <Text style={{fontFamily:'Roboto-Medium',fontSize:18,color:'#666',backgroundColor:'#FFF'}}>No result for your query.</Text>
            </View>
         )
       }
    }
    moveToProfile = () => {
        this.props.navigator.push({id:'Profile', user:this.state.user, events:this.state.events });
    }
    moveToHome = () => {
      this.setState({loading:true},()=>{
          this.props.navigator.push({id:'Myhome', user:this.state.user,events:this.props.events});
      })
    }
    showAnimating = () => {
      return (
        <ActivityIndicator
          style={styles.centering}
          color="#487597"
          size="large"
        />
      )
    }
    render () {
      return (
          <View style={styles.container}>
                <CustomStatusBar backgroundColor="#292E39" barStyle="light-content"/>
                <View style={styles.header}>
                    <View style={styles.header_left}>
                      {
                        (this.props.ishome) ?
                        <TouchableOpacity style={{width:40,height:40,padding:5,justifyContent:'center',alignItems:'center'}} onPress={()=>{this.moveToHome()}}>
                            <View style={{width:30,height:30}}  onPress={()=>{this.moveToHome()}}>
                                <Image source={imageSource.home} style={{width:30,height:30}}></Image>
                            </View>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity style={{width:40,height:40,padding:5,justifyContent:'center',alignItems:'center'}} onPress={()=>{this.pushBack()}}>
                          <View style={{width:30,height:30}}  onPress={()=>{this.moveToHome()}}>
                            <Image source={imageSource.arrow_left} style={{width:30,height:30}}></Image>
                          </View>
                        </TouchableOpacity>
                      }
                    </View>
                    <View style={styles.header_center}>
                        <Text style={{color:'#FFF',fontFamily:'Roboto-Medium',fontSize:14,textAlign:'center'}} ellipsizeMode={'tail'}  numberOfLines={1}>All Events</Text>
                    </View>
                    <View style={styles.header_right}>
                      <TouchableOpacity onPress={()=>this.hideShowFilter(true)}>
                          <Image source={imageSource.search_icon} style={{width:30,height:30}}></Image>
                      </TouchableOpacity>
                    </View>
                </View>
                <View style={{flex:1}}>
                    <View style={{flexDirection:'row'}}>
                      <ScrollView removeClippedSubviews={true} horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{padding:10}}>
                            <View style={{flexDirection:'row'}}>
                            <TouchableOpacity ref={e => (this.inputCategory['All'] = e)} onPress={()=>this.directSearch('All')} style={{padding:10,margin:5,justifyContent:'center',borderRadius:5,borderWidth:1,borderColor:'#27ccc0',backgroundColor:'#27ccc0'}}><Text ref={e => (this.inputCategory['TEXTAll'] = e)} style={{color:'#FFF',fontFamily:'Roboto-Regular'}}>All</Text></TouchableOpacity>
                            <TouchableOpacity ref={e => (this.inputCategory['Nearby'] = e)} onPress={()=>this.directSearch('Nearby')} style={{padding:10,margin:5,justifyContent:'center',borderRadius:5,borderWidth:1,borderColor:'#27ccc0'}}><Text ref={e => (this.inputCategory['TEXTNearby'] = e)} style={{color:'#27ccc0',fontFamily:'Roboto-Regular'}}>Nearby</Text></TouchableOpacity>
                            <TouchableOpacity ref={e => (this.inputCategory['This Week'] = e)} onPress={()=>this.directSearch('This Week')} style={{padding:10,margin:5,justifyContent:'center',borderRadius:5,borderWidth:1,borderColor:'#27ccc0'}}><Text ref={e => (this.inputCategory['TEXTThis Week'] = e)} style={{color:'#27ccc0',fontFamily:'Roboto-Regular'}}>This Week</Text></TouchableOpacity>
                            <TouchableOpacity ref={e => (this.inputCategory['Popular'] = e)} onPress={()=>this.directSearch('Popular')} style={{padding:10,margin:5,justifyContent:'center',borderRadius:5,borderWidth:1,borderColor:'#27ccc0'}}><Text ref={e => (this.inputCategory['TEXTPopular'] = e)} style={{color:'#27ccc0',fontFamily:'Roboto-Regular'}}>Popular</Text></TouchableOpacity>
                              {
                                  this.state.category.map((o,i) => {
                                      return (
                                        <TouchableOpacity key={i} ref={e => (this.inputCategory[o.value] = e)} onPress={()=>this.directSearch(o.value)} style={{padding:10,margin:5,justifyContent:'center',borderRadius:5,borderWidth:1,borderColor:'#27ccc0'}}><Text ref={e => (this.inputCategory['TEXT'+o.value] = e)} style={{color:'#27ccc0',fontFamily:'Roboto-Regular'}}>{o.value}</Text></TouchableOpacity>
                                      )
                                  })
                              }
                            </View>
                      </ScrollView>
                    </View>
                    <ScrollView
                        removeClippedSubviews={true}
                        contentContainerStyle={{  paddingBottom: 40 }}
                    >
                          { this.renderRows() }
                          {
                            (this.state.showload && (this.state.loading == false)) ?
                              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                {
                                  (this.state.animating) ? this.showAnimating() :
                                    <TouchableOpacity style={{ backgroundColor: '#FFF', paddingHorizontal: 35, paddingVertical: 10, borderRadius: 20 }} onPress={() => this.getEvents()} >
                                      <Text style={{ textAlign: 'center', color: '#555' }}>Load More</Text>
                                    </TouchableOpacity>
                                }
                              </View>
                              :
                              null
                          }
                    </ScrollView>
                </View>
                <Modal
                    animationType={'slide'}
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => { this.setState({
                        modalVisible:!this.state.modalVisible
                    });}}
                    >
                    <Popup generateQuery={this.generateQuery} filters={this.state.filters} search={this.state.search} />
                </Modal>
                <Modal
                    animationType={'slide'}
                    transparent={true}
                    visible={this.state.visible}
                    onRequestClose={() => { this.setState({
                        visible:!this.state.visible
                      })
                    }}
                    >
                      <View style={{backgroundColor:'rgba(0,0,0,0.8)',flex:1,justifyContent:'center'}}>
                          <TouchableOpacity style={{position:'absolute',top:20,right:20,zIndex:20,padding:5}} onPress={()=>this.setState({ visible: false })}>
                            <Image source={imageSource.close_icon} style={{width:20,height:20,alignSelf:'flex-end'}}  />
                          </TouchableOpacity>
                          <KeyboardAwareScrollView keyboardShouldPersistTaps={"always"} contentContainerStyle={{justifyContent:'center',paddingTop:62}} style={{flex:1}} >
                              <Info user={this.state.user} topevent={this.state.sudotopevent} navigator={this.props.navigator} hidemodel={this.hidemodel} />
                          </KeyboardAwareScrollView>
                      </View>
                </Modal>
        </View>
      );
    }

}
