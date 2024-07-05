// components/Menu.js
import React from 'react';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { View, Text, StyleSheet } from 'react-native';

const Menu = (props) => {
  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.container}>
        <Text style={styles.title}>Menu</Text>
        <DrawerItem
          label="Perfil"
          onPress={() => props.navigation.navigate('DashboardLideranca')}
        />
        <DrawerItem
          label="Meus Voluntários"
          onPress={() => props.navigation.navigate('ListaVoluntarios')}
        />
        <DrawerItem
          label="Lista de Cursos"
          onPress={() => props.navigation.navigate('ListaCursos')}
        />
        <DrawerItem
          label="Brigada de Apoio"
          onPress={() => props.navigation.navigate('BrigadaApoio')}
          
        />
        <DrawerItem
          label="Mapa De Resiliência Climática"
          onPress={() => props.navigation.navigate('Mapa')} />
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default Menu;
