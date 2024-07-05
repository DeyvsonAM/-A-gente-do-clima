import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { Avatar, Card, Paragraph, Button, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';

const db = getFirestore();
const auth = getAuth();

const DashboardVoluntario = () => {
  const navigation = useNavigation();
  const [voluntario, setVoluntario] = useState({
    nome: 'Carregando...',
    cpf: 'Carregando...',
    xp: 0,
    medalhas: 0,
    foto: 'https://via.placeholder.com/150',
    cursosDisponiveis: [],
    cursosConcluidos: []
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const userDocRef = doc(db, "usuarios", auth.currentUser.uid);
        try {
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setVoluntario({
              nome: data.nome || 'Nome não disponível',
              email: data.email || 'Email não disponível',
              cpf: data.cpf || 'CPF não disponível',
              dataNascimento: data.dataNascimento || 'Data de nascimento não disponível',
              foto: data.foto || 'https://via.placeholder.com/150',
              cursosDisponiveis: data.cursosDisponiveis || [],
              cursosConcluidos: data.cursosConcluidos || []
            });
          } else {
            console.log("Documento não encontrado!");
          }
        } catch (error) {
          console.error("Erro ao buscar dados do usuário: ", error);
        }
      } else {
        console.log("Nenhum usuário está logado.");
      }
    };

    fetchUserData();
  }, []);

  const navigateToCursosDisponiveis = () => {
    navigation.navigate('CursosDisponiveis', { cursos: voluntario.cursosDisponiveis });
  };

  const navigateToCursosConcluidos = () => {
    navigation.navigate('CursosConcluidos', { cursos: voluntario.cursosConcluidos });
  };

  const navigateToChatEmGrupo = () => {
    navigation.navigate('BrigadaApoio');
  };

  const navigateToMapa = () => {
    navigation.navigate('Mapa');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.profileCard}>
        <View style={styles.profileContent}>
          <Avatar.Image size={150} source={{ uri: voluntario.foto }} style={styles.foto} />
          <IconButton 
            icon={() => <Icon name="users" size={24} color="#666" />} 
            onPress={navigateToChatEmGrupo} 
            style={styles.settingsIcon}
          />
          <Text style={styles.nome}>{voluntario.nome}</Text>
          <Text style={styles.textoInfo}>CPF: {voluntario.cpf}</Text>
          <Paragraph style={styles.textoInfo}>Nível de XP: {voluntario.xp}</Paragraph>
        </View>
      </Card>

      <Button 
        mode="contained" 
        onPress={navigateToCursosDisponiveis} 
        style={[styles.cursosButton, { backgroundColor: '#31ACC4' }]}
        labelStyle={styles.sectionTitle}
      >
        Cursos Disponíveis
      </Button>
        
      <Button 
        mode="contained" 
        onPress={navigateToCursosConcluidos} 
        style={[styles.cursosButton, { backgroundColor: '#F09400' }]}
        labelStyle={styles.sectionTitle}
      >
        Cursos Concluídos
      </Button>
      
      <Button 
        mode="contained" 
        onPress={navigateToMapa} 
        style={[styles.cursosButton, { backgroundColor: '#4CAF50' }]}
        labelStyle={styles.sectionTitle}
        icon={() => <Icon name="map" size={20} color="#FFF" style={styles.mapIcon} />}
      >
        Mapa de Resiliência Climática
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#FEF2E4', // Fundo neutro da paleta
  },
  profileCard: {
    width: '90%',
    marginBottom: 20,
    borderRadius: 10,
    elevation: 3,
  },
  profileContent: {
    alignItems: 'center',
    padding: 20,
  },
  foto: {
    marginBottom: 20,
    borderColor: '#0476D9',
    borderWidth: 3,
  },
  nome: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  textoInfo: {
    fontSize: 16,
    color: '#666',
  },
  cursosButton: {
    width: '90%',
    marginVertical: 10,
    paddingVertical: 10,
    borderRadius: 20,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  settingsIcon: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  mapIcon: {
    marginRight: 10,
  },
});

export default DashboardVoluntario;
