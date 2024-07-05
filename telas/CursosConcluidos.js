// telas/CursosConcluidos.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const db = getFirestore();
const auth = getAuth();

const CursosConcluidos = () => {
  const [usuario, setUsuario] = useState({
    xp: 0,
    cursosConcluidos: [],
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const userDocRef = doc(db, "usuarios", auth.currentUser.uid);
        try {
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            const cursosComProgresso = data.cursosConcluidos.map(curso => ({
              nome: curso,
              progresso: Math.floor(Math.random() * 100) + 1 // Gera uma porcentagem de 1 a 100
            }));
            setUsuario({
              xp: data.xp || 0,
              cursosConcluidos: cursosComProgresso,
            });
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

    fetchUserData();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: 'https://via.placeholder.com/100' }} style={styles.logo} />
        <Text style={styles.title}>Suas Conquistas</Text>
        <View style={styles.xpContainer}>
          <Text style={styles.xp}>{usuario.xp}</Text>
          <Image source={{ uri: 'https://via.placeholder.com/20' }} style={styles.medalIcon} />
        </View>
      </View>
      <View style={styles.coursesContainer}>
        {usuario.cursosConcluidos.map((curso, index) => (
          <View key={index} style={styles.course}>
            <Image source={{ uri: 'https://via.placeholder.com/50' }} style={styles.courseIcon} />
            <View style={styles.courseInfo}>
              <Text style={styles.courseName} numberOfLines={1} ellipsizeMode="tail">{curso.nome}</Text>
              <Text style={styles.courseProgress}>{curso.progresso}%</Text>
            </View>
          </View>
        ))}
      </View>
      <View style={styles.actionsContainer}>
        <View style={styles.action}>
          <Text style={styles.actionText}>Compras</Text>
          <Text style={styles.actionSubtext}>Troque seus Captitos por Prêmios!!</Text>
        </View>
        <View style={styles.action}>
          <Text style={styles.actionText}>Histórico</Text>
          <Text style={styles.actionSubtext}>Veja o que você já ganhou!!</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#FEF2E4',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  logo: {
    width: 50,
    height: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  xpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  xp: {
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 5,
  },
  medalIcon: {
    width: 20,
    height: 20,
  },
  coursesContainer: {
    marginBottom: 20,
  },
  course: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  courseIcon: {
    width: 50,
    height: 50,
  },
  courseInfo: {
    flex: 1,
    marginLeft: 10,
  },
  courseName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  courseProgress: {
    fontSize: 16,
    color: '#666',
  },
  actionsContainer: {
    marginTop: 20,
  },
  action: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  actionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E56600',
  },
  actionSubtext: {
    fontSize: 14,
    color: '#666',
  },
});

export default CursosConcluidos;
