import React, { useState } from "react";

export default function EmailSmsForm({ ticket }) {
  const [emailStatus, setEmailStatus] = useState("");
  const [smsStatus, setSmsStatus] = useState("");

  const handleSendEmail = async () => {
    const res = await fetch("https://get-my-cab-bot-api-chi.vercel.app/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: ticket.custEmail,
        subject: `WahCabs Booking - ${ticket.bookingType}`,
        text: `Dear ${ticket.custName},\n\nYour booking for ${ticket.bookingType} (${ticket.vehicle}) on ${ticket.date} from ${ticket.fromLoc} to ${ticket.toLoc} has been confirmed.\n\nTotal: ₹${ticket.amount}\n\nThanks,\nWahCabs Team`
      }),
    });

    const result = await res.json();
    if (result.success) setEmailStatus("✅ Email sent");
    else setEmailStatus("❌ Failed to send email");
  };

  const handleSendSMS = async () => {
    const res = await fetch("https://get-my-cab-bot-api-chi.vercel.app/api/send-sms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: ticket.custPhone, // Make sure it's in +91 format
        template: "BOOKING",
        data: {
          booking_id: ticket.id || "WCTKT123",
          activity: ticket.bookingType,
          vehicle: ticket.vehicle,
          pickup_date: ticket.date,
          pickup_time: ticket.pickupTime || "10:00 AM",
          from: ticket.fromLoc,
          amount: `₹${ticket.amount}`
        }
      }),
    });

    const result = await res.json();
    if (result.success) setSmsStatus("✅ SMS sent");
    else setSmsStatus("❌ Failed to send SMS");
  };

  return (
    <div className="mt-6 p-4 bg-white rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold mb-2">Send Notification</h3>

      <div className="flex gap-4 flex-wrap">
        <button
          onClick={handleSendEmail}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Send Email to {ticket.custEmail}
        </button>

        <button
          onClick={handleSendSMS}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Send SMS to {ticket.custPhone}
        </button>
      </div>

      <div className="text-sm mt-2 text-gray-700">
        {emailStatus && <div>Email: {emailStatus}</div>}
        {smsStatus && <div>SMS: {smsStatus}</div>}
      </div>
    </div>
  );
}
