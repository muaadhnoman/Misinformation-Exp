import { collection, getDocs, addDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from '../firebase';

export interface AccessCode {
  id: string;
  code: string;
  isActive: boolean;
  isAdmin: boolean;
  createdAt: Date;
  description?: string;
}

class AuthService {
  private readonly COLLECTION_NAME = 'accessCodes';

  // Validate access code and return user info
  async validateAccessCode(code: string): Promise<{ isValid: boolean; isAdmin: boolean }> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where('code', '==', code),
        where('isActive', '==', true)
      );
      
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        return { isValid: false, isAdmin: false };
      }
      
      const userData = querySnapshot.docs[0].data();
      return { 
        isValid: true, 
        isAdmin: userData.isAdmin || false 
      };
    } catch (error) {
      console.error('Error validating access code:', error);
      return { isValid: false, isAdmin: false };
    }
  }

  // Get all access codes (admin function)
  async getAllAccessCodes(): Promise<AccessCode[]> {
    try {
      const querySnapshot = await getDocs(collection(db, this.COLLECTION_NAME));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      })) as AccessCode[];
    } catch (error) {
      console.error('Error getting access codes:', error);
      return [];
    }
  }

  // Add new access code (admin function)
  async addAccessCode(code: string, isAdmin: boolean = false, description?: string): Promise<boolean> {
    try {
      await addDoc(collection(db, this.COLLECTION_NAME), {
        code,
        isActive: true,
        isAdmin,
        createdAt: new Date(),
        description: description || ''
      });
      return true;
    } catch (error) {
      console.error('Error adding access code:', error);
      return false;
    }
  }

  // Deactivate access code (admin function)
  async deactivateAccessCode(codeId: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, this.COLLECTION_NAME, codeId));
      return true;
    } catch (error) {
      console.error('Error deactivating access code:', error);
      return false;
    }
  }

  // Initialize with default codes if collection is empty
  async initializeDefaultCodes(): Promise<void> {
    try {
      const codes = await this.getAllAccessCodes();
      if (codes.length === 0) {
        await this.addAccessCode('123', false, 'Default user access code');
        await this.addAccessCode('admin', true, 'Admin access code');
        console.log('Initialized default access codes');
      }
    } catch (error) {
      console.error('Error initializing default codes:', error);
    }
  }
}

export const authService = new AuthService();