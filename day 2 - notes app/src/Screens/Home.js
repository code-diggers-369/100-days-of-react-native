import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import FontAwesome5Icons from 'react-native-vector-icons/FontAwesome5';
import {MasonryGridView} from 'react-native-masonry-gridview';
import {useNavigation} from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Home() {
  const [cardsData, setCardsData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [isSearchTextOpen, setIsSearchTextOpen] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    initAppData().then(() => {
      fetchData();
    });
    return () => {};
  }, []);

  const initAppData = async () => {
    try {
      const tempArray = await AsyncStorage.getItem('notesData');
      if (tempArray == null) {
        await AsyncStorage.setItem('notesData', JSON.stringify([]));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchData = useCallback(async () => {
    try {
      const storageData = JSON.parse(await AsyncStorage.getItem('notesData'));
      if (storageData) {
        setCardsData(storageData);
      }
    } catch (err) {
      console.log(err);
    }
  });

  const handleRemoveCardItem = async cardId => {
    const storageData = JSON.parse(await AsyncStorage.getItem('notesData'));

    const filterData = storageData.filter(item => item.id !== cardId);

    await AsyncStorage.setItem('notesData', JSON.stringify(filterData));

    fetchData();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={{fontSize: 30, fontWeight: 'bold'}}>Notes</Text>

        {isSearchTextOpen && (
          <TextInput
            style={styles.serachInput}
            placeholder="Search here"
            value={searchText}
            onChangeText={text => setSearchText(text)}
          />
        )}

        <TouchableOpacity
          style={{backgroundColor: '#3A3A3A', padding: 10, borderRadius: 10}}
          onPress={() => {
            setIsSearchTextOpen(!isSearchTextOpen);

            if (isSearchTextOpen) {
              setSearchText('');
            }
          }}>
          <FontAwesome5Icons
            name={isSearchTextOpen ? 'times' : 'search'}
            size={20}
          />
        </TouchableOpacity>
      </View>

      <ScrollView>
        <MasonryGridView
          items={cardsData.filter(item => {
            const {title, description, cretedAt} = item;
            if (
              title.indexOf(searchText) != -1 ||
              description.indexOf(searchText) != -1 ||
              cretedAt.indexOf(searchText) != -1
            ) {
              return item;
            }
          })}
          columns={2}
          renderItem={item => (
            <View
              style={[
                styles.cardContainer,
                {
                  backgroundColor: item.color,
                },
              ]}>
              <Text style={{color: 'black', fontSize: 25, fontWeight: '600'}}>
                {item.title}
              </Text>
              <Text style={{color: 'black', fontSize: 17, fontWeight: '600'}}>
                {item.description}
              </Text>

              <Text style={{color: 'black', marginTop: 10}}>
                {item.cretedAt}
              </Text>

              <TouchableOpacity
                style={styles.trashContainer}
                onPress={() => {
                  handleRemoveCardItem(item.id);
                }}>
                <FontAwesome5Icons name="trash" color={'black'} size={20} />
              </TouchableOpacity>
            </View>
          )}
        />
        {cardsData.length == 0 && (
          <Text style={{textAlign: 'center', fontSize: 20}}>
            There Is No Data
          </Text>
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.addButtonContainer}
        onPress={() => {
          navigation.navigate('Create', {
            onSave: () => {
              fetchData();
            },
          });
        }}>
        <FontAwesome5Icons name="plus" size={15} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#252525',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 10,
  },
  addButtonContainer: {
    position: 'absolute',
    bottom: 50,
    right: 30,
    backgroundColor: '#3A3A3A',
    padding: 20,
    borderRadius: 50,
  },
  cardContainer: {
    padding: 20,
    margin: 5,
    borderRadius: 10,
  },
  serachInput: {
    backgroundColor: '#3A3A3A',
    padding: 5,
    width: '50%',
    borderRadius: 10,
  },
  trashContainer: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    padding: 10,
    borderRadius: 50,
  },
});
