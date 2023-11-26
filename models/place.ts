//Libs
import { z } from "zod"

//Local

export type Location = {
  lat: number;
  lng: number;
}

export interface Place {
  title: string;
  imageUri: string;
  address: string;
  location: Location;
}

export interface ExistingPlace extends Place {
  id: number;
}

export function validatePlace(value: unknown): Place {

  const result = placeSchema.parse(value)
  return result;

}

const placeSchema = z.object({
  id: z.number(),
  title: z.string().min(1).max(200),
  imageUri: z.string().min(1).max(2000),
  address: z.string().min(1).max(200),
  location: z.object({
    lat: z.number(),
    lng: z.number()
  })
})