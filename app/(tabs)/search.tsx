import MovieCard from "@/Components/MovieCard";
import SearchBar from "@/Components/SearchBar";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchMovies } from "@/services/api";
import useFetch from "@/services/useFetch";
import { Link, useRouter } from "expo-router";
import { ActivityIndicator, FlatList, Image, ScrollView, Text, View } from "react-native";

export default function Search() {
  const router = useRouter();

  const {data:movies, loading: loadingMovies, error: errorMovies} = useFetch(() => fetchMovies({query: ''}),false);
  

  return (
    <View className="bg-primary flex-1">
      <Image source={images.bg} className="absolute w-full h-full z-0" />
      <ScrollView className="flex-1 px-5" 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ minHeight: "100%" ,paddingBottom: 10 }}
       >
        <Image
          source={icons.logo}
          className=" w-22 h-14 z-10 mt-24 ml-[150px] "
          />

      {loadingMovies ? (
        <ActivityIndicator size="large" color="#0000ff" className="mt-10 self-center" />
      ) : errorMovies ? (
        <Text>{errorMovies.message}</Text>
      ) : (
        <View className="flex-1 mt-5">
        <SearchBar
              value=""
              onChangeText={() => {}}
              onPress={() => {
                router.push("/search");
              }}
              placeholder="Search for a movie"
            />

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
