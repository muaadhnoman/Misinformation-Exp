import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, orderBy, query, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

export interface PostData {
  id: string;
  postText: string;
  postImage: string | null;
  viewCount: number;
  disputeCount: number;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  profileInitial: string;
  profileName: string;
  profileTime: string;
  createdAt: Date;
  updatedAt: Date;
  settings: {
    blurCounts: boolean;
    autoIncrement: boolean;
    showDisputeGauge: boolean;
    showViewDisputes: boolean;
    showDisputeFeature: boolean;
    showDisputeButton: boolean;
    showNewGauge: boolean;
    showViewsCount: boolean;
  };
  comments: Array<{
    id: number;
    text: string;
    author: string;
    time: string;
    initial: string;
  }>;
}

class PostsService {
  private readonly COLLECTION_NAME = 'posts';

  // Get all posts
  async getAllPosts(): Promise<PostData[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as PostData[];
    } catch (error) {
      console.error('Error getting posts:', error);
      return [];
    }
  }

  // Get posts with real-time updates
  subscribeToAllPosts(callback: (posts: PostData[]) => void): () => void {
    const q = query(
      collection(db, this.COLLECTION_NAME),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const posts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as PostData[];
      callback(posts);
    });

    return unsubscribe;
  }

  // Create a new post
  async createPost(postData: Omit<PostData, 'id' | 'createdAt' | 'updatedAt'>): Promise<string | null> {
    try {
      const docRef = await addDoc(collection(db, this.COLLECTION_NAME), {
        ...postData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('Post created with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error creating post:', error);
      return null;
    }
  }

  // Update an existing post
  async updatePost(postId: string, updates: Partial<PostData>): Promise<boolean> {
    try {
      const postRef = doc(db, this.COLLECTION_NAME, postId);
      await updateDoc(postRef, {
        ...updates,
        updatedAt: new Date()
      });
      console.log('Post updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating post:', error);
      return false;
    }
  }

  // Delete a post
  async deletePost(postId: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, this.COLLECTION_NAME, postId));
      console.log('Post deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting post:', error);
      return false;
    }
  }


  // Get template post data for creating new posts
  getPostTemplate(): Omit<PostData, 'id' | 'createdAt' | 'updatedAt'> {
    return {
      postText: "Just sharing some thoughts on this beautiful day! What's everyone up to?",
      postImage: null,
      viewCount: 0,
      disputeCount: 0,
      likeCount: 0,
      commentCount: 0,
      shareCount: 0,
      profileInitial: 'S',
      profileName: 'Sam Ahmed',
      profileTime: 'Just now',
      settings: {
        blurCounts: true,
        autoIncrement: false,
        showDisputeGauge: false,
        showViewDisputes: false,
        showDisputeFeature: false,
        showDisputeButton: false,
        showNewGauge: false,
        showViewsCount: true
      },
      comments: []
    };
  }
}

export const postsService = new PostsService();