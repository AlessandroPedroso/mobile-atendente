import { borderRadius, colors, fontSize, spacing } from "@/constants/theme";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "secondary";
  loading?: boolean;
}

export function Button({
  title,
  variant = "primary",
  loading = false,
  disabled,
  style,
  ...rest
}: ButtonProps) {
  const backroundColor = variant === "primary" ? colors.green : colors.brand;

  return (
    <TouchableOpacity
      style={[
        { backgroundColor: backroundColor },
        styles.button,
        style,
        (disabled || loading) && styles.buttonDisabled,
      ]}
      {...rest}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={colors.background} />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  text: {
    color: colors.background,
    fontSize: fontSize.lg,
    fontWeight: "600",
  },
});
