//Libs
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { DrawerScreenProps } from "@react-navigation/drawer"

//Local
import { StackParams } from "../App";
import { insertPlace } from "../util/database";
import { Place } from "../models/place";
import PlaceForm from "../components/Places/PlaceForm";

type Props = NativeStackScreenProps<StackParams, 'AddPlace' | "Drawer">

function AddPlace({ navigation }: Props) {

  async function createPlaceHandler(place: Place) {
    await insertPlace(place);
    navigation.navigate('Drawer', {
      screen: 'AllPlaces',
    });
  }

  return <PlaceForm onCreatePlace={createPlaceHandler} />;
}

export default AddPlace;
