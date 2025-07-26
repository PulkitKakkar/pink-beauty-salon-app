import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export async function getUserRole(uid) {
    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);
    if (snap.exists()) {
        return snap.data().role;
    } else {
        return null;
    }
}