//Libs
import { NavigationContainer, NavigatorScreenParams } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer"
import { Fragment, useContext, useEffect, useState, useCallback } from "react";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SplashScreen from "expo-splash-screen";
import { View } from "react-native";
import * as Font from "expo-font";
import Ionicons from "@expo/vector-icons/Ionicons";
import Entypo from "@expo/vector-icons/Entypo";

//Local
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import WelcomeScreen from "./screens/WelcomeScreen";
import { Colors } from "./constants/styles";
import AuthContextProvider, { AuthContext } from "./store/auth-context";
import IconButton from "./components/ui/IconButton";
import AllPlaces from "./screens/AllPlaces";
import PlaceDetails from "./screens/PlaceDetails";
import Map from "./screens/Map";
import AddPlace from "./screens/AddPlace";

export type StackParams = {
  Login: undefined;
  Signup: undefined;
  Drawer: NavigatorScreenParams<DrawerParams>;
  PlaceDetails: { placeId: number };
  Map: { initialLat: number, initialLng: number }
  AddPlace: { pickedLat: number, pickedLng: number }
}

export type DrawerParams = {
  Home: undefined;
  AllPlaces: undefined;
}

const Stack = createNativeStackNavigator<StackParams>();
const Drawer = createDrawerNavigator<DrawerParams>()

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.secondary900 },
        headerTintColor: Colors.primary500,
        contentStyle: { backgroundColor: Colors.primary100 },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}

function DrawerNavigator() {
  const authCtx = useContext(AuthContext);
  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.secondary900 },
        headerTintColor: Colors.primary500,
        sceneContainerStyle: { backgroundColor: Colors.primary100 },
        drawerContentStyle: { backgroundColor: Colors.secondary900 },
        drawerInactiveTintColor: "white",
        drawerActiveTintColor: Colors.secondary900,
        drawerActiveBackgroundColor: Colors.primary500,
      }}
    >
      <Drawer.Screen
        name="Home"
        component={WelcomeScreen}
        options={{
          headerRight: ({ tintColor }) => (
            <IconButton
              icon="exit"
              color={tintColor ?? "white"}
              size={24}
              onPress={authCtx.logout}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="AllPlaces"
        component={AllPlaces}
        options={({ navigation }) => ({
          title: "Your Favorite Places",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="list" color={color} size={size} />
          ),
          headerRight: ({ tintColor }) => (
            <IconButton
              color={tintColor ?? "white"}
              icon="add"
              size={24}
              onPress={() => navigation.navigate("AddPlace")}
            />
          )
        })}
      />
    </Drawer.Navigator>
  )
}

function AuthenticatedStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.secondary900 },
        headerTintColor: Colors.primary500,
        contentStyle: { backgroundColor: Colors.primary100 },
      }}
    >
      <Stack.Screen
        name="Drawer"
        component={DrawerNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AddPlace"
        component={AddPlace}
        options={{
          title: "Add a new Place",
        }}
      />
      <Stack.Screen name="Map" component={Map} />
      <Stack.Screen
        name="PlaceDetails"
        component={PlaceDetails}
        options={{
          title: "Loading Place...",
        }}
      />
    </Stack.Navigator >
  );
}

function Navigation() {
  const authCtx = useContext(AuthContext);

  return (
    <NavigationContainer>
      {!authCtx.isAuthenticated && <AuthStack />}
      {authCtx.isAuthenticated && <AuthenticatedStack />}
    </NavigationContainer>
  );
}

function Root() {
  const [isTryingLogin, setIsTryingLogin] = useState(true);
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        await Font.loadAsync(Entypo.font);
        const storedToken = await AsyncStorage.getItem("token");

        if (storedToken) {
          authCtx.authenticate(storedToken);
        }

      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setIsTryingLogin(false);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (isTryingLogin) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [isTryingLogin]);

  if (!isTryingLogin) {
    return <Navigation />;
  }

  return (
    <View
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      onLayout={onLayoutRootView}
    >
      <Entypo name="rocket" size={30} />
    </View>
  );
}

export default function App() {
  return (
    <Fragment>
      <StatusBar style="light" />
      <AuthContextProvider>
        <Root />
      </AuthContextProvider>
    </Fragment>
  );
}
