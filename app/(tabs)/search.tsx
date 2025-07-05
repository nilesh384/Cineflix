import MovieCard from "@/Components/MovieCard";
import SearchBar from "@/Components/SearchBar";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchAll } from "@/services/api";
import { updateSeachCount } from "@/services/appwrite";
import { useAuth } from "@/services/AuthContext";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  View,
} from "react-native";

export default function Search() {
  const { user, isLoading } = useAuth();

  if (!user && !isLoading) return <Redirect href="/auth/Login" />;
  if (isLoading) return null;

  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (searchQuery.trim()) {
        try {
          setLoading(true);
          setError(null);
          const data = await fetchAll({ query: searchQuery });
          setMovies(data.results || []);
        } catch (err: any) {
          setError(err);
        } finally {
          setLoading(false);
        }
      } else {
        setMovies([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // Optional: log to Appwrite
  useEffect(() => {
    if (searchQuery.trim() && movies.length > 0) {
      updateSeachCount(
        searchQuery,
        movies[0],
        movies[0]?.media_type === "movie" || movies[0]?.media_type === "tv"
          ? movies[0].media_type
          : "movie"
      );
    }
  }, [movies]);

  return (
    <View className="bg-primary flex-1">
      <Image source={images.bg} className="absolute w-full h-full z-0" />

      <FlatList
        className="flex-1 px-5"
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: "space-evenly",
          marginVertical: 16,
          paddingHorizontal: 2,
        }}
        contentContainerStyle={{ paddingBottom: 50 }}
        scrollEnabled={true}
        ListHeaderComponent={
          <View>
            <Image
              source={icons.logo}
              className="w-24 h-16 z-10 mt-24 self-center"
              resizeMode="contain"
            />
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search from 1000+ movies"
            />
            {loading && (
              <ActivityIndicator
                size="large"
                color="#00f"
                className="mt-10 self-center"
              />
            )}
            {error && (
              <Text className="text-red-500 text-center mt-5">
                Error: {error.message}
              </Text>
            )}
            {!loading && !error && searchQuery.trim() && movies.length > 0 && (
              <Text className="text-white text-base font-bold mt-5 mb-3">
                Search results for:
                <Text className="text-accent text-lg font-bold">
                  {"  " + searchQuery}
                </Text>
              </Text>
            )}
          </View>
        }
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
        ListEmptyComponent={
          !loading && !error && searchQuery.trim() ? (
            <View>
              <Image
                source={icons.search}
                className="w-24 h-24 self-center mt-10"
                resizeMode="contain"
              />
              <Text className="text-white text-center mt-5">
                No results found for "{searchQuery}"
              </Text>
            </View>
          ) : null
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
