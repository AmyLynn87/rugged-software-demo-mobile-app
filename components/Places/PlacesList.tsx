//Libs
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

//Local
import { Colors } from "../../constants/styles";
import PlaceItem from "./PlaceItem";
import { ExistingPlace } from "../../models/place";
import { StackParams } from "../../App";

interface Props {
  places: ExistingPlace[]
}

type NavigationProps = NativeStackNavigationProp<StackParams, 'PlaceDetails'>;

function PlacesList({ places }: Props) {
  const navigation: NavigationProps = useNavigation();

  function selectPlaceHandler(id: number) {
    navigation.navigate("PlaceDetails", {
      placeId: id,
    });
  }

  if (!places || places.length === 0) {
    return (
      <View style={styles.fallbackContainer}>
        <Text style={styles.fallbackText}>
          No places added yet - start adding some
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.list}
      data={places}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <PlaceItem place={item} onSelect={selectPlaceHandler} />
      )}
    />
  );
}

export default PlacesList;

const styles = StyleSheet.create({
  list: {
    margin: 24,
  },
  fallbackContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fallbackText: {
    fontSize: 16,
    color: Colors.secondary900,
  },
});
