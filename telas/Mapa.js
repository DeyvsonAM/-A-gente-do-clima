import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Modal, TextInput, Button, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';

const db = getFirestore();

const Mapa = () => {
  const [markers, setMarkers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newMarker, setNewMarker] = useState(null);
  const [descricao, setDescricao] = useState('');
  const [pontoCounts, setPontoCounts] = useState({
    'Barreiras com risco de deslizamento': 0,
    'Foco de lixo': 0,
    'Família em risco': 0,
  });

  const fetchPontos = async () => {
    try {
      const pontosCollection = collection(db, "Pontos");
      const pontosSnapshot = await getDocs(pontosCollection);
      const pontosList = pontosSnapshot.docs.map(doc => {
        const data = doc.data();
        if (data.coordenada) {
          const [latitude, longitude] = data.coordenada.split(',').map(coord => parseFloat(coord.trim()));
          return {
            id: doc.id,
            tipo: data.tipo,
            descricao: data.descricao,
            coordenada: { latitude, longitude }
          };
        } else {
          return null;
        }
      }).filter(point => point !== null); // Filtra pontos válidos
      setMarkers(pontosList);

      // Atualizar a contagem dos tipos de pontos
      const counts = pontosList.reduce((acc, ponto) => {
        acc[ponto.tipo] = (acc[ponto.tipo] || 0) + 1;
        return acc;
      }, {});
      setPontoCounts(counts);

    } catch (error) {
      console.error("Erro ao buscar pontos: ", error);
    }
  };

  const addMarker = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setNewMarker({ latitude, longitude });
    setModalVisible(true);
  };

  const saveMarker = async (type) => {
    if (newMarker && newMarker.latitude && newMarker.longitude) {
      try {
        const coordenadaString = `${newMarker.latitude}, ${newMarker.longitude}`;
        const docRef = await addDoc(collection(db, "Pontos"), {
          tipo: type,
          coordenada: coordenadaString,
          descricao,
        });
        console.log("Documento salvo com ID: ", docRef.id);
        setMarkers([...markers, { id: docRef.id, tipo: type, descricao, coordenada: newMarker }]);
        
        // Atualizar a contagem dos pontos
        setPontoCounts(prevCounts => ({
          ...prevCounts,
          [type]: (prevCounts[type] || 0) + 1
        }));
        
        setModalVisible(false);
        setDescricao('');
        setNewMarker(null);
      } catch (error) {
        console.error("Erro ao salvar ponto: ", error);
      }
    } else {
      Alert.alert('Erro', 'Coordenadas do ponto não são válidas.');
    }
  };

  const handleSave = (type) => {
    saveMarker(type);
  };

  useEffect(() => {
    fetchPontos();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Mapa de Pontos</Text>
        <View style={styles.counterContainer}>
          <Text style={styles.counterText}>Barreiras com risco de deslizamento: {pontoCounts['Barreiras com risco de deslizamento']}</Text>
          <Text style={styles.counterText}>Foco de lixo: {pontoCounts['Foco de lixo']}</Text>
          <Text style={styles.counterText}>Família em risco: {pontoCounts['Família em risco']}</Text>
        </View>
      </View>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: -8.111877,
          longitude: -34.955592,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onPress={addMarker}
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={{ latitude: marker.coordenada.latitude, longitude: marker.coordenada.longitude }}
            title={marker.tipo}
            description={marker.descricao}
          />
        ))}
      </MapView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Adicionar Ponto</Text>
          <TextInput
            style={styles.input}
            placeholder="Descrição"
            value={descricao}
            onChangeText={setDescricao}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, { backgroundColor: '#E56600' }]} onPress={() => handleSave('Barreiras com risco de deslizamento')}>
              <Text style={styles.buttonText}>Barreiras com risco de deslizamento</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, { backgroundColor: '#F09400' }]} onPress={() => handleSave('Foco de lixo')}>
              <Text style={styles.buttonText}>Foco de lixo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, { backgroundColor: '#6B0E71' }]} onPress={() => handleSave('Família em risco')}>
              <Text style={styles.buttonText}>Família em risco</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, { backgroundColor: '#31ACC4' }]} onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Adicionar pontos clicando no mapa</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 115,
    backgroundColor: '#F09400',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  headerText: {
    color: '#FFF2E4',
    fontSize: 24,
    fontWeight: 'bold',
  },
  counterContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  counterText: {
    color: '#FFF2E4',
    fontSize: 14,
    marginVertical: 2,
  },
  map: {
    flex: 1,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    width: '100%',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    height: 40,
    backgroundColor: '#E56600',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: '#FFF2E4',
    fontSize: 14,
  }
});

export default Mapa;
