import { Client, Account, ID, Databases, Avatars, Query, Storage } from 'react-native-appwrite';


export const config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.jeretgoad.avdeos',
    projectId: '67dc5f6d0029bd564720',
    databaseId: '67dc63b7003325cf51ef',
    userCollectionId: '67dc65770031745c6abe',
    videoCollectionId: '67dc65a8000e455768dd',
    storageId: '67dc6856003c2c2f9d45'
};

const {
    endpoint,
    platform,
    projectId,
    databaseId,
    userCollectionId,
    videoCollectionId,
    storageId,
} = config;

// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(config.endpoint) // Your Appwrite Endpoint
    .setProject(config.projectId) // Your project ID
    .setPlatform(config.platform) // Your application ID or bundle ID.

   
    const account = new Account(client);
    const avatars = new Avatars(client);
    const databases = new Databases(client);
    const storage = new Storage(client);
    
    // Register User
export const createUser = async (email, password, username ) => {
    try {
        // Check for existing session
        await account.get();
        // If get() succeeds, a session exists, so delete it
        await account.deleteSession('current');
      } catch (error) {
        // No session exists, or another error occurred (e.g., network issue)
        // If the error is specifically a 401 Unauthorized error (no session), proceed with signup
          if (error.code !== 401) {
            console.error("Error checking or deleting existing session:", error);
            throw error; // Re-throw the error if it's not a 401
          }
      }
    try {
       const newAccount = await account.create(
        ID.unique(),
        email,
        password,
        username
       )
       
       if(!newAccount) throw Error;

       const avatarUrl = avatars.getInitials(username);

       await signIn(email, password);

       const newUser = await databases.createDocument(
        config.databaseId,
        config.userCollectionId,
        ID.unique(),
        {
            accountId: newAccount.$id,
            email,
            username,
            avatar: avatarUrl
        }
       )
       return newUser;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

// Sign In function
export const signIn = async (email, password) => {
    try {
        const session = await account.createEmailPasswordSession(email, password);

        return session;
    } catch (error) {
        throw new Error(error);
    }
}

export async function getAccount() {
    try {
        const currentAccount = await account.get();

        return currentAccount;
    } catch (error) {
        throw new Error(error);
    }
};

export async function getCurrentUser() {
    try {
        const currentAccount = await getAccount();

        if(!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            databaseId,
            userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        );

        if(!currentUser) throw Error;

        return currentUser.documents[0];
    } catch (error) {
        console.log(error);
    }
}

export const getAllPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId
            [Query.orderDesc("$createdAt")]
        )
        return posts.documents;
    } catch (error) {
        throw new Error(error);      
    }
}

export const getLatestPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.orderDesc("$createdAt"), Query.limit(7)]
        );
        
        return posts.documents;
    } catch (error) {
        throw new Error(error);      
    }
}

export const searchPosts = async (query) => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.search("title", query)]
        );
        
        return posts.documents;
    } catch (error) {
        throw new Error(error);      
    }
}

export const getUserPosts = async (userId) => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.equal("creator", userId)]
        );
        
        return posts.documents;
    } catch (error) {
        throw new Error(error);      
    }
}

export const signOut = async () => {
    try {
        const session = await account.deleteSession('current');

        return session;
    } catch (error) {
        throw new Error(error);
    }
}

export const getFilePreview = async (fileId, type) => {
    let fileUrl;

    try {
        if(type === 'video') {
            fileUrl = storage.getFileView(storageId, fileId);
        } else if(type === 'image') {
            fileUrl = storage.getFilePreview(storageId, fileId, 2000, 2000, 'top', 100);
        } else {
            throw new Error('Invalid file type');
        }

        if(!fileUrl) throw Error;

        return fileUrl;
    } catch (error) {
        throw new Error(error);
    }
}

export const uploadFile = async (file, type) => {
    if(!file) return;

    const asset = { 
        name: file.fileName,
        type: file.mimeType,
        size: file.fileSize,
        uri: file.uri,
     };

    try {
        const uploadFile = await storage.createFile(
            storageId,
            ID.unique(),
            asset
        );

        const fileUrl = await getFilePreview(uploadFile.$id, type);

        return fileUrl;
    } catch (error) {
        throw new Error(error);
    }
}

export const createVideo = async (form) => {
    try {
        const [thumbnailUrl, videoUrl] = await Promise.all([
            uploadFile(form.thumbnail, 'image'),
            uploadFile(form.video, 'video'),
        ])

        const newPost = await databases.createDocument(databaseId, videoCollectionId, ID.unique(), {
            title: form.title,
            thumbnail: thumbnailUrl,
            video: videoUrl,
            prompt: form.prompt,
            creator: form.userId
        })

        return newPost;
    } catch (error) {
        throw new Error(error);
    }
}