//Libs
import { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";

//Local
import PlacesList from "../components/Places/PlacesList";
import { fetchPlaces } from "../util/database";
import { ExistingPlace, Place, validatePlace } from "../models/place";

function AllPlaces() {
  const [loadedPlaces, setLoadedPlaces] = useState<ExistingPlace[]>([]);

  const isFocused = useIsFocused();

  useEffect(() => {
    async function loadPlaces() {
      //TODO: fix this
      const places: any = await fetchPlaces();
      const validPlaces = places.map((place: unknown) => validatePlace(place))
      setLoadedPlaces(validPlaces);
    }
    if (isFocused) {
      loadPlaces();
    }
  }, [isFocused]);

  return <PlacesList places={loadedPlaces} />;
}

export default AllPlaces;
