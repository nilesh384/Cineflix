import { View, Text } from 'react-native'
import React from 'react'
import { useAuth } from '@/services/AuthContext';
import { Redirect } from 'expo-router';

const saved = () => {

 const { user, isLoading } = useAuth();

  if (!user && !isLoading) return <Redirect href="/auth/Login" />;
  if (isLoading) return null;


  return (
    <View>
      <Text>saved</Text>
    </View>
  )
}

export default saved