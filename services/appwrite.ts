import { Client, Databases, ID, Query } from "appwrite";

// track the searches made by a user

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;

const client = new Client();
client
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

const databases = new Databases(client);

export const updateSeachCount = async (
  query: string,
  movie: Movie | undefined
) => {
  if (!query.trim() || !movie) return;

  try {
    const result = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("searchTerm", query),
    ]);

    if (result.documents.length > 0) {
      const existingMovie = result.documents[0];
      await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        existingMovie.$id,
        {
          count: (existingMovie.count || 0) + 1,
        }
      );
      console.log("🔁 Updated search count:", existingMovie.searchTerm);
    } else {
      await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm: query,
        movie_id: movie.id,
        count: 1,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        title: movie.title,
        vote_average: movie.vote_average,
      });
      console.log("🆕 Created new search record:", query);
    }
  } catch (error) {
    console.error("❌ Appwrite Error:", error);
  }
};

export const getTrendingMovies = async (): Promise<TrendingMovie[] | undefined> => {
  try {
    const result = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.limit(10),
      Query.orderDesc("count"),
    
    ]);
    return result.documents as unknown as TrendingMovie[];

  } catch (error) {
    console.error("❌ Error fetching trending movies:", error);
    return undefined;
  }
};
