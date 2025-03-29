import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { db, collection, getDocs } from "../../firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  stock: number;
}

export default function TimKiem() {
  const [searchText, setSearchText] = useState("");
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    loadRecentSearches();
    fetchProducts();
  }, []);

  const loadRecentSearches = async () => {
    const savedSearches = await AsyncStorage.getItem("recentSearches");
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  };

  const saveRecentSearch = async (query: string) => {
    let updatedSearches = [query, ...recentSearches.filter((q) => q !== query)];
    if (updatedSearches.length > 2) {
      updatedSearches = updatedSearches.slice(0, 2);
    }
    setRecentSearches(updatedSearches);
    await AsyncStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
  };

  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const products = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];
      setAllProducts(products);
    } catch (error) {
      console.error("Lỗi lấy danh sách sản phẩm:", error);
    }
  };

  const handleSearch = () => {
    if (searchText.trim().length < 2) return; // Chỉ tìm nếu nhập ít nhất 2 ký tự

    saveRecentSearch(searchText);

    const lowerCaseSearch = searchText.toLowerCase();
    const results = allProducts.filter((product) => {
      return product.name
        .toLowerCase()
        .split(" ") // Tách từng từ trong tên
        .some((word) => word.startsWith(lowerCaseSearch)); // Kiểm tra từ nào bắt đầu bằng 2 chữ cái đầu
    });

    setFilteredProducts(results);
  };

  const handleRecentSearch = (query: string) => {
    setSearchText(query);
    handleSearch();
  };

  const clearRecentSearch = async (query: string) => {
    const updatedSearches = recentSearches.filter((q) => q !== query);
    setRecentSearches(updatedSearches);
    await AsyncStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity style={styles.productItem} onPress={() => router.push(`/product/${item.id}`)}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>{item.price}đ</Text>
        <Text style={styles.productStock}>Còn {item.stock} sp</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Thanh tìm kiếm */}
      <View style={styles.searchContainer}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm"
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <TouchableOpacity onPress={handleSearch}>
          <Ionicons name="search-outline" size={24} />
        </TouchableOpacity>
      </View>

      {/* Lịch sử tìm kiếm gần đây */}
      {searchText === "" && recentSearches.length > 0 && (
        <View style={styles.recentContainer}>
          <Text style={styles.recentTitle}>Tìm kiếm gần đây</Text>
          {recentSearches.map((query) => (
            <View key={query} style={styles.recentItem}>
              <TouchableOpacity onPress={() => handleRecentSearch(query)} style={styles.recentTextContainer}>
                <Ionicons name="time-outline" size={20} />
                <Text style={styles.recentText}>{query}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => clearRecentSearch(query)}>
                <Ionicons name="close" size={20} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* Danh sách kết quả tìm kiếm */}
      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginHorizontal: 10,
  },
  recentContainer: { marginTop: 16 },
  recentTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 8 },
  recentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  recentTextContainer: { flexDirection: "row", alignItems: "center" },
  recentText: { fontSize: 16, marginLeft: 8 },
  productItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  productImage: { width: 50, height: 50, marginRight: 12, borderRadius: 8 },
  productName: { fontSize: 16, fontWeight: "bold" },
  productPrice: { color: "green", fontSize: 14 },
  productStock: { color: "#666", fontSize: 12 },
});
