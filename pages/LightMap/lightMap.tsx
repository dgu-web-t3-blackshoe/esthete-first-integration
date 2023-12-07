//4-1 4-2
import React, { useState, useRef, useEffect } from "react";

//요소
import {
  Image,
  Alert,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator as Spinner,
} from "react-native";
import { NavBar, SvgType } from "../../components/navbar";

//구글지오코딩 API KEY
import { API_KEY } from "@env";

//Redux
import { useSelector } from "react-redux";
import { State } from "../../storage/reducers";

//라이브러리
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import Icon from "react-native-vector-icons/FontAwesome5";

//네비게이션
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

//api
import axios from "axios";
import { SERVER_IP } from "../../components/utils";

type RootStackParamList = {
  LightMapList: {
    state: string;
    city: string;
    town: string;
  };
  Error: undefined;
};

const LightMap: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  //현재 위치 (기본값 : 서울역)
  const [currentRegion, setCurrentRegion] = useState({
    latitude: 37.557067,
    longitude: 126.971179,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  //현재 위치 업데이트
  const { lat, lon } = useSelector((state: State) => state.location);
  //맵뷰의 현재 보여주는 곳 참조
  const mapRef = useRef<MapView>(null);

  //좌표 찍을 곳
  const [locationInfo, setLocationInfo] = useState<any>(null);

  useEffect(() => {
    if (lat !== null && lon !== null) {
      setCurrentRegion({
        latitude: lat,
        longitude: lon,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      getLocationInfo(lat, lon);
    }
  }, [lat, lon]);

  useEffect(() => {
    if (locationInfo) {
      getData(lat, lon);
    }
  }, [locationInfo]);

  const goToCurrentLocation = async () => {
    let currentLocation = await Location.getCurrentPositionAsync({});
    setCurrentRegion({
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
    mapRef.current?.animateToRegion(
      {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      1000
    );
  };

  const getLocationInfo = async (latitude: number, longitude: number) => {
    try {
      const response = await axios.get(
        "https://maps.googleapis.com/maps/api/geocode/json",
        {
          params: {
            latlng: `${latitude},${longitude}`,
            key: API_KEY,
            language: "ko",
          },
        }
      );

      const formattedAddress = response.data.results[0].formatted_address;

      const addressParts = formattedAddress.split(" ");
      if (addressParts.includes("대한민국")) {
        const indexofC = addressParts.indexOf("대한민국");
        const state = addressParts[indexofC + 1] || "";
        const city = addressParts[indexofC + 2] || "";
        const town = addressParts[indexofC + 3] || "";
        setLocationInfo([state, city, town]);
      } else {
        const state = addressParts[1] || "";
        const city = addressParts[2] || "";
        const town = addressParts[3] || "";
        setLocationInfo([state, city, town]);
      }
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const [photoData, setPhotoData] = useState<any>(null);

  const getData = async (lat: any, lon: any) => {
    try {
      const response = await axios.get(
        `${SERVER_IP}core/photos/locations/current?longitude=${lon}&latitude=${lat}&radius=100000&group=city`
      );
      setPhotoData(response.data.content);
    } catch (e) {
      navigation.replace("Error");
      console.log(e);
    }
  };

  const [dataWithmMarkers, setDataWithmMarkers] = useState<Array<object>>([]);
  useEffect(() => {
    const fetchCoordinates = async () => {
      if (photoData !== null) {
        const temp = await Promise.all(
          photoData
            .filter((e: { state: string }) => e.state !== "string")
            .map(async (e: { state: string; city: string }) => {
              const latlon: any = await getLatLon(e.state, e.city, "");
              return {
                ...e,
                latitude: latlon[0],
                longitude: latlon[1],
              };
            })
        );

        setDataWithmMarkers((prev) => [...prev, ...temp]);
      }
    };

    fetchCoordinates();
  }, [photoData]);

  //데이터 받아오면 그걸로 위도, 경도 받아오기
  const getLatLon = async (country: string, state: string, city: string) => {
    try {
      const address = `${city}, ${state}, ${country}`;

      const response = await axios.get(
        "https://maps.googleapis.com/maps/api/geocode/json",
        {
          params: {
            address: address,
            key: API_KEY,
          },
        }
      );
      const location = response.data.results[0].geometry.location;
      const latitude = location.lat;
      const longitude = location.lng;
      return [latitude, longitude];
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* 맨 위 지역 명, 내 위치로 이동 버튼 뷰 시작 */}
      <View
        style={{
          backgroundColor: "white",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 20,
          height: 40,
        }}
      >
        {locationInfo && (
          <Text style={{ fontSize: 16, borderBottomWidth: 0.8, width: 250 }}>
            {locationInfo[0]}, {locationInfo[1]}, {locationInfo[2]}
          </Text>
        )}

        <TouchableOpacity onPress={goToCurrentLocation} style={{}}>
          <Icon name="map-marked" size={25} color={"black"} />
        </TouchableOpacity>
      </View>
      {/* 맨 위 지역 명, 내 위치로 이동 버튼 뷰 끝 */}
      {photoData ? (
        <MapView
          ref={mapRef}
          style={{ flex: 1 }}
          initialRegion={currentRegion}
          region={currentRegion}
          provider={PROVIDER_GOOGLE}
          onRegionChangeComplete={() => console.log("moved")}
        >
          {/* <Marker
            coordinate={{
              latitude: currentRegion.latitude,
              longitude: currentRegion.longitude,
            }}
            title={"내 위치"}
          /> */}
          {dataWithmMarkers.length > 0 &&
            dataWithmMarkers.map((e: any, i) => {
              return (
                <Marker
                  key={i}
                  coordinate={{
                    latitude: e.latitude,
                    longitude: e.longitude,
                  }}
                  // onPress={() =>
                  //   navigation.navigate("LightMapList", {
                  //     state: locationInfo[0],
                  //     city: locationInfo[1],
                  //     town: locationInfo[2],
                  //   })
                  // }
                >
                  <View
                    style={{
                      padding: 5,
                      backgroundColor: "black",
                      borderRadius: 50,
                    }}
                  >
                    <Image
                      source={{ uri: e.thumbnail }}
                      style={{
                        width:
                          e.count > 10
                            ? 100
                            : e.count > 5
                            ? 80
                            : e.count > 2
                            ? 60
                            : 50,
                        height:
                          e.count > 10
                            ? 100
                            : e.count > 5
                            ? 80
                            : e.count > 2
                            ? 60
                            : 50,
                        borderRadius: 50,
                      }}
                    />
                  </View>
                </Marker>
              );
            })}
        </MapView>
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
            backgroundColor: "black",
          }}
        >
          <Spinner size="large" color="white" />
        </View>
      )}

      <NavBar type={SvgType.LightMap} />
    </SafeAreaView>
  );
};

export default LightMap;
