import "./App.css";
import React, { useEffect, useRef, useState } from "react";
import {
  MeetingProvider,
  MeetingConsumer,
  Constants,
} from "@videosdk.live/react-sdk";
import { getToken, createMeeting } from "./api";
import MeetingContainer from "./MeetingContainer";

function JoinScreen({ updateMeetingId, getMeetingAndToken, setMeetingMode }) {
  return (
    <div>
      <input
        type="text"
        placeholder="Enter Meeting Id"
        onChange={(e) => {
          updateMeetingId(e.target.value);
        }}
      />
      <button
        onClick={() => {
          getMeetingAndToken();
          setMeetingMode(Constants.modes.CONFERENCE);
        }}
      >
        Join as a host
      </button>
      <button
        onClick={() => {
          getMeetingAndToken();
          setMeetingMode(Constants.modes.CONFERENCE);
        }}
      >
        Create Meeting
      </button>
      <button
        onClick={() => {
          getMeetingAndToken();
          setMeetingMode(Constants.modes.VIEWER);
        }}
      >
        Join as viewer
      </button>
    </div>
  );
}
function App() {
  const [token, setToken] = useState(null);
  const [meetingId, setMeetingId] = useState(null);
  const [meetingMode, setMeetingMode] = useState(Constants.modes.CONFERENCE);

  const meetingIdRef = useRef();

  useEffect(() => {
    meetingIdRef.current = meetingId;
  }, [meetingId]);

  const getMeetingAndToken = async () => {
    const meetingId = meetingIdRef.current;
    const token = await getToken();
    setToken(token);
    setMeetingId(meetingId ? meetingId : await createMeeting({ token }));
  };
  const updateMeetingId = (meetingId) => {
    setMeetingId(meetingId);
  };

  return token && meetingId ? (
    <MeetingProvider
      config={{
        meetingId,
        micEnabled: true,
        webcamEnabled: true,
        name: "John doe",
        mode: meetingMode,
        multiStream: false,
      }}
      token={token}
    >
      <MeetingConsumer>
        {() => (
          <MeetingContainer meetingId={meetingId} meetingMode={meetingMode} />
        )}
      </MeetingConsumer>
    </MeetingProvider>
  ) : (
    <JoinScreen
      updateMeetingId={updateMeetingId}
      getMeetingAndToken={getMeetingAndToken}
      setMeetingMode={setMeetingMode}
    />
  );
}
export default App;
