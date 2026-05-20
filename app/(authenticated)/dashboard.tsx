import { useAuth } from "@/contexts/AuthContext";
import { Button, Text, View } from "react-native";

export default function Dashboard() {
  const { signOut } = useAuth();

  return (
    <View>
      <Text>Página Dashboard</Text>
      <Button title="Sair" onPress={signOut} />
    </View>
  );
}
