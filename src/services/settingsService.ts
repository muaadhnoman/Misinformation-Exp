import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

export interface PostSettings {
  blurCounts: boolean;
  autoIncrement: boolean;
  showDisputeGauge: boolean;
  showViewDisputes: boolean;
  showDisputeFeature: boolean;
  showDisputeButton: boolean;
  showNewGauge: boolean;
  showViewsCount: boolean;
}

export interface PostData {
  postText: string;
  postImage: string | null;
  viewCount: number;
  disputeCount: number;
  profileInitial: string;
  profileName: string;
  profileTime: string;
  settings: PostSettings;
}

const defaultSettings: PostSettings = {
  blurCounts: true,
  autoIncrement: false,
  showDisputeGauge: false,
  showViewDisputes: false,
  showDisputeFeature: false,
  showDisputeButton: false,
  showNewGauge: false,
  showViewsCount: true
};

const defaultPostData: PostData = {
  postText: "Just sharing some thoughts on this beautiful day! What's everyone up to?",
  postImage: null,
  viewCount: 913,
  disputeCount: 19,
  profileInitial: 'S',
  profileName: 'Sam Ahmed',
  profileTime: '2h',
  settings: defaultSettings
};

export const savePostData = async (postId: string, postData: PostData): Promise<void> => {
  try {
    const docRef = doc(db, 'posts', postId);
    await setDoc(docRef, postData);
  } catch (error) {
    console.error('Error saving post data:', error);
  }
};

export const loadPostData = async (postId: string): Promise<PostData> => {
  try {
    const docRef = doc(db, 'posts', postId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as PostData;
    } else {
      return defaultPostData;
    }
  } catch (error) {
    console.error('Error loading post data:', error);
    return defaultPostData;
  }
};

// Legacy functions for backward compatibility
export const saveSettings = async (postId: string, settings: PostSettings): Promise<void> => {
  try {
    const postData = await loadPostData(postId);
    await savePostData(postId, { ...postData, settings });
  } catch (error) {
    console.error('Error saving settings:', error);
  }
};

export const loadSettings = async (postId: string): Promise<PostSettings> => {
  try {
    const postData = await loadPostData(postId);
    return postData.settings;
  } catch (error) {
    console.error('Error loading settings:', error);
    return defaultSettings;
  }
};