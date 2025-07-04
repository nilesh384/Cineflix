import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import MovieCard from "@/Components/MovieCard";
import TrendingCard from "@/Components/TrendingCard";
import SkeletonTrendingCard from "@/Components/SkeletonTrendingCard";
import SkeletonMovieCard from "@/Components/SkeletonMovieCard";
import { fetchAll } from "@/services/api";
import { getTrendingMovies } from "@/services/appwrite";
import useFetch from "@/services/useFetch";

export default function Index() {
  const [refreshing, setRefreshing] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const {
    data: trendingMovies,
    loading: loadingTrendingMovies,
    error: errorTrendingMovies,
    refetch: refetchTrendingMovies,
  } = useFetch(getTrendingMovies);

  const uniqueTrendingMovies = trendingMovies
    ? Array.from(new Map(trendingMovies.map((m) => [m.movie_id, m])).values())
    : [];

  const loadMovies = async (reset = false) => {
    try {
      const currentPage = reset ? 1 : page;
      const data = await fetchAll({ query: "", page: currentPage });

      if (reset) {
        setMovies(data.results);
      } else {
        setMovies((prev) => [...prev, ...data.results]);
      }

      setHasMore(currentPage < data.total_pages);
      setPage(currentPage + 1);
    } catch (err) {
      console.error("Failed to load movies:", err);
    } finally {
      setInitialLoading(false);
      setLoadingMore(false);
      if (reset) setRefreshing(false);
    }
  };

  useEffect(() => {
    loadMovies(true);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    setHasMore(true);
    await Promise.all([refetchTrendingMovies?.(), loadMovies(true)]);
  };

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      setLoadingMore(true);
      loadMovies();
    }
  };

  return (
    <View className="bg-primary flex-1">
      <Image source={images.bg} className="absolute w-full h-full z-0" />

      <FlatList
        ListHeaderComponent={
          <>
            <Image
              source={icons.logo}
              className="w-24 h-16 z-10 mt-24 self-center"
              resizeMode="contain"
            />

            {/* Trending */}
            <View className="mt-10">
              <Text className="text-lg text-white font-bold mb-3">
                Trending Movies
              </Text>
              {loadingTrendingMovies ? (
                <FlatList
                  horizontal
                  data={[...Array(6).keys()]}
                  keyExtractor={(item) => `skeleton-trending-${item}`}
                  renderItem={() => <SkeletonTrendingCard />}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: 16 }}
                />
              ) : uniqueTrendingMovies.length > 0 ? (
                <FlatList
                  horizontal
                  data={uniqueTrendingMovies}
                  keyExtractor={(item, index) => `${item.movie_id}_${index}`}
                  renderItem={({ item, index }) => (
                    <TrendingCard movie={item} index={index} media_type={item.media_type === "movie" || item.media_type === "tv" ? item.media_type : "movie"} />
                  )}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: 16 }}
                  className="mb-4"
                />
              ) : (
                <Text className="text-gray-400">No trending movies found.</Text>
              )}
            </View>

            <Text className="text-white text-lg font-bold mt-6 mb-3">
              Popular Movies
            </Text>
          </>
        }
        scrollEnabled={true}
        data={movies}
        renderItem={({ item }) => (
          <MovieCard
            id={item.id}
            poster_path={item.poster_path}
            title={item.title || item.name || "Untitled"}
            vote_average={item.vote_average}
            release_date={item.release_date || item.first_air_date || ""}
            media_type={item.media_type === "movie" || item.media_type === "tv" ? item.media_type : "movie"} // Default to 'movie' if not provided
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: "space-evenly",
          paddingHorizontal: 2,
          marginBottom: 10,
        }}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator size="small" color="#fff" className="my-4" />
          ) : null
        }
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={
          initialLoading ? (
            <View className="flex-row flex-wrap justify-between">
              {[...Array(6).keys()].map((_, index) => (
                <SkeletonMovieCard key={`skeleton-latest-${index}`} />
              ))}
            </View>
          ) : (
            <Text className="text-gray-400 text-center">
              No latest movies found.
            </Text>
          )
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
        className="px-5"
        removeClippedSubviews={true}
      />

      {(errorTrendingMovies) && (
        <Text className="text-red-500 text-center mt-5">
          {errorTrendingMovies.message}
        </Text>
      )}
    </View>
  );
}
