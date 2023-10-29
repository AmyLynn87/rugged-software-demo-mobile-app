//Libs
import axios from "axios";

//Local

const apiKey = process.env.EXPO_PUBLIC_FIREBASE_API_KEY;

async function authenticate(mode: string, email: string, password: string) {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:${mode}?key=${apiKey}`;
  const response = await axios.post(url, {
    email: email,
    password: password,
    returnSecureToken: true,
  });

  return response.data.idToken;
}

export function createUser(email: string, password: string) {
  return authenticate("signUp", email, password);
}

export function login(email: string, password: string) {
  return authenticate("signInWithPassword", email, password);
}
