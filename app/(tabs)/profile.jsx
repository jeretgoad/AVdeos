import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import EmptyState from '../../components/EmptyState';
import { getUserPosts, signOut } from '../../lib/appwrite';
import useAppwrite from '../../lib/useAppwrite';
import VideoCard from '../../components/VideoCard';
import { useGlobalContext } from '../../context/GlobalProvider';
import { icons } from '../../constants';
import InfoBox from '../../components/InfoBox';
import { router } from 'expo-router';

const Profile = () => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext();
  const { data: posts } = useAppwrite(() => getUserPosts(user.$id));

  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLoggedIn(false);
    
    router.replace('/sign-in');
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList 
        //data={[{ id: 1}, { id: 2}, { id: 3 },]} to have dummy data
        //data={[]} test the emptyState prop
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <VideoCard 
            video={item}
          /> 
        )}
        ListHeaderComponent={() => (
          <View className="w-full flex justify-center items-center mt-6 mb-12 px-4">
            <TouchableOpacity 
              className="flex w-full items-end mb-10" 
              onPress={logout}
            >
              <Image 
                source={icons.logout}
                resizeMode='contain'
                className="w-6 h-6"
              />
            </TouchableOpacity>

            <View className="flex w-16 h-16 border border-secondary rounded-lg justify-center items-center">
              <Image 
                source={{ uri: user?.avatar }} 
                className="w-[90%] h-[90%] rounded-lg"
                resizeMode='cover'
              />
            </View>

            <InfoBox 
              title={user?.username}
              containerStyles='mt-5'
              titleStyles='text-lg'
            />

            <View className="mt-5 flex flex-row">
              <InfoBox 
                title={posts.length || 0}
                subtitle="Posts"
                titleStyles='text-xl'
                containerStyles='mr-10'
              />
              
              <InfoBox 
                title="1.2k"
                subtitle="Followers"
                titleStyles='text-xl'
              />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState 
            title="No Videos Found"
            subtitle="No video found for this search query"
          />
        )}

      />
    </SafeAreaView>
  );
};

export default Profile;