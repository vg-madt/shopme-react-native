import React,{useState,useEffect} from 'react';
import { FlatList, StyleSheet, Text,View,Modal,Alert,Pressable} from 'react-native';
import { TextInput, TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import Constants from "expo-constants";
import { useIsFocused } from '@react-navigation/native';

export default function AddCategory({ navigation }) {
    const [categories,setCategories]=useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [category,setCategory] = useState('');
    const [categoryAdd, setCategoryAdd] = useState(false)
    const [CID,setCID] = useState('')
    const [isEdit,setIsEdit] = useState(false)    

    const getCategories = async () => {
        try {
          let response = await fetch(
            Constants.manifest.extra.URL+'/category'
          );
          let data = await response.json();
        //var obj = Object.values(data);
          //console.log("json values ",data);
          setCategories(data);
          //console.log("category page ",categories)
        } catch (error) {
           console.error(error);
        }
      };

      useEffect(() => {
        getCategories();
    },[modalVisible])


    const addCategory = async () => {
        setModalVisible(!modalVisible)
        setCategoryAdd(!categoryAdd)
        console.log('adding 1',categoryAdd);
        try{
            if(isEdit==false){
            var r = await fetch( Constants.manifest.extra.URL+'/category', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json',
                        'Accept':'application/json' },
              body: JSON.stringify({
                name:category
              })
              
            });
            //console.log('adding 2');
        }else{
            var r = await fetch( Constants.manifest.extra.URL+'/category/'+CID, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json',
                          'Accept':'application/json' },
                body: JSON.stringify({
                  name:category
                })
                
              });
              let data = await r.json();
              setCategories(data);
              console.log('edit');
              
        }
            setCategory('')
            setIsEdit(false)
      
          } catch(e){
            console.log('post req error ',e);
          }
          //console.log('adding 3');

    }

    const deleteCategory = async(event) => {
        setCategoryAdd(!categoryAdd)

        try{
            var r = await fetch( Constants.manifest.extra.URL+'/category/delete/'+event._id);
            let data = await r.json();
            setCategories(data);
            //console.log("values after del ",data);
          } catch(e){
            console.log('post req error ',e);
          }
    }

    const editCategory = (event) => {
        setModalVisible(!modalVisible);
        setCategory(event.name)
        setCID(event._id)
        setIsEdit(true)
    }



    return (
      <View style={styles.container}>
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
            <Text style={styles.modalText}>Enter Category</Text>
            <TextInput style={styles.textInput}
        placeholder='Category' 
        value={category}
        onChangeText={(category) => setCategory(category)}/>
        <View style={styles.category}>
        <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={addCategory}>
              <Text style={styles.textStyle}>Add</Text>
            </TouchableOpacity>
            
            </View>
          </View>
        </View>
      </Modal>
        <Text style={styles.heading}>Category</Text>
        <FlatList 
            style={styles.flatlist}
            keyExtractor={(item,index) => item._id}
            data = {categories}
            renderItem = {itemData =>   
                <View>
                <View style={styles.category}>
        <Text style={styles.text}> {itemData.item.name}</Text>
        <TouchableOpacity onPress={() => editCategory(itemData.item)}>
        <Icon style ={styles.icon} size={25} name="edit"/>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteCategory(itemData.item)}>
        <Icon style ={styles.icon} size={25} name="trash"/>
        </TouchableOpacity>
        </View>
        <View style={styles.line}></View>
        </View>
        }
      />
      <TouchableOpacity style ={styles.add}
      onPress={()=>setModalVisible(true)}>
        <Icon size={30} color='white' name="plus"/>
        </TouchableOpacity>
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      paddingTop:50
    },
    category:{
        flexDirection:'row'
    },
    heading:{
        fontSize:26,
        fontWeight:'400',
        marginLeft:20,
        marginTop:-20,
        marginBottom:10
    },
    text:{
        paddingVertical:18,
        paddingHorizontal:20,
        height:50,
        marginVertical:5,
        width:'70%',
        backgroundColor: 'white',
        overflow: 'hidden',
        fontSize:16
    },
    icon:{
        color:'#1874CD',
        paddingVertical:18,
        paddingHorizontal:14

    },
    add:{
        backgroundColor:'#152026',
        height:60,
        width:60,
        justifyContent:'center',
        padding:18,
        marginLeft:330,
        borderRadius:35,
        marginBottom:20,
        color:'white',
    },
    flatlist:{
        alignContent:'center',
    },
    line:{
        borderBottomColor:'#a1a1a1',
        borderBottomWidth:1,
        marginHorizontal:10
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
      button: {
        borderRadius: 35,
        padding: 16,
        elevation: 2,
        width:100,
        alignItems:'center',
        margin:10
      },
      buttonClose: {
        backgroundColor: "#152026"
      },
      textInput:{
        borderColor:'#152026',
        height:60,
        width:340,
        borderRadius:30,
        backgroundColor:'#EBEFF2',
        marginVertical:10,
        paddingHorizontal:30,
        alignSelf:'center'
    },
    textStyle:{
        color:'white'
    }
  });