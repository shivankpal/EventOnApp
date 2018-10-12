import { StyleSheet } from "react-native";
export default StyleSheet.create({
  container: {
      flex:1,
      backgroundColor:'#292E39'
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
    height:50,
    padding:10,
  },
  header_center:{
     flex:1,
     justifyContent: 'center',
     alignItems: 'center',
  },
  header_right:{
    justifyContent: 'center',
    height:50,
    padding:10,
  },
  header_center_title:{
    color:'#FFF',
    fontFamily:'Roboto-Medium',
    fontSize:18,
    textAlign:'center'
  },
  centering: {
   alignItems: 'center',
   justifyContent: 'center',
   padding: 8,
 },
 content:{
   flex:1,
   alignItems:'center'
 },
 rowEdit:{
   flexDirection:'row',
   marginBottom:3,
 },
 icon:{
   width:15,
   height:15,
   marginRight:5,
 },
 title:{
   color: '#FFF',
   fontSize:18,
   fontFamily:'Roboto-Regular',
 },
 subtitle_pos:{
   color: '#CCC',
   fontSize:10,
   fontFamily:'Roboto-Medium',
 },
 subtitle_loc:{
   color: '#CCC',
   fontSize:12,
   fontFamily:'Roboto-Thin',
 },
 prof:{
   color: '#9c9fa6',
   fontSize:14,
   fontFamily:'Roboto-Regular',
 },
 edit:{
    paddingHorizontal:10,
    paddingVertical:5,
    borderRadius:5,
 },
 btntext:{
    color:'#EAEAEA',
    fontFamily:'Roboto-Regular',
    fontSize:12,
 }
});
