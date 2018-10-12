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
   flexDirection:'row'
 },
 right:{
    padding:10,
    backgroundColor:'rgba(0,0,0,0.5)'

 },
 title:{
   color: '#FFF',
   fontSize:14,
   fontFamily:'Roboto-Medium',
 },
 date:{
   color: '#FFF',
   fontSize:11,
   fontFamily:'Roboto-Regular',
 },
});
