import { FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  collection,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

export const getPremiumStatus = async (app: FirebaseApp) => {
  const auth = getAuth(app);
  const userId = auth.currentUser?.uid;
  // let t;
  if (!userId) throw new Error("User not logged in");

  const db = getFirestore(app);
  const subscriptionsRef : any  = collection(db, "customers", userId, "subscriptions");
  const q = query(
    subscriptionsRef,
    where("status", "in", ["trialing", "active"])
  );

  // async function checkCancellationPeriod() {
  //   try {
  //     const querySnapshot = await getDocs(cancelQuery);
  //     let hasCancelAtPeriodEnd = true;
  //     console.log("length",querySnapshot.size);
      
  //     let con = 0
  //      querySnapshot.forEach((doc) => {
  //       const data = doc.data();
  //       // console.log(data);
  //       con++;
  //       if (data.cancel_at_period_end === false) {
  //         hasCancelAtPeriodEnd = false;
  //       }
  //     });
  //     console.log("con",con);
      
  
  //     console.log("Has cancel at period end:", hasCancelAtPeriodEnd);
  //     setIsCancel(hasCancelAtPeriodEnd)
  //     if (hasCancelAtPeriodEnd) {
  //       setIsPremium(false)
  //     }
  //     // return hasCancelAtPeriodEnd;
  //   } catch (error) {
  //     console.error("Error checking cancellation period:", error);
  //     return false;
  //   }
  // }
  


  // const doc = await getDocs(subscriptionsRef)
  // // console.log('doc',doc.docs);
  // doc.forEach((doc) => {
  //   console.log("kdaflk");
    
  //   console.log(doc.id);
  //   // t = doc.id
  //   // Fetch subcollections for each subscription document
  //   // fetchSubcollections(doc.id);
  // });
  // const invoiceRef : any  = collection(db, "customers", userId, "subscriptions",t, "invoice");

  

  return new Promise<boolean>((resolve, reject) => {
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        // In this implementation we only expect one active or trialing subscription to exist.
        console.log("Subscription snapshot", snapshot.docs.length);
        if (snapshot.docs.length === 0) {
          console.log("No active or trialing subscriptions found");
          resolve(false);
        } else {
          console.log("Active or trialing subscription found");
          resolve(true);
        }
        unsubscribe();
      },
      reject
    );
  });
};
