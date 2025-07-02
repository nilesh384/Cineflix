import { View, Text, ImageBackground, Image } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { images } from '@/constants/images'
import { icons } from '@/constants/icons'

const TabIcon = ({icon, title, focused}: any) => {
  if (focused){
    return (
    <>
      <ImageBackground source={images.highlight} className='flex flex-row w-full flex-1 min-w-[100px] min-h-16 mt-4 justify-center items-center rounded-full overflow-hidden'>
        <Image source={icon} tintColor="#151312" className='size-5' />
        <Text className='text-secondary text-base font-semibold ml-2'>{title}</Text>
      </ImageBackground>

    </>
  )
  } else {
    return (
      <View className='flex flex-row w-full flex-1 min-w-[112px] min-h-14 mt-4 justify-center items-center rounded-full overflow-hidden'>
        <Image source={icon} tintColor="text-light-100" className='size-5' />
      </View>
    )
  }
}

const _layout = () => {
  return (
    <Tabs 
    screenOptions={{
      tabBarShowLabel: false,
      tabBarItemStyle: {
        height: "100%",
        width: "100%",
        justifyContent: 'center',
        alignItems: 'center',
      },
      tabBarStyle:{
        backgroundColor: "#0f0d23",
        borderRadius: 30,
        marginHorizontal: 10,
        marginBottom: 20, 
        height: 55,
        position: "absolute",
        overflow: "hidden",
        borderWidth: 0,
        borderColor: "#0f0d23",
        
      }
    }}
    >
      <Tabs.Screen name="index" options={{
        title: 'Home',
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <TabIcon focused={focused} icon={icons.home} title="Home"/>
        )
      }} />
      <Tabs.Screen name="saved" options={{ title: 'Saved', headerShown: false,
        tabBarIcon: ({ focused }) => (
          <TabIcon focused={focused} icon={icons.save} title="Saved"/>
        )
       }} />
      <Tabs.Screen name="search" options={{ title: 'Search', headerShown: false,
        tabBarIcon: ({ focused }) => (
          <TabIcon focused={focused} icon={icons.search} title="Search"/>
        )
       }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', headerShown: false,
        tabBarIcon: ({ focused }) => (
          <TabIcon focused={focused} icon={icons.person} title="Profile"/>
        )
       }} />
    </Tabs>
  )
}

export default _layout