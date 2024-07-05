import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';

const db = getFirestore();
const auth = getAuth();

const CursosDisponiveis = () => {
  const [cursosDisponiveis, setCursosDisponiveis] = useState([]);
  const [usuarioCursosDisponiveis, setUsuarioCursosDisponiveis] = useState([]);

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const cursosCollection = collection(db, "Cursos");
        const cursosSnapshot = await getDocs(cursosCollection);
        const cursosList = cursosSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCursosDisponiveis(cursosList);
        console.log('Cursos disponíveis:', cursosList);
      } catch (error) {
        console.error("Erro ao buscar cursos: ", error);
      }
    };

    const fetchUsuarioCursosDisponiveis = async () => {
      if (auth.currentUser) {
        const userDocRef = doc(db, "usuarios", auth.currentUser.uid);
        try {
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUsuarioCursosDisponiveis(data.cursoDisponivel || []);
            console.log('Cursos do usuário:', data.cursoDisponivel);
          } else {
            console.log("Documento do usuário não encontrado!");
          }
        } catch (error) {
          console.error("Erro ao buscar dados do usuário: ", error);
        }
      } else {
        console.log("Nenhum usuário está logado.");
      }
    };

    fetchCursos();
    fetchUsuarioCursosDisponiveis();
  }, []);

  useEffect(() => {
    console.log('Cursos disponíveis atualizados:', cursosDisponiveis);
    console.log('Cursos do usuário atualizados:', usuarioCursosDisponiveis);
  }, [cursosDisponiveis, usuarioCursosDisponiveis]);

  const cursosFiltrados = cursosDisponiveis.filter(curso =>
    usuarioCursosDisponiveis.includes(curso.nome)
  );

  return (
    <View style={styles.container}>
      <Text style={styles.texto}>Cursos Disponíveis</Text>
      {cursosFiltrados.length > 0 ? (
        <FlatList
          data={cursosFiltrados}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.cursoContainer}>
              <Image source={{ uri: 'https://via.placeholder.com/100' }} style={styles.cursoImagem} />
              <Text style={styles.cursoNome}>{item.nome}</Text>
              <TouchableOpacity style={styles.botaoIniciar}>
                <Text style={styles.botaoTexto}>Iniciar</Text>
              </TouchableOpacity>
            </View>
          )}
          numColumns={2}
          columnWrapperStyle={styles.row}
        />
      ) : (
        <Text style={styles.texto}>Nenhum curso disponível.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
  },
  texto: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6b0e71',
    marginBottom: 20,
  },
  row: {
    flex: 1,
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cursoContainer: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
    width: '45%', // Ajuste para ter dois containers lado a lado
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    alignItems: 'center',
  },
  cursoImagem: {
    width: '100%',
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  cursoNome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6b0e71',
    marginBottom: 10,
    textAlign: 'center',
  },
  botaoIniciar: {
    backgroundColor: '#E56600',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  botaoTexto: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CursosDisponiveis;
