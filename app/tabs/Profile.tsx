import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

export default function ProfileScreen() {
  const router = useRouter();
  const [userData, setUserData] = useState<{
    name: string;
    email: string;
    avatar: string;
  }>({
    name: "",
    email: "",
    avatar: "",
  });

  const fetchUser = async () => {
    const user = getAuth().currentUser;
    if (!user) return;

    try {
      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserData({
          name: data.name || "",
          email: user.email || "",
          avatar: data.avatar || "",
        });
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể lấy dữ liệu người dùng.");
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUser();
    }, [])
  );

  const handleLogout = () => {
    Alert.alert("Xác nhận", "Bạn có chắc chắn muốn đăng xuất?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Đăng xuất",
        style: "destructive",
        onPress: () => router.replace("/login"),
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>PROFILE</Text>

      {/* Avatar không được phép thay đổi ở đây */}
      <View style={styles.profileInfo}>
        <Image
          source={
            userData.avatar
              ? { uri: userData.avatar }
              : require("@/assets/images/eye.png") // ảnh avatar mặc định
          }
          style={styles.avatar}
        />
        <View>
          <Text style={styles.name}>{userData.name}</Text>
          <Text style={styles.email}>{userData.email}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Chung</Text>
        {[
          { label: "Chỉnh sửa thông tin", screen: "/EditProfileScreen" },
          { label: "Cẩm nang trồng cây", screen: "/guide" },
          { label: "Lịch sử giao dịch", screen: "/transaction-history" },
          { label: "Q & A", screen: "/qa" },
        ].map((item) => (
          <TouchableOpacity
            key={item.label}
            style={styles.item}
            onPress={() => router.push(item.screen)}
          >
            <Text style={styles.itemText}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={18} color="#999" />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bảo mật và Điều khoản</Text>
        {[
          { label: "Điều khoản và điều kiện", screen: "/terms" },
          { label: "Chính sách quyền riêng tư", screen: "/privacy" },
        ].map((item) => (
          <TouchableOpacity
            key={item.label}
            style={styles.item}
            onPress={() => router.push(item.screen)}
          >
            <Text style={styles.itemText}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={18} color="#999" />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Đăng xuất</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 20 },
  header: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 16,
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  name: { fontSize: 16, fontWeight: "bold" },
  email: { fontSize: 14, color: "#555" },

  section: { marginTop: 20 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#888",
    marginBottom: 10,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  itemText: { fontSize: 15 },

  logoutBtn: { paddingVertical: 15, alignItems: "center" },
  logoutText: { color: "red", fontSize: 15 },
});
