import * as React from 'react';
import { Button, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import AddCategory from "./AddCategory"
import AddProduct from "./AddProduct"
import EditOrder from "./EditOrder"



function NotificationsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.goBack()} title="Go back home" />
    </View>
  );
}


const Drawer = createDrawerNavigator();

export default function Admin() {
  return (
    <NavigationContainer independent={true}>
      <Drawer.Navigator initialRouteName="AddCategory">
        <Drawer.Screen name="Add Category" component={AddCategory} />
        <Drawer.Screen name="Add Product" component={AddProduct} />
        <Drawer.Screen name="View Orders" component={EditOrder} />
        <Drawer.Screen name="View Stats" component={NotificationsScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}