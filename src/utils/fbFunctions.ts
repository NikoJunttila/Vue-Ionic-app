/* import { initializeApp } from "firebase/app";
import { getFirestore} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

export const app = initializeApp(firebaseConfig);
export const db = getFirestore();
export const auth = getAuth();
export const storage = getStorage(); */
//above coming from file with config that is hidden
import { db } from "./firebase";
import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  where,
  query,
  limit,
  collection,
  writeBatch,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export async function getDocument(collection: string, id: string) {
  const docRef = doc(db, collection, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return null
    console.log("No such document!");
  }
}
export async function getCollection(coll: string): Promise<any> {
  const querySnapshot = await getDocs(collection(db, coll));
  const data: any = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return data;
}
export async function getDoneWorkoutsCollection(
  emailLower: string
): Promise<any> {
  const querySnapshot = await getDocs(
    collection(db, "users", emailLower, "completedWorkouts")
  );
  const data: any = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return data;
}
export async function getCustomWorkoutsCollection(
  emailLower: string
): Promise<any> {
  const querySnapshot = await getDocs(
    collection(db, "users", emailLower, "addedWorkouts")
  );
  const data: any = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return data;
}
export async function createDocument(coll: string, path: string, obj: any) {
  try {
    const ref = doc(db, coll, `${path}`);
    const promise = await setDoc(ref, obj);
    console.log(`succesfully set new ${coll}`);
  } catch (err) {
    console.log(err);
  }
}
export async function fetchDocumentsWhere(
  coll: string,
  whereParam: string,
  lookFor: string,
  number: number
) {
  const collectionRef = collection(db, coll);
  const q = query(
    collectionRef,
    where(whereParam, "==", lookFor),
    limit(number)
  );
  try {
    const snapshot = await getDocs(q);
    const returnVal = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return returnVal;
  } catch (error) {
    console.error("Error fetching documents:", error);
  }
  return [];
}
export async function addCompletedWorkout(emailLower: string, workout: any) {
  const idCrypt = window.crypto.randomUUID();
  try {
    const ref = doc(db, "users", emailLower, "completedWorkouts", idCrypt);
    const promise = await setDoc(ref, workout);
    return "succesfully set new workout";
  } catch (err) {
    console.log(err);
    return `${err}`;
  }
}
export async function updateWorkouts(workout: any, emailLower: string) {
  try {
    const batch = writeBatch(db);

    const ref1 = doc(db, "users", emailLower, "addedWorkouts", `${workout.id}`);
    batch.set(ref1, workout);

    const ref2 = doc(db, "workoutsPersonal", `${workout.id}`);
    batch.set(ref2, workout);

    await batch.commit();
    console.log("updated workouts");
  } catch (error) {
    console.error("Error updating workouts: ", error);
  }
}
