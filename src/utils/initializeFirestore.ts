import { authService } from '../services/authService';

// Initialize Firestore with default access codes
export const initializeFirestore = async () => {
  try {
    console.log('Initializing Firestore with default access codes...');
    await authService.initializeDefaultCodes();
    
    // Add additional codes if needed
    const additionalCodes = ['456', '789', 'admin2024'];
    const existingCodes = await authService.getAllAccessCodes();
    const existingCodeValues = existingCodes.map(c => c.code);
    
    for (const code of additionalCodes) {
      if (!existingCodeValues.includes(code)) {
        await authService.addAccessCode(code, `Access code ${code}`);
        console.log(`Added access code: ${code}`);
      }
    }
    
    console.log('Firestore initialization complete');
  } catch (error) {
    console.error('Error initializing Firestore:', error);
  }
};

// Function to add new access code (for admin use)
export const addNewAccessCode = async (code: string, description?: string) => {
  try {
    const success = await authService.addAccessCode(code, description);
    if (success) {
      console.log(`Successfully added access code: ${code}`);
    } else {
      console.error(`Failed to add access code: ${code}`);
    }
    return success;
  } catch (error) {
    console.error('Error adding access code:', error);
    return false;
  }
};