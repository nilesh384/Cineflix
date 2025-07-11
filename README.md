# 🍿 Popcorn Play

**Popcorn Play** is a sleek and modern mobile app built using **React Native (Expo)** that allows users to explore trending movies and TV shows, watch trailers, and manage their favorites. It provides an IMDb-like experience — mobile-first, fast, and feature-rich — powered by the **TMDb API** and backed by **Appwrite**.

---

## 🚀 Features

- 🔐 **User Authentication** (Sign Up / Login / Logout via Appwrite)
- 🔍 **Search** for movies and TV shows
- 🔄 **Infinite Scrolling & Pagination** for trending and search results
- 📄 **Detailed Pages** with synopsis, cast, genres, release info, and ratings
- 🎬 **YouTube Trailer Playback** within the app
- 🧑‍🤝‍🧑 **Cast and Crew Details** with images and character info
- 🌐 **Streaming Provider Info**: Know where to watch
- 💾 **Save Movies/TV Shows** to your Appwrite database
- ✨ **Shimmer/Skeleton Loaders** for better loading UX
- 🎨 Polished, responsive UI optimized for all screen sizes

---

## ⚙️ Tech Stack

- **React Native** (with **Expo**)
- **Appwrite** (for Auth + Database + Storage)
- **TMDb API** (movie, TV, trailer, cast, watch providers)
- **React Navigation** (stack/screen transitions)
- **Axios** (data fetching)
- **Shimmer Placeholders** (skeleton loaders)

---

## 📦 Getting Started

### 1. Clone the Repo

   ```bash
   git clone https://github.com/nilesh384/Popcorn-Play.git
   ```
   ```bash
   cd Popcorn-Play
   ```

## Get started

### 2. Install dependencies

   ```bash
   npm install
   ```

### 3. Create a .env file in the root:


TMDB_API_KEY=your_tmdb_api_key
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=your_project_id
APPWRITE_DATABASE_ID=your_database_id
APPWRITE_COLLECTION_ID=your_collection_id
APPWRITE_BUCKET_ID=your_bucket_id


### 4. 🗂️ Folder Structure

```bash
Popcorn-Play/
├── screenshots/
│   ├── home.png
│   ├── details.png
│   ├── trailer.png
│   └── login.png
```

### 5. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

Acknowledgements


TMDb — the amazing open movie API

Appwrite — powerful backend-as-a-service

Expo — fast React Native development


## ⚠️ Disclaimer

Popcorn Play was built for educational and development purposes.

🛑 This app includes a **developer-only feature** to stream full movies and series for free.  
It was added **just for fun**, and to explore how streaming integrations work.  
Please be aware:

- This feature is **NOT safe or legal to use in production**
- It is **not intended for public release**
- Streaming copyrighted content without proper rights is illegal and violates DMCA and local laws

> ❗ **Use it only for learning. Do not deploy or distribute this feature.**
