import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { colors, fontSize, spacing } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Atenção", "Por favor, preencha todos os campos.");
      return;
    }

    try {
      setLoading(true);
      await signIn(email, password);
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Rrro ao tentar fazer login.");
    } finally {
      setLoading(false);
    }

    // console.log({ email, password });
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={"padding"}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>
            Sujeito<Text style={styles.logoBrand}>Pizzaria</Text>
          </Text>
          <Text style={styles.logoSubTitle}>Garçom app</Text>
        </View>

        <View style={styles.formContainer}>
          <Input
            label="Email"
            placeholder="Digite seu email..."
            placeholderTextColor={colors.gray}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <Input
            label="Senha"
            placeholder="Digite sua senha..."
            placeholderTextColor={colors.gray}
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />
          <Button
            title="Acessar"
            variant="primary"
            loading={loading}
            onPress={handleLogin}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  scrollContent: {
    justifyContent: "center",
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  logoText: {
    fontSize: 34,
    fontWeight: "bold",
    color: colors.primary,
  },
  logoBrand: {
    color: colors.brand,
  },
  logoSubTitle: {
    color: colors.primary,
    fontSize: fontSize.lg,
  },
  formContainer: {
    gap: spacing.md,
  },
});
