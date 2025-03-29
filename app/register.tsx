import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { auth, db } from '../firebaseConfig'; // Import Firebase config
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!name) return Alert.alert('Lỗi', 'Họ tên không được để trống');
    if (!email) return Alert.alert('Lỗi', 'E-mail không được để trống');
    if (!phone) return Alert.alert('Lỗi', 'Số điện thoại không được để trống');
    if (!password) return Alert.alert('Lỗi', 'Mật khẩu không được để trống');
    if (password.length <= 6) return Alert.alert('Lỗi', 'Mật khẩu phải lớn hơn 6 ký tự');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name,
        email,
        phone,
      });
      
      Alert.alert('Thành công', 'Đăng ký thành công!');
      router.push('/login');
    } catch (error: any) {
        console.log('Firebase Error: ', error.message)
      Alert.alert('Lỗi', 'Dang ky that bai');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Image source={require('../assets/images/button-back.png')} style={styles.backIcon} />
      </TouchableOpacity>
      <Image source={require('../assets/images/logo.png')} style={styles.headerImage} />
      <Text style={styles.title}>Đăng ký</Text>
      <Text style={styles.subTitle}>Tạo tài khoản</Text>
      <TextInput placeholder="Họ tên" style={styles.input} value={name} onChangeText={setName} />
      <TextInput placeholder="E-mail" style={styles.input} keyboardType="email-address" value={email} onChangeText={setEmail} />
      <TextInput placeholder="Số điện thoại" style={styles.input} keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
      <TextInput placeholder="Mật khẩu" style={styles.input} secureTextEntry value={password} onChangeText={setPassword} />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Đăng ký</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  backButton: { position: 'absolute', top: 40, left: 20, zIndex: 10 },
  backIcon: { width: 40, height: 40 },
  headerImage: { width: '100%', height: 150, resizeMode: 'cover', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold' },
  subTitle: { fontSize: 16, marginBottom: 10 },
  input: { width: '100%', padding: 10, borderWidth: 1, borderColor: 'green', borderRadius: 5, marginBottom: 10 },
  button: { backgroundColor: 'green', padding: 10, borderRadius: 5, width: '100%', alignItems: 'center' },
  buttonText: { color: 'white', fontSize: 16 },
});
