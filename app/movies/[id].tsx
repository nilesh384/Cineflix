import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import useFetch from '@/services/useFetch';
import { fetchMovieDetails } from '@/services/api';
import { icons } from '@/constants/icons';

const MovieDetails = () => {
  const { id } = useLocalSearchParams();
  const { data: movie, loading } = useFetch(() => fetchMovieDetails(id as string));

  const formatVoteCount = (votes: number): string => {
    if (votes >= 1_000_000) return (votes / 1_000_000).toFixed(1) + " M";
    if (votes >= 1_000) return (votes / 1_000).toFixed(1) + " K";
    return votes.toString();
  };


  return (
    <View className="bg-primary flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Poster */}
        <View>
          {movie?.poster_path ? (
            <Image
              source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
              className="w-full h-[500px]"
              resizeMode="cover"
            />
          ) : (
            <Text className="text-white text-center mt-20">Poster not available</Text>
          )}
        </View>

        {/* Movie Info */}
        {movie && (
          <View className="px-5 mt-6">
            {/* Title */}
            <Text className="text-white text-2xl font-bold mb-1">{movie.title}</Text>

            {/* Tagline */}
            {movie.tagline && (
              <Text className="text-accent italic text-sm mb-3">"{movie.tagline}"</Text>
            )}

            {/* Rating, Release Year, Runtime */}
            <View className="flex-row flex-wrap gap-2 items-center mb-4">
              {/* Rating */}
              <View className="flex-row items-center bg-dark-100 px-2 py-1 rounded shrink-0">
                <Image source={icons.star} className="w-4 h-4 mr-1" />
                <Text className="text-yellow-400 font-bold text-sm">
                  {movie.vote_average?.toFixed(1)} / 10
                </Text>
                <Text className="text-gray-500 text-sm pl-2">
                  ({formatVoteCount(movie.vote_count)} votes)
                </Text>
              </View>

              {/* Year */}
              <Text className="text-gray-400 text-sm bg-dark-100 px-2 py-1 rounded shrink-0">
                {new Date(movie?.release_date).getFullYear()}
              </Text>

              {/* Runtime */}
              {movie.runtime && (
                <Text className="text-gray-400 text-sm bg-dark-100 px-2 py-1 rounded shrink-0">
                  {movie.runtime} min
                </Text>
              )}

              {/* Status (Released/Planned) */}
              {movie.status && (
                <Text
                  className={`text-sm font-semibold px-2 py-1 rounded shrink-0 ${movie.status === "Released"
                      ? "text-green-400 bg-green-900/40"
                      : "text-yellow-300 bg-yellow-800/40"
                    }`}
                >
                  {movie.status}
                </Text>
              )}
            </View>


            {/* Genres */}
            <Text className="text-white text-base font-semibold mb-2 ml-1">Genres</Text>
            {movie.genres?.length > 0 && (
              <View className="flex-row flex-wrap gap-2 mb-4">
                {movie.genres.map((g) => (
                  <View
                    key={g.id}
                    className="bg-dark-100 mx-1 px-3 py-1 "
                  >
                    <Text className="text-white text-sm">{g.name}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Overview */}
            {movie.overview && (
              <>
                <Text className="text-white text-base font-semibold mb-1">Overview</Text>
                <Text className="text-gray-400 font-semibold text-[0.95rem] ">
                  {movie.overview}
                </Text>
              </>
            )}

            <View className='flex-row flex-wrap justify-between mt-4'>
              {/* Budget */}
              {movie.budget > 0 && (
                <View className="mt-4">
                  <Text className="text-white text-base font-semibold mb-1">Budget</Text>
                  <Text className="text-gray-400 font-semibold text-[0.95rem] ">
                    ${formatVoteCount(movie.budget)}
                  </Text>
                </View>
              )}


              {/* Revenue */}
              {movie.revenue > 0 && (
                <View className="mt-4">
                  <Text className="text-white text-base font-semibold mb-1">Revenue</Text>
                  <Text className="text-gray-400 font-semibold text-[0.95rem] ">
                    ${formatVoteCount(movie.revenue)}
                  </Text>
                </View>
              )}


              {/* under budget or over budget */}
              {movie.budget > 0 && movie.revenue > 0 && (
                <View className="mt-4">
                  <Text className="text-white text-base font-semibold mb-1">Current Status</Text>
                  <Text
                    className={`text-sm px-2 py-1 rounded self-start font-semibold ${movie.revenue >= movie.budget
                      ? "text-green-400 bg-green-900/40"
                      : "text-red-400 bg-red-900/40"
                      }`}
                  >
                    {movie.revenue >= movie.budget
                      ? `Profit: $${formatVoteCount(movie.revenue - movie.budget)}`
                      : `Loss: $${formatVoteCount(movie.budget - movie.revenue)}`}
                  </Text>
                </View>

              )}
            </View>

            {/* Production Companies */}
            {movie.production_companies?.length > 0 && (
              <View className="mt-4 mb-10">
                <Text className="text-white text-base font-semibold mb-1">Production Companies</Text>
                <View className="flex-row flex-wrap gap-x-4 gap-y-2">
                  {movie.production_companies.map((company) => (
                    <View
                      key={company.id}
                      className="bg-dark-100 px-3 py-1 rounded"
                    >
                      <Text className="text-white text-sm">{company.name}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>
      <TouchableOpacity
        className="absolute bottom-5 left-0 right-0 mx-5 bg-accent rounded-xl py-3.5 flex flex-row items-center justify-center z-50"
        onPress={router.back}
      >
        <Image
          source={icons.arrow}
          className="size-5 mr-1 mt-0.5 rotate-180"
          tintColor="#fff"
        />
        <Text className="text-white font-semibold text-base">Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MovieDetails;
