import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, TextInput, Button, ActivityIndicator } from 'react-native-paper';
import { auth, firestore } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const TelaCadastro = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [cpf, setCpf] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCadastro = async () => {
    if (!nome || !email || !senha || !cpf || !dataNascimento) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios');
      return;
    }

    if (cpf.length !== 11 || !/^\d+$/.test(cpf)) {
      Alert.alert('Erro', 'CPF deve ter 11 dígitos numéricos');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Erro', 'Email inválido');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;

      await setDoc(doc(firestore, 'usuarios', user.uid), {
        nome,
        email,
        cpf,
        dataNascimento,
        tipo: 'voluntário',
        XP: 0,
        medalhas: 'Pacificador',
      });

      Alert.alert('Sucesso', 'Usuário registrado com sucesso!');
    } catch (error) {
      Alert.alert('Erro', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>
      <TextInput
        style={styles.input}
        label="Nome"
        value={nome}
        onChangeText={setNome}
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
      <TextInput
        style={styles.input}
        label="CPF"
        value={cpf}
        onChangeText={setCpf}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        label="Data de Nascimento (DD/MM/AAAA)"
        value={dataNascimento}
        onChangeText={setDataNascimento}
      />
      {loading ? (
        <ActivityIndicator animating={true} size="large" color="#E56600" />
      ) : (
        <Button mode="contained" onPress={handleCadastro} style={styles.button}>
          Cadastrar
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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

export default TelaCadastro;
