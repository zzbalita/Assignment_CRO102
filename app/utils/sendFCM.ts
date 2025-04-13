export const sendFCMNotification = async (token: string) => {
    const YOUR_SERVER_KEY = '8X1gwNON-8NMKCvkpn7O7ADBUhlZAIIhIDKoAU90Nuk'; // thay bằng key thật từ Firebase Console
  
    const message = {
      to: token,
      notification: {
        title: 'Khám phá ngay!',
        body: 'Bạn vừa mở mục Khám phá 🎉',
      },
      data: {
        screen: 'TimKiem',
      },
    };
  
    await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `key=${"8X1gwNON-8NMKCvkpn7O7ADBUhlZAIIhIDKoAU90Nuk"}`,
      },
      body: JSON.stringify(message),
    });
  };
  