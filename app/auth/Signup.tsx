// screens/Signup.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { createUser, loginUser, getCurrentUser } from '@/services/auth';
import { useAuth } from '@/services/AuthContext';
import { Ionicons } from '@expo/vector-icons'; 

const Signup = () => {
  const router = useRouter();
  const { setUser } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    if (!name || !email || !password) {
      return Alert.alert('Validation Error', 'All fields are required.');
    }

    try {
      await createUser(email, password, name); // Create Appwrite user
      await loginUser(email, password);        // Log them in
      const loggedInUser = await getCurrentUser(); // Fetch user details
      setUser(loggedInUser);                   // Update context
      router.replace('/home');                // Go to home tab
    } catch (err: any) {
      Alert.alert('Signup failed', err?.message || 'Something went wrong');
    }
  };

  return (
    <KeyboardAvoidingView className="flex-1 bg-primary px-6 justify-center">
      {/* Back Button */}
      <TouchableOpacity onPress={() => router.replace('/(tabs)/home')} className="absolute top-14 left-4 z-10">
        <Ionicons name="arrow-back" size={28} color="white" />
      </TouchableOpacity>

      <Animated.View entering={FadeInDown.duration(600)}>
        <Text className="text-3xl font-bold text-white mb-6">Create Account</Text>

        <TextInput
          className="bg-white/10 text-white rounded-lg p-3 mb-4"
          placeholder="Name"
          placeholderTextColor="#aaa"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          className="bg-white/10 text-white rounded-lg p-3 mb-4"
          placeholder="Email"
          placeholderTextColor="#aaa"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
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
          onPress={handleSignup}
        >
          <Text className="text-white font-semibold text-lg">Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity className="mt-6" onPress={() => router.replace('/auth/Login')}>
          <Text className="text-gray-400 text-center">
            Already have an account?{' '}
            <Text className="text-yellow-400">Login</Text>
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

export default Signup;
