import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from "react-native";
import { useRouter } from "expo-router";

export default function PaymentCardScreen() {
  const router = useRouter();

  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setCardDetails({ ...cardDetails, [field]: value });
  };

  const handlePayment = () => {
    const { cardNumber, cardHolder, expiryDate, cvv } = cardDetails;

    if (!cardNumber || !cardHolder || !expiryDate || !cvv) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin thẻ.");
      return;
    }

    Alert.alert(
      "Xác nhận thanh toán",
      "Bạn có chắc chắn muốn thanh toán?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Có",
          onPress: () => {
            router.push("/payment-success");
          },
        },
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Thông tin thanh toán</Text>

      <Text style={styles.label}>Số thẻ</Text>
      <TextInput
        style={styles.input}
        keyboardType="number-pad"
        placeholder="1234 5678 9012 3456"
        value={cardDetails.cardNumber}
        onChangeText={(text) => handleInputChange("cardNumber", text)}
      />

      <Text style={styles.label}>Tên chủ thẻ</Text>
      <TextInput
        style={styles.input}
        placeholder="Nguyễn Văn A"
        value={cardDetails.cardHolder}
        onChangeText={(text) => handleInputChange("cardHolder", text)}
      />

      <Text style={styles.label}>Ngày hết hạn</Text>
      <TextInput
        style={styles.input}
        placeholder="MM/YY"
        value={cardDetails.expiryDate}
        onChangeText={(text) => handleInputChange("expiryDate", text)}
      />

      <Text style={styles.label}>CVV</Text>
      <TextInput
        style={styles.input}
        keyboardType="number-pad"
        placeholder="123"
        secureTextEntry
        value={cardDetails.cvv}
        onChangeText={(text) => handleInputChange("cvv", text)}
      />

      <TouchableOpacity style={styles.button} onPress={handlePayment}>
        <Text style={styles.buttonText}>XÁC NHẬN THANH TOÁN</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontWeight: "600",
    marginTop: 15,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
  },
  button: {
    backgroundColor: "#28a745",
    padding: 15,
    marginTop: 30,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
