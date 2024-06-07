import React from 'react'
import { Picker } from '@react-native-picker/picker';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, View, Button} from 'react-native';

export default function App() {

  const [value, onChangeValue] = React.useState('---');
  const [inputValue, onChangeinputValue] = React.useState('Input value here:');
  const [inputCase,setInputCase] = React.useState ("Select case");

  const prompt = require ("prompt-sync")({sigint: true})
const { degrees, sqrt, atan } = Math;

function getLatitude(Northing_SS, Northing_SO) {
  /**
   * Determines the latitude of a line
   *
   * Input:
   * Northing of station string - number
   * Northing of station occupied - number
   *
   * Output:
   * latitude - number
   */

  const latitude = Northing_SS - Northing_SO;
  return latitude;
}

function getDeparture(Easting_SS, Easting_SO) {
  /**
   * Determines the latitude of a line
   *
   * Input:
   * Easting of station string - number
   * Easting of station occupied - number
   *
   * Output:
   * departure - number
   */

  const departure = Easting_SS - Easting_SO;
  return departure;
}

const Northing_SS = parseFloat(prompt("Northing of Station Sighted: "));
const Easting_SS = parseFloat(prompt("Easting of Station Sighted: "));
const Northing_SO = parseFloat(prompt("Northing of Station Occupied: "));
const Easting_SO = parseFloat(prompt("Easting of Station Occupied: "));

const lat = getLatitude(Northing_SS, Northing_SO);
const dep = getDeparture(Easting_SS, Easting_SO);

let bearing;
if (lat > 0 || lat < 0) {
  bearing =  Math.atan(Math.abs(dep) / Math.abs(lat)) * (180 / Math.PI);
} else if (lat === 0) {
  bearing = 0;
} else {
  bearing = "N/A";
}

console.log(bearing);

let azimuth_dd;
if (lat > 0 && dep > 0) {
  azimuth_dd = bearing;
} else if (lat < 0 && dep > 0) {
  azimuth_dd = 180 - bearing;
} else if (lat < 0 && dep < 0) {
  azimuth_dd = 180 + bearing;
} else if (lat > 0 && dep < 0) {
  azimuth_dd = 360 - bearing;
} else if (lat < 0 && dep === 0) {
  azimuth_dd = 180 + bearing;
} else if (lat > 0 && dep === 0) {
  azimuth_dd = bearing;
} else if (lat === 0 && dep > 0) {
  azimuth_dd = 90 + bearing;
} else if (lat === 0 && dep < 0) {
  azimuth_dd = 270 + bearing;
} else {
  azimuth_dd = "NA";
}

const degree = Math.floor(azimuth_dd);
const minutes = (azimuth_dd - degree) * 60;
const minutes_fractional = Math.floor(minutes);
const seconds = (minutes - minutes_fractional) * 60;


console.log(`Azimuth from the North: ${degree}-${minutes_fractional}-${seconds.toFixed (2)}`);

const Distance = (sqrt((lat ** 2) + (dep ** 2))).toFixed (3);
console.log("Distance: ", Distance);
  
  return (
    <View style={styles.box}>
      <View style={styles.box_1}>
        <Text style={styles.titleText}>BACKSIGHT CALCULATOR!</Text>
      </View>
      
      <View style={styles.box_2}>
        <View style={styles.box_2A}>
          <Text style={styles.case_design}>Station Occupied</Text>
        </View>

        <View style={styles.box_2B}>
        <TextInput
        style={styles.input}
        onChangeText={onChangeinputValue}
        value={inputValue}
      />
       <Button
      title="Convert"
      onPress={() => convertValue(inputValue)}
      /> 
        </View>
      </View>

      <View style={styles.box_3}>
      <View style={styles.box_3A}>
        <Text style={styles.result_box}>Result:</Text>
        <Text style={styles.result_box}>{value}</Text>
        </View>
      </View>

      <View style={styles.box_4}>
      <Text style={styles.titleQuote}>Sometimes, we need to convert things in our lives for us to attain our desires.</Text>
      </View>
    </View>
  );
}

/*
The following section contains the designs and layout of each box.
*/

const styles = StyleSheet.create({
  box: {
    flex: 1,
    backgroundColor: '#1d2951',
    alignItems: 'center',
    justifyContent: 'center'
  },
  box_1: {
    width: '100%',
    height: '15%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  titleText: {
    fontSize: 30,
    fontWeight: '600',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'serif',
    color: "white"
  },
  box_2: {
    width: '100%',
    height: '35%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10
  },
  box_2A: {
    flexDirection: 'column',
    backgroundColor: '#FFF6CC',
    width: '100%',
    height: '50%',
    padding: 10
  },
  case_design: {
    fontSize: 24,
    fontWeight: '200',
    fontFamily: 'serif',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'black'
  },
  box_2B: {
    flex: 1,
    backgroundColor: '#FFF6CC',
    width: '100%',
    height: '50%'
  },
  input: {
    height: '50%',
    width: '70%',
    fontSize: 40,
    color: 'black',
    fontFamily: 'serif',
    alignItems: 'center',
    justifyContent: 'center'
  },
  box_3: {
    width: '100%',
    height: '35%',
    padding: 10
  },
  box_3A: {
    flex: 1,
    backgroundColor: '#FFF6CC',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  result_box: {
    fontSize: 50,
    fontWeight: '600',
    fontFamily: 'serif',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'black'
  },
  box_4: {
    width: '100%',
    height: '15%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10
  },
  titleQuote: {
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'serif',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white'
  },
});