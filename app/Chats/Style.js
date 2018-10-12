import { StyleSheet } from "react-native";
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
    margin:10,
    borderRadius:10,
    backgroundColor:'#FFF',
 },
 row:{
   marginRight:10,
   marginLeft:10,
   paddingTop:10,
   paddingBottom:10,
   borderBottomWidth:1,
   borderBottomColor:'#EAEAEA',
   flexDirection:'row',
 },
 left:{
   width:80,
 },
 right:{
   flex:1,
 },
 title:{
   color: '#222',
   fontSize:14,
   fontFamily:'Roboto-Bold',
 },
 date:{
   color: '#666',
   fontSize:12,
   fontFamily:'Roboto-Regular',
 },
 description:{
   color: '#666',
   fontSize:12,
   marginTop:5,
   fontFamily:'Roboto-Regular',
 },
});
