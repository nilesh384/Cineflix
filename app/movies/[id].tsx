import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  Linking,
  ToastAndroid,
} from 'react-native';
import React, { useState, useMemo, useEffect } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import useFetch from '@/services/useFetch';
import {
  fetchCredits,
  fetchMediaDetails,
  fetchTrailer,
  fetchWatchProviders,
} from '@/services/api';
import { icons } from '@/constants/icons';
import { WebView } from 'react-native-webview';
import { useAuth } from '@/services/AuthContext';
import { checkIfSaved, saveMovieToDB, deleteSavedMovie } from '@/services/appwrite';

const MovieDetails = () => {
  const { id, type } = useLocalSearchParams();
  const { data: movie } = useFetch(() => fetchMediaDetails(id as string, type as 'movie' | 'tv'));
  const { data: trailers } = useFetch(() => fetchTrailer(id as string, type as 'movie' | 'tv'));
  const { data: providersData } = useFetch(() => fetchWatchProviders(id as string, type as 'movie' | 'tv'));
  const { data: cast } = useFetch(() => fetchCredits(id as string, type as 'movie' | 'tv'));

  const [showTrailer, setShowTrailer] = useState(false);
  const { user, isLoading } = useAuth();
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const checkSaved = async () => {
      if (user && movie) {
        try {
          const res = await checkIfSaved(user.$id, movie.id);
          setIsSaved(res);
        } catch (err) {
          console.error("❌ Error checking saved state:", err);
        }
      }
    };

    checkSaved();
  }, [user, movie]);


  const handleSave = async () => {
    if (!user || !movie) return;
    if (isSaved) {
      try {
        await deleteSavedMovie(user.$id, movie.id);
        setIsSaved(false);
        ToastAndroid.show('Movie removed from saved list!', 1500);
      } catch (error) {
        console.error('❌ Delete Error:', error);
      }
      return;
    } else {
      try {
        await saveMovieToDB(user.$id, {
          id: movie.id,
          title: movie.title || movie.name || '',
          poster_url: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '',
          vote_average: movie.vote_average || 0,
          release_date: movie.release_date || movie.first_air_date || '',
          media_type: type as 'movie' | 'tv',
        });
        setIsSaved(true);
        ToastAndroid.show('Movie saved successfully!', 1500);
      } catch (error) {
        console.error('❌ Save Error:', error);
      }
    }
  };


  const trailer = useMemo(() => {
    if (!trailers || !Array.isArray(trailers)) return null;
    return (
      trailers.find(
        (t) =>
          t.type === "Trailer" &&
          t.site === "YouTube" &&
          t.official &&
          t.name.toLowerCase().includes("official")
      ) ||
      trailers.find((t) => t.type === "Trailer" && t.site === "YouTube") ||
      trailers.find((t) => t.site === "YouTube")
    );
  }, [trailers]);

  const topProviders = useMemo(() => {
    const countryCode = 'IN'; // fallback to India
    if (!providersData) return { link: '', providers: [] };

    const { flatrate = [], buy = [], rent = [], link = '' } = providersData;
    const combined = [...flatrate, ...buy, ...rent];

    // Remove duplicates
    const unique = combined.filter(
      (v, i, self) => i === self.findIndex((t) => t.provider_id === v.provider_id)
    );

    return { link, providers: unique };
  }, [providersData]);


  const formatVoteCount = (votes: number): string => {
    if (votes >= 1_000_000) return (votes / 1_000_000).toFixed(1) + ' M';
    if (votes >= 1_000) return (votes / 1_000).toFixed(1) + ' K';
    return votes.toString();
  };

  return (
    <View className="bg-primary flex-1">
      <Modal visible={showTrailer} animationType="slide" onRequestClose={() => setShowTrailer(false)}>
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            onPress={() => setShowTrailer(false)}
            className="absolute top-10 right-5 z-50 bg-black/60 p-2 rounded-full"
          >
            <Image source={icons.close} className="w-8 h-8" tintColor="#fff" />
          </TouchableOpacity>
          {trailer?.key && (
            <WebView
              style={{ marginTop: 0, flex: 1 }}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              allowsFullscreenVideo={true}
              allowsInlineMediaPlayback={true}
              mediaPlaybackRequiresUserAction={false}
              startInLoadingState={true}
              source={{ uri: `https://www.youtube.com/embed/${trailer.key}` }}
            />
          )}
        </View>
      </Modal>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View>
          {movie?.poster_path ? (
            <Image
              source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
              className="w-full h-[500px]"
              resizeMode="cover"
            />
          ) : (
            <Image
              source={{ uri: 'https://cinemaone.net/images/movie_placeholder.png' }}
              className="w-full h-[500px]"
              resizeMode="cover"
            />
          )}
          {trailer?.key && (
            <TouchableOpacity
              className="absolute bottom-4 right-4 bg-black/60 p-3 rounded-full z-20"
              onPress={() => setShowTrailer(true)}
            >
              <Image source={icons.play} className="w-6 h-6" tintColor="#fff" />
            </TouchableOpacity>
          )}

          {movie && user && (
            <TouchableOpacity
              className="absolute top-4 right-4 bg-black/60 p-2 rounded-full z-20"
              onPress={handleSave}
            >
              <Image
                source={isSaved ? icons.saveFilled : icons.save}
                className="w-8 h-8"
                tintColor="#FEDD00"
              />
            </TouchableOpacity>
          )}


        </View>

        {movie && (
          <View className="px-5 mt-6">
            <Text className="text-white text-2xl font-bold mb-1">{movie.title || movie.name}</Text>
            {movie.tagline && <Text className="text-accent italic text-sm mb-3">"{movie.tagline}"</Text>}

            <View className="flex-row flex-wrap gap-2 items-center mb-4">
              <View className="flex-row items-center bg-dark-100 px-2 py-1 rounded shrink-0">
                <Image source={icons.star} className="w-4 h-4 mr-1" />
                <Text className="text-yellow-400 font-bold text-sm">
                  {movie.vote_average?.toFixed(1)} / 10
                </Text>
                <Text className="text-gray-500 text-sm pl-2">
                  ({formatVoteCount(movie.vote_count)} votes)
                </Text>
              </View>

              {movie?.last_air_date && (
                <Text className="text-gray-400 text-sm bg-dark-100 px-2 py-1 rounded shrink-0">
                  {new Date(movie.first_air_date ?? '').getFullYear()} - {new Date(movie.last_air_date ?? '').getFullYear()}
                </Text>
              )}
              {movie.release_date && (
                <Text className="text-gray-400 text-sm bg-dark-100 px-2 py-1 rounded shrink-0">
                  {new Date(movie?.release_date || "Release date").getFullYear()}
                </Text>
              )}

              {movie.runtime && (
                <Text className="text-gray-400 text-sm bg-dark-100 px-2 py-1 rounded shrink-0">
                  {movie.runtime} min
                </Text>
              )}

              {movie.status && (
                <Text
                  className={`text-sm font-semibold px-2 py-1 rounded shrink-0 ${movie.status === 'Released'
                    ? 'text-green-400 bg-green-900/40'
                    : 'text-yellow-300 bg-yellow-800/40'
                    }`}
                >
                  {movie.status}
                </Text>
              )}
            </View>

            {topProviders?.providers?.length > 0 && (
              <View className="mt-4">
                <Text className="text-white text-base font-semibold mb-2">Available On</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
                  {topProviders.providers.map((provider) => (
                    <TouchableOpacity
                      key={provider.provider_id}
                      onPress={() => Linking.openURL(topProviders.link)}
                      className="items-center mr-4"
                    >
                      <Image
                        source={{ uri: `https://image.tmdb.org/t/p/w92${provider.logo_path}` }}
                        className="w-14 h-14 rounded-full mb-1"
                      />
                      <Text className="text-white text-xs text-center w-16" numberOfLines={2}>
                        {provider.provider_name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            <Text className="text-white text-base font-semibold mb-2 ml-1">Genres</Text>
            {movie.genres?.length > 0 && (
              <View className="flex-row flex-wrap gap-2 mb-4">
                {movie.genres.map((g) => (
                  <View key={g.id} className="bg-dark-100 mx-1 px-3 py-1">
                    <Text className="text-white text-sm">{g.name}</Text>
                  </View>
                ))}
              </View>
            )}

            {movie.overview && (
              <>
                <Text className="text-white text-base font-semibold mb-1">Overview</Text>
                <Text className="text-gray-400 font-semibold text-[0.95rem]">
                  {movie.overview}
                </Text>
              </>
            )}

            <View className="flex-row flex-wrap justify-between mt-4">
              {movie.budget > 0 && (
                <View className="mt-4">
                  <Text className="text-white text-base font-semibold mb-1">Budget</Text>
                  <Text className="text-gray-400 font-semibold text-[0.95rem]">
                    ${formatVoteCount(movie.budget)}
                  </Text>
                </View>
              )}

              {movie.revenue > 0 && (
                <View className="mt-4">
                  <Text className="text-white text-base font-semibold mb-1">Revenue</Text>
                  <Text className="text-gray-400 font-semibold text-[0.95rem]">
                    ${formatVoteCount(movie.revenue)}
                  </Text>
                </View>
              )}

              {movie.budget > 0 && movie.revenue > 0 && (
                <View className="mt-4">
                  <Text className="text-white text-base font-semibold mb-1">Current Status</Text>
                  <Text
                    className={`text-sm px-2 py-1 rounded self-start font-semibold ${movie.revenue >= movie.budget
                      ? 'text-green-400 bg-green-900/40'
                      : 'text-red-400 bg-red-900/40'
                      }`}
                  >
                    {movie.revenue >= movie.budget
                      ? `Profit: $${formatVoteCount(movie.revenue - movie.budget)}`
                      : `Loss: $${formatVoteCount(movie.budget - movie.revenue)}`}
                  </Text>
                </View>
              )}
            </View>

            {cast?.length > 0 && (
              <View className="mt-6">
                <Text className="text-white text-base font-semibold mb-2">Cast</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
                  {cast.slice(0, 15).map((member: {
                    cast_id?: number;
                    id: number;
                    profile_path?: string;
                    name: string;
                    character: string;
                  }) => (
                    <View key={member.cast_id || member.id} className="items-center mr-5 w-32">
                      <Image
                        source={{
                          uri: member.profile_path
                            ? `https://image.tmdb.org/t/p/w300${member.profile_path}`
                            : "https://via.placeholder.com/120x180?text=?",
                        }}
                        className="w-32 h-44 rounded-xl bg-dark-100"
                        resizeMode="cover"
                      />
                      <Text
                        className="text-white text-sm mt-2 font-semibold text-center"
                        numberOfLines={2}
                      >
                        {member.name}
                      </Text>
                      <Text
                        className="text-gray-400 text-xs text-center"
                        numberOfLines={2}
                      >
                        as {member.character}
                      </Text>
                    </View>

                  ))}
                </ScrollView>
              </View>
            )}


            {movie.production_companies?.length > 0 && (
              <View className="mt-4 mb-10">
                <Text className="text-white text-base font-semibold mb-1">Production Companies</Text>
                <View className="flex-row flex-wrap gap-x-4 gap-y-2">
                  {movie.production_companies.map((company) => (
                    <View key={company.id} className="bg-dark-100 px-3 py-1 rounded">
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
        <Image source={icons.arrow} className="size-5 mr-1 mt-0.5 rotate-180" tintColor="#fff" />
        <Text className="text-white font-semibold text-base">Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MovieDetails;
