"use client";
import * as React from "react";

interface EmailTemplateProps {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  name,
  email,
  subject,
  message,
}) => (
  <div>
    <h1>Hei, {name}!</h1>
    <br></br>
    <p>Tak for besked ❤️</p>
    <p>Vi har modtaget det her indhold fra dig:</p>
    <br></br>
    <h3>Emne: {subject}</h3>
    <p>Besked: {message}</p>
    <p>Email: {email}</p>
    <br></br>
    <p>En hårdtarbejdende Frigear frivillig vil svare dig hurtigst mulig 🤘</p>
    <br></br>
    <h3>Kram og high-five </h3>
    <h3>Frigear ★★★</h3>
  </div>
);

export default EmailTemplate;
