// app/tabs/NotificationScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import * as Notifications from 'expo-notifications';

interface NotificationItem {
  title: string;
  body: string;
  date: string;
}

export default function NotificationScreen() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      const { title, body } = notification.request.content;
      const date = new Date().toLocaleString();

      const newNotification: NotificationItem = {
        title: title || 'Không có tiêu đề',
        body: body || 'Không có nội dung',
        date,
      };

      setNotifications(prev => [newNotification, ...prev]);
    });

    return () => subscription.remove();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📬 Danh sách thông báo</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.body}>{item.body}</Text>
            <Text style={styles.date}>{item.date}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 20, fontStyle: 'italic' }}>
            Chưa có thông báo nào.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#f0f8ff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  title: { fontSize: 16, fontWeight: 'bold' },
  body: { fontSize: 14, marginTop: 4 },
  date: { fontSize: 12, marginTop: 6, color: '#888' },
});
