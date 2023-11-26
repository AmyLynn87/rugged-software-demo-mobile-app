//Libs
import * as SQLite from "expo-sqlite";

//Local
import { ExistingPlace, Place } from "../models/place";

const database = SQLite.openDatabase("places.db");

export const init = () => {
  const promises = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        ` CREATE TABLE IF NOT EXISTS places (
        id INTEGER PRIMARY KEY NOT NULL, 
        title TEXT NOT NULL, 
        imageUri TEXT NOT NULL, 
        address TEXT NOT NULL, 
        lat REAL NOT NULL, 
        lng REAL NOT NULL)`,
        [],
        () => {
          resolve(true);
          console.log("Created database OK");
        },
        (error) => {
          reject(error);
          return true;
        }
      );
    });
  });
  return promises;
};

export function insertPlace(place: Place) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO places (title, imageUri, address, lat, lng) VALUES (?,?,?,?,?)`,
        [
          place.title,
          place.imageUri,
          place.address,
          place.location.lat,
          place.location.lng,
        ],
        (_, result) => {
          resolve(result);
        },
        (_, error) => {
          reject(error);
          return true;
        }
      );
    });
  });
  return promise;
}

export function fetchPlaces() {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM places`,
        [],
        (_, result) => {
          const places: Place[] = [];

          for (const dp of result.rows._array) {
            const place: ExistingPlace = {
              address: dp.address,
              id: dp.id,
              imageUri: dp.imageUri,
              title: dp.title,
              location: {
                lat: dp.lat,
                lng: dp.lng
              }
            }
            places.push(place);
          }
          resolve(places);
        },
        (_, error) => {
          reject(error);
          return true;
        }
      );
    });
  });
  return promise;
}

export function fetchPlaceDetails(id: string) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM places WHERE id = ?`,
        [id],
        (_, result) => {
          const dbPlace = result.rows._array[0];
          const place: ExistingPlace = {
            address: dbPlace.address,
            id: dbPlace.id,
            imageUri: dbPlace.imageUri,
            title: dbPlace.title,
            location: {
              lat: dbPlace.lat,
              lng: dbPlace.lng
            }
          }
          resolve(place);
        },
        (_, error) => {
          reject(error);
          return true;
        }
      );
    });
  });
  return promise;
}
