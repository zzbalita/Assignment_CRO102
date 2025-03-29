import React, { useState, useEffect } from "react";
import { 
  View, Text, Image, FlatList, TouchableOpacity, StyleSheet, Alert 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { db, collection, getDocs, doc, deleteDoc } from "../firebaseConfig";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export default function CartScreen() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "cart"));
      const items = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as CartItem[];
      setCartItems(items);
    } catch (error) {
      console.error("Lỗi tải giỏ hàng:", error);
    }
  };

  const toggleSelectItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const deleteSelectedItems = async () => {
    Alert.alert("Xác nhận", "Bạn có chắc chắn muốn xoá các sản phẩm đã chọn?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Đồng ý",
        onPress: async () => {
          try {
            await Promise.all(
              selectedItems.map(async (id) => {
                await deleteDoc(doc(db, "cart", id));
              })
            );
            setCartItems(cartItems.filter((item) => !selectedItems.includes(item.id)));
            setSelectedItems([]);
          } catch (error) {
            console.error("Lỗi xoá sản phẩm:", error);
          }
        },
      },
    ]);
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>GIỎ HÀNG</Text>
        {selectedItems.length > 0 && (
          <TouchableOpacity onPress={deleteSelectedItems}>
            <Ionicons name="trash-outline" size={28} color="black" />
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <TouchableOpacity onPress={() => toggleSelectItem(item.id)}>
              <Ionicons
                name={selectedItems.includes(item.id) ? "checkbox" : "square-outline"}
                size={24}
                color="black"
              />
            </TouchableOpacity>
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <View style={{ flex: 1 }}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>{item.price}đ</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>Giỏ hàng của bạn hiện đang trống</Text>}
      />
      {cartItems.length > 0 && (
        <View style={styles.footer}>
          <Text style={styles.totalPrice}>Tạm tính: {totalPrice.toLocaleString()}đ</Text>
          <TouchableOpacity style={styles.checkoutButton}>
            <Text style={styles.checkoutText}>Tiến hành thanh toán</Text>
            <Ionicons name="arrow-forward" size={20} color="white" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerTitle: { fontSize: 18, fontWeight: "bold" },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  productImage: { width: 50, height: 50, marginHorizontal: 10 },
  productName: { fontSize: 16, fontWeight: "bold" },
  productPrice: { color: "green", fontWeight: "bold" },
  emptyText: { textAlign: "center", marginTop: 20, fontSize: 16 },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    alignItems: "center",
  },
  totalPrice: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  checkoutButton: {
    backgroundColor: "green",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  checkoutText: { color: "white", fontSize: 16, marginRight: 5 },
});
