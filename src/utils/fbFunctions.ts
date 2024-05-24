import { db } from "./firebase";
import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  where,
  query,
  limit,
  collection
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export async function getDocument(collection: string, id: string) {
  const docRef = doc(db, collection, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
    return docSnap.data();
  } else {
    // docSnap.data() will be undefined in this case
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
export async function createDocument(
  coll: string,
  path: string,
  obj: any
) {
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
    const ref = doc(db, "users", emailLower,"completedWorkouts",idCrypt);
    const promise = await setDoc(ref, workout);
    return "succesfully set new workout"
  } catch (err) {
    console.log(err);
    return `${err}`
  }
} 