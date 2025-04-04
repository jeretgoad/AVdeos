import { Image, FlatList, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';
import { React, useState } from 'react';
import { icons } from '../constants';
import * as Animatable from "react-native-animatable";
import { useEvent } from 'expo';
import { VideoView, useVideoPlayer } from "expo-video";
import { ResizeMode, Video } from "expo-av"; 

const zoomIn = {
  0: {
    scale: 0.9,
  },
  1: {
    scale: 1,
  }
}
const zoomOut = {
  0: {
    scale: 1,
  },
  1: {
    scale: 0.9,
  }
}


const TrendingItem = ({ activeItem, item }) => {
  const [play, setPlay] = useState(false);
  
  {/*const [videoUrl, setVideoUrl] = useState(null);
  
  const player = useVideoPlayer(videoUrl, (player) => {
    player.loop = false;
    player.play();
    if(player.playToEnd){
      setPlay(false);
    } else {
      setPlay(true);
    }
  });

  const { isPlaying } = useEvent(player, 'playingChange', { 
    isPlaying: player.playing, 
  });
*/}
  return (
    <Animatable.View className="mr-5" animation={activeItem === item.$id ? zoomIn : zoomOut} duration={250}>
      {play ? (
        <Video
          style={styles.video}
          source={{ uri: item.video }}
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
            className="relative flex justify-center items-center"
            activeOpacity={0.7}
            onPress={() => {
              setPlay(true); 
              //setVideoUrl({uri: `http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4`})
            }}
          >
            <ImageBackground 
              source={{ uri: item.thumbnail }}
              className="w-52 h-72 rounded-[33px] my-5 overflow-hidden shadow-lg shadow-black/40"
              resizeMode='cover'
            />

            <Image 
              source={icons.play} 
              className="w-12 h-12 absolute"
              resizeMode='contain'
            />
          </TouchableOpacity>
      )}
    </Animatable.View>
  )
}

const Trending = ({ posts }) => {
  const [activeItem, setActiveItem] = useState(posts[1]);

  const viewableItemsChanged = ({ viewableItems }) => {
    if(viewableItems.length > 0) { 
      setActiveItem(viewableItems[0].key);
    }
  };

  return (
    <FlatList 
        data={posts}
        horizontal
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
            <TrendingItem activeItem={activeItem} item={item} />
        )}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 0,
        }}
        contentOffset={{ x: 170 }}
    />
  );
};


const styles = StyleSheet.create({
  video: {
      width: 208,
      height: 290,
      borderRadius: 33,
      marginTop: 12,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
  }
});

export default Trending;