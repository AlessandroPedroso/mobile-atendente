import { Button } from "@/components/Button";
import { OrderItem } from "@/components/OrderItem";
import { QuantityControl } from "@/components/QuantityControl";
import { Select } from "@/components/Select";
import { colors, fontSize, spacing } from "@/constants/theme";
import api from "@/services/api";
import { Category, Item, Product } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Order() {
  const router = useRouter();
  const { table, order_id } = useLocalSearchParams<{
    table: string;
    order_id: string;
  }>();
  const insets = useSafeAreaInsets();

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState("");

  const [quantity, setQuantity] = useState(1);

  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingAddItem, setLoadingAddItem] = useState(false);

  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    async function loadDataCategories() {
      await loadCategories();
    }
    loadDataCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      loadProducts(selectedCategory);
    } else {
      setProducts([]);
      setSelectedCategory("");
    }
  }, [selectedCategory]);

  async function loadCategories() {
    try {
      const response = await api.get<Category[]>("/category");
      // console.log(response.data);
      setCategories(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingCategories(false);
    }
  }

  async function loadProducts(categoryId: string) {
    try {
      setLoadingProducts(true);
      const response = await api.get<Product[]>(`/category/products`, {
        params: {
          category_id: categoryId,
        },
      });
      // console.log(response.data);
      setProducts(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingProducts(false);
    }
  }

  async function handleAddItem() {
    try {
      setLoadingAddItem(true);
      const response = await api.post<Item>("/order/add", {
        order_id: order_id,
        product_id: selectedProduct,
        amount: quantity,
      });
      setItems((prevItems) => [...prevItems, response.data]);
      setSelectedCategory("");
      setSelectedProduct("");
      setQuantity(1);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingAddItem(false);
    }
  }

  async function handleDeleteItem(item_id: string) {
    try {
      await api.delete("/order/remove", {
        params: {
          item_id: item_id,
        },
      });

      const updatedItems = items.filter((item) => item.id !== item_id);
      setItems(updatedItems);
      Alert.alert("Item removido", "Seu item foi removido da mesa!");
    } catch (error) {
      console.log(error);
      Alert.alert("Atenção", "Erro ao remover item da mesa.");
    }
  }

  if (loadingCategories) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.brand} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 28 }]}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Mesa {table}</Text>
          <Pressable style={styles.closeButtton} onPress={() => router.back()}>
            <Ionicons name="trash" size={20} color={colors.primary} />
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Select
          label="Categorias"
          placeholder="Selecione uma categoria"
          options={categories.map((category) => ({
            label: category.name,
            value: category.id,
          }))}
          selectedValue={selectedCategory}
          onValueChange={setSelectedCategory}
        />
        {loadingProducts ? (
          <ActivityIndicator size="small" color={colors.brand} />
        ) : (
          selectedCategory && (
            <Select
              placeholder="Selecione um produto..."
              options={products.map((products) => ({
                label: products.name,
                value: products.id,
              }))}
              selectedValue={selectedProduct}
              onValueChange={setSelectedProduct}
            />
          )
        )}

        {selectedProduct && (
          <View style={styles.quantitySection}>
            <Text style={styles.quantityLabel}>Quantidade:</Text>
            <QuantityControl
              quantity={quantity}
              onIncrement={() => setQuantity((quantity) => quantity + 1)}
              onDecrement={() => {
                if (quantity <= 1) {
                  setQuantity(1);
                  return;
                }
                setQuantity((quantity) => quantity - 1);
              }}
            />
          </View>
        )}

        {selectedProduct && (
          <Button
            title="Adicionar"
            onPress={handleAddItem}
            variant="secondary"
            loading={loadingAddItem}
          />
        )}

        {items.length > 0 && (
          <View style={styles.itemsSections}>
            <Text style={styles.itemsTitle}>Itens Adicionados</Text>
            {items.map((item) => (
              <OrderItem
                key={item.id}
                item={item}
                onRemove={handleDeleteItem}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderColor,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: fontSize.xl,
    color: colors.primary,
    fontWeight: "bold",
  },
  closeButtton: {
    backgroundColor: colors.red,
    padding: spacing.sm,
    borderRadius: 8,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.lg,
    gap: 14,
  },
  quantitySection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.md,
  },
  quantityLabel: {
    color: colors.primary,
    fontSize: fontSize.lg,
    fontWeight: "bold",
  },
  itemsSections: {
    marginTop: spacing.xl,
    gap: spacing.md,
  },
  itemsTitle: {
    color: colors.primary,
    fontSize: fontSize.lg,
    fontWeight: "bold",
  },
});
