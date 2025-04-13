import React, { useState } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function PaymentScreen() {
  const router = useRouter();

  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
  });

  const [shippingMethod, setShippingMethod] = useState("fast");
  const [paymentMethod, setPaymentMethod] = useState("visa");

  const subtotal = 500000;
  const shippingFee = shippingMethod === "fast" ? 15000 : 20000;
  const total = subtotal + shippingFee;

  const handlePayment = () => {
    if (!customer.name || !customer.email || !customer.address || !customer.phone) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin khách hàng.");
      return;
    }

    if (paymentMethod === "visa" || paymentMethod === "atm") {
      router.push("/PaymentCardScreen");
    } else {
      Alert.alert("Thanh toán thành công", "Đơn hàng của bạn đã được xác nhận!");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>THANH TOÁN</Text>
      </View>

      {/* Thông tin khách hàng */}
      <Text style={styles.sectionTitle}>Thông tin khách hàng</Text>
      {["name", "email", "address", "phone"].map((field) => (
        <TextInput
          key={field}
          style={styles.input}
          placeholder={field === "phone" ? "0123456789" : `Nhập ${field}`}
          value={customer[field as keyof typeof customer]}
          onChangeText={(text) => setCustomer({ ...customer, [field]: text })}
          keyboardType={field === "phone" ? "phone-pad" : "default"}
        />
      ))}

      {/* Phương thức vận chuyển */}
      <Text style={styles.sectionTitle}>Phương thức vận chuyển</Text>
      <TouchableOpacity 
        style={[styles.option, shippingMethod === "fast" && styles.selectedOption]}
        onPress={() => setShippingMethod("fast")}
      >
        <Text style={styles.optionText}>Giao hàng Nhanh - 15.000đ</Text>
        {shippingMethod === "fast" && <Ionicons name="checkmark" size={20} color="green" />}
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.option, shippingMethod === "cod" && styles.selectedOption]}
        onPress={() => setShippingMethod("cod")}
      >
        <Text style={styles.optionText}>Giao hàng COD - 20.000đ</Text>
        {shippingMethod === "cod" && <Ionicons name="checkmark" size={20} color="green" />}
      </TouchableOpacity>

      {/* Hình thức thanh toán */}
      <Text style={styles.sectionTitle}>Hình thức thanh toán</Text>
      <TouchableOpacity 
        style={[styles.option, paymentMethod === "visa" && styles.selectedOption]}
        onPress={() => setPaymentMethod("visa")}
      >
        <Text style={styles.optionText}>Thẻ VISA/MASTERCARD</Text>
        {paymentMethod === "visa" && <Ionicons name="checkmark" size={20} color="green" />}
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.option, paymentMethod === "atm" && styles.selectedOption]}
        onPress={() => setPaymentMethod("atm")}
      >
        <Text style={styles.optionText}>Thẻ ATM</Text>
        {paymentMethod === "atm" && <Ionicons name="checkmark" size={20} color="green" />}
      </TouchableOpacity>

      {/* Tổng tiền */}
      <View style={styles.summary}>
        <Text>Tạm tính</Text>
        <Text>{subtotal.toLocaleString()}đ</Text>
      </View>
      <View style={styles.summary}>
        <Text>Phí vận chuyển</Text>
        <Text>{shippingFee.toLocaleString()}đ</Text>
      </View>
      <View style={styles.summary}>
        <Text style={{ fontWeight: "bold" }}>Tổng cộng</Text>
        <Text style={{ color: "green", fontWeight: "bold" }}>{total.toLocaleString()}đ</Text>
      </View>

      {/* Button tiếp tục */}
      <TouchableOpacity style={styles.button} onPress={handlePayment}>
        <Text style={styles.buttonText}>TIẾP TỤC</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  headerTitle: { fontSize: 18, fontWeight: "bold", marginLeft: 10 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginTop: 20 },
  input: { borderBottomWidth: 1, borderColor: "#ccc", paddingVertical: 8, marginVertical: 5 },
  option: { flexDirection: "row", justifyContent: "space-between", padding: 10, borderBottomWidth: 1, borderColor: "#ddd" },
  selectedOption: { backgroundColor: "#f0f0f0" },
  optionText: { fontSize: 16 },
  summary: { flexDirection: "row", justifyContent: "space-between", marginVertical: 5 },
  button: { backgroundColor: "green", padding: 12, alignItems: "center", borderRadius: 5, marginTop: 20 },
  buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },
});
