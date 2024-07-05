import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Avatar, Card, Title, Paragraph, Button, Provider } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { getFirestore, updateDoc, arrayUnion, doc, getDoc, collection, getDocs } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';

const db = getFirestore();

const DetalhesVoluntario = ({ route, navigation }) => {
  const { voluntario } = route.params;
  const [novoCurso, setNovoCurso] = useState('');
  const [disponiveis, setDisponiveis] = useState([]);

  useEffect(() => {
    const fetchCursos = async () => {
      const cursosRef = collection(db, 'Cursos');
      const cursosSnapshot = await getDocs(cursosRef);
      const cursosList = cursosSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setDisponiveis(cursosList);
    };

    fetchCursos();
  }, []);

  const handleAdicionarCurso = async () => {
    if (!novoCurso) {
      Alert.alert('Erro', 'Por favor, selecione um curso para adicionar.');
      return;
    }

    try {
      const userDocRef = doc(db, 'usuarios', voluntario.id);
      await updateDoc(userDocRef, {
        cursoDisponivel: arrayUnion(novoCurso)
      });

      Alert.alert('Sucesso', 'Curso Encaminhado com sucesso!');
      setNovoCurso('');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível adicionar o curso. Tente novamente.');
      console.error("Erro ao adicionar curso: ", error);
    }
  };

  const handlePromoverLider = async () => {
    try {
      const userDocRef = doc(db, 'usuarios', voluntario.id);
      await updateDoc(userDocRef, {
        tipo: 'lideranca'
      });

      Alert.alert('Sucesso', 'Voluntário promovido a Líder!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível promover o voluntário. Tente novamente.');
      console.error("Erro ao promover voluntário: ", error);
    }
  };

  return (
    <Provider>
      <ScrollView contentContainerStyle={styles.container}>
        <Card style={styles.card}>
          <Card.Content style={styles.content}>
            <Avatar.Image 
              size={100} 
              source={{ uri: voluntario.foto || 'https://via.placeholder.com/150' }} 
              style={styles.avatar} 
            />
            <Title style={styles.title}>{voluntario.nome}</Title>
            <Paragraph style={styles.paragraph}>CPF: {voluntario.cpf}</Paragraph>
            <Paragraph style={styles.paragraph}>Email: {voluntario.email}</Paragraph>
            <Paragraph style={styles.paragraph}>Data de Nascimento: {voluntario.dataNascimento}</Paragraph>
            <Paragraph style={styles.paragraph}>Nível de XP: {voluntario.XP}</Paragraph>
            <Paragraph style={styles.paragraph}>Medalhas: {voluntario.medalhas}</Paragraph>
            
            <View style={styles.addCursoContainer}>
              <Picker
                selectedValue={novoCurso}
                onValueChange={(itemValue) => setNovoCurso(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Selecione um curso" value="" />
                {disponiveis.map((curso) => (
                  <Picker.Item key={curso.id} label={curso.nome} value={curso.nome} />
                ))}
              </Picker>
              <Button 
                mode="contained" 
                onPress={handleAdicionarCurso} 
                style={styles.button}
                labelStyle={styles.buttonLabel}
              >
                Encaminhar Curso
              </Button>
            </View>
            
            <Button 
              mode="contained" 
              onPress={handlePromoverLider} 
              style={styles.promoteButton}
              icon={() => <Icon name="arrow-up" size={20} color="#FFF" />}
              labelStyle={styles.buttonLabel}
            >
              Promover a Líder
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FEF2E4', // Cor de fundo creme
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '90%',
    backgroundColor: '#FFF', // Fundo branco para o cartão
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    padding: 20,
  },
  content: {
    alignItems: 'center',
  },
  avatar: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6B0E71', // Texto roxo
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 16,
    color: '#666', // Texto cinza para descrição
    marginBottom: 5,
  },
  addCursoContainer: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  picker: {
    width: '100%',
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
    backgroundColor: '#31ACC4', // Cor do botão
  },
  promoteButton: {
    marginTop: 20,
    backgroundColor: '#E56600', // Cor do botão de promover
  },
  buttonLabel: {
    color: '#FFF', // Cor do texto do botão
  },
});

export default DetalhesVoluntario;
