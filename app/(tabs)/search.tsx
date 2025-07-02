import MovieCard from "@/Components/MovieCard";
import SearchBar from "@/Components/SearchBar";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchMovies } from "@/services/api";
import { updateSeachCount } from "@/services/appwrite";
import useFetch from "@/services/useFetch";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, ScrollView, Text, View } from "react-native";

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: movies, loading: loadingMovies, error: errorMovies, refetch: refetchMovies, reset } = useFetch(() => fetchMovies({ query: searchQuery }));

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        refetchMovies(); // Only refetch here
      } else {
        reset();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // ✅ Separate effect for updating Appwrite AFTER movies are available
  useEffect(() => {
    if (searchQuery.trim() && movies?.length > 0) {
      updateSeachCount(searchQuery, movies[0]);
    }
  }, [movies]);


  return (
    <View className="bg-primary flex-1">
      <Image source={images.bg} className="absolute w-full h-full z-0" />
      <ScrollView className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}
      >
        <Image
          source={icons.logo}
          className=" w-22 h-14 z-10 mt-24 ml-[150px] "
        />

        <View className="flex-1 mt-5">

          <>
            <FlatList
              data={movies}
              renderItem={({ item }) => (
                <MovieCard
                  id={item.id}
                  poster_path={item.poster_path}
                  title={item.title}
                  vote_average={item.vote_average}
                  release_date={item.release_date}
                />
              )}
              keyExtractor={(item) => item.id.toString()}
              numColumns={3}
              columnWrapperStyle={{
                justifyContent: "space-evenly",
                marginVertical: 16,
                paddingHorizontal: 2,
                marginBottom: 10,

              }}
              contentContainerStyle={{ paddingBottom: 50 }}
              className="mt-2 pb-32"
              scrollEnabled={false}

              ListHeaderComponent={
                <>
                  <SearchBar
                    value={searchQuery}
                    onChangeText={(text) => { setSearchQuery(text); }}
                    placeholder="Search from 1000+ movies "
                  />

                  {loadingMovies && (
                    <ActivityIndicator size="large" color="#0000ff" className="mt-10 self-center" />
                  )}

                  {errorMovies && (
                    <Text className="text-red-500 text-center mt-5">Error: {errorMovies.message}</Text>
                  )}

                  {!loadingMovies && !errorMovies && searchQuery.trim() && movies?.length! > 0 && (
                    <Text className="text-white text-base font-bold mt-5 mb-3">Search results for:
                      <Text className="text-accent text-lg font-bold mt-5 mb-3 ">  {searchQuery}</Text>
                    </Text>


                  )}
                </>
              }

              ListEmptyComponent={
                !loadingMovies && !errorMovies ? (
                  <View>
                    <Image
                      source={icons.search}
                      className="w-24 h-24 self-center mt-10"
                      resizeMode="contain"
                    />
                    <Text className="text-white text-center mt-5">
                      {searchQuery.trim() ? `No results found for ${searchQuery}` : ""}
                    </Text>
                  </View>
                ) : null
              }
            />
          </>
        </View>



      </ScrollView>
    </View>
  );
}
