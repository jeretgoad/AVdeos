import { View, Text, FlatList } from 'react-native'
import { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import SearchInput from '../../components/SearchInput';
import EmptyState from '../../components/EmptyState';
import { searchPosts } from '../../lib/appwrite';
import useAppwrite from '../../lib/useAppwrite';
import VideoCard from '../../components/VideoCard';
import { useLocalSearchParams } from 'expo-router';

const Profile = () => {
  const { query } = useLocalSearchParams();
  const { data: posts, refetch } = useAppwrite(() => searchPosts(query));

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    refetch();
  }, [query]);

  // one flatlist
  // with list header
  // and horizontal flatlist

  //  we cannot do that with just scrollview as there's both horizontal and vertical scroll (two flat lists, within trending)

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
          <View className="flex my-6 px-4">
            <Text className="font-pmedium text-sm text-gray-100">Search Results</Text>
            <Text className="text-2xl font-psemibold text-white">{query}</Text>
            <View className="mt-6 mb-8">
              <SearchInput initialQuery={query} />
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