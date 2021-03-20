import React,{useState} from 'react';
import { FlatList, StyleSheet, Text, SafeAreaView,View,Button,Image,ToastAndroid} from 'react-native';
import { TextInput, TouchableOpacity,TouchableHighlight } from 'react-native-gesture-handler';

export default function Register({navigation}) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password,setPassword] = useState('');

  var custo;
  const showToast = () => {
    ToastAndroid.show("Registered", ToastAndroid.SHORT);
  };

  function register(){

    try{
      var r = fetch('http://localhost:5000/register.action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
                  'Accept':'application/json' },
        body: JSON.stringify({
          name:name,
          email:email,
          password:password
        })
        
      });
      console.log('result ',r);
      //showToast();
      navigation.navigate('Login');

    } catch(e){
      console.log('post req error ',e);
    }
  }
  

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.signIn}>
      <Image style={styles.image}
      source={require('../assets/icon.png')} />
     
     <TextInput style={styles.textInput}
        placeholder='Name'
        value={name}
        
        onChangeText={(name) => setName(name)}/>
        <TextInput style={styles.textInput}
        value={email}
        placeholder='Email'
        autoCapitalize='none'
        onChangeText={(email) => setEmail(email)}/>
        <TextInput style={styles.textInput}
        placeholder='Password'
        value={password}
        secureTextEntry={true}
        onChangeText={(password) => setPassword(password)}
        />
        <TouchableOpacity
        style={styles.button} onPress={register}>
          <Text style={styles.text}>Register</Text>
        </TouchableOpacity>
        <View style={styles.view}>
          <Text>Already Registered? </Text><TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.click}>Login</Text>
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
      marginVertical:100
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

