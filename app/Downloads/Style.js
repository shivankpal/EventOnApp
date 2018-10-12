import { StyleSheet,Dimensions } from "react-native";
export default StyleSheet.create({
  container: {
      flex:1,
  },
  centering: {
   alignItems: 'center',
   justifyContent: 'center',
   padding: 8,
 },
 box: {
    margin:20,
    borderRadius:10,
    backgroundColor:'#FFF'
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
 date:{
   color: '#666',
   fontSize:12,
   fontFamily:'Roboto-Regular',
   flex:1,
 },
 description:{
   color: '#666',
   fontSize:12,
   fontFamily:'Roboto-Regular',
   flex:1,
 },
});
