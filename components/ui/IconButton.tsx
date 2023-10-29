//Libs
import { GestureResponderEvent, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

//Local

interface Props {
  onPress: (event: GestureResponderEvent) => void;
  icon: keyof typeof Ionicons.glyphMap
  color: string
  size: number
}

function IconButton({ icon, color, size, onPress }: Props) {
  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      onPress={onPress}
    >
      <Ionicons name={icon} color={color} size={size} />
    </Pressable>
  );
}

export default IconButton;

const styles = StyleSheet.create({
  button: {
    margin: 8,
    borderRadius: 20,
  },
  pressed: {
    opacity: 0.7,
  },
});
