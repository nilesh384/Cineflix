import { View, Text, ActivityIndicator } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { WebView } from 'react-native-webview';

export default function WebviewScreen() {
  const { url, title } = useLocalSearchParams();

  return (
    <>
    <Stack.Screen
        options={{
          title: decodeURIComponent(title as string) , // 👈 Custom title here
          headerStyle: {
            backgroundColor: "#111",
          },
          headerTintColor: "#fff", // Back button color
        }}
      />
      <View style={{ flex: 1 }}>
      <WebView
        source={{ uri: decodeURIComponent(url as string) }}
        startInLoadingState
        renderLoading={() => (
          <View style={{ backgroundColor: '#fff' }}>
            <ActivityIndicator
              size="large"
              color="#111"
            />
          </View>
        )}
      />
    </View>
    </>
  );
}
