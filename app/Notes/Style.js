import { StyleSheet } from "react-native";
export default StyleSheet.create({
  container: {
      flex:1,
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
    flexDirection:'row',
  },
  header_center:{
     flex:1,
     justifyContent: 'center',
     alignItems: 'center',
     padding:5,
  },
  header_right:{
    justifyContent: 'center',
    padding:10,
    flexDirection:'row',
  },
  header_center_title:{
    color: 'white',
    margin: 10,
    fontSize: 16,
    fontFamily:'Roboto-Medium',
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
   borderBottomColor:'#EAEAEA',
 },
 title:{
   color: '#222',
   fontSize:16,
   fontFamily:'Roboto-Medium',
 },
 date:{
   color: '#888',
   fontSize:12,
   fontFamily:'Roboto-Regular',
 },
 description:{
   color: '#444',
   fontSize:13,
   fontFamily:'Roboto-Regular',
 },
});
