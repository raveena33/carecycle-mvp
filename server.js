require("dotenv").config();
const express = require("express");
const cors = require("cors");
const twilio = require("twilio");
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc, getDocs, updateDoc, doc, getDoc } = require("firebase/firestore");

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

if (!accountSid || !authToken || !twilioPhoneNumber) {
  console.error("Twilio Credentials Missing! Check your .env file.");
  process.exit(1);
}

const client = new twilio(accountSid, authToken);


const firebaseConfig = {
  apiKey: "AIzaSyA_xxxxx",
  authDomain: "carecycle-82585.firebaseapp.com",
  projectId: "carecycle-82585",
  storageBucket: "carecycle-82585.appspot.com",
  messagingSenderId: "435181593080",
  appId: "1:435181593080:web:xxxxxxxxxx"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);


app.post("/voice", async (req, res) => {
  const response = new twilio.twiml.VoiceResponse();
  response.say("Welcome to CareCycle. Press 1 for groceries, 2 for companionship, or 3 for medical visits.");

  response.gather({
    numDigits: 1,
    action: "/handle-selection",
  });

  res.type("text/xml").send(response.toString());
});


app.post("/handle-selection", async (req, res) => {
  const selection = req.body.Digits;
  let service = "";

  if (selection === "1") service = "Groceries";
  else if (selection === "2") service = "Companionship";
  else if (selection === "3") service = "Medical Visits";
  else {
    const response = new twilio.twiml.VoiceResponse();
    response.say("Invalid selection. Goodbye.");
    return res.type("text/xml").send(response.toString());
  }

  const docRef = await addDoc(collection(db, "requests"), {
    service,
    status: "Pending",
    timestamp: new Date(),
    phone: req.body.From,
  });

  console.log(`Request logged: ${service} for ${req.body.From}`);

  const response = new twilio.twiml.VoiceResponse();
  response.say(`Thank you. Your request for ${service} has been received. We will notify you once a volunteer accepts.`);
  
  res.type("text/xml").send(response.toString());
});


app.post("/accept-request", async (req, res) => {
  const { requestId, volunteerName, volunteerPhone } = req.body;

  if (!requestId || !volunteerName || !volunteerPhone) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    const requestRef = doc(db, "requests", requestId);
    const requestSnap = await getDoc(requestRef);

    if (!requestSnap.exists()) {
      return res.status(404).json({ error: "Request not found." });
    }

    await updateDoc(requestRef, {
      status: "Assigned",
      volunteer: volunteerName,
      volunteerPhone: volunteerPhone,
    });

    console.log(`Request ${requestId} assigned to ${volunteerName}`);

   
    callSeniorConfirmation(requestSnap.data().phone, volunteerName, requestSnap.data().service);

    res.json({ success: "Request accepted successfully!" });
  } catch (error) {
    console.error("Error accepting request:", error);
    res.status(500).json({ error: "Failed to accept request." });
  }
});

const NGROK_URL = "https://72bf-199-212-64-66.ngrok-free.app"; // ngrok URL

const callSeniorConfirmation = async (seniorPhone, volunteerName, service) => {
  try {
    console.log(`Calling senior ${seniorPhone} for ${service} with ${volunteerName}...`);

    const call = await client.calls.create({
      url: `${NGROK_URL}/confirm-call?volunteer=${encodeURIComponent(volunteerName)}&service=${encodeURIComponent(service)}`,
      to: seniorPhone,
      from: twilioPhoneNumber,
    });

    console.log(`Call placed to ${seniorPhone}: ${call.sid}`);
  } catch (error) {
    console.error("Error calling senior:", error);
  }
};


app.get("/confirm-call", (req, res) => {
  try {
    const { volunteer, service } = req.query;

    if (!volunteer || !service) {
      console.error("Missing parameters in /confirm-call");
      return res.status(400).send("Missing volunteer or service parameters");
    }

    console.log(`Confirming match: ${volunteer} for ${service}`);

    const response = new twilio.twiml.VoiceResponse();
    response.say(`Your request for ${service} has been assigned to ${volunteer}. They will be in touch soon.`);
    
    res.type("text/xml").send(response.toString());
  } catch (error) {
    console.error("Error generating TwiML:", error);
    res.status(500).send("Error generating TwiML");
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
