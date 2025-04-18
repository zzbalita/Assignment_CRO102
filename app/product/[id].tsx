import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { getFirestore, doc, getDoc, collection, addDoc } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";

const ProductDetail = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      const db = getFirestore();
      const docRef = doc(db, "products", id as string);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProduct(docSnap.data());
      }
    };
    fetchProduct();
  }, [id]);

  const addToCart = async () => {
    if (quantity <= 0) {
      Alert.alert("Thông báo", "Vui lòng chọn số lượng hợp lệ!");
      return;
    }

    const db = getFirestore();
    await addDoc(collection(db, "cart"), {
      productId: id,
      name: product.name,
      image: product.image,
      price: product.price,
      quantity: quantity,
    });

    Alert.alert("Thành công", "Sản phẩm đã được thêm vào giỏ hàng!");
    router.replace("/tabs/home"); // Chuyển về màn hình home
  };

  if (!product) return <Text>Loading...</Text>;

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#fff" }}>
      <TouchableOpacity onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <Image source={{ uri: product.image }} style={{ width: "100%", height: 300 }} resizeMode="contain" />
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>{product.name}</Text>
      <Text style={{ fontSize: 20, color: "green", marginVertical: 10 }}>{product.price}đ</Text>
      <Text style={{ color: "gray" }}>{product.description}</Text>
      
      <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 20 }}>
        <TouchableOpacity onPress={() => setQuantity(Math.max(1, quantity - 1))} style={{ padding: 10, backgroundColor: "#ddd", borderRadius: 5 }}>
          <Text>-</Text>
        </TouchableOpacity>
        <Text style={{ marginHorizontal: 10 }}>{quantity}</Text>
        <TouchableOpacity onPress={() => setQuantity(quantity + 1)} style={{ padding: 10, backgroundColor: "#ddd", borderRadius: 5 }}>
          <Text>+</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity onPress={addToCart} style={{ backgroundColor: "green", padding: 15, borderRadius: 5, alignItems: "center" }}>
        <Text style={{ color: "white", fontSize: 18 }}>CHỌN MUA</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProductDetail;
