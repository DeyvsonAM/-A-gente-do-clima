import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Card, Title, Paragraph, Avatar } from 'react-native-paper';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const db = getFirestore();
const auth = getAuth();

const DashboardLideranca = ({ navigation }) => {
  const [userData, setUserData] = useState({
    nome: 'Carregando...',
    email: 'Carregando...',
    cpf: 'Carregando...',
    dataNascimento: 'Carregando...',
    avatarUrl: 'https://via.placeholder.com/150'
  });

  const openDrawer = () => {
    navigation.openDrawer();
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, "usuarios", auth.currentUser.uid);
        const docSnap = await getDoc(userDocRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserData({
            nome: data.nome || 'Nome não disponível',
            email: data.email || 'Email não disponível',
            cpf: data.cpf || 'CPF não disponível',
            dataNascimento: data.dataNascimento || 'Data de nascimento não disponível',
            avatarUrl: data.avatarUrl || 'https://via.placeholder.com/150'
          });
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <View style={styles.container}>
      <Card style={styles.profileCard}>
        <Card.Content style={styles.profileContent}>
          <Avatar.Image size={100} source={{ uri: userData.avatarUrl }} style={styles.avatar} />
          <Title style={styles.name}>{userData.nome}</Title>
          <Paragraph style={styles.paragraph}>Email: {userData.email}</Paragraph>
          <Paragraph style={styles.paragraph}>CPF: {userData.cpf}</Paragraph>
          <Paragraph style={styles.paragraph}>Data de Nascimento: {userData.dataNascimento}</Paragraph>
        </Card.Content>
      </Card>

      <Button mode="contained" onPress={openDrawer} style={styles.button}>
        Abrir Menu
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEF2E4', // Cor de fundo da paleta
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCard: {
    width: '90%',
    backgroundColor: '#FFF',
    borderRadius: 10,
    elevation: 3,
    marginBottom: 20,
  },
  profileContent: {
    alignItems: 'center',
    padding: 20,
  },
  avatar: {
    marginBottom: 20,
    backgroundColor: '#31ACC4', // Fundo do avatar
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E56600', // Cor do nome
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 16,
    color: '#6B0E71', // Cor dos detalhes
    marginBottom: 5,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#31ACC4', // Cor do botão
    width: '90%',
    padding: 10,
  },
});

export default DashboardLideranca;
