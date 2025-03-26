import { View, Text, Image, Platform } from 'react-native'
import { Tabs, Redirect } from 'expo-router';

import { icons } from '../../constants';
import { StatusBar } from 'expo-status-bar';
import { useGlobalContext } from '../../context/GlobalProvider';

const TabIcon = ({ icon, color, name, focused }) => {
    return (
        <View className='flex items-center justify-center gap-2 mt-7'>
            <Image 
                source={icon}
                resizeMode="contain"
                tintColor={color}
                className="w-6 h-6"
            />
            <Text 
                className={`${focused ? 'font-psemibold' : 'font-pregular'} text-xs w-full text-center`}
                style={{ color: color }}    
            >
                {name}
            </Text>
        </View>
    )
};

const TabsLayout = () => {
    const { isLoading, isLoggedIn } = useGlobalContext();
    //console.log("loading and isLogged: " + isLoading + " " + isLoggedIn);
    if (!isLoading && !isLoggedIn) return <Redirect href="/sign-in" />;
    return (
        <>
            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: '#FFA001',
                    tabBarInactiveTintColor: '#CDCDE0',
                    tabBarStyle: {
                        backgroundColor: '#161622',
                        borderTopWidth: 1,
                        borderTopColor: '#232533',
                        height: 84,
                    },
                    tabBarShowLabel: false,
                }}
            >
                <Tabs.Screen 
                    name="home"
                    options={{
                        title: 'Home',
                        headerShown: false,
                        tabBarIcon: ({ color, focused }) => (
                            <TabIcon 
                                icon={icons.home}
                                color={color}
                                name= "Home"
                                focused={focused}
                            />
                        )
                    }}
                />
                <Tabs.Screen 
                    name="bookmark"
                    options={{
                        title: 'Bookmark',
                        headerShown: false,
                        tabBarIcon: ({ color, focused }) => (
                            <TabIcon 
                                icon={icons.bookmark}
                                color={color}
                                name= "Bookmark"
                                focused={focused}
                            />
                        )
                    }}
                />
                <Tabs.Screen 
                    name="create"
                    options={{
                        title: 'Create',
                        headerShown: false,
                        tabBarIcon: ({ color, focused }) => (
                            <TabIcon 
                                icon={icons.plus}
                                color={color}
                                name= "Create"
                                focused={focused}
                            />
                        )
                    }}
                />
                <Tabs.Screen 
                    name="profile"
                    options={{
                        title: 'Profile',
                        headerShown: false,
                        tabBarIcon: ({ color, focused }) => (
                            <TabIcon 
                                icon={icons.profile}
                                color={color}
                                name= "Profile"
                                focused={focused}
                            />
                        )
                    }}
                />
            </Tabs>
            <StatusBar backgroundColor="#161622" style="light" />
        </>
    );
};

export default TabsLayout;