import { StyleSheet,Dimensions } from "react-native";
var {height, width} = Dimensions.get('window');
export default StyleSheet.create({
  container: {
      flex:1,
      backgroundColor:'#292E39'
  },
  header:{
     height:50,
     flexDirection:'row',
     backgroundColor:'transparent',
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
  },
  header_center_title:{
    color: 'white',
    margin: 10,
    fontSize: 16,
    fontFamily:'Roboto-Medium',
  },
  listrow:{
    margin:10,
    backgroundColor:'#FFF',
    borderRadius:10,
    height:225,
    width:width-20,
  },
  listrowtop:{
    flex:1,
    borderRadius:10,
  },
  textboxrow:{
    flex:1,
    flexDirection:'column',
    padding:20,
    justifyContent:'flex-end'
  },
  textboxtitle:{
    fontSize:16,
    fontFamily:'Roboto-Medium',
    color:'#EAEAEA',
    backgroundColor:'transparent',
  },
  textboxsubtext:{
    fontSize:12,
    fontFamily:'Roboto-Regular',
    color:'#CCC',
    backgroundColor:'transparent',
  },
  centering: {
   alignItems: 'center',
   justifyContent: 'center',
   padding: 8,
 },
 box: {
    margin:20,
    borderRadius:10,
 },
 row:{
   marginRight:10,
   marginLeft:10,
   paddingTop:10,
   paddingBottom:10,
   borderBottomWidth:1,
   borderBottomColor:'#EAEAEA'
 },
 title:{
   color: '#222',
   fontSize:14,
   fontFamily:'Roboto-Regular',
 },
 comtext:{
   color: '#666',
   fontSize:12,
   fontFamily:'Roboto-Regular',
   flex:1,
 },
fil_header:{
    padding:10,
    backgroundColor:'#CCC',
    borderBottomColor:'#EAEAEA',
    borderBottomWidth:1,
    flexDirection:'row',
    alignItems:'center'
},
fil_headerText:{
  color: '#555',
  fontSize:12,
  fontFamily:'Roboto-Regular',
  flex:1,
},
fil_content:{
  maxHeight:height-385,
},
fil_row:{
  borderBottomColor:'#EAEAEA',
  borderBottomWidth:1,
  padding:10,
  justifyContent:'center',
  flexDirection:'row'
},
fil_row_text:{
  color: '#666',
  fontSize:12,
  fontFamily:'Roboto-Regular',
  flex:1,
},
fil_row_tick:{
  alignSelf:'flex-end',
  color:'#CCC',
},
popup:{
    flex:1,
    backgroundColor:'rgba(0,0,0,0.5)',
    justifyContent:'center',
    alignItems:'center',
},
popupin: {
    margin:20,
    backgroundColor:'#FFF',
    height:height-60,
    borderRadius:10,
},
textbox:{
  flexDirection:'row',
  alignItems:'center',
  padding:10,
  height:60,

},
textinput:{
  height:40,
  borderWidth:0.3,
  marginLeft:2,
  borderColor:'#999',
  backgroundColor:'#f0f0f0',
  fontFamily:'Roboto-Regular',
  marginRight:5,
  flex:1,
  borderRadius:5,
},
fil_title:{
  padding:15,
  backgroundColor:'#6699FF',
  borderTopLeftRadius:10,
  borderTopRightRadius:10,
},
fil_title_text:{
  fontFamily:'Roboto-Medium',
  fontSize:15,
  color:'#EAEAEA'
},
popbox:{
  marginTop:5,
  marginBottom:5,
  width:width-40,
},

limage:{
  width:80,
  height:80,
  justifyContent:'center',
  alignItems:'center',
  marginRight:10,
},
limagetag:{
  width:70,
  height:70,
  borderRadius:70,
}
});
