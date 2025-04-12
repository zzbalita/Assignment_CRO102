import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { getAuth } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, storage } from "@/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter } from "expo-router";
import uuid from "react-native-uuid";

export default function EditProfileScreen() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    avatar: "",
  });

  const fetchUser = async () => {
    try {
      const user = getAuth().currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserInfo({
            name: data.name || "",
            email: user.email || "",
            address: data.address || "",
            phone: data.phone || "",
            avatar: data.avatar || "",
          });
        }
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể lấy dữ liệu người dùng.");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const uploadImageAsync = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const fileName = `avatars/${uuid.v4()}.jpg`;
    const imageRef = ref(storage, fileName);
    await uploadBytes(imageRef, blob);
    const downloadUrl = await getDownloadURL(imageRef);
    return downloadUrl;
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Lỗi", "Bạn cần cấp quyền truy cập ảnh.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setUserInfo({ ...userInfo, avatar: result.assets[0].uri });
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Lỗi", "Bạn cần cấp quyền truy cập camera.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({ quality: 1 });

    if (!result.canceled) {
      setUserInfo({ ...userInfo, avatar: result.assets[0].uri });
    }
  };

  const handleSave = async () => {
    const user = getAuth().currentUser;
    if (!user) return;

    try {
      setUploading(true);
      let avatarUrl = userInfo.avatar;

      if (avatarUrl && avatarUrl.startsWith("file")) {
        avatarUrl = await uploadImageAsync(avatarUrl);
      }

      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        name: userInfo.name,
        address: userInfo.address,
        phone: userInfo.phone,
        avatar: avatarUrl,
      });

      Alert.alert("Thành công", "Thông tin đã được cập nhật!");
      router.back();
    } catch (error) {
      console.log(error);
      Alert.alert("Lỗi", "Cập nhật thất bại.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickImage}>
        <Image
          source={
            userInfo.avatar
              ? { uri: userInfo.avatar }
              : require("@/assets/images/eye.png")
          }
          style={styles.avatar}
        />
        <Text style={styles.changePhoto}>Chọn từ thư viện</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={takePhoto}>
        <Text style={styles.changePhoto}>Chụp ảnh</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Họ và tên"
        value={userInfo.name}
        onChangeText={(text) => setUserInfo({ ...userInfo, name: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={userInfo.email}
        editable={false}
      />
      <TextInput
        style={styles.input}
        placeholder="Địa chỉ"
        value={userInfo.address}
        onChangeText={(text) => setUserInfo({ ...userInfo, address: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Số điện thoại"
        value={userInfo.phone}
        onChangeText={(text) => setUserInfo({ ...userInfo, phone: text })}
        keyboardType="phone-pad"
      />

      <TouchableOpacity style={styles.button} onPress={handleSave} disabled={uploading}>
        <Text style={styles.buttonText}>
          {uploading ? "Đang lưu..." : "Lưu thông tin"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  changePhoto: { textAlign: "center", color: "#888", marginVertical: 5 },
  input: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 8,
    marginVertical: 10,
  },
  button: {
    backgroundColor: "rgba(125, 123, 123, 1)",
    padding: 12,
    borderRadius: 5,
    marginTop: 30,
    alignItems: "center",
  },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 16 },
});
