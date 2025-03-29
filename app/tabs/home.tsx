import React, { useEffect, useState } from "react";
import { 
  View, Text, Image, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { db, collection, getDocs } from "../../firebaseConfig";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

export default function HomeScreen() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
      fetchProducts();
    }, []);

    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const items = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Product[];
        setProducts(items);
      } catch (error) {
        console.error("Lỗi tải sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };

    const handlePress = (item: Product) => {
      router.push(`/product/${item.id}`);
    };

    const renderItem = ({ item }: { item: Product }) => (
      <TouchableOpacity style={styles.card} onPress={() => handlePress(item)}>
        <Image source={{ uri: item.image }} style={styles.productImage} />
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>{item.price}đ</Text>
      </TouchableOpacity>
    );

    const renderCategory = (categoryName: string) => {
      const filteredProducts = products.filter(item => item.category === categoryName);

      return (
        <View key={categoryName}>
          <TouchableOpacity>
            <Text style={styles.sectionTitle}>{categoryName}</Text>
          </TouchableOpacity>
          <FlatList
            data={filteredProducts}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            scrollEnabled={false}
          />
        </View>
      );
    };

    const categories = ["Cây trồng", "Chậu cây trồng", "Phụ kiện", "Combo chăm sóc"];

    return (
      <FlatList
        ListHeaderComponent={
          <View style={styles.bannerContainer}>
            <View style={styles.header}>
              <TouchableOpacity
               onPress={() => router.push("/CartScreen")}
               style={styles.cartButton}>
                <Ionicons name="cart-outline" size={28} color="black" />
              </TouchableOpacity>
            </View>
            <Image source={require("../../assets/images/homeBanner.png")} style={styles.bannerImage} />
            <View style={styles.overlayText}>
              <Text style={styles.bannerTitle}>Planta - tỏa sáng </Text>
              <Text style={styles.bannerTitle}>không gian nhà bạn</Text>
              <Text style={styles.bannerLink}>Xem hàng mới về →</Text>
            </View>
          </View>
        }
        data={categories}
        renderItem={({ item }) => renderCategory(item)}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.container}
      />
    );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16 },
  header: {
    position: "absolute",
    top: 10,
    right: 16,
    zIndex: 10,
  },
  cartButton: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 50,
    elevation: 5,
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginVertical: 10 },
  card: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 10,
    margin: 5,
    alignItems: "center",
  },
  productImage: { width: 120, height: 120, resizeMode: "contain" },
  productName: { fontWeight: "bold", marginTop: 5, textAlign: "center" },
  productPrice: { color: "green", fontWeight: "bold", marginTop: 5 },
  bannerContainer: {
    position: "relative",
    width: "100%",
    height: 280,
    marginBottom: 10,
  },
  bannerImage: {
    width: "100%",
    height: 280,
    resizeMode: "cover",
    borderRadius: 10,
  },
  overlayText: {
    position: "absolute",
    top: 20,
    left: 16,
    right: 16,
  },
  bannerTitle: { fontSize: 26, fontWeight: "bold", color: "black" },
  bannerLink: { fontSize: 14, color: "green", marginTop: 5 },
});

