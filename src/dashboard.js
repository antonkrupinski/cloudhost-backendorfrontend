import React, { useState, useRef, useEffect } from "react";
import { getFirestore, doc, onSnapshot, setDoc } from "firebase/firestore";
import { getApp } from "firebase/app";

export default function Dashboard({ user }) {
  const db = getFirestore(getApp());
  const [sessionId, setSessionId] = useState("");
  const videoRef = useRef();

  const joinSession = async () => {
    const pc = new RTCPeerConnection();

    pc.ontrack = e => videoRef.current.srcObject = e.streams[0];

    // Listen for offer
    const docRef = doc(db, "sessions", sessionId);
    onSnapshot(docRef, async docSnap => {
      const data = docSnap.data();
      if (data?.offer) {
        await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        await setDoc(docRef, { answer: answer.toJSON() }, { merge: true });
      }
    });
  };

  return (
    <div>
      <h1>Welcome {user.email}</h1>
      <input placeholder="Session ID" onChange={e => setSessionId(e.target.value)} />
      <button onClick={joinSession}>Join Session</button>
      <video ref={videoRef} autoPlay style={{ width: "800px" }}></video>
    </div>
  );
}
