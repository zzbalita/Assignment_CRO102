import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function PaymentSuccessScreen() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>THÔNG BÁO</Text>
      </View>

      <Text style={styles.successText}>Bạn đã đặt hàng thành công</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thông tin khách hàng</Text>
        <Text>Trần Minh Trí</Text>
        <Text>tranminhtri@gmail.com</Text>
        <Text>60 Láng Hạ, Ba Đình, Hà Nội</Text>
        <Text>0123456789</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Phương thức vận chuyển</Text>
        <Text>Giao hàng Nhanh - 15.000đ</Text>
        <Text>(Dự kiến giao hàng 5-7/9)</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hình thức thanh toán</Text>
        <Text>Thẻ VISA/MASTERCARD</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Đơn hàng đã chọn</Text>
        <Text>🌱 Cây cảnh - Phụ kiện (ẩn phần chi tiết demo)</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.totalRow}>
          <Text style={styles.bold}>Đã thanh toán</Text>
          <Text style={styles.bold}>515.000đ</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.greenButton}>
        <Text style={styles.greenButtonText}>Xem Cẩm nang trồng cây</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace("/tabs/home")}>
        <Text style={styles.link}>Quay về Trang chủ</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  successText: {
    color: "green",
    fontSize: 16,
    textAlign: "center",
    marginVertical: 10,
  },
  section: {
    marginTop: 20,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingBottom: 10,
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  bold: {
    fontWeight: "bold",
  },
  greenButton: {
    backgroundColor: "green",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  greenButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  link: {
    color: "#000",
    textAlign: "center",
    marginTop: 20,
    textDecorationLine: "underline",
  },
});
