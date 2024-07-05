import React from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import { Avatar, Card, Paragraph } from 'react-native-paper';

const BrigadaApoio = () => {
  // Exemplo de lista de usuários (substitua com dados reais)
  const usuarios = [
    { id: 1, nome: 'Ana', avatarUrl: 'https://via.placeholder.com/150' },
    { id: 2, nome: 'Carlos', avatarUrl: 'https://via.placeholder.com/150' },
    { id: 3, nome: 'Beatriz', avatarUrl: 'https://via.placeholder.com/150' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Brigada de Apoio</Text>
      <View style={styles.content}>
        <View style={styles.userListContainer}>
          <FlatList
            data={usuarios}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <Card style={styles.userCard}>
                <Card.Content style={styles.userContent}>
                  <Avatar.Image size={40} source={{ uri: item.avatarUrl }} />
                  <Paragraph style={styles.userName}>{item.nome}</Paragraph>
                </Card.Content>
              </Card>
            )}
          />
        </View>
        <View style={styles.chatContainer}>
          <ScrollView contentContainerStyle={styles.chatScroll}>
            <Text style={styles.chatText}>Área do Chat (não funcional)</Text>
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEF2E4', // Fundo neutro da paleta
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E56600', // Cor do título
    marginBottom: 20,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  userListContainer: {
    width: '25%',
    backgroundColor: '#F09400', // Cor de fundo para a lista de usuários
    borderRightWidth: 1,
    borderRightColor: '#ddd',
    paddingVertical: 10,
  },
  userCard: {
    marginBottom: 10,
    alignItems: 'center',
    backgroundColor: '#31ACC4', // Cor de fundo para os cartões de usuário
    borderRadius: 10,
    marginHorizontal: 5,
  },
  userContent: {
    alignItems: 'center',
  },
  userName: {
    marginTop: 5,
    fontSize: 14,
    color: '#FFF', // Cor do texto do nome do usuário
    textAlign: 'center',
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#EEE', // Cor de fundo para o chat
    padding: 20,
    borderRadius: 10,
    marginLeft: 10,
  },
  chatScroll: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatText: {
    fontSize: 16,
    color: '#6B0E71', // Cor do texto do chat
    textAlign: 'center',
  },
});

export default BrigadaApoio;
