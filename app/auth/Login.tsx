// screens/Login.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { loginUser, getCurrentUser } from '@/services/auth';
import { useAuth } from '@/services/AuthContext';
import { Ionicons } from '@expo/vector-icons';

const Login = () => {
  const router = useRouter();
  const { setUser } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing Fields', 'Please enter both email and password.');
      return;
    }

    try {
      await loginUser(email, password);
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      router.replace('/(tabs)/home');
    } catch (err: any) {
      Alert.alert('Login failed', err.message || 'Something went wrong');
    }
  };

  const handleBack = () => {
    router.replace('/(tabs)/home');
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-primary px-6 justify-center"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Back Button */}
      <TouchableOpacity
        className="absolute top-14 left-6 z-10"
        onPress={handleBack}
      >
        <Ionicons name="arrow-back" size={28} color="white" />
      </TouchableOpacity>

      <Animated.View entering={FadeInDown.duration(600)}>
        <Text className="text-3xl font-bold text-white mb-6 text-center">
          Welcome Back
        </Text>

        <TextInput
          className="bg-white/10 text-white rounded-lg p-3 mb-4"
          placeholder="Email"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          className="bg-white/10 text-white rounded-lg p-3 mb-6"
          placeholder="Password"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          className="bg-yellow-500 rounded-xl p-4 items-center"
          onPress={handleLogin}
        >
          <Text className="text-white font-semibold text-lg">Login</Text>
        </TouchableOpacity>

        <TouchableOpacity className="mt-6" onPress={() => router.replace('/auth/Signup')}>
          <Text className="text-gray-400 text-center">
            Don’t have an account?{' '}
            <Text className="text-yellow-400">Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

export default Login;
