import React, { useState } from 'react';
import { View, StyleSheet, Alertn, Image } from 'react-native';
import { Text, TextInput, Button, ActivityIndicator } from 'react-native-paper';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore'; 


const TelaLogin = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const firestore = getFirestore();

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;

      const userDocRef = doc(firestore, "usuarios", user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.tipo === 'lideranca') {
          navigation.navigate('DrawerNavigator');
        } else {
          navigation.navigate('VoluntarioNavigator');
        }
      } else {
        throw new Error('Usuário não encontrado no Firestore');
      }
    } catch (error) {
      Alert.alert('Erro', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
       <Image
        style={styles.tinyLogo}
        source={require('../assets/Logo grande.png')}
      />
      <TextInput
        style={styles.input}
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        label="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />
      {loading ? (
        <ActivityIndicator animating={true} size="large" color="#E56600" />
      ) : (
        <Button mode="contained" onPress={handleLogin} style={styles.button}>
          Entrar
        </Button>
      )}
      <Button
        mode="text"
        onPress={() => navigation.navigate('TelaCadastro')}
        style={styles.textButton}
      >
        Não tem uma conta? Cadastre-se
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  tinyLogo: {
    width: 200,
    height: 150,
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FEF2E4', // Cor de fundo da paleta
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E56600', // Cor do texto de acordo com a hierarquia
    marginBottom: 20,
  },
  input: {
    width: '100%',
    marginBottom: 10,
    backgroundColor: '#fff', // Mantendo o fundo branco para os inputs
  },
  button: {
    marginTop: 20,
    width: '100%',
    backgroundColor: '#31ACC4', // Cor do botão
  },
  textButton: {
    marginTop: 10,
    color: '#6B0E71', // Cor do texto do botão de cadastro
  },
});

export default TelaLogin;
