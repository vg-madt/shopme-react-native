import React,{useState} from 'react';
import { FlatList, StyleSheet, Text, SafeAreaView,View,Button,Image} from 'react-native';
import { TextInput, TouchableOpacity,TouchableHighlight } from 'react-native-gesture-handler';
import SyncStorage from 'sync-storage';
import Constants from "expo-constants";

export default function Login({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user,setUser] = useState([]);

  const login = async () => {
    try{

      var r = await fetch(Constants.manifest.extra.URL+'/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
                  'Accept':'application/json' },
        body: JSON.stringify({
          email:email,
          password:password
        })
        
      });
      let data = await r.json();
      console.log('value ',data)
          SyncStorage.set('currentUser', data.email);
          SyncStorage.set('isLoggedIn',true);
          console.log('cuser', SyncStorage.get('currentUser'));
          navigation.navigate('Settings');
    } catch(e){
      console.log('post req error ',e);
      console.log('invalid user');
    }
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.signIn}>
      <Image style={styles.image}
      source={require('../assets/icon.png')} />
     
        <TextInput style={styles.textInput}
        placeholder='Email' 
        value={email}
        autoCapitalize='none'
        onChangeText={(email) => setEmail(email)}/>
        <TextInput style={styles.textInput}
        placeholder='Password'
        value={password}
        autoCapitalize='none'
        onChangeText={(password) => setPassword(password)}
        secureTextEntry={true}
        />
        <TouchableOpacity
        style={styles.button} onPress={login}>
          <Text style={styles.text} >Login</Text>
        </TouchableOpacity>
        <View style={styles.view}>
          <Text>Not Registered? </Text><TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.click}>Register</Text>
          </TouchableOpacity>
        </View>
        </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        marginTop:0,
        padding:90,
        alignItems:'center',
        backgroundColor:'#a0e0e0'

    },
    signIn:{
      alignItems:'center',
      marginVertical:120
    },
    textInput:{
        borderColor:'#152026',
        height:60,
        width:340,
        borderRadius:30,
        backgroundColor:'white',
        marginVertical:10,
        paddingHorizontal:30,
        alignSelf:'center'
    },
    button:{
      borderColor:'#152026',
        height:60,
        width:340,
        borderRadius:30,
        backgroundColor:'#152026',
        marginVertical:10,
        paddingHorizontal:30,
        alignItems:'center',
        justifyContent:'center',
    },
    text:{
      fontSize:20,
      color:'#EBEFF2'
    },
    view:{
      width:400,
      padding:20,
      margin:10,
      flexDirection:'row',

      justifyContent:'center'
    },
    click:{
      color:'blue'
    },
    image:{
      height:180,
      width:180,
      marginLeft:30
    }
});

