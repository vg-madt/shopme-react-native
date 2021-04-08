import React, { useState,useEffect } from 'react';
import { FlatList, StyleSheet, Text, View,SafeAreaView,TouchableOpacity,Image, Alert,Modal} from 'react-native';
import SyncStorage from 'sync-storage';
import { useIsFocused } from "@react-navigation/native";
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import {SearchBar} from 'react-native-elements';
import Constants from "expo-constants";

export default function EditOrder({navigation}) {
  var currentUser = SyncStorage.get('currentUser');
  const [searchVal, setSearchVal] = useState('');
  const[orders,setOrders]=useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const isFocused = useIsFocused();
  const [chosenOrder, setChosenOrder] = useState({})
  var colors = ['#fffcb0','#ccfff8','#d5ffcc','#ffe9cc','#ffbcb0']
  var statuses = ["Ordered","Shipped","Completed","Delivered","Payment Pending","Cancelled"]


  useEffect(() => {
    console.log("called");
    getOrder();
},[isFocused]);

const handleSearch = () => {
  console.log('product searched ',searchVal);

  if(searchVal!= ''){
    
  getSearchedCustomers();
  }else{
    getOrder()
  }
}
useEffect(() => {
  getSearchedCustomers();
},[searchVal]);

const getSearchedCustomers = async () => {
  try {
    if(searchVal!==''){
    let response = await fetch(
      Constants.manifest.extra.URL+'/order/search/'+searchVal
    );
    let data = await response.json();
    console.log("searched products",data);
    setOrders(data);
    }
  } catch (error) {
     console.error(error);
  }
};

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

const chooseStatus = async(item) => {
    setModalVisible(!modalVisible)
    setChosenOrder(item)

}
const getChosenStatus= async(status) => {
    setModalVisible(!modalVisible)
    console.log("stsus ",status)
    chosenOrder.status = status
    //console.log("chosen order details updated ",chosenOrder)
    try {
      let response = await fetch(
        Constants.manifest.extra.URL+'/order/'+chosenOrder._id, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json',
                    'Accept':'application/json' },
          body: JSON.stringify({
            status:chosenOrder.status
          })
          
        });
      let data = await response.json();
      console.log("changed order ",data)
    
    } catch (error) {
       console.error(error);
    }
}
const getOrder = async () => {
  try {
    //console.log("getorder is called");
    let response = await fetch(
      Constants.manifest.extra.URL+'/order'
    );
    let data = await response.json();
  //cart = obj;
  setOrders(data);

  } catch (error) {
     console.error(error);
  }
};

  return (
    <View style={styles.container}>
      <View>
        <SearchBar
         style={styles.search}
        placeholder="Search Customer"
        darkTheme={true}
        value={searchVal}
        onChangeText={(value) => {setSearchVal(value); handleSearch(value);}}/>
        </View>

<Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
          <View style={styles.container}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Choose Status</Text>
            <FlatList 
            style={styles.flatlist}
            keyExtractor={(item,index) => index.toString()}
            data = {statuses}
            renderItem = {itemData =>   
                <View>
                <TouchableOpacity
                onPress={() => getChosenStatus(itemData.item)}>
        <Text style={styles.status}> {itemData.item}</Text>
        </TouchableOpacity>
        <View style={styles.line}></View>
        </View>
        }/>          
        </View>
        </View>
</Modal>

        <Text style={styles.heading}>Customer Orders</Text>
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
             <TouchableOpacity
             onPress={() => chooseStatus(itemData.item)}>
            <Text style={{textAlign:'center'}}>Status: {itemData.item.status}</Text>
            </TouchableOpacity>
            </View>}
        </View>}/>
    </View>
    
  );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        //paddingStart:10,
        paddingTop:10,
        backgroundColor:'white',
        height:'100%',
        width:'100%'
        //marginTop:20

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
      marginLeft:10,
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
    search:{
      flex:1,
  },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
      },
      modalText: {
        marginBottom: 15,
        textAlign: "center"
      },
      heading:{
        fontSize:26,
        fontWeight:'400',
        marginLeft:20,
        marginTop:20,
        marginBottom:10
    },
    line:{
        borderBottomColor:'#a1a1a1',
        borderBottomWidth:1,
        marginHorizontal:10
    },
    flatlist:{
        width:'100%',
    },
    status:{
        padding:20,
        textAlign:'center'
    }

});
