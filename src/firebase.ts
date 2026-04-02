import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
console.log("Firebase app initialized:", app.name);

// Use the database ID from config if it exists, otherwise use (default)
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');
console.log("Firestore initialized with DB ID:", firebaseConfig.firestoreDatabaseId || '(default)');
export const auth = getAuth(app);

// Connection test
async function testConnection() {
  try {
    console.log("Starting Firestore connection test...");
    const testDoc = await getDocFromServer(doc(db, 'test', 'connection'));
    console.log("Firestore connection successful. Doc exists:", testDoc.exists());
  } catch (error: any) {
    console.error("Firestore connection test error details:", {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    if (error.message && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration. The client is offline.");
    }
  }
}
testConnection();
