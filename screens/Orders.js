import React, { useState,useEffect } from 'react';
import { FlatList, StyleSheet, Text, View,SafeAreaView,TouchableOpacity,Image, Alert} from 'react-native';
import SyncStorage from 'sync-storage';
import { useIsFocused } from "@react-navigation/native";
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import Constants from "expo-constants";

export default function Order({navigation}) {
  var currentUser = SyncStorage.get('currentUser');
  var cart = [];
  const[orders,setOrders]=useState([]);
  const[products,setProducts]=useState([]);
  const isFocused = useIsFocused();
  const [chosenOrder, setChosenOrder] = useState({})
  var colors = ['#fffcb0','#ccfff8','#d5ffcc','#ffe9cc','#ffbcb0']
  var index = 0

  useEffect(() => {
    console.log("called");
    getOrder();
},[isFocused]);

function bgcolor(item){
  switch(item){
    case "Ordered":
      return colors[0]
    case "Shipped":
      return colors[1]
      break;
      case "Completed":
        case "Delivered":
        return colors[2]
        break;
        case "Payment Pending":
          return colors[3]
          break;
          case "Cancelled":
            return colors[4]
      break;
  }
}
const getOrder = async () => {
  try {
    //console.log("getorder is called");
    let response = await fetch(
      Constants.manifest.extra.URL+'/order/'+currentUser
    );
    let data = await response.json();
  //cart = obj;
  setOrders(data);

  } catch (error) {
     console.error(error);
  }
};

const cancelOrder = async(item) => {
 item.status = "Cancelled"
 setChosenOrder(item)
  try{
    let response = await fetch(
      Constants.manifest.extra.URL+'/order/'+item._id, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json',
                  'Accept':'application/json' },
        body: JSON.stringify({
          status:"Cancelled"
        })
        
      });
    let data = await response.json();
    console.log("changed order ",data)
  }catch(e){
    console.error(e);
  }
}

  return (
    <View style={styles.container}>
        <Text style={styles.heading}>Your Orders</Text>
        <View style={styles.line}></View>
        
       <FlatList 
      style={styles.flatlist}
      keyExtractor={(item,index) => item._id}
      data = {orders}
      //extraData={isChanged}
      renderItem = {itemData =>
        <View style={styles.cart}>
            <Text style={{fontWeight:'bold'}}>Order Id: {itemData.item._id}</Text>
            <View style={styles.head}>    
            <Text>Total Cost: ${parseFloat(itemData.item.totalcost).toFixed(2)}</Text>
            </View>
           
        <View style={styles.head}>
            <Text>Name: {itemData.item.name}        </Text>
        </View>
        <View style={styles.head}>
            <Text>Email: {itemData.item.email}        </Text>
        </View>
        <View style={styles.head}>
            <Text>Phone: {itemData.item.phonenumber}        </Text>
        </View>
        <View style={styles.head}>
        <Text>Total Products: {itemData.item.products.length}</Text>
         </View>
         <View style={styles.head}>
        <Text>Date ordered: {itemData.item.date.split('T')[0]}</Text>
         </View>
         {<View style={{backgroundColor: bgcolor(itemData.item.status),borderRadius:30,height:40,padding:10,marginTop:10}}>
            <Text style={{textAlign:'center'}}>Status: {itemData.item.status}</Text>
            </View>}
           {itemData.item.status==="Ordered" || itemData.item.status ==="Payment Pending" ? <View style={styles.button}>
             <TouchableOpacity
             onPress={() => cancelOrder(itemData.item)}>
            <Text style={{textAlign:'center',color:'white'}}>Cancel</Text>
            </TouchableOpacity></View>:<View></View>} 
        </View>}/>
    </View>
    
  );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        paddingStart:10,
        paddingTop:10,
        backgroundColor:'white',
        height:'100%'

    },
    heading:{
        fontSize:30,
        marginTop:30,
        marginBottom:10
        
    },
    line:{
        borderBottomColor:'#a1a1a1',
        borderBottomWidth:1,
        marginBottom:20,
        marginRight:10
    },
    head:{
      flexDirection:'row',
      paddingTop:10,
    },
    cart:{
      height:250,
      width:390,
      backgroundColor:'#ededed',
      padding:10,
      marginTop:10,
      borderRadius:10
    },
    text:{
      paddingLeft:10,
      flex:1,
      //alignContent:'flex-end'
    },
    p:{
        marginTop:5
    },
    button:{
      height:40,width:100,justifyContent:'center',alignContent:'center',
      backgroundColor:'#ff5757',
      borderRadius:35,
      marginTop:-100,
      marginLeft:260,
      padding:10
    }

});
