import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { StyleSheet, Text, TextInput, View, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

function HomeScreen({ navigation }) {
    const [Northing_SO_i, onChangeNorthing_SO] = useState(''); // Northing of the station occupied
    const [Easting_SO_i, onChangeEasting_SO] = useState(''); // Easting of the station occupied
    const [Northing_SS_i, onChangeNorthing_SS] = useState(''); // Northing of the station sighted
    const [Easting_SS_i, onChangeEasting_SS] = useState(''); // Easting of the station sighted

    return (
        <View style={styles.box}>
            <View style={styles.box_title}>
                <Text style={styles.text_title}>BACKSIGHT CALCULATOR!</Text>
            </View>

            <View style={styles.box_2}>
                <View style={styles.box_SO}>
                    <Text style={styles.text_station}>STATION OCCUPIED</Text>
                </View>

                <View style={styles.box_SO_N}>
                    <Text style={styles.text_NE}>Northing: </Text>
                    <TextInput
                        style={styles.text_inputN}
                        onChangeText={onChangeNorthing_SO}
                        value={Northing_SO_i}
                        placeholder="Input text"
                        keyboardType="numeric" // Allow only numbers as input
                    />
                </View>

                <View style={styles.box_SO_E}>
                    <Text style={styles.text_NE}>Easting: </Text>
                    <TextInput
                        style={styles.text_inputE}
                        onChangeText={onChangeEasting_SO}
                        value={Easting_SO_i}
                        placeholder="Input text"
                        keyboardType="numeric"
                    />
                </View>

                <View style={styles.box_SS}>
                    <Text style={styles.text_station}>STATION SIGHTED</Text>
                </View>

                <View style={styles.box_SS_N}>
                    <Text style={styles.text_NE}>Northing: </Text>
                    <TextInput
                        style={styles.text_inputN}
                        onChangeText={onChangeNorthing_SS}
                        value={Northing_SS_i}
                        placeholder="Input text"
                        keyboardType="numeric"
                    />
                </View>

                <View style={styles.box_SS_E}>
                    <Text style={styles.text_NE}>Easting: </Text>
                    <TextInput
                        style={styles.text_inputE}
                        onChangeText={onChangeEasting_SS}
                        value={Easting_SS_i}
                        placeholder="Input text"
                        keyboardType="numeric"
                    />
                </View>

                <Button
                    title="Compute"
                    onPress={() => navigation.navigate('Results', { Northing_SO_i, Easting_SO_i, Northing_SS_i, Easting_SS_i })}
                    style={{backgroundColor: '#F47D91',
                      fontFamily: 'Helvetica',
                    }}
                />
            </View>
        </View>
    );
}

function ResultsScreen({ route, navigation }) {
    const { Northing_SO_i, Easting_SO_i, Northing_SS_i, Easting_SS_i } = route.params;
    const [Azimuth, onChangeAzimuth] = useState('---');
    const [Distance, onChangeDistance] = useState('---');

    const Northing_SO = parseFloat(Northing_SO_i);
    const Easting_SO = parseFloat(Easting_SO_i);
    const Northing_SS = parseFloat(Northing_SS_i);
    const Easting_SS = parseFloat(Easting_SS_i);

    function getLatitude(Northing_SS, Northing_SO) {
        const latitude = Northing_SS - Northing_SO;
        return latitude;
    }

    function getDeparture(Easting_SS, Easting_SO) {
        const departure = Easting_SS - Easting_SO;
        return departure;
    }

    function getAzimuthandDistance() {    
        const lat = getLatitude(Northing_SS, Northing_SO);
        const dep = getDeparture(Easting_SS, Easting_SO);
        const distance = (Math.sqrt((lat ** 2) + (dep ** 2))).toFixed(3) + " m"; // Calculate distance, format to 3 decimal places
        onChangeDistance(distance); // Set distance value

        let bearing;
        if (lat !== 0) {
            bearing = Math.atan(Math.abs(dep) / Math.abs(lat)) * (180 / Math.PI); // Calculate bearing
        } else if (lat === 0) {
            bearing = 0;
        } else {
            bearing = "N/A";
        }

        let azimuth_dd; // Calculate azimuth in decimal degrees
        if (lat > 0 && dep > 0) {
            azimuth_dd = bearing;
        } else if (lat < 0 && dep > 0) {
            azimuth_dd = 180 - bearing;
        } else if (lat < 0 && dep < 0) {
            azimuth_dd = 180 + bearing;
        } else if (lat > 0 && dep < 0) {
            azimuth_dd = 360 - bearing;
        } else if (lat < 0 && dep === 0) {
            azimuth_dd = 180;
        } else if (lat > 0 && dep === 0) {
            azimuth_dd = 0;
        } else if (lat === 0 && dep > 0) {
            azimuth_dd = 90;
        } else if (lat === 0 && dep < 0) {
            azimuth_dd = 270;
        } else {
            azimuth_dd = "N/A";
        }

        convertToDMS(azimuth_dd); // Convert azimuth_dd value to DMS
    }

    function convertToDMS(azimuth_dd) {
        const degrees = Math.floor(azimuth_dd);
        const minutes = Math.floor((azimuth_dd - degrees) * 60);
        const seconds = ((azimuth_dd - degrees - (minutes / 60)) * 3600).toFixed(2);

        const azimuth_dms = degrees.toString().concat("-", minutes.toString(), "-", seconds.toString()); // Format azimuth to DDD-MM-SS.ss
        onChangeAzimuth(azimuth_dms); // Set azimuth value
    }

    React.useEffect(() => {
        getAzimuthandDistance();
    }, []);

    return (
        <View style={styles.box}>
            <View style={styles.box_3}>
                <View style={styles.box_resultA}>
                    <Text style={styles.text_result1}>Azimuth from the North:</Text>
                    <Text style={styles.text_result2}>{Azimuth}</Text>
                </View>

                <View style={styles.box_resultD}>
                    <Text style={styles.text_result1}>Backsight Distance:</Text>
                    <Text style={styles.text_result2}>{Distance}</Text>
                </View>

                <Button
                    title="Back"
                    onPress={() => navigation.goBack()}
                    style={{backgroundColor: '#F47D91',
                      fontFamily: 'Helvetica',
                    }}
                />
            </View>
        </View>
    );
}

export default function App() {
    const [fontsLoaded] = useFonts({
        'Helvetica': require('./assets/fonts/helvetica.ttf'),
        'Helvetica-Bold': require('./assets/fonts/helvetica-bold.ttf'),
        'Georgia': require('./assets/fonts/georgia.ttf'),
        'Georgia-Bold': require('./assets/fonts/georgia-bold.ttf'),
    });

    if (!fontsLoaded) {
        return null; // Prevent rendering until fonts are loaded
    }

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Results" component={ResultsScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    box: {
        flex: 1,
        backgroundColor: '#FF8FBD',
        alignItems: 'center',
        justifyContent: 'center'
    },
    box_title: {
        width: '100%',
        height: '20%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    text_title: {
        fontSize: 50,
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Helvetica-Bold',
        color: "white"
    },
    box_2: {
        width: '100%',
        height: '45%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10
    },
    box_SO: {
        flexDirection: 'column',
        backgroundColor: '#F8DAE1',
        width: '100%',
        height: '10%',
        padding: 10
    },
    box_SO_N: {
        flexDirection: 'row',
        backgroundColor: '#F8DAE1',
        width: '100%',
        height: '20%',
        padding: 10
    },
    box_SO_E: {
        flexDirection: 'row',
        backgroundColor: '#F8DAE1',
        width: '100%',
        height: '20%',
        padding: 10
    },
    box_SS: {
        flexDirection: 'column',
        backgroundColor: '#F8DAE1',
        width: '100%',
        height: '10%',
        padding: 10
    },
    box_SS_N: {
        flexDirection: 'row',
        backgroundColor: '#F8DAE1',
        width: '100%',
        height: '20%',
        padding: 10
    },
    box_SS_E: {
        flexDirection: 'row',
        backgroundColor: '#F8DAE1',
        width: '100%',
        height: '20%',
        padding: 10
    },
    text_station: {
        fontSize: 28,
        fontFamily: 'Georgia-Bold',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'black'
    },
    text_NE: {
        fontSize: 30,
        fontFamily: 'Georgia-Bold',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'black'
    },
    text_inputN: {
        height: 40,
        width: '70%',
        fontSize: 30,
        color: 'black',
        fontFamily: 'Georgia',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text_inputE: {
        height: 40,
        width: '70%',
        fontSize: 30,
        color: 'black',
        fontFamily: 'Georgia',
        alignItems: 'center',
        justifyContent: 'center'
    },
    box_3: {
        width: '100%',
        height: '35%',
        padding: 10
    },
    box_resultA: {
        flex: 1,
        backgroundColor: '#F8DAE1',
        width: '100%',
        height: '50%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    box_resultD: {
        flex: 1,
        backgroundColor: '#F8DAE1',
        width: '100%',
        height: '50%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text_result1: {
        fontSize: 30,
        fontFamily: 'Georgia-Bold',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'black'
    },
    text_result2: {
        fontSize: 40,
        fontFamily: 'Georgia',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'black'
    },
});
