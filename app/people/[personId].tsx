// app/people/[personId].tsx
import React from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    Linking,
    ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import useFetch from '@/services/useFetch';
import { fetchPersonDetails, fetchPersonPictures, fetchPersonOtherMovies, fetchPersonTvCredits } from '@/services/api';
import Carousel from 'react-native-reanimated-carousel';
import Dot from '@/Components/Dot';
import { Dimensions } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import { icons } from '@/constants/icons';
import MovieCard from '@/Components/MovieCard';
import { FlatList } from 'react-native-gesture-handler';

const PersonDetails = () => {
    const { personId } = useLocalSearchParams();
    const BASE_IMAGE_URL = 'https://image.tmdb.org/t/p/original';
    const { width } = Dimensions.get('window');
    const progressValue = useSharedValue(0);

    const { data: person, loading, error } = useFetch<Person>(() =>
        fetchPersonDetails(personId as string)
    );
    const { data: personPictures } = useFetch<PersonPicture[]>(() =>
        personId ? fetchPersonPictures(personId as string) : Promise.resolve([])
    );

    const { data: personMovies } = useFetch<PersonMovieCredit[]>(() =>
        personId ? fetchPersonOtherMovies(personId as string) : Promise.resolve([])
    );

    const { data: personTvCredits } = useFetch<PersonTvCredit[]>(() =>
        personId ? fetchPersonTvCredits(personId as string) : Promise.resolve([])
    );


    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-primary">
                <ActivityIndicator size="large" color="#fff" />
            </View>
        );
    }

    if (error || !person) {
        return (
            <View className="flex-1 justify-center items-center bg-primary">
                <Text className="text-white">Failed to load person data.</Text>
            </View>
        );
    }

    return (
        <>
            <ScrollView className="bg-primary flex-1 " contentContainerStyle={{ padding: 20 }}>
                {/* Profile Image */}
                {personPictures && personPictures.length > 0 ? (
                    <View className="relative">
                        <Carousel
                            width={width}
                            height={500}
                            data={personPictures.slice(0, 10)}
                            loop
                            autoPlay
                            scrollAnimationDuration={1000}
                            onProgressChange={(_, absoluteProgress) =>
                                (progressValue.value = absoluteProgress)
                            }
                            renderItem={({ item }: { item: { file_path: string } }) => (
                                <Image
                                    source={{ uri: `https://image.tmdb.org/t/p/w780${item.file_path}` }}
                                    className="w-full h-full"
                                    resizeMode="cover"
                                />
                            )}
                        />

                        {/* Dot indicators */}
                        <View className="absolute bottom-4 left-0 right-0 flex-row justify-center items-center space-x-2 z-10">
                            {personPictures.slice(0, 10).map((_: PersonPicture, i: number) => (
                                <Dot key={i} index={i} progressValue={progressValue} />
                            ))}

                        </View>
                    </View>
                ) : (
                    <Image
                        source={{
                            uri: person?.profile_path
                                ? `${BASE_IMAGE_URL}${person.profile_path}`
                                : 'https://via.placeholder.com/300x450?text=No+Image',
                        }}
                        className="w-full h-[500px]"
                        resizeMode="cover"
                    />
                )}

                {person.deathday && (
                    <View className="bg-red-500 p-2 rounded-lg mb-4">
                        <Text className="text-white text-center">
                            {`Sadly, ${person.name} passed away on `}
                            <Text className="font-bold">
                                {new Date(person.deathday).toDateString()}
                            </Text>
                        </Text>
                    </View>
                )}

                {/* Name and Info */}
                <Text className="text-purple-500 italic text-2xl font-bold text-center mb-2 mt-4">{person.name}</Text>


                <View className="flex-row justify-center items-center mb-4">
                    <Text className="text-yellow-400 text-lg">
                        {person.known_for_department || 'Department Unknown'}
                    </Text>
                    {person.birthday && (
                        <Text className="text-gray-400 text-lg ml-2">
                            | Born: {new Date(person.birthday).toDateString()}
                        </Text>
                    )}

                </View>
                {person.place_of_birth && (
                    <Text className="text-gray-400 text-center text-lg ml-2">
                        Place of Origin:  {person.place_of_birth}
                    </Text>
                )}


                {/* Biography */}
                {person.biography && (
                    <>
                        <Text className="text-accent font-semibold text-lg mb-2 mt-4">Biography</Text>
                        <Text className="text-gray-300 italic leading-6">{person.biography}</Text>
                    </>
                )}

                {personMovies && personMovies.length > 0 && (
                    <View className="mt-6">
                        <Text className="text-white text-base font-semibold mb-2">Acted In</Text>
                        <Text className="text-gray-400 text-sm mb-4">[MOVIES]</Text>

                        <FlatList
                            data={personMovies.slice(0, 15)}
                            keyExtractor={(item) => item.id.toString()}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingHorizontal: 20 }}
                            renderItem={({ item }) => (
                                <View className="mr-4 w-32 mb-16  overflow-hidden  shadow-lg shadow-black/40">
                                    <MovieCard
                                        id={item.id}
                                        key={`${item.id}-movie`}
                                        poster_path={item.poster_path || ''}
                                        title={item.title}
                                        vote_average={item.vote_average}
                                        release_date={item.release_date}
                                        media_type="movie"
                                    />
                                </View>
                            )}
                        />
                    </View>
                )}

                {personTvCredits && personTvCredits.length > 0 && (
                    <View className="mt-6">
                        <Text className="text-white text-base font-semibold mb-2">Acted In</Text>
                        <Text className="text-gray-400 text-sm mb-4">[TV / WEB SERIES]</Text>

                        <FlatList
                            data={personTvCredits.slice(0, 15)}
                            keyExtractor={(item) => item.id.toString()}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingHorizontal: 20 }}
                            renderItem={({ item }) => (
                                <View className="mr-4 w-32 mb-16  overflow-hidden  shadow-lg shadow-black/40">
                                    <MovieCard
                                        id={item.id}
                                        key={`${item.id}-tv`}
                                        poster_path={item.poster_path || ''}
                                        title={item.name}
                                        vote_average={item.vote_average}
                                        release_date={item.first_air_date}
                                        media_type="tv"
                                    />
                                </View>
                            )}
                        />
                    </View>
                )}



                {/* Homepage */}
                {person.homepage && (
                    <TouchableOpacity
                        onPress={() => Linking.openURL(person.homepage!)}
                        className="mb-16"
                    >
                        <Text className="text-center text-blue-700 italic font-bold text-base">Visit Homepage -{'>'}</Text>
                    </TouchableOpacity>
                )}



            </ScrollView>
            <TouchableOpacity
                className="absolute bottom-5 left-0 right-0 mx-5 bg-accent rounded-xl py-3.5 flex flex-row items-center justify-center z-50 mt-44"
                onPress={router.back}
            >
                <Image source={icons.arrow} className="size-5 mr-1 mt-0.5 rotate-180" tintColor="#fff" />
                <Text className="text-white font-semibold text-base">Go Back</Text>
            </TouchableOpacity>
        </>
    );
};

export default PersonDetails;
