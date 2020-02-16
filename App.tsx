/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useState} from 'react';
import {Text, View, StyleSheet, TextInput} from 'react-native';
import SimpleSliver from './src/SimpleSliver';
import SafeAreaView, {SafeAreaProvider} from 'react-native-safe-area-view';

const App = () => {
  const [textVal, setTextVal] = useState('');

  return (
    <SimpleSliver
      maxHeight={300}
      minHeight={100}
      scrollViewContent={
        <Text style={{fontSize: 30}}>
          {
            '1\n\n2\n\n1\n\n2\n\n1\n\n2\n\n1\n\n2\n\n1\n\n2\n\n1\n\n2\n\n1\n\n2\n\n1\n\n2\n\n1\n\n2\n\n1\n\n2\n\n1\n\n2\n\n1\n\n2'
          }
        </Text>
      }
      maxHeightView={
        <Text style={{fontSize: 40, color: 'black'}}>{'Hello Big View'}</Text>
      }
      minHeightView={
        <SafeAreaProvider>
          <SafeAreaView style={styles.minViewContainer}>
            <View style={styles.textView}>
              <TextInput
                style={styles.textInput}
                placeholderTextColor={'white'}
                placeholder={'Search'}
                value={textVal}
                onChangeText={val => setTextVal(val)}
              />
            </View>
            <View style={{flex: 1}} />
          </SafeAreaView>
        </SafeAreaProvider>
      }
      minViewBackgroundColor={'green'}
      maxViewBackgroundColor={'red'}
    />
  );
};

const styles = StyleSheet.create({
  minViewContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
  },
  textView: {
    flex: 2,
    borderRadius: 100,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
  },
  textInput: {
    padding: 0,
    color: 'white',
    fontSize: 20,
    flex: 1,
  },
});

export default App;
