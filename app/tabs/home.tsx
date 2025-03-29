import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, ScrollView } from "react-native";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import {app} from "../../firebaseConfig"; // Đảm bảo đã cấu hình Firebase

const HomeScreen = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const db = getFirestore(app);
        const storage = getStorage(app);
        const productRef = collection(db, "products");
        const productSnapshot = await getDocs(productRef);
        const productList = await Promise.all(
          productSnapshot.docs.map(async (doc) => {
            const data = doc.data();
            const imageUrl = await getDownloadURL(ref(storage, data.imagePath));
            return { id: doc.id, ...data, imageUrl };
          })
        );
        setProducts(productList);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Chia sản phẩm theo danh mục
  const filterByCategory = (category) => products.filter((item) => item.category === category);

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", paddingHorizontal: 15 }}>
      <ScrollView>
        {/* Tiêu đề */}
        <Text style={{ fontSize: 24, fontWeight: "bold", marginVertical: 10 }}>
          Planta - toả sáng không gian nhà bạn
        </Text>
        <Text style={{ color: "green", fontSize: 16 }}>Xem hàng mới về →</Text>

        {/* Danh mục Cây trồng */}
        <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 20 }}>Cây trồng</Text>
        <FlatList
          data={filterByCategory("Cây trồng")}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={{ marginRight: 15 }}>
              <Image source={{ uri: item.imageUrl }} style={{ width: 120, height: 120, borderRadius: 10 }} />
              <Text>{item.name}</Text>
              <Text style={{ color: "green", fontWeight: "bold" }}>{item.price}đ</Text>
            </TouchableOpacity>
          )}
        />

        {/* Danh mục Chậu cây trồng */}
        <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 20 }}>Chậu cây trồng</Text>
        <FlatList
          data={filterByCategory("Chậu cây trồng")}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={{ marginRight: 15 }}>
              <Image source={{ uri: item.imageUrl }} style={{ width: 120, height: 120, borderRadius: 10 }} />
              <Text>{item.name}</Text>
              <Text style={{ color: "green", fontWeight: "bold" }}>{item.price}đ</Text>
            </TouchableOpacity>
          )}
        />

        {/* Danh mục Phụ kiện */}
        <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 20 }}>Phụ kiện</Text>
        <FlatList
          data={filterByCategory("Phụ kiện")}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={{ marginRight: 15 }}>
              <Image source={{ uri: item.imageUrl }} style={{ width: 120, height: 120, borderRadius: 10 }} />
              <Text>{item.name}</Text>
              <Text style={{ color: "green", fontWeight: "bold" }}>{item.price}đ</Text>
            </TouchableOpacity>
          )}
        />

        {/* Danh mục Combo chăm sóc */}
        <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 20 }}>Combo chăm sóc</Text>
        <FlatList
          data={filterByCategory("Combo chăm sóc")}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={{ marginRight: 15 }}>
              <Image source={{ uri: item.imageUrl }} style={{ width: 120, height: 120, borderRadius: 10 }} />
              <Text>{item.name}</Text>
              <Text style={{ color: "green", fontWeight: "bold" }}>{item.price}đ</Text>
            </TouchableOpacity>
          )}
        />
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
