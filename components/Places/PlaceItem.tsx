//Libs
import { View, Image, Text, Pressable, StyleSheet } from "react-native";

//Local
import { Colors } from "../../constants/styles";
import { Place } from "../../models/place";

interface Props {
  place: Place;
  onSelect: (placeId: string) => void
}

function PlaceItem({ place, onSelect }: Props) {
  return (
    <Pressable
      style={({ pressed }) => [styles.item, pressed && styles.pressed]}
      onPress={() => onSelect(place.id)}
    >
      <Image style={styles.image} source={{ uri: place.imageUri }} />
      <View style={styles.info}>
        <Text style={styles.title}>{place.title}</Text>
        <Text style={styles.address}>{place.address}</Text>
      </View>
    </Pressable>
  );
}

export default PlaceItem;

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderRadius: 6,
    marginVertical: 12,
    backgroundColor: Colors.primary500,
    elevation: 2,
    shadowColor: "black",
    shadowRadius: 2,
    shadowOpacity: 0.15,
    shadowOffset: { width: 1, height: 1 },
  },
  pressed: {
    opacity: 0.9,
  },
  image: {
    flex: 1,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    height: 100,
  },
  info: {
    flex: 2,
    padding: 12,
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    color: Colors.secondary700,
  },
  address: {
    fontSize: 12,
    color: Colors.secondary700,
  },
});
