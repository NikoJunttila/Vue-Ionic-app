import {db} from "./firebase"
import { doc, getDoc,getDocs, collection } from "firebase/firestore";

export async function getDocument(collection : string,id:string){
    const docRef = doc(db, collection, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
    return docSnap.data()
  } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
  }
}
export async function getCollection(coll:string) : Promise<any>{
    const querySnapshot = await getDocs(collection(db, coll));
    const data : any = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
return data 
}