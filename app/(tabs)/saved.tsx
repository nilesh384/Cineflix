import { View, FlatList, Image, Text } from 'react-native';
import React, { useState, useCallback } from 'react';
import { useAuth } from '@/services/AuthContext';
import { getSavedMovies } from '../../services/appwrite';
import MovieCard from '@/Components/MovieCard';
import { icons } from '@/constants/icons';
import { Redirect } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Saved = () => {
  const { user, isLoading } = useAuth();
  const [savedMovies, setSavedMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchSavedMovies = async () => {
        if (user) {
          setLoading(true);
          const res = await getSavedMovies(user.$id);
          setSavedMovies(res);
          setLoading(false);
        }
      };

      fetchSavedMovies();
    }, [user])
  );

  if (!user && !isLoading) return <Redirect href="/auth/Login" />;

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <View className="flex-1 bg-primary px-4 pt-5">
      <FlatList
        data={savedMovies}
        keyExtractor={(item) => item.$id}
        numColumns={3}
        contentContainerStyle={{ paddingVertical: 20 }}
        columnWrapperStyle={{ justifyContent: 'flex-start', gap:13 , marginVertical: 12, }}
        
        renderItem={({ item }) => (
          <MovieCard
            id={item.movie_id}
            poster_path={item.poster_url}
            title={item.title}
            vote_average={item.vote_average}
            release_date={item.release_date}
            media_type={item.media_type}
          />
        )}
        ListEmptyComponent={
          !loading ? (
            <View className="items-center mt-10">
              <Image source={icons.save} className="w-16 h-16 mb-4" />
              <Text className="text-white text-center">No saved movies yet.</Text>
            </View>
          ) : null
        }
      />
    </View>
    </SafeAreaView>
  );
};

export default Saved;
