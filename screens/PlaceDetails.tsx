//Libs
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

//Local
import { Colors } from "../constants/styles";
import { fetchPlaceDetails } from "../util/database";
import { StackParams } from "../App";
import OutlinedButton from "../components/ui/OutlinedButton";
import { Place, validatePlace } from "../models/place";


type Props = NativeStackScreenProps<StackParams, 'PlaceDetails', "Map">;

export default function PlaceDetails({ route, navigation }: Props) {
  const [fetchedPlace, setFetchedPlace] = useState<Place | null>(null);

  function showOnMapHandler() {
    if (fetchedPlace) {
      navigation.navigate("Map", {
        initialLat: fetchedPlace.location.lat,
        initialLng: fetchedPlace.location.lng,
      });
    }
  }

  const selectedPlaceId = route.params.placeId;

  useEffect(() => {
    async function loadPlaceData() {
      const place = await fetchPlaceDetails(selectedPlaceId);
      const validPlace = validatePlace(place)
      setFetchedPlace(validPlace);
      navigation.setOptions({
        title: validPlace.title,
      });
    }
    loadPlaceData();
  }, [selectedPlaceId]);

  if (!fetchedPlace) {
    return (
      <View style={styles.fallback}>
        <Text>Loading place data...</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <Image style={styles.image} source={{ uri: fetchedPlace.imageUri }} />
      <View style={styles.locationContainer}>
        <View style={styles.addressContainer}>
          <Text style={styles.address}>{fetchedPlace.address}</Text>
        </View>
        <OutlinedButton icon="map" onPress={showOnMapHandler}>
          View On Map
        </OutlinedButton>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  fallback: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    height: "35%",
    minHeight: 300,
    width: "100%",
  },
  locationContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  addressContainer: {
    padding: 20,
  },
  address: {
    color: Colors.primary500,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
});
