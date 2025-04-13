import { useEffect, useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Icon } from 'react-native-elements';
import messaging from '@react-native-firebase/messaging';
import { sendFCMNotification } from '../utils/sendFCM';

export default function TabLayout() {
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  useEffect(() => {
    const requestPermissionAndGetToken = async () => {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        const token = await messaging().getToken();
        console.log('✅ FCM Token:', token);
        setFcmToken(token);
      } else {
        console.log('❌ Notification permission not granted');
      }
    };

    requestPermissionAndGetToken();

    // Optional: Handle foreground notifications
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('🔔 FCM Message received in foreground:', remoteMessage);
    });

    return unsubscribe;
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { backgroundColor: '#fff', height: 60 },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Trang chủ',
          tabBarIcon: ({ color }) => <Icon name="home" type="feather" color={color} />,
        }}
      />
      <Tabs.Screen
        name="TimKiem"
        listeners={{
          tabPress: async () => {
            if (fcmToken) {
              await sendFCMNotification(fcmToken);
            } else {
              console.log('⚠️ FCM Token not available yet');
            }
          },
        }}
        options={{
          title: 'Khám phá',
          tabBarIcon: ({ color }) => <Icon name="search" type="feather" color={color} />,
        }}
      />
      <Tabs.Screen
        name="NotificationScreen"
        options={{
          title: 'Thông báo',
          tabBarIcon: ({ color }) => <Feather name="bell" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Feather name="user" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
