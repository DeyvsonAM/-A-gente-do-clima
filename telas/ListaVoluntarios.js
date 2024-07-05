import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { Searchbar, Card, Title, Paragraph, Avatar } from 'react-native-paper';

const db = getFirestore();

const ListaVoluntarios = ({ navigation }) => {
  const [voluntarios, setVoluntarios] = useState([]);
  const [filteredVoluntarios, setFilteredVoluntarios] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchVoluntarios = async () => {
      try {
        const usuariosCollection = collection(db, 'usuarios');
        const usuariosSnapshot = await getDocs(usuariosCollection);
        const usuariosList = usuariosSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setVoluntarios(usuariosList);
        setFilteredVoluntarios(usuariosList);
        console.log('Voluntários:', usuariosList);
      } catch (error) {
        console.error("Erro ao buscar voluntários: ", error);
      }
    };

    fetchVoluntarios();
  }, []);

  const navigateToDetalhesVoluntario = (voluntario) => {
    navigation.navigate('DetalhesVoluntario', { voluntario });
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query === '') {
      setFilteredVoluntarios(voluntarios);
    } else {
      const filtered = voluntarios.filter(voluntario =>
        voluntario.nome.toLowerCase().includes(query.toLowerCase()) ||
        voluntario.cpf.includes(query)
      );
      setFilteredVoluntarios(filtered);
    }
  };

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Pesquisar voluntários"
        onChangeText={handleSearch}
        value={searchQuery}
        style={styles.searchBar}
      />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {filteredVoluntarios.map((voluntario) => (
          <Card
            key={voluntario.id}
            style={styles.voluntarioItem}
            onPress={() => navigateToDetalhesVoluntario(voluntario)}
          >
            <Card.Content style={styles.voluntarioContent}>
              <Avatar.Text size={40} label={voluntario.nome.charAt(0)} style={styles.avatar} />
              <View style={styles.voluntarioInfo}>
                <Title style={styles.nomeVoluntario}>{voluntario.nome}</Title>
                <Paragraph style={styles.cpfVoluntario}>XP: {voluntario.XP}</Paragraph>
              </View>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEF2E4',
  },
  searchBar: {
    margin: 10,
    borderRadius: 10,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 20,
  },
  voluntarioItem: {
    width: '90%',
    marginBottom: 10,
    borderRadius: 10,
    elevation: 3,
  },
  voluntarioContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  avatar: {
    backgroundColor: '#31ACC4',
  },
  voluntarioInfo: {
    marginLeft: 10,
    flex: 1,
  },
  nomeVoluntario: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E56600',
  },
  cpfVoluntario: {
    fontSize: 14,
    color: '#6B0E71',
  },
});

export default ListaVoluntarios;
