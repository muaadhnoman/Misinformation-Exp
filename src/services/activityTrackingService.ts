import { collection, addDoc, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';

export interface CommentActivity {
  id?: string;
  accessCode: string;
  action: 'comment_submit' | 'comment_edit' | 'comment_delete';
  postId: string;
  timestamp: Date;
  details: {
    commentText: string;
    postAuthor: string;
    postContent: string;
    responseTime: string;
    commentLength: number;
    wordCount: number;
    containsLinks: boolean;
    containsUrls: boolean;
    sentiment?: 'positive' | 'negative' | 'neutral';
    sessionDuration?: number;
  };
}

export interface UserSession {
  accessCode: string;
  sessionStart: Date;
  postViewStart: Date;
  currentPostId?: string;
}

class ActivityTrackingService {
  private readonly ACTIVITIES_COLLECTION = 'userActivities';
  private userSession: UserSession | null = null;

  // Initialize user session with access code
  initializeSession(accessCode: string): void {
    this.userSession = {
      accessCode,
      sessionStart: new Date(),
      postViewStart: new Date()
    };
  }

  // Set current post being viewed
  setCurrentPost(postId: string): void {
    if (this.userSession) {
      this.userSession.currentPostId = postId;
      this.userSession.postViewStart = new Date();
    }
  }

  // Get current user's access code
  getCurrentAccessCode(): string {
    return this.userSession?.accessCode || 'unknown';
  }

  // Calculate response time for current post
  private calculateResponseTime(): string {
    if (!this.userSession?.postViewStart) return '0 seconds';
    
    const now = new Date();
    const diffMs = now.getTime() - this.userSession.postViewStart.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    
    if (diffMinutes > 0) {
      return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
    } else {
      return `${diffSeconds} second${diffSeconds > 1 ? 's' : ''}`;
    }
  }

  // Analyze comment content
  private analyzeComment(commentText: string) {
    const wordCount = commentText.trim().split(/\s+/).filter(word => word.length > 0).length;
    const containsLinks = /https?:\/\/[^\s]+/.test(commentText);
    const containsUrls = /(?:www\.|https?:\/\/)[^\s]+/.test(commentText);
    
    return {
      wordCount,
      containsLinks,
      containsUrls,
      commentLength: commentText.length
    };
  }

  // Get basic sentiment analysis
  private getSentiment(text: string): 'positive' | 'negative' | 'neutral' {
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love', 'like', 'awesome', 'brilliant'];
    const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'dislike', 'wrong', 'stupid', 'horrible', 'disgusting', 'fake'];
    
    const lowerText = text.toLowerCase();
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  // Track comment submission
  async trackCommentSubmission(
    postId: string,
    commentText: string,
    postAuthor: string,
    postContent: string
  ): Promise<boolean> {
    try {
      if (!this.userSession) {
        console.error('No user session initialized');
        return false;
      }

      const analysis = this.analyzeComment(commentText);
      const responseTime = this.calculateResponseTime();
      const sentiment = this.getSentiment(commentText);

      const activity: CommentActivity = {
        accessCode: this.userSession.accessCode,
        action: 'comment_submit',
        postId,
        timestamp: new Date(),
        details: {
          commentText,
          postAuthor,
          postContent: postContent.substring(0, 100) + (postContent.length > 100 ? '...' : ''),
          responseTime,
          commentLength: analysis.commentLength,
          wordCount: analysis.wordCount,
          containsLinks: analysis.containsLinks,
          containsUrls: analysis.containsUrls,
          sentiment,
          sessionDuration: Math.floor((new Date().getTime() - this.userSession.sessionStart.getTime()) / 1000)
        }
      };

      await addDoc(collection(db, this.ACTIVITIES_COLLECTION), activity);
      console.log('Comment activity tracked successfully');
      return true;
    } catch (error) {
      console.error('Error tracking comment activity:', error);
      return false;
    }
  }

  // Get user activities by access code
  async getUserActivities(accessCode: string, limitCount: number = 50): Promise<CommentActivity[]> {
    try {
      const q = query(
        collection(db, this.ACTIVITIES_COLLECTION),
        where('accessCode', '==', accessCode),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date()
      })) as CommentActivity[];
    } catch (error) {
      console.error('Error fetching user activities:', error);
      return [];
    }
  }

  // Get all activities (admin function)
  async getAllActivities(limitCount: number = 100): Promise<CommentActivity[]> {
    try {
      const q = query(
        collection(db, this.ACTIVITIES_COLLECTION),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date()
      })) as CommentActivity[];
    } catch (error) {
      console.error('Error fetching all activities:', error);
      return [];
    }
  }

  // Get activities by post ID
  async getPostActivities(postId: string): Promise<CommentActivity[]> {
    try {
      const q = query(
        collection(db, this.ACTIVITIES_COLLECTION),
        where('postId', '==', postId),
        orderBy('timestamp', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date()
      })) as CommentActivity[];
    } catch (error) {
      console.error('Error fetching post activities:', error);
      return [];
    }
  }
}

export const activityTracker = new ActivityTrackingService();