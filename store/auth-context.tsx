//Libs
import { createContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

//Local

interface AuthContextProps {
  token: string | null,
  isAuthenticated: boolean,
  authenticate: (token: string) => void,
  logout: () => void,
}


export const AuthContext = createContext<AuthContextProps>({
  token: "",
  authenticate: (token: string) => { },
  isAuthenticated: false,
  logout: () => { }
});

function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const [authToken, setAuthToken] = useState<string | null>(null);

  function authenticate(token: string) {
    setAuthToken(token);
    AsyncStorage.setItem("token", token);
  }

  function logout() {
    setAuthToken(null);
    AsyncStorage.setItem("token", "");
  }

  const value: AuthContextProps = {
    token: authToken,
    isAuthenticated: !!authToken,
    authenticate: authenticate,
    logout: logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContextProvider;
