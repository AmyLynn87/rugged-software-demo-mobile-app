//Libs
import { NativeStackScreenProps } from "@react-navigation/native-stack";

//Local
import { StackParams } from "../App";
import { insertPlace } from "../util/database";
import { Place } from "../models/place";
import PlaceForm from "../components/Places/PlaceForm";

type Props = NativeStackScreenProps<StackParams, 'AddPlace'>;

function AddPlace({ navigation }: Props) {

  async function createPlaceHandler(place: Place) {
    await insertPlace(place);
    navigation.navigate("AllPlaces");
  }

  return <PlaceForm onCreatePlace={createPlaceHandler} />;
}

export default AddPlace;
