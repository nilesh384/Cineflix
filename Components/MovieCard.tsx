import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { router } from 'expo-router';
import { icons } from '@/constants/icons';

type MovieCardProps = {
  id: number;
  poster_path: string;
  title: string;
  vote_average: number;
  release_date: string;
  media_type: 'movie' | 'tv'; // 👈 Include this
};

const MovieCard = ({
  id,
  poster_path,
  title,
  vote_average,
  release_date,
  media_type,
}: MovieCardProps) => {
  const handlePress = () => {
    router.push({
      pathname: '/movies/[id]',
      params: {
        id: id.toString(),
        type: media_type, // 👈 Pass movie or tv
      },
    });
  };
  
  return (
    <TouchableOpacity className='w-[30%]' onPress={handlePress}>
      <View className="relative w-full h-52">
        <Image
          source={{
            uri: poster_path
              ? `https://image.tmdb.org/t/p/w500${poster_path}`
              : 'https://placehold.co/600X400/1a1a1a/ffffff.png',
          }}
          className="w-full h-full rounded-lg"
          resizeMode="cover"
        />
        <View className="absolute top-1.5 right-1.5 bg-black/60 px-2 py-1 rounded-lg flex-row items-center">
          <Image source={icons.star} className="w-4 h-4" />
          <Text className="text-xs text-white ml-1">
            {vote_average.toFixed(1)}
          </Text>
        </View>
      </View>

      {media_type === 'tv' && (
        <View className="absolute top-1.5 left-1.5 bg-black px-2 py-1 rounded-md flex-row items-center">
          <Text className="text-xs text-yellow-400">
            {media_type.toUpperCase()}
          </Text>
        </View>
      )}

      <Text className="text-sm font-bold mt-2 text-white" numberOfLines={1}>
        {title}
      </Text>

      {release_date ? 
      (<Text className="text-xs text-gray-400">{new Date(release_date).getFullYear()}</Text>): 
      (<Text className="text-xs text-yellow-400">Yet to release</Text>)
      }
    </TouchableOpacity>
  );
};

export default React.memo(MovieCard);
