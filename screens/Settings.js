import React,{useState,useEffect} from 'react';
import { FlatList, StyleSheet, Text, Touchable, TouchableOpacity, View } from 'react-native';
import SyncStorage from 'sync-storage';


export default function Settings({navigation}) {
    var user = SyncStorage.get('currentUser');
    var isLoggedIn = SyncStorage.get('isLoggedIn');
    //console.log('user is logged in ',user,isLoggedIn);
    if(user === '' || user === undefined){
        user = 'Guest';
        isLoggedIn = false;
        //console.log("curent user in settings ",user);
    }else{
        user=user;
        isLoggedIn=true;
    }

    const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((count) => count + 1);
    }, 10);

    const unsubscribe = navigation.addListener('focus', () => {
      setCount(0);
    });

    return () => {
      clearTimeout(interval);
      unsubscribe;
    };
  }, [navigation]);
    
    function toLogin(){
        navigation.navigate('Login');
    }
    function toRegister(){
        navigation.navigate('Register');
    }
    function toCart(){
        navigation.navigate('Cart');
    }
    function toLogout(){
        SyncStorage.set('isLoggedIn',false);
        console.log('is logged in ',isLoggedIn);
        SyncStorage.set('currentUser','');
        //navigation.navigate('Home');
        
    }
    function toAdmin(){
        navigation.navigate('Admin');
    }
    function toViewOrder(){
        navigation.navigate('Orders');
    }
  return (
    <View style={styles.container}>
        
        <Text style={styles.heading}>Welcome {user},</Text>
        {isLoggedIn == false ? <View>
            <TouchableOpacity onPress={toLogin}>
            <Text style={styles.text}>Login</Text>
        </TouchableOpacity>
        <View style={styles.line}></View>
        <TouchableOpacity onPress={toRegister}>
            <Text style={styles.text}>Register</Text>
        </TouchableOpacity>
        <View style={styles.line}></View>
        </View> : 
        <View><TouchableOpacity onPress={toLogout}>
        <Text style={styles.text}>Logout</Text>
    </TouchableOpacity>
    <View style={styles.line}></View>
    <TouchableOpacity onPress={toViewOrder}>
        <Text style={styles.text}>View Orders</Text>
    </TouchableOpacity>
    <View style={styles.line}></View></View>
    }
    
    {user === "admin" ?<View>
        <TouchableOpacity onPress={toAdmin}>
            <Text style={styles.text}>Admin Page</Text>
        </TouchableOpacity>
        <View style={styles.line}></View>
        </View>:
        <View></View>}
   
        <TouchableOpacity onPress={toCart}>
            <Text style={styles.text}>View Cart</Text>
        </TouchableOpacity>
        <View style={styles.line}></View>
        
    </View>
  );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        padding:20,
        backgroundColor:'white'

    },
    heading:{
        fontSize:30,
        marginTop:30,
        marginBottom:10
        
    },
    line:{
        borderBottomColor:'#a1a1a1',
        borderBottomWidth:1
    },
    text:{
        fontSize:20,
        padding:20
      }
});

