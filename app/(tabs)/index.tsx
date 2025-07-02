import MovieCard from "@/Components/MovieCard";
import TrendingCard from "@/Components/TrendingCard";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchMovies } from "@/services/api";
import { getTrendingMovies } from "@/services/appwrite";
import useFetch from "@/services/useFetch";
import { ActivityIndicator, FlatList, FlatListComponent, Image, ScrollView, Text, View } from "react-native";

export default function Index() {

  const { data: trendingMovies, loading: loadingTrendingMovies, error: errorTrendingMovies } = useFetch(getTrendingMovies);
  const uniqueTrendingMovies = trendingMovies
  ? Array.from(new Map(trendingMovies.map(movie => [movie.movie_id, movie])).values())
  : [];

  const { data: movies, loading: loadingMovies, error: errorMovies } = useFetch(() => fetchMovies({ query: '' }));


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

        {loadingMovies || loadingTrendingMovies ? (
          <ActivityIndicator size="large" color="#0000ff" className="mt-10 self-center" />
        ) : errorMovies || errorTrendingMovies ? (
          <Text>{errorMovies?.message || errorTrendingMovies?.message}</Text>
        ) : (
          <View className="flex-1 mt-5">
            {trendingMovies && trendingMovies.length > 0 && (
              <View className="mt-10">
                <Text className="text-lg text-white font-bold mb-3">
                  Trending Movies
                </Text>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="mb-4 mt-3"
                  data={uniqueTrendingMovies}
                  contentContainerStyle={{
                    gap: 26,
                  }}
                  renderItem={({ item, index }) => (
                    <TrendingCard movie={item} index={index} />
                  )}
                  keyExtractor={(item, index) => `${item.movie_id}_${index}`}
                  ItemSeparatorComponent={() => <View className="w-4" />}
                />
              </View>
            )}
            <>
              <Text className="text-white text-lg font-bold mt-5 mb-3">Latest Movies</Text>
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
                  paddingHorizontal: 2,
                  marginBottom: 10,

                }}
                contentContainerStyle={{ paddingBottom: 50 }}
                className="mt-2 pb-32"
                scrollEnabled={false}
              />
            </>
          </View>

        )
        }



      </ScrollView>
    </View>
  );
}
