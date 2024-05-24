// stores/userStore.js
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { auth, db } from "../utils/firebase"
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export const useUserStore = defineStore('user', () => {
    const user = ref(null);
  
    // Function to fetch user data
    const fetchUser = async (email) => {
      try {
        const userDocRef = doc(db, 'users', email);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          user.value = userDoc.data();
        } else {
          throw new Error('No user found with the provided email.');
        }
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
    };
  
    // Listen to authentication state changes
    onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        // If user is authenticated, fetch user data
        fetchUser(authUser.email);
      } else {
        // If user is not authenticated, reset user state
        user.value = null;
      }
    });
  
    return { user };
  });
