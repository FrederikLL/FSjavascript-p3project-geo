
import { SERVER_URL } from "./settings";

ServerFacade = () => {

  async function fetchGameArea() {
    const res = await fetch(`${SERVER_URL}/geoapi/gamearea`).then(res => res.json());
    return res.coordinates;
  }

  async function isUserInArea(lon, lat) {
    const status = await fetch(`${SERVER_URL}/geoapi/isuserinarea/${lon}/${lat}`).
                    then(res => res.json())
    return status;
  }

  async function login (username,password,lon,lat,distance){
      const test = await fetch(`${SERVER_URL}/gameapi/nearbyplayers`,{
          method:'POST',
          headers:{
              Accept: 'application/json',
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "userName":username,
            "password":password, 
            "lon":lon, 
            "lat":lat, 
            "distance":200000
          })
      }).then(res=>res.json())
      console.log(test);
      return test;
  }

  return {
    fetchGameArea,
    isUserInArea,
    login
  }
}

export default ServerFacade();