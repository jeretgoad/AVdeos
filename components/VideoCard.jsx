import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { icons } from '../constants'
import { ResizeMode, Video } from "expo-av"; 

const VideoCard = ({ video: {title, thumbnail, video, creator: { username, avatar }} }) => {
    const [play, setPlay] = useState(false);

    {/* for "expo-video as expo-av is deprecated"
    const [videoUrl, setVideoUrl] = useState(null);
      
    const player = useVideoPlayer(videoUrl, (player) => {
        player.loop = false;
        player.play();
      });
    */}

    return (
        <View className="flex flex-col items-center px-4 mb-14">
            <View className="flex flex-row gap-3 items-start">
                <View className="flex justify-center items-center flex-row flex-1">
                    <View className="w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center p-0.5 flex">
                        <Image
                            source={{ uri: avatar }}
                            className="w-full h-full rounded-lg"
                            resizeMode='cover' 
                        />
                    </View>

                    <View className="justify-center flex-1 ml-3 gap-y-1">
                        <Text className="text-white font-psemibold text-sm" numberOfLines={1}>{title}</Text>
                        <Text className="text-xs text-gray-100 font-pregular" numberOfLines={1}>{username}</Text>
                    </View>
                </View>

                <View className="pt-2">
                    <Image 
                        source={icons.menu}
                        className="w-5 h-5"
                        resizeMode='contain'
                    />
                </View>
            </View>

            {play ? (
                <Video
                    style={styles.video}
                    source={{ uri: video }}
                    resizeMode={ResizeMode.CONTAIN}
                    useNativeControls
                    shouldPlay
                    onPlaybackStatusUpdate={(status) => {
                    if (status.didJustFinish) {
                        setPlay(false);
                    }
                }}
              />
            ) : (
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => setPlay(true)}
                    className="w-full h-60 rounded-xl mt-3 relative flex justify-center items-center"
                >
                    <Image
                        source={{ uri: thumbnail }}
                        className="w-full h-full rounded-xl mt-3"
                        resizeMode='cover'
                    />
                    <Image 
                        source={icons.play}
                        className="w-12 h-12 absolute"
                        resizeMode='contain'
                    />
                </TouchableOpacity>
            )}
        </View>
  )
};

const styles = StyleSheet.create({
    video: {
        width: "100%",
        height: 240,
        borderRadius: 16,
        marginTop: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    }
  });

export default VideoCard