import { StatusBar } from 'expo-status-bar';
import React, { useState,useEffect } from 'react';
import { FlatList,Button, StyleSheet, Text, View,SafeAreaView, TouchableOpacity, Image } from 'react-native';
//import dress from '../assets/dress'
import Icon from 'react-native-vector-icons/FontAwesome';
import SyncStorage from 'sync-storage';
import { useIsFocused } from "@react-navigation/native";

export default function ProductList(props) {
  const prods = props.products;
  var currentUser = SyncStorage.get('currentUser');
  var isLoggedIn = SyncStorage.get('isLoggedIn');
  const isFocused = useIsFocused();
  useEffect(() => {
    console.log("called");
    getCart();
}, [props, isFocused]);

  if(currentUser === '' || currentUser === undefined){
    currentUser = 'Guest';
    isLoggedIn = false;
    console.log("curent user in home ",currentUser);
}else{
    currentUser=currentUser;
    isLoggedIn=true;
}
  var cart = [];
  const[products,setProducts]=useState([]);
  var [totalCost,setT] = useState(0.0);
  var [hst,setH] = useState(0.0);
  var [subTotal,setS] = useState(0.0);
  
  useEffect(() => {
    console.log('current user in getCart ',currentUser);
    getCart();
},[]);
  const getCart = async () => {
    try {
      console.log("getcart is called");
      let response = await fetch(
        'http://localhost:5000/getCart.action&'+currentUser
      );
      let data = await response.json();
    var obj = Object.values(data);
    cart = data;
    console.log("cart ",data);
    if (cart === undefined) {
      console.log("cart is undefined")
      setProducts([]);
      setT(0.0);
      setS(0.0);
      setH(0.0);
  }else if(cart.products.length==0){
    console.log("cart products is empty");
    setProducts([]);
    setT(0.0);
    setS(0.0);
    setH(0.0);

  }else if(cart.products.length>0){
    console.log("cart has items")
    setProducts(cart.products)
    setT(cart.totalCost);
    setS(cart.subTotal);
    setH(cart.hst);
    console.log(totalCost,subTotal);
  }
      return obj;
    } catch (error) {
       console.error(error);
    }
  };
  const addToCart = async (product) => {
    //getCart();
    //currentUser = SyncStorage.get('currentUser');
    products.push(product);
    subTotal += parseFloat(product.price);
    console.log("subtotal: ",subTotal);
    cart.subTotal = subTotal;
    hst += parseFloat(product.price)*0.13;
    cart.hst = hst;
    totalCost=(subTotal+hst);
    console.log("hst -> ",hst);
    console.log("total cost -> ",totalCost);
    cart.totalCost = totalCost;
    try{
      console.log("add to cart is called ",cart);
      var r = await fetch('http://localhost:5000/addCart.action&'+currentUser, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
                  'Accept':'application/json' },
        body: JSON.stringify({
          products:products,
          totalCost:totalCost,
          hst:hst,
          subTotal:subTotal
        })
        
      });
      let data = await r.json();
      console.log('value ',data);
    } catch(e){
      console.log('post req error ',e);
      console.log('invalid user');
    }
  }
  return (
    <SafeAreaView style={styles.container}>
       <View> 
       <FlatList 
      style={styles.flatlist}
      keyExtractor={(item,index) => item.id.toString()}
      data = {prods}
      //extraData={isChanged}
      renderItem = {itemData =>
        <View>
        <TouchableOpacity style={styles.shadow}>
          <Image style={styles.image} source={{uri:'http://localhost:5000/getImage.action-'+itemData.item.id}}/>          
          </TouchableOpacity>
        
        <View>
        <Text style={styles.text}> {itemData.item.name}</Text>
        </View>
        <View style ={styles.cart}>
          <Text style={styles.price}>CA${itemData.item.price}</Text>
        </View>
        <TouchableOpacity style={styles.icon} onPress={() => addToCart(itemData.item)}>
        <Icon name="cart-plus" size={40} color="#152026"/>
        <Text>Add to Cart</Text>
        </TouchableOpacity>
        </View>}/>
     </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection:'row',
    backgroundColor: '#fff',
    marginTop:30,
    justifyContent:'center',
    width:'100%'
  },
  cart:{
    flexDirection:'row',
    marginLeft:14
  },
  text:{
      paddingTop:18,
      width:300,
      fontSize:16,
      marginBottom:10,
      marginLeft:10
  },
  price:{
    fontSize:16,
    fontWeight:'bold'
  },
  icon:{
    marginTop:-54,
    marginLeft:180,
    alignItems:'center'
  },
  image:{
    height:280,
    width:280,
    borderRadius:30,
    marginLeft:10,
    marginTop:20
  },
  shadow:{

    shadowColor: "#000",
    shadowOffset: {
        width: 2,
        height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 1,
  },
  flatlist:{
      alignContent:'center',
  }
});
