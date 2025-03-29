import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Checkbox from 'expo-checkbox';
import { auth } from '../firebaseConfig'; // Import Firebase auth
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    if (!email) return Alert.alert('Lỗi', 'Email không được để trống');
    if (!password) return Alert.alert('Lỗi', 'Mật khẩu không được để trống');

    setLoading(true);
    setError('');
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (rememberMe) {
        await AsyncStorage.setItem('userToken', user.uid);
      }

      Alert.alert('Thành công', 'Đăng nhập thành công!');
      router.replace('/tabs/home'); 
    } catch (error: any) {
      console.log(error);
      setError('Email hoặc mật khẩu không đúng!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => router.push('/register')} style={styles.backButton}>
        <Image source={require('../assets/images/button-back.png')} style={styles.backIcon} />
      </TouchableOpacity>

      <Image source={require('../assets/images/logo.png')} style={styles.logo} />
      <Text style={styles.welcome}>Chào mừng bạn</Text>
      <Text style={styles.subTitle}>Đăng nhập tài khoản</Text>
      <TextInput 
        placeholder="Nhập email" 
        style={styles.input} 
        keyboardType="email-address"
        value={email} 
        onChangeText={setEmail} 
      />
      <TextInput 
        placeholder="Mật khẩu" 
        secureTextEntry 
        style={styles.input} 
        value={password} 
        onChangeText={setPassword} 
      />
      <View style={styles.rememberContainer}>
        <Checkbox value={rememberMe} onValueChange={setRememberMe} color={rememberMe ? 'green' : undefined} />
        <Text style={styles.rememberText}>Nhớ tài khoản</Text>
        <TouchableOpacity><Text style={styles.forgotPassword}>Quên mật khẩu?</Text></TouchableOpacity>
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Đang đăng nhập...' : 'Đăng nhập'}</Text>
      </TouchableOpacity>
      <Text style={styles.orText}>Hoặc</Text>
      <View style={styles.socialContainer}>
        <TouchableOpacity><Image source={require('../assets/images/google.png')} style={styles.socialIcon} /></TouchableOpacity>
        <TouchableOpacity><Image source={require('../assets/images/facebook.png')} style={styles.socialIcon} /></TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => router.push('/register')}>
        <Text style={styles.link}>Bạn không có tài khoản? <Text style={{ color: 'green' }}>Tạo tài khoản</Text></Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  backButton: { position: 'absolute', top: 40, left: 20, zIndex: 10 },
  backIcon: { width: 40, height: 40 },
  logo: { width: 200, height: 200, marginBottom: 20 },
  welcome: { fontSize: 24, fontWeight: 'bold' },
  subTitle: { fontSize: 16, marginBottom: 10 },
  input: { width: '100%', padding: 10, borderWidth: 1, borderColor: 'green', borderRadius: 5, marginBottom: 10 },
  rememberContainer: { flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'space-between' },
  rememberText: { marginLeft: -100 },
  forgotPassword: { color: 'green' },
  button: { backgroundColor: 'green', padding: 10, borderRadius: 5, width: '100%', alignItems: 'center' },
  buttonText: { color: 'white', fontSize: 16 },
  orText: { marginVertical: 10 },
  socialContainer: { flexDirection: 'row', gap: 10 },
  socialIcon: { width: 40, height: 40 },
  link: { marginTop: 10 },
  error: { color: 'red', marginBottom: 10 },
});
