"use client";

import { useRouter } from "next/navigation";
import { PremiumPanel } from "./premiumPanel";
import { StandardPanel } from "./standardPanel";
import { useEffect, useState } from "react";
import { initFirebase } from "@/firebase";
import { getAuth } from "firebase/auth";
import { getCheckoutUrl, getPortalUrl } from "./stripePayment";
import { getPremiumStatus } from "./getPremiumStatus";
import { FirebaseApp } from "firebase/app";
import {
  collection,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";


export default function AccountPage() {
  const app = initFirebase();
  const auth = getAuth(app);

  const userName = auth.currentUser?.displayName;
  const email = auth.currentUser?.email;
  const router = useRouter();
  const [isPremium, setIsPremium] = useState(false);
  // const [isCancel, setIsCancel] = useState(true)

  useEffect(() => {
    const checkPremium = async () => {
      const newPremiumStatus = auth.currentUser
        ? await getPremiumStatus(app)
        : true;
      setIsPremium(newPremiumStatus);
    // console.log("sajhfah",newPremiumStatus);

    };
    
    // console.log('status',checkPremium());

      checkPremium();
      checkCancellationPeriod();

  }, [app, auth.currentUser?.uid]);
  //---------------cancel sub check-------------------------
  const db = getFirestore(app);

  const userId = auth.currentUser?.uid;
  if (!userId) {
    console.error('No user is currently logged in.');
    return;
  }
  
  const subscriptionsRef = collection(db, "customers", userId, "subscriptions");
  const cancelQuery = query(
    subscriptionsRef,
    where("cancel_at_period_end", "==", false) // Note: Using "==" to check for true
  );
async function checkCancellationPeriod() {
  try {
    const querySnapshot = await getDocs(cancelQuery);
    let hasCancelAtPeriodEnd = true;
    console.log("length",querySnapshot.size);
    
    // let con = 0
    //  querySnapshot.forEach((doc) => {
    //   const data = doc.data();
    //   // console.log(data);
    //   con++;
    //   if (data.cancel_at_period_end === false) {
    //     hasCancelAtPeriodEnd = false;
    //   }
    // });
    // console.log("con",con);
    if (querySnapshot.docs.length === 0) {
      setIsPremium(false)
      
    }
    

    // console.log("Has cancel at period end:", hasCancelAtPeriodEnd);
    // setIsCancel(hasCancelAtPeriodEnd)
    // if (hasCancelAtPeriodEnd) {
    // }
    // return hasCancelAtPeriodEnd;
  } catch (error) {
    console.error("Error checking cancellation period:", error);
    return false;
  }
}

  // const user : any = auth.currentUser?.uid
  // const subscriptionsRef : any  = collection(db, "customers", user, "subscriptions");
  // const cancelQuery = query(
  //   subscriptionsRef,
  //   where("cancel_at_period_end","==",true)
  // )
  // // if (cancelQuery.type) {
    
  // // }
  // console.log("cancelQuery",cancelQuery);
  // ----------------------------------------------------------
  
  const upgradeToPremiumMonthly = async () => {
    const priceId = "price_1PYwWiLrmgL3Th0DqeD4cHpk";
    const checkoutUrl = await getCheckoutUrl(app, priceId);
    router.push(checkoutUrl);
    console.log("Upgrade to Premium");
  };
  const upgradeToPremiumAnually = async () => {
    const priceId = "price_1PjVMrLrmgL3Th0DF4LQHmPd";
    const checkoutUrl = await getCheckoutUrl(app, priceId);
    router.push(checkoutUrl);
    console.log("Upgrade to Premium");
  };

  const manageSubscription = async () => {
    const portalUrl = await getPortalUrl(app);
    router.push(portalUrl);
    
    console.log("Manage Subscription");
  };

  const signOut = () => {
    auth.signOut();
    router.push("/");
  };

  const upgradeToPremiumButtonMonthly = (
    <button
      onClick={upgradeToPremiumMonthly}
      className="bg-blue-600 p-4 px-6 text-lg rounded-lg hover:bg-blue-700 shadow-lg"
    >
      <div className="flex gap-2 items-center align-middle justify-center">
        Monthly Subscription
      </div>
    </button>
  );
  const upgradeToPremiumButtonAnually = (
    <button
      onClick={upgradeToPremiumAnually}
      className="bg-blue-600 p-4 px-6 text-lg rounded-lg hover:bg-blue-700 shadow-lg"
    >
      <div className="flex gap-2 items-center align-middle justify-center">
        Annual Subscription
      </div>
    </button>
  )

  const managePortalButton = (
    <button
      onClick={manageSubscription}
      className="bg-blue-600 p-4 px-6 text-lg rounded-lg hover:bg-blue-700 shadow-lg"
    >
      <div className="flex gap-2 items-center align-middle justify-center">
        Manage Subscription
        <br />
        <p>UPGRADE AND CANCEL</p>
      </div>
    </button>
  );

  const signOutButton = (
    <button
      onClick={signOut}
      className="hover:underline text-slate-500 hover:text-slate-300 text-lg text-center"
    >
      <div className="flex gap-2 items-center align-middle justify-center">
        Sign Out
      </div>
    </button>
  );
  
  const accountSummary = (
    <div>
      <div className="text-slate-500 mb-1">Signed in as {userName}</div>
      <div className="text-slate-300 text-xl">{email}</div>
    </div>
  );
  let memberButtonAnnual;
  const statusPanel = isPremium ? <PremiumPanel /> : <StandardPanel />;
  const memberButtonMonthly = isPremium ? managePortalButton : upgradeToPremiumButtonMonthly ;
  if (isPremium === false) {
    memberButtonAnnual = isPremium ? managePortalButton : upgradeToPremiumButtonAnually;
  }


  return (
    <div className="flex flex-col gap-8">
      {accountSummary}
      {statusPanel}
      {memberButtonMonthly}
      {memberButtonAnnual}
      {signOutButton}
    </div>
  );
}
