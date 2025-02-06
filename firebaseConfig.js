import { initializeApp } from "firebase/app";
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyDzxQwbriA03j4_p7ss6fZ0nvBaBD9BHnQ",
  authDomain: "hopdev-c4802.firebaseapp.com",
  projectId: "hopdev-c4802",
  storageBucket: "hopdev-c4802.appspot.com",
  messagingSenderId: "190024067708",
  appId: "1:190024067708:android:854ca45cbc6f90bf79b7f9",
};

const app = initializeApp(firebaseConfig);

const messaging = getMessaging(app);

export { messaging };
