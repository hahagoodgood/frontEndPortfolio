// src/firebase/firebaseConfig.js
// Firebase 프로젝트에서 복사한 구성 객체를 여기에 추가하세요.
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {getAuth, signInAnonymously, onAuthStateChanged} from "firebase/auth";

// .env 파일의 api 키값을 ""으로 감싸면 안 된다.
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASEURL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

// Firebase 앱 초기화
const firebaseApp = initializeApp(firebaseConfig);

// Firestore 초기화
const db = getFirestore(firebaseApp);


// 권한 얻기
const auth = getAuth(firebaseApp);

// 연결확인
const testFirebaseConnection = () => {
  // fierbaseApp이 비여있지 않을 경우
  if (firebaseApp) {
    console.log("Firebase initialized successfully:", firebaseApp);
  } else {
    console.error("Firebase initialization failed!");
  }
};

// 인증상태 확인 후 로그인 여부 확인
const ensureAnonymousLogin = async () => {
  try {
    return new Promise((resolve, reject) => {
      // 현재 인증 상태 확인
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          // 이미 인증된 경우
          console.log("User is already logged in:", user.uid);
          resolve(user); // 현재 사용자 반환
        } else {
          // 인증되지 않은 경우 익명 로그인 수행
          try {
            const userCredential = await signInAnonymously(auth);
            console.log("Signed in anonymously:", userCredential.user.uid);
            resolve(userCredential.user); // 익명 사용자 반환
          } catch (error) {
            console.error("Error during anonymous sign-in:", error.message);
            reject(error);
          }
        }
      });
    });
  } catch (error) {
    console.error("Error ensuring anonymous login:", error.message);
    throw error;
  }
};

function getType(value) {
  if (value === null) return "null"; // null 체크
  if (typeof value !== "object") return typeof value; // 원시 타입 반환

  // 객체, 배열, 날짜 등을 세분화
  const type = Object.prototype.toString.call(value); // "[object Type]" 반환
  return type.slice(8, -1).toLowerCase(); // "Type" 부분만 추출해 소문자로 반환
}


// export default ;
export { db, 
  firebaseApp, 
  auth, 
  testFirebaseConnection, 
  ensureAnonymousLogin,
  getType };
