import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import TelaLogin from './telas/TelaLogin';
import TelaCadastro from './telas/TelaCadastro';
import DashboardLideranca from './telas/DashboardLideranca';
import ListaVoluntarios from './telas/ListaVoluntarios';
import ListaCursos from './telas/ListaCursos';
import BrigadaApoio from './telas/BrigadaApoio';
import DashboardVoluntario from './telas/DashboardVoluntario';
import CursosDisponiveis from './telas/CursosDisponiveis';
import CursosConcluidos from './telas/CursosConcluidos';
import DetalhesVoluntario from './telas/DetalhesVoluntario';
import Menu from './components/Menu';
import Mapa from './telas/Mapa';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const DrawerNavigator = () => (
  <Drawer.Navigator initialRouteName="DashboardLideranca" drawerContent={(props) => <Menu {...props} />}>
    <Drawer.Screen name="DashboardLideranca" component={DashboardLideranca} options={{ title: 'Dashboard Liderança' }} />
    <Drawer.Screen name="ListaVoluntarios" component={ListaVoluntarios} options={{ title: 'Lista de Voluntários' }} />
    <Drawer.Screen name="ListaCursos" component={ListaCursos} options={{ title: 'Lista de Cursos' }} />
    <Drawer.Screen name="BrigadaApoio" component={BrigadaApoio} options={{ title: 'Brigada de Apoio' }} />
    <Drawer.Screen name="Mapa" component={Mapa} options={{ title: 'Mapa' }} />

  </Drawer.Navigator>
);

const VoluntarioNavigator = () => (
  <Stack.Navigator initialRouteName="DashboardVoluntario">
    <Stack.Screen name="DashboardVoluntario" component={DashboardVoluntario} options={{ title: 'Dashboard Voluntário' }} />
    <Stack.Screen name="CursosDisponiveis" component={CursosDisponiveis} options={{ title: 'Cursos Disponíveis' }} />
    <Stack.Screen name="CursosConcluidos" component={CursosConcluidos} options={{ title: 'Cursos Concluídos' }} />
    <Stack.Screen name="BrigadaApoio" component={BrigadaApoio} options={{ title: 'Brigada de Apoio' }} />
    <Stack.Screen name="Mapa" component={Mapa} options={{ title: 'Mapa' }} />
  </Stack.Navigator>
);

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLeader, setIsLeader] = useState(false);

  useEffect(() => {
    // Simulação de estado de autenticação
    setIsLoggedIn(false); // Ajuste isso conforme sua lógica de autenticação
    setIsLeader(false); // Ajuste isso conforme sua lógica de autenticação
  }, []);

  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="TelaLogin">
          
          <Stack.Screen name="TelaLogin" component={TelaLogin} />
          <Stack.Screen name="TelaCadastro" component={TelaCadastro} />
          <Stack.Screen name="DrawerNavigator" component={DrawerNavigator} />
          <Stack.Screen name="VoluntarioNavigator" component={VoluntarioNavigator} />
          <Stack.Screen name="DetalhesVoluntario" component={DetalhesVoluntario} options={{ title: 'Detalhes do Voluntário' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;
