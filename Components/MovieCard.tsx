import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { Link } from 'expo-router';
import { icons } from '@/constants/icons';

type MovieCardProps = {
  id: number;
  poster_path: string;
  title: string;
  vote_average: number;
  release_date: string;
};

const MovieCard = ({
  id,
  poster_path,
  title,
  vote_average,
  release_date,
}: MovieCardProps) => {
  return (
    <Link href={`/movies/${id}`} asChild>
      <TouchableOpacity className='w-[30%]'>
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
          <View className="absolute top-1.5 right-1.5 bg-black/80 px-2 py-1 rounded-lg flex-row items-center">
            <Image source={icons.star} className="w-4 h-4" />
            <Text className="text-xs text-white ml-1">
              {vote_average.toFixed(1)}
            </Text>
          </View>
        </View>

        <Text className="text-sm font-bold mt-2 text-white" numberOfLines={1}>{title}</Text>

        <Text className="text-xs text-gray-400">
          {new Date(release_date).getFullYear()}
        </Text>

      </TouchableOpacity>
    </Link>
  );
};

export default MovieCard;
