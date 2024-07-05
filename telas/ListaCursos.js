import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { Searchbar, Card, Title, Paragraph, Button } from 'react-native-paper';

const db = getFirestore();

const ListaCursos = ({ navigation }) => {
  const [cursos, setCursos] = useState([]);
  const [filteredCursos, setFilteredCursos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const cursosCollection = collection(db, 'Cursos');
        const cursosSnapshot = await getDocs(cursosCollection);
        const cursosList = cursosSnapshot.docs.map(doc => ({
          id: doc.id,
          nome: doc.data().nome || 'Nome não disponível',
          descricao: doc.data().descricao || 'Descrição não disponível',
          modelo: doc.data().Modelo || 'Modelo não disponível',
        }));
        setCursos(cursosList);
        setFilteredCursos(cursosList);
        console.log('Cursos:', cursosList);
      } catch (error) {
        console.error("Erro ao buscar cursos: ", error);
      }
    };

    fetchCursos();
  }, []);

  const navigateToDetalhesCurso = (curso) => {
    navigation.navigate('DetalhesCurso', { curso });
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query === '') {
      setFilteredCursos(cursos);
    } else {
      const filtered = cursos.filter(curso =>
        curso.nome.toLowerCase().includes(query.toLowerCase()) ||
        curso.descricao.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredCursos(filtered);
    }
  };

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Pesquisar cursos"
        onChangeText={handleSearch}
        value={searchQuery}
        style={styles.searchBar}
      />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {filteredCursos.map((curso) => (
          <Card
            key={curso.id}
            style={styles.cursoItem}
            onPress={() => navigateToDetalhesCurso(curso)}
          >
            <Card.Content>
              <Title style={styles.nomeCurso}>{curso.nome}</Title>
              <Paragraph style={styles.descricaoCurso}>{curso.descricao}</Paragraph>
              <Button
                mode="contained"
                style={styles.modeloButton}
                onPress={() => navigateToDetalhesCurso(curso)}
              >
                {curso.modelo}
              </Button>
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
    backgroundColor: '#FEF2E4', // Fundo neutro da paleta
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
  cursoItem: {
    width: '90%',
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: '#F09400', // Cor de fundo para os cartões de cursos
    elevation: 3,
  },
  nomeCurso: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FEF2E4', // Cor do nome do curso
  },
  descricaoCurso: {
    fontSize: 14,
    color: '#6B0E71', // Cor da descrição do curso
  },
  modeloButton: {
    marginTop: 10,
    backgroundColor: '#31ACC4', // Cor do botão
  },
  modeloButtonText: {
    color: '#FEF2E4', // Cor do texto do botão
  },
});

export default ListaCursos;
