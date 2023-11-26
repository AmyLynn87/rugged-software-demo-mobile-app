//Libs
import { Alert, Image, StyleSheet, Text, View } from "react-native";
import {
  getCurrentPositionAsync,
  useForegroundPermissions,
  PermissionStatus,
} from "expo-location";
import { useState, useEffect } from "react";
import {
  useNavigation,
  useRoute,
  useIsFocused,
} from "@react-navigation/native";
import type { RouteProp } from '@react-navigation/native';

//Local
import OutlinedButton from "../ui/OutlinedButton";
import { Colors } from "../../constants/styles";
import { getAddress, getMapPreview } from "../../util/location";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParams } from "../../App";
import { Location } from "../../models/place";

interface Props {
  onPickLocation: (pickedLocation: Location & { address: string }) => void;
}

type MapScreenNavigationProps = NativeStackNavigationProp<StackParams, 'Map'>;
type AddPlaceScreenRouteProps = RouteProp<StackParams, 'AddPlace'>;

function LocationPicker({ onPickLocation }: Props) {
  const [pickedLocation, setPickedLocation] = useState<Location>({ lat: 0, lng: 0 });
  const isFocused = useIsFocused();

  const navigation: MapScreenNavigationProps = useNavigation();
  const route: AddPlaceScreenRouteProps = useRoute();

  const [locationPermissionsInformation, requestPermission] =
    useForegroundPermissions();

  useEffect(() => {
    if (isFocused && route.params) {
      const mapPickedLocation: Location = {
        lat: route.params.pickedLat,
        lng: route.params.pickedLng,
      };
      setPickedLocation(mapPickedLocation);
    }
  }, [isFocused, route]);

  useEffect(() => {
    async function handleLocation() {
      if (pickedLocation) {
        const address = await getAddress(
          pickedLocation.lat,
          pickedLocation.lng
        );
        onPickLocation({ ...pickedLocation, address: address });
      }
    }
    handleLocation();
  }, [pickedLocation, onPickLocation]);

  async function verifyPermissions() {
    if (locationPermissionsInformation &&
      locationPermissionsInformation.status === PermissionStatus.UNDETERMINED
    ) {
      const permissionResponse = await requestPermission();
      return permissionResponse.granted;
    }

    if (locationPermissionsInformation && locationPermissionsInformation.status === PermissionStatus.DENIED) {
      Alert.alert(
        "Insufficient Permissions!",
        "You need to grant location permissions to use this app."
      );
      return false;
    }

    return true;
  }

  async function getLocationHandler() {
    const hasPermission = await verifyPermissions();

    if (!hasPermission) return;

    const location = await getCurrentPositionAsync();
    setPickedLocation({
      lat: location.coords.latitude,
      lng: location.coords.longitude,
    });
  }

  function pickOnMapHandler() {
    navigation.navigate("Map", { initialLat: 0, initialLng: 0 });
  }

  let locationPreview = <Text>No location picked yet.</Text>;

  if (pickedLocation) {
    locationPreview = (
      <Image
        style={styles.image}
        source={{
          uri: getMapPreview(pickedLocation.lat, pickedLocation.lng),
        }}
      />
    );
  }

  return (
    <View>
      <View style={styles.mapPreview}>{locationPreview}</View>
      <View style={styles.actions}>
        <OutlinedButton icon="location" onPress={getLocationHandler}>
          Locate User
        </OutlinedButton>
        <OutlinedButton icon="map" onPress={pickOnMapHandler}>
          Pick on Map
        </OutlinedButton>
      </View>
    </View>
  );
}

export default LocationPicker;

const styles = StyleSheet.create({
  mapPreview: {
    width: "100%",
    height: 200,
    marginVertical: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary100,
    borderRadius: 4,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 4,
  },
});
