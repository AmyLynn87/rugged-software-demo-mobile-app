//Libs
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useState, useCallback } from "react";

//Local
import { Colors } from "../../constants/styles";
import Button from "../ui/Button";
import { Location, Place } from "../../models/place";
import ImagePicker from "./ImagePicker";
import LocationPicker from "./LocationPicker";

interface Props {
  onCreatePlace: (newPlace: Place) => void
}


function PlaceForm({ onCreatePlace }: Props) {
  const [enteredTitle, setEnteredTitle] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [pickedLocation, setPickedLocation] = useState<Location & {
    address: string;
  }>({ lat: 0, lng: 0, address: "" });

  const pickLocationHandler = useCallback((pickedLocation: Location & {
    address: string;
  }) => {
    setPickedLocation(pickedLocation);
  }, []);

  function savePlaceHandler() {
    const placeData: Place = {
      title: enteredTitle,
      imageUri: selectedImage,
      location: { lat: pickedLocation.lat, lng: pickedLocation.lng },
      address: pickedLocation.address
    }
    onCreatePlace(placeData);
  }

  return (
    <ScrollView style={styles.form}>
      <View>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          onChangeText={(enteredText) => setEnteredTitle(enteredText)}
          value={enteredTitle}
        />
      </View>
      <ImagePicker onTakeImage={(imageUri: string) => setSelectedImage(imageUri)} />
      <LocationPicker onPickLocation={pickLocationHandler} />
      <Button onPress={savePlaceHandler}>Add Place</Button>
    </ScrollView>
  );
}

export default PlaceForm;

const styles = StyleSheet.create({
  form: {
    flex: 1,
    padding: 24,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 4,
    color: Colors.primary500,
  },
  input: {
    marginVertical: 8,
    paddingHorizontal: 4,
    paddingVertical: 8,
    fontSize: 16,
    borderBottomColor: Colors.primary700,
    borderBottomWidth: 2,
    backgroundColor: Colors.primary100,
  },
});
