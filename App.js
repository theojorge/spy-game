import React, { useState, useEffect} from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, Modal, FlatList, TextInput} from 'react-native';
import { Checkbox } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from "@react-native-picker/picker"; 

export default function App() {
  const [themes, setThemes] = useState({
    Futbolistas: [
      "Messi", "Cristiano Ronaldo", "Neymar", "Mbappé", "Zidane", "Pele", "Maradona", "Benzema", "Suarez", "Lewandowski",
      "Modric", "Salah", "Van Dijk", "Ronaldo Nazário", "Beckham", "Dibu Martinez", "Iniesta", "Xavi", "Buffon", "Puyol",
      "Kante", "Kroos", "Gareth Bale", "Di Stefano", "Roberto Carlos", "Kaká", "Ronaldinho", "Di María", "Mascherano", "Vinicius Jr"
    ],
    Artistas: [
      "Taylor Swift", "Eminem", "The Beatles", "Michael Jackson", "Beyoncé", "Ariana Grande", "Drake", "Kendrick Lamar", 
      "Madonna", "Billie Eilish", "Ed Sheeran", "Lady Gaga", "Bruno Mars", "Shakira", "Rihanna", "Justin Bieber", 
      "Adele", "Post Malone", "The Weeknd", "Travis Scott", "Kanye West", "Coldplay", "Eros Ramazzotti", "Elton John", 
      "Nirvana", "The Rolling Stones", "Nicki Minaj", "Pink Floyd", "Dua Lipa", "Harry Styles"
    ],
    Paises: [
      "Argentina", "Brasil", "Japón", "Francia", "España", "Alemania", "Italia", "México", "Estados Unidos", "Colombia", 
      "Chile", "Perú", "Uruguay", "Portugal", "Inglaterra", "Países Bajos", "Bélgica", "Croacia", "Polonia", "Suecia", 
      "Noruega", "Australia", "Canadá", "Rusia", "China", "India", "Arabia Saudita", "Sudáfrica", "Corea del Sur", 
      "Egipto", "Nueva Zelanda"
    ],
    Peliculas: [
      "The Godfather", "Cars", "Batman: The Dark Knight", "Pulp Fiction", "Forrest Gump", "Inception", "Fight Club", 
      "The Matrix", "Shrek", "The Lion King", "Back to the Future", "Interstellar", "Gladiator", "Titanic", 
      "The Silence of the Lambs", "Ratatouille", "Schindler's List", "Scary Movie", "Jurassic Park", "Star Wars", 
      "The Lord of the Rings: The Fellowship of the Ring", "Toy Story", "Memento", "Avatar", "Casablanca", 
      "The Avengers", "The Terminator", "Oppenheimer", "Finding Nemo", "Kung Fu Panda", "Taxi Driver"
    ],
    Actores: [
      "Leonardo DiCaprio", "Morgan Freeman", "Tom Hanks", "Brad Pitt", "Will Smith", "Johnny Depp", "Denzel Washington", 
      "Robert Downey Jr.", "Matt Damon", "Tom Cruise", "Ryan Reynolds", "Joaquin Phoenix", "Christian Bale", "Kevin Hart", 
      "Meryl Streep", "Angelina Jolie", "Scarlett Johansson", "Ana de Armas", "Emma Stone", "Jennifer Lawrence", 
      "Robert Pattinson", "Matthew McConaughey", "Hugh Jackman", "Robert De Niro", "Samuel L. Jackson", "Keanu Reeves", 
      "Natalie Portman", "Anne Hathaway", "Adam Sandler", "Al Pacino", "Jack Nicholson"
    ]
  });
  const [step, setStep] = useState('config');
  const [selectedThemes, setSelectedThemes] = useState([]);
  const [players, setPlayers] = useState(3);
  const [spies, setSpies] = useState(1);
  const [assignments, setAssignments] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [reveal, setReveal] = useState(false);
  const [newTheme, setNewTheme] = useState('');
  const [newWords, setNewWords] = useState('');
  const [theme, setTheme] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [addNewThemeModalVisible, setAddNewThemeModalVisible] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [wordsList, setWordsList] = useState([]);

  useEffect(() => {
  const loadThemes = async () => {
    try {
      // Intentamos cargar ambos datos (temas y temas seleccionados)
      const savedThemes = await AsyncStorage.getItem('themes');
      const savedSelectedThemes = await AsyncStorage.getItem('selectedThemes');

      if (savedThemes && savedSelectedThemes) {
        // Si ambos existen, usamos los valores guardados
        const loadedThemes = JSON.parse(savedThemes);
        const loadedSelectedThemes = JSON.parse(savedSelectedThemes);


        setThemes(loadedThemes);
        setSelectedThemes(loadedSelectedThemes);
      } else {
        // Si no hay nada guardado, inicializamos con los valores predeterminados
        console.log("No saved themes or selected themes, initializing with defaults");

        setThemes(themes);
        setSelectedThemes(Object.keys(themes));

        // Guardamos los valores predeterminados en AsyncStorage
        await AsyncStorage.setItem('themes', JSON.stringify(themes));
        await AsyncStorage.setItem('selectedThemes', JSON.stringify(Object.keys(themes)));

      }
    } catch (error) {
      console.error("Error loading themes or selectedThemes from AsyncStorage", error);
    }
  };

  loadThemes();
}, []);

// Para guardar los temas seleccionados
useEffect(() => {
  const saveSelectedThemes = async () => {
    try {
    
      await AsyncStorage.setItem('selectedThemes', JSON.stringify(selectedThemes));
    } catch (error) {
      console.error("Error saving selectedThemes to AsyncStorage", error);
    }
  };

  // Solo guardamos si hay un cambio en los temas seleccionados
  if (selectedThemes.length > 0) {
    saveSelectedThemes();
  }
}, [selectedThemes]);

  useEffect(() => {
    // Guardar los temas en AsyncStorage cada vez que 'themes' cambie
    const saveThemes = async () => {
      try {
      
        await AsyncStorage.setItem('themes', JSON.stringify(themes));
      } catch (error) {
        console.error("Error saving themes to AsyncStorage", error);
      }
    };
    
    if (Object.keys(themes).length > 0) {
      saveThemes();
    }
  }, [themes]);

  const startGame = () => {
    const theme = selectedThemes[Math.floor(Math.random() * selectedThemes.length)];
    const words = themes[theme];
    const word = words[Math.floor(Math.random() * words.length)];

    let roles = Array(players - spies).fill(word);
    roles = roles.concat(Array(spies).fill("Espía"));
    roles = roles.sort(() => Math.random() - 0.5);

    setAssignments(roles);
    setStep('assign');
    setTheme(theme);
  };

  const nextPlayer = () => {
    if (currentPlayer + 1 < players) {
      setCurrentPlayer(currentPlayer + 1);
      setReveal(false);
    } else {
      setStep('game');
    }
  };

  const resetGame = () => {
    setStep('config');
    setPlayers(3);
    setSpies(1);
    setAssignments([]);
    setCurrentPlayer(0);
    setReveal(false);
  };

   const saveNewTheme = () => {
  if (!newTheme || wordsList.length === 0) {
    Alert.alert('Error', 'Por favor ingresa una temática y al menos una palabra');
    return;
  }

  const updatedThemes = { ...themes, [newTheme]: wordsList }; // Usar la lista de palabras
  setThemes(updatedThemes);
  setNewTheme('');
  setWordsList([]); // Limpiar la lista de palabras
  setAddNewThemeModalVisible(false);
};

  // Agregar palabras a una temática existente
  const handleAddWord = () => {
  if (!newWords) {
    Alert.alert('Error', 'Por favor ingresa una palabra');
    return;
  }
  const updatedThemes = { ...themes };
  updatedThemes[selectedTheme] = [
    ...updatedThemes[selectedTheme],
    newWords, // Solo agrega la palabra ingresada
  ];
  setThemes(updatedThemes); // Actualizar el estado
  setNewWords(''); // Limpiar el campo de entrada para la siguiente palabra
};

  // Eliminar una palabra de una temática
  const handleDeleteWord = (word) => {
    const updatedThemes = { ...themes };
    updatedThemes[selectedTheme] = updatedThemes[selectedTheme].filter(
      (existingWord) => existingWord !== word
    );
    setThemes(updatedThemes);
  };

  

  const handleSelectTheme = (theme) => {
    setSelectedThemes((prev) =>
      prev.includes(theme) ? prev.filter((t) => t !== theme) : [...prev, theme]
    );
  };

  const handleDeleteTheme = () => {
  Alert.alert(
    'Eliminar Temática',
    `¿Estás seguro de que deseas eliminar la temática "${selectedTheme}"?`,
    [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Eliminar',
        onPress: () => {
          const updatedThemes = { ...themes };
          delete updatedThemes[selectedTheme]; // Eliminar la temática seleccionada
          const updatedSelectedThemes = selectedThemes.filter(theme => theme !== selectedTheme);
          setThemes(updatedThemes); // Actualizar el estado
          setSelectedThemes(updatedSelectedThemes);
          setModalVisible(false); // Cerrar el modal
        },
      },
    ],
    { cancelable: true }
  );
};


  if (step === 'config') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Configura el Juego</Text>
        <Text style={styles.subtitle}>Selecciona temáticas:</Text>
         <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.button}>
        <Text style={styles.buttonText}>Seleccionar Temáticas</Text>
      </TouchableOpacity>

      {/* Modal con checkboxes para seleccionar temáticas */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecciona las temáticas</Text>

            {/* Lista de temas con checkboxes */}
            <FlatList
              data={Object.keys(themes)}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <View style={styles.checkboxContainer}>
                  <Checkbox
                    status={selectedThemes.includes(item) ? 'checked' : 'unchecked'}
                    onPress={() => handleSelectTheme(item)}
                  />
                  <Text style={styles.checkboxLabel}>{item}</Text>
                </View>
              )}
            />

            {/* Botón para cerrar el modal */}
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.modalButton}
            >
              <Text style={styles.modalButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
        <Text style={styles.label}>Número de jugadores: {players}</Text>
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.controlButton, { backgroundColor: 'red' }]}
            onPress={() => setPlayers(Math.max(3, players - 1))}
          >
            <Text style={styles.controlButtonText}>-</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.controlButton, { backgroundColor: 'green' }]}
            onPress={() => setPlayers(players + 1)}
          >
            <Text style={styles.controlButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Número de espías: {spies}</Text>
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.controlButton, { backgroundColor: 'red' }]}
            onPress={() => setSpies(Math.max(1, spies - 1))}
          >
            <Text style={styles.controlButtonText}>-</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.controlButton, { backgroundColor: 'green' }]}
            onPress={() => setSpies(Math.min(players, spies + 1))}
          >
            <Text style={styles.controlButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.bigButton, { backgroundColor: '#4caf50' }]}
          onPress={startGame}
          disabled={selectedThemes.length === 0}
        >
          <Text style={styles.bigButtonText}>Iniciar Juego</Text>
        </TouchableOpacity>

        {/* Botón para agregar nuevas temáticas */}
        <TouchableOpacity
          style={[styles.bigButton, { backgroundColor: '#ff9800' }]}
          onPress={() => setStep('manageThemes')}
        >
          <Text style={styles.bigButtonText}>Administrar Temáticas</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Pantalla de administración de temáticas
  if (step === 'manageThemes') {
     return (
    <View style={styles.container}>
      <Text style={styles.title}>Administrar Temáticas</Text>

      <Picker
  selectedValue={selectedTheme}
  onValueChange={(itemValue) => {
    setSelectedTheme(itemValue);
    setModalVisible(true);
  }}
  style={styles.picker}
>
  <Picker.Item label="Seleccionar Temática" value={null} enabled={false} />
  {Object.keys(themes).map((theme) => (
    <Picker.Item key={theme} label={theme} value={theme} />
  ))}
</Picker>


      {/* Agregar nueva temática */}
      <TouchableOpacity
        style={[styles.bigButton, { backgroundColor: '#4caf50' }]}
        onPress={() => setAddNewThemeModalVisible(true)}
      >
        <Text style={styles.bigButtonText}>Agregar Nueva Temática</Text>
      </TouchableOpacity>

      <TouchableOpacity
                style={[styles.bigButton, { backgroundColor: '#2196f3' }]}
                onPress={() => setStep('config')}
              >
                <Text style={styles.bigButtonText}>Volver a Configuración</Text>
              </TouchableOpacity>
      {/* Modal para agregar palabras a una temática existente */}
      <Modal
  visible={modalVisible}
  animationType="slide"
  transparent={true}
  onRequestClose={() => setModalVisible(false)}
>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>{selectedTheme}</Text>

      <FlatList
  data={themes[selectedTheme]}
  keyExtractor={(item) => item}
  renderItem={({ item }) => (
    <View style={styles.wordContainer}>
      <Text style={styles.word}>{item}</Text>
      <TouchableOpacity onPress={() => handleDeleteWord(item)}>
        <Text style={styles.deleteText}>Eliminar</Text>
      </TouchableOpacity>
    </View>
  )}
  style={styles.scrollList} // Aplicando el estilo para limitar la altura
  scrollEnabled={true} // Habilita el desplazamiento si es necesario
/>

      {/* Campo para agregar una palabra */}
      <TextInput
        style={styles.input}
        placeholder="Agregar palabra"
        value={newWords}
        onChangeText={setNewWords}
      />

      {/* Botón para agregar la palabra */}
      <TouchableOpacity
        style={[styles.bigButton, { backgroundColor: '#4caf50' }]}
        onPress={handleAddWord}
      >
        <Text style={styles.bigButtonText}>Agregar Palabra</Text>
      </TouchableOpacity>


            <TouchableOpacity
        style={[styles.bigButton, { backgroundColor: '#f44336' }]}
        onPress={handleDeleteTheme}
      >
        <Text style={styles.bigButtonText}>Eliminar Temática</Text>
      </TouchableOpacity>  

            <TouchableOpacity
              style={[styles.bigButton, { backgroundColor: '#f44336' }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.bigButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal para agregar nueva temática */}
      <Modal
  visible={addNewThemeModalVisible}
  animationType="slide"
  transparent={true}
  onRequestClose={() => setAddNewThemeModalVisible(false)}
>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Agregar Nueva Temática</Text>

      {/* Input para el nombre de la temática */}
      <TextInput
        style={styles.input}
        placeholder="Nombre de la temática"
        value={newTheme}
        onChangeText={setNewTheme}
      />

      {/* Input para agregar palabras */}
      <TextInput
        style={styles.input}
        placeholder="Agregar palabra"
        value={newWords}
        onChangeText={setNewWords}
      />

      {/* Botón para agregar palabra */}
      <TouchableOpacity
        style={[styles.bigButton, { backgroundColor: '#4caf50' }]}
        onPress={() => {
          if (newWords.trim()) {
            // Agregar palabra a la lista
            setWordsList((prevWords) => [...prevWords, newWords]);
            setNewWords('');  // Limpiar el campo de palabra
          }
        }}
      >
        <Text style={styles.bigButtonText}>Agregar Palabra</Text>
      </TouchableOpacity>

      {/* Mostrar las palabras agregadas */}
      <FlatList
        data={wordsList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.wordContainer}>
            <Text style={styles.word}>{item}</Text>
            <TouchableOpacity onPress={() => {
              // Eliminar palabra de la lista
              const updatedWords = wordsList.filter((_, i) => i !== index);
              setWordsList(updatedWords);
            }}>
              <Text style={styles.deleteText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Botón para guardar la temática */}
      <TouchableOpacity
        style={[styles.bigButton, { backgroundColor: '#4caf50' }]}
        onPress={saveNewTheme}
      >
        <Text style={styles.bigButtonText}>Guardar Temática</Text>
      </TouchableOpacity>

      {/* Botón para cerrar el modal */}
      <TouchableOpacity
        style={[styles.bigButton, { backgroundColor: '#f44336' }]}
        onPress={() => setAddNewThemeModalVisible(false)}
      >
        <Text style={styles.bigButtonText}>Volver</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>
    </View>
  );
  }

  if (step === 'assign') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Jugador {currentPlayer + 1}</Text>
        {reveal ? (
        <View style={styles.revealContainer}>
          <Text
            style={
              assignments[currentPlayer] === "Espía"
                ? styles.spyText
                : styles.wordText
            }
          >
            {assignments[currentPlayer] === "Espía" ? "¡Sos Espía!" : assignments[currentPlayer]}
          </Text> 
          <Text style={styles.themeText}>({theme})
          </Text>
        </View>
          
        ) : (
          <TouchableOpacity
            style={[styles.bigButton, { backgroundColor: '#2196f3' }]}
            onPress={() => setReveal(true)}
          >
            <Text style={styles.bigButtonText}>Revelar</Text>
          </TouchableOpacity>
        )}
        {reveal && (
          <TouchableOpacity
            style={[styles.bigButton, { backgroundColor: '#4caf50' }]}
            onPress={nextPlayer}
          >
            <Text style={styles.bigButtonText}>Siguiente</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  if (step === 'game') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>¡Empieza el Juego!</Text>
        <Text style={styles.subtitle}>Todos los roles han sido asignados.</Text>
        <TouchableOpacity
          style={[styles.bigButton, { backgroundColor: '#f44336' }]}
          onPress={resetGame}
        >
          <Text style={styles.bigButtonText}>Volver a Configuración</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 15,
    color: '#555',
  },
  button: {
    padding: 10,
    margin: 5,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
  selectedButton: {
    padding: 10,
    margin: 5,
    backgroundColor: '#4caf50',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  wordText: {
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 20,
    color: 'green',
  },
  spyText: {
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 20,
    color: 'red',
  },
  label: {
    fontSize: 16,
    marginVertical: 10,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    width: '60%',
  },
  controlButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 5,
  },
  controlButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  bigButton: {
    width: '80%',
    padding: 20,
    marginVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  bigButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
   themeText: {
    fontSize: 20,
    marginTop: 15,
    color: '#333',
    fontWeight: 'bold',
  },

  revealContainer: {
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    width: '80%',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkboxLabel: {
    fontSize: 16,
  },
  modalButton: {
    backgroundColor: '#f44336',
    padding: 10,
    marginTop: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  selectedThemesText: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 20,
  },
   wordContainer: {
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  word: {
    fontSize: 16,
    marginRight: 5,
  },
  deleteText: {
    color: 'red',
    fontSize: 14,
  },
  scrollList: {
    maxHeight: 200,  
    width: '100%',
    marginBottom: 10,
  },
   picker: {
    height: 70,
    width: 300,
    borderColor: "#6200EE",
    borderWidth: 10,
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: "#ffffff",
  },
    input: {
    height: 50,
    width: '80%',
    borderWidth: 1, 
    borderColor: '#000', 
    borderRadius: 10, 
    paddingHorizontal: 15, 
    backgroundColor: '#fff', 
    marginBottom: 10,
  },
});
