import React, { useState, useEffect, useRef } from 'react';
import { TextInput, Modal, Platform, Text, View, StyleSheet, TouchableHighlight, Alert } from 'react-native';
import * as Location from 'expo-location';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Constants from 'expo-constants';
import facade from "./serverFacade";

//const SERVER_URL = "https://1bf1238a.ngrok.io";

const MyButton = ({ txt, onPressButton }) => {
  return (
    <TouchableHighlight style={styles.touchable} onPress={onPressButton}>
      <Text style={styles.touchableTxt}>{txt}</Text>
    </TouchableHighlight>
  );
}

export default App = () => {

  //HOOKS
  const [position, setPosition] = useState({ latitude: null, longitude: null })
  const [errorMessage, setErrorMessage] = useState(null);
  const [gameArea, setGameArea] = useState([]);
  const [region, setRegion] = useState(null);
  const [serverIsUp, setServerIsUp] = useState(false);
  const [status, setStatus] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleLogin, setModalVisibleLogin] = useState(false);
  const [textValueName, onChangeTextName] = useState('Username');
  const [textValuePass, onChangeTextPass] = useState('Password');
  const [nearbyPlayer, setNearbyPlayer] = useState(false);
  const [nearbyPlayerLocation, setNearbyPlayerLocation] = useState({});
  const [arrayUsersClose, setArrayUsersClose] = useState([]);
  let mapRef = useRef(null);


  useEffect(() => {
    getLocationAsync();
    //ShowModal();


  }, [])

  useEffect(() => {
    getGameArea();


  }, [])

  async function getGameArea() {
    //Fetch gameArea via the facade, and call this method from within (top) useEffect
    try {
      const area = await facade.fetchGameArea();
      setGameArea(area)
      setServerIsUp(true)
    } catch (err) {
      setErrorMessage("Could not fetch GameArea")
    }

  }

  getLocationAsync = async () => {
    //Request permission for users location, get the location and call this method from useEffect
    let { status } = await Location.requestPermissionsAsync();
    if (status !== 'granted') {
      setErrorMessage('Permission to access location was denied');
      return
    }

    let location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });
    setPosition({ latitude: location.coords.latitude, longitude: location.coords.longitude })
    setRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421
    });


  };

  /*
  When a press is done on the map, coordinates (lat,lon) are provided via the event object
  */
  onMapPress = async (event) => {
    //Get location from where user pressed on map, and check it against the server
    const coordinate = event.nativeEvent.coordinate;
    const lon = coordinate.longitude
    const lat = coordinate.latitude
    try {
      const status = await facade.isUserInArea(lon, lat);
      showStatusFromServer(setStatus, status);
    } catch (err) {
      Alert.alert("Error", "Server could not be reached")
      setServerIsUp(false);
    }



  }

  onCenterGameArea = () => {
    // (RED) Center map around the gameArea fetched from the backend
    //Hardcoded, should be calculated as center of polygon received from server
    const latitude = 55.777055745928664;
    const longitude = 12.55897432565689;
    mapRef.current.animateToRegion({
      latitude,
      longitude,
      latitudeDelta: 0.002,
      longitudeDelta: 0.04,
    }, 1000);



  }

  sendRealPosToServer = async () => {
    //Upload users current position to the isuserinarea endpoint and present result
    const lat = position.latitude
    const lon = position.longitude;
    try {
      const status = await facade.isUserInArea(lon, lat);
      showStatusFromServer(setStatus, status);
    } catch (err) {
      setErrorMessage("Could not get result from server")
      setServerIsUp(false)
    }

  }

  ShowModal = async () => {


  }

  loginreq = async (username, password,lon,lat) => { //without array
    //maybe need a usestate for new players and i need new map markers
    try {
      const usersClose = await facade.login(username,password,lon,lat);
      setArrayUsersClose(usersClose);
      //console.log(usersClose);
      const player1 = usersClose[1];
      //console.log(player1);
      setNearbyPlayerLocation(player1);
      //console.log(nearbyPlayerLocation);
      setNearbyPlayer(true)
      setModalVisibleLogin(!modalVisibleLogin)
    } catch (err) {
      setErrorMessage("Could not fetch nearbyplayers")
    }

  }


  async function maybedel(){
    
  }

  const info = serverIsUp ? status : " Server is not up";
  const pinColors = ["red", "green","purple", "yellow", "orange","tomato","gold","wheat","linen","tan",
"aqua","teal","violet","indigo","turquoise","navy","plum"]

  return (
    //modal at the top, with login and about page(about just saying my student id or name)
    <View style={{ flex: 1, paddingTop: 20 }}>

      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}>
        <View style={{ marginTop: 22 }}>
          <View>
            <Text style={{ textAlign: "center" }}>About Page</Text>
            <Text style={{ textAlign: "center" }}>Project by Frederik Lassen, cph-fl91</Text>
            <MyButton style={{ flex: 2 }} onPressButton={() => setModalVisible(!modalVisible)}
        txt="Hide" />
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisibleLogin}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}>
        <View style={{ marginTop: 22 }}>
          <View>
            <Text style={{ textAlign: "center" }}>Login page</Text>
            <TextInput 
            style={{height:40, borderColor: 'gray', borderWidth: 1}}
            onChangeText={text=>onChangeTextName(text)}
            value={textValueName}/>
            <TextInput 
            style={{height:40, borderColor: 'gray', borderWidth: 1}}
            onChangeText={text=>onChangeTextPass(text)}
            value={textValuePass}/>
            <MyButton style={{ flex: 2 }} onPressButton={()=>loginreq(textValueName,textValuePass,position.longitude,position.latitude)} //not sure bout syntax here for loginreq function but use textinputs above and position usestate
        txt="Login with location" /> 
        {/* better placeholder, hidden PW     */}
            <MyButton style={{ flex: 2 }} onPressButton={() => setModalVisibleLogin(!modalVisibleLogin)}
        txt="Hide" />
          </View>
        </View>
      </Modal>

      <View style={styles.buttoncontainer}>
       <View style={styles.buttons}>
        <MyButton  onPressButton={() => setModalVisible(true)}
          txt="About" />
        </View>
        <View style={styles.buttons}>
          <MyButton  onPressButton={() => setModalVisibleLogin(true)}
          txt="Login" />
        </View>
      </View>

      {!region && <Text style={styles.fetching}>
        .. Fetching data</Text>}

      {/* Add MapView */}
      {region && <MapView
        ref={mapRef}
        style={{ flex: 14 }}
        // onPress={onMapPress} //burde fjerne den der error når man trykker
        mapType="standard"
        region={region}
        showsUserLocation
        showsCompass
      >
        {/*App MapView.Polygon to show gameArea*/}
        {serverIsUp && <MapView.Polygon coordinates={gameArea}
          strokeWidth={1}
          onPress={onMapPress}
          fillColor="rgba(128, 153, 177, 0.5)" />
        }


        {/*App MapView.Marker to show users current position*/}
        <MapView.Marker title="me" pinColor="blue"
          coordinate={{ longitude: position.longitude, latitude: position.latitude }}
        />
        {/* {nearbyPlayer && <MapView.Marker title={nearbyPlayerLocation.userName} pinColor="yellow" 
        coordinate={{ latitude:nearbyPlayerLocation.lat, longitude:nearbyPlayerLocation.lon}}/>} */}

{nearbyPlayer && arrayUsersClose[0] != null && arrayUsersClose.map((marker, index) => (
            <MapView.Marker
                key = {index}
                pinColor = {pinColors[Math.floor(Math.random() * pinColors.length)]} //choose a random color in a array of like 5 or 6
                coordinate = {{
                    latitude: marker.lat,
                    longitude: marker.lon
                }}
                title = { marker.userName }
            />
        ))
 }

      </MapView>
      }


      <Text style={{ flex: 1, textAlign: "center", fontWeight: "bold" }}>
        Your position (lat,long): {position.latitude}, {position.longitude}
      </Text>
      {/* <Text style={{ flex: 1, textAlign: "center" }}>{info}</Text>

      <MyButton style={{ flex: 2 }} onPressButton={sendRealPosToServer}
        txt="Upload real Position" />

      <MyButton style={{ flex: 2 }} onPressButton={() => onCenterGameArea()}
        txt="Show Game Area" /> */}
    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  },
  touchable: { backgroundColor: "#4682B4", margin: 3 },
  touchableTxt: { fontSize: 22, textAlign: "center", padding: 5 },

  fetching: {
    fontSize: 35, flex: 14,
    flexDirection: "row",
    justifyContent: 'center',
    alignItems: "center",
    paddingTop: Constants.statusBarHeight
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    textAlign: 'center',
  },
  buttons:{
    flex:1,
  },
  buttoncontainer:{
    flex:1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

function showStatusFromServer(setStatus, status) {
  setStatus(status.msg);
  setTimeout(() => setStatus("- - - - - - - - - - - - - - - - - - - -"), 3000);
}
