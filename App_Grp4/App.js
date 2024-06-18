import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { StyleSheet, Text, TextInput, View, Pressable, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

function CustomButton({ onPress, title }) {
    return (
        <Pressable style={styles.button} onPress={onPress}>
            <Text style={styles.buttonText}>{title}</Text>
        </Pressable>
    );
}

function HomeScreen({ navigation }) {
    const [Northing_SO_i, onChangeNorthing_SO] = useState(''); // Northing of the station occupied
    const [Easting_SO_i, onChangeEasting_SO] = useState(''); // Easting of the station occupied
    const [Northing_SS_i, onChangeNorthing_SS] = useState(''); // Northing of the station sighted
    const [Easting_SS_i, onChangeEasting_SS] = useState(''); // Easting of the station sighted

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.box_title}>
                    <Text style={styles.text_title}>[TITLE]</Text>
                </View>

                <View style={styles.box}>
                    <View style={styles.box_station}>
                        <Text style={styles.text_station}>STATION OCCUPIED</Text>
                    </View>

                    <View style={styles.box_station_NE}>
                        <Text style={styles.text_NE}>Northing: </Text>
                        <TextInput
                            style={styles.text_input}
                            onChangeText={onChangeNorthing_SO}
                            value={Northing_SO_i}
                            placeholder="Input text"
                            keyboardType="numeric" // Allow only numbers as input
                        />
                    </View>

                    <View style={styles.box_station_NE}>
                        <Text style={styles.text_NE}>Easting: </Text>
                        <TextInput
                            style={styles.text_input}
                            onChangeText={onChangeEasting_SO}
                            value={Easting_SO_i}
                            placeholder="Input text"
                            keyboardType="numeric"
                        />
                    </View>
                </View>

                <View style={styles.box}>
                    <View style={styles.box_station}>
                        <Text style={styles.text_station}>STATION SIGHTED</Text>
                    </View>

                    <View style={styles.box_station_NE}>
                        <Text style={styles.text_NE}>Northing: </Text>
                        <TextInput
                            style={styles.text_input}
                            onChangeText={onChangeNorthing_SS}
                            value={Northing_SS_i}
                            placeholder="Input text"
                            keyboardType="numeric"
                        />
                    </View>

                    <View style={styles.box_station_NE}>
                        <Text style={styles.text_NE}>Easting: </Text>
                        <TextInput
                            style={styles.text_input}
                            onChangeText={onChangeEasting_SS}
                            value={Easting_SS_i}
                            placeholder="Input text"
                            keyboardType="numeric"
                        />
                    </View>
                </View>

                <CustomButton
                    title="Compute"
                    onPress={() => navigation.navigate('Results', { Northing_SO_i, Easting_SO_i, Northing_SS_i, Easting_SS_i })}
                />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

function ResultsScreen({ route, navigation }) {
    const { Northing_SO_i, Easting_SO_i, Northing_SS_i, Easting_SS_i } = route.params;
    const [Azimuth, onChangeAzimuth] = useState('');
    const [Distance, onChangeDistance] = useState('');

    const Northing_SO = parseFloat(Northing_SO_i);
    const Easting_SO = parseFloat(Easting_SO_i);
    const Northing_SS = parseFloat(Northing_SS_i);
    const Easting_SS = parseFloat(Easting_SS_i);

    function getLatitude(Northing_SS, Northing_SO) {
        return Northing_SS - Northing_SO;
    }

    function getDeparture(Easting_SS, Easting_SO) {
        return Easting_SS - Easting_SO;
    }

    function getAzimuthandDistance() {
        const lat = getLatitude(Northing_SS, Northing_SO);
        const dep = getDeparture(Easting_SS, Easting_SO);
        const distance = (Math.sqrt((lat ** 2) + (dep ** 2))).toFixed(3);
        onChangeDistance(distance);

        let bearing;
        if (lat !== 0) {
            bearing = Math.atan(Math.abs(dep) / Math.abs(lat)) * (180 / Math.PI);
        } else if (lat === 0) {
            bearing = 0;
        } else {
            bearing = "N/A";
        }

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

        convertToDMS(azimuth_dd);
    }

    function convertToDMS(azimuth_dd) {
        const degrees = Math.floor(azimuth_dd);
        const minutes = Math.floor((azimuth_dd - degrees) * 60);
        const seconds = ((azimuth_dd - degrees - (minutes / 60)) * 3600).toFixed(2);

        const azimuth_dms = degrees.toString().concat("-", minutes.toString(), "-", seconds.toString());
        onChangeAzimuth(azimuth_dms);
    }

    React.useEffect(() => {
        getAzimuthandDistance();
    }, []);

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.box}>
                    <View style={styles.box_resultA}>
                        <Text style={styles.text_result1}>Azimuth (North):</Text>
                        <Text style={styles.text_result2}>{Azimuth}</Text>
                    </View>
    
                    <View style={styles.box_resultD}>
                        <Text style={styles.text_result1}>Distance (meters):</Text>
                        <Text style={styles.text_result2}>{Distance}</Text>
                    </View>
    
                    <CustomButton
                        title="Back"
                        onPress={() => navigation.goBack()}
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}    

export default function App() {
    const [fontsLoaded] = useFonts({
        'Helvetica': require('./assets/fonts/helvetica.ttf'),
        'Rowdy-Bold': require('./assets/fonts/Rowdy-Bold.ttf'),
        'Rowdy-Light': require('./assets/fonts/Rowdy-Light.ttf'),
        'Rowdy-Regular': require('./assets/fonts/Rowdy-Regular.ttf'),
    });

    if (!fontsLoaded) {
        return null; // Prevent rendering until fonts are loaded
    }

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Backsight Calculator">
                <Stack.Screen name="Backsight Calculator" component={HomeScreen} />
                <Stack.Screen name="Results" component={ResultsScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FF8FBD',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    box_title: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    text_title: {
        fontSize: 35,
        fontFamily: 'Rowdy-Bold',
        color: "white",
    },
    box: {
        width: '100%',
        padding: 10,
    },
    box_station: {
        flexDirection: 'column',
        backgroundColor: '#F8DAE1',
        width: '100%',
        paddingHorizontal: 10,
        paddingVertical: 5,
        alignItems: 'center',
    },
    box_station_NE: {
        flexDirection: 'column',
        backgroundColor: '#F8DAE1',
        width: '100%',
        padding: 10,
        paddingTop: 0,
    },
    text_station: {
        fontSize: 28,
        fontFamily: 'Rowdy-Bold',
        color: 'black',
    },
    text_NE: {
        fontSize: 30,
        fontFamily: 'Rowdy-Light',
        color: 'black',
    },
    text_input: {
        height: 40,
        width: '100%',
        fontSize: 25,
        color: 'black',
        fontFamily: 'Helvetica',
        backgroundColor: 'white',
        paddingLeft: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    box_resultA: {
        backgroundColor: '#F8DAE1',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
    },
    box_resultD: {
        backgroundColor: '#F8DAE1',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
    },
    text_result1: {
        fontSize: 30,
        fontFamily: 'Rowdy-Bold',
        color: 'black',
        textAlign: 'center',
    },
    text_result2: {
        fontSize: 40,
        fontFamily: 'Rowdy-Regular',
        color: 'black',
        textAlign: 'center',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: '#bb437e',
        marginVertical: 10,
        alignSelf: 'center',
    },
    buttonText: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
    },
});
