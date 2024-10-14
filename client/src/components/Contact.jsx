// import React from 'react'

// import { list } from "firebase/storage";
import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { useSearchParams } from "react-router-dom";

const Contact = ({ listing }) => {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");
  const onChange = (e) => {
    setMessage(e.target.value);
  };
  useEffect(() => {
    const fetchLanlord = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);

        const data = await res.json();
        setLandlord(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLanlord();
  }, [listing.userRef]);
   const sendEmailPopup = () => {
     const recipientEmail = landlord.email;
     const subject = `Regarding ${listing.name}`;
     const body =
       message || `Hi, I would like to inquire about ${listing.name}.`;

     const mailtoURL = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
       recipientEmail
     )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

     window.open(mailtoURL, "_blank", "width=600,height=600");
   };
  return (
    <>
      {landlord && (
        <div className="flex flex-col gap-4">
          <p>
            Contact <span className="font-semibold ">{landlord.username}</span>{" "}
            for{" "}
            <span className="font-semibold ">{listing.name.toLowerCase()}</span>
          </p>
          <textarea
            className="mt-2 w-full border p-3 rounded-lg"
            placeholder="Enter your message here..."
            onChange={onChange}
            name="message"
            id="message"
            rows="2"
            value={message}
          ></textarea>
          <button
            className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95"
            onClick={sendEmailPopup}
          >
            Send message via Gmail
          </button>
        </div>
      )}
    </>
  );
};

export default Contact;
