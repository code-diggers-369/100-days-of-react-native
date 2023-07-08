import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import FontAwesome5Icons from 'react-native-vector-icons/FontAwesome5';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Create() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const navigation = useNavigation();

  const handleSave = async () => {
    try {
      const colors = ['#FFAB91', '#FFCC80', '#E6EE9B', '#80DEEA', '#CF93D9'];
      if (title.length > 0 && description.length > 0) {
        const tempArray = JSON.parse(await AsyncStorage.getItem('notesData'));
        const date = new Date();
        tempArray.push({
          id: Date.now(),
          title: title,
          description: description,
          cretedAt: `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`,
          color: colors[Math.floor(Math.random() * (colors.length - 1))],
        });

        await AsyncStorage.setItem('notesData', JSON.stringify(tempArray));

        navigation.goBack();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={{
            backgroundColor: '#3A3A3A',
            paddingHorizontal: 15,
            paddingVertical: 10,
            borderRadius: 10,
          }}
          onPress={() => {
            navigation.goBack();
          }}>
          <FontAwesome5Icons name="angle-left" size={20} />
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: '#3A3A3A',
            paddingHorizontal: 15,
            paddingVertical: 10,
            borderRadius: 10,
          }}
          onPress={() => handleSave()}>
          <Text style={{color: 'white', fontWeight: 'bold'}}>Save</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.textInputContainer}>
        <TextInput
          placeholder="Title"
          style={styles.textInputTitle}
          value={title}
          onChangeText={text => setTitle(text)}
        />

        <TextInput
          placeholder="Type something..."
          style={styles.textInputDesciption}
          multiline={true}
          value={description}
          onChangeText={text => setDescription(text)}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#252525',
    padding: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 10,
  },
  textInputContainer: {},
  textInputTitle: {
    fontSize: 50,
  },
  textInputDesciption: {
    fontSize: 23,
  },
});
