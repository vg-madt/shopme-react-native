import React, { useState,useEffect } from 'react';
import { FlatList, StyleSheet, Text, View,SafeAreaView,TouchableOpacity,Image, Alert} from 'react-native';
import SyncStorage from 'sync-storage';
import { useIsFocused } from "@react-navigation/native";
import { ScrollView, TextInput } from 'react-native-gesture-handler';
//import Toast from 'react-native-simple-toast';

export default function Cart({navigation}) {
  var currentUser = SyncStorage.get('currentUser');
  var cart = [];
  const[orders,setOrders]=useState([]);
  const[products,setProducts]=useState([]);
  const isFocused = useIsFocused();
  var [totalCost,setT] = useState(0);
  var [hst,setH] = useState(0);
  var [subTotal,setS] = useState(0);

  useEffect(() => {
    console.log("called");
    getOrder();
    //getProducts();
},[isFocused]);


const getOrder = async () => {
  try {
    console.log("getcart is called");
    let response = await fetch(
      'http://localhost:5000/getOrders!'+currentUser
    );
    let data = await response.json();
  var obj = Object.values(data);
  cart = obj;
  setOrders(data);
  var cartValues = Object.values(cart);
  var v = Object.values(cartValues);
  //setProducts(cart.details);
  //console.log("cart Values ",products);
    return obj;
  } catch (error) {
     console.error(error);
  }
};

  return (
    <View style={styles.container}>
        <Text style={styles.heading}>Your Orders</Text>
        <View style={styles.line}></View>
        
       <FlatList 
      style={styles.flatlist}
      keyExtractor={(item,index) => item.id.toString()}
      data = {orders}
      //extraData={isChanged}
      renderItem = {itemData =>
        <View style={styles.cart}>
            <View style={styles.head}>
            <Text style={{fontWeight:'bold'}}>Order Id: {itemData.item.id}        </Text>
            <Text style={styles.text}>Total Cost: {parseFloat(itemData.item.totalCost).toFixed(2)}</Text>
            <Text style={styles.text}>Status: {itemData.item.status}</Text>
        </View>
        <View style={styles.head}>
            <Text>Customer Name: {itemData.item.customerName}        </Text>
        </View>
        <View style={styles.head}>
            <Text>Customer Email: {itemData.item.customerEmail}        </Text>
        </View>
        <View style={styles.head}>
            <Text>Phone: {itemData.item.phoneNumber}        </Text>
        </View>
        <View style={styles.head}>
        <Text>Total Products: {itemData.item.details.length}</Text>
         </View>
         <View style={styles.head}>
        <Text>Date ordered: {itemData.item.date.split('T')[0]}</Text>
         </View>
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
      paddingTop:10
    },
    cart:{
      height:200,
      width:390,
      backgroundColor:'#dBEFF2',
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
    }

});
