import React, { useState, useEffect } from 'react';

// --- Template Definitions ---
// In a real app, you might fetch these from a database.
const emailTemplates = [
  {
    name: 'Booking Confirmation',
    subject: 'Booking Confirmed: Your Trip with WahCabs',
    body: `Dear {custName},\n\nYour booking for a {bookingType} trip has been successfully confirmed!\n\nVehicle: {vehicle}\nDate: {date}\nFrom: {fromLoc}\nTo: {toLoc}\n\nTotal Amount: ₹{amount}\n\nWe look forward to serving you.\n\nBest regards,\nThe WahCabs Team`,
  },
  {
    name: 'Payment Reminder',
    subject: 'Action Required: Payment Reminder for Your WahCabs Booking',
    body: `Dear {custName},\n\nThis is a friendly reminder regarding the outstanding payment for your booking.\n\nBooking ID: {id}\nTotal Amount: ₹{amount}\nAmount Pending: ₹{pendingAmount}\n\nPlease complete the payment at your earliest convenience.\n\nThanks,\nThe WahCabs Team`,
  },
  {
    name: 'Trip Start Notification',
    subject: 'Your WahCabs Trip is Starting Soon!',
    body: `Hello {custName},\n\nYour driver is on the way for your {bookingType} trip from {fromLoc} to {toLoc}.\n\nPlease be ready for your pickup.\n\nDriver Details:\nName: {driverName}\nContact: {driverPhone}\nVehicle: {vehicleNumber}\n\nHave a safe journey!\n\nThanks,\nThe WahCabs Team`,
  },
];

// --- Helper function to replace placeholders ---
const fillTemplate = (templateString, ticket) => {
  if (!ticket) return templateString;
  // A simple regex to find all {key} placeholders
  return templateString.replace(/\{(\w+)\}/g, (placeholder, key) => {
    // Use dummy data for placeholders not in the ticket object
    const dummyData = {
        driverName: "Ramesh Kumar",
        driverPhone: "+91 9876543210",
        vehicleNumber: "GA 01 AB 1234",
        pendingAmount: ticket.pendingAmount || ticket.price, // Fallback for pending amount
    };
    return ticket[key] || dummyData[key] || placeholder;
  });
};


export default function EmailDialog({ isOpen, onClose, ticket }) {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [status, setStatus] = useState('');
  const [isSending, setIsSending] = useState(false);

  // --- Effect to initialize the dialog when it opens ---
  useEffect(() => {
    if (isOpen && ticket) {
      // Load the default 'Booking Confirmation' template
      const defaultTemplate = emailTemplates[0];
      setSubject(fillTemplate(defaultTemplate.subject, ticket));
      setBody(fillTemplate(defaultTemplate.body, ticket));
      setStatus(''); // Reset status on open
    }
  }, [isOpen, ticket]);

  // --- Handle template selection ---
  const handleTemplateChange = (e) => {
    const templateName = e.target.value;
    const selectedTemplate = emailTemplates.find(t => t.name === templateName);
    if (selectedTemplate) {
      setSubject(fillTemplate(selectedTemplate.subject, ticket));
      setBody(fillTemplate(selectedTemplate.body, ticket));
    }
  };

  // --- Handle sending the email ---
  const handleSendEmail = async () => {
    if (!ticket || !ticket.custEmail) {
      setStatus('❌ Error: Customer email not found.');
      return;
    }
    setIsSending(true);
    setStatus('⏳ Sending...');

    try {
      const res = await fetch('https://get-my-cab-bot-api-chi.vercel.app/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: ticket.custEmail,
          subject: subject,
          text: body,
        }),
      });

      const result = await res.json();
      if (result.success) {
        setStatus('✅ Email sent successfully!');
      } else {
        setStatus(`❌ Failed to send email: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error sending email:', error);
      setStatus('❌ Network or server error.');
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-gray-900 text-white rounded-lg shadow-2xl p-8 w-full max-w-2xl transform transition-all duration-300 scale-100">
        <h2 className="text-2xl font-bold mb-4">Compose Email</h2>

        {/* --- Template Selector --- */}
        <div className="mb-4">
          <label htmlFor="template-select" className="block text-sm font-medium text-gray-400 mb-2">
            Load a Template
          </label>
          <select
            id="template-select"
            onChange={handleTemplateChange}
            className="input-modern w-full"
            defaultValue="Booking Confirmation"
          >
            {emailTemplates.map(t => (
              <option key={t.name} value={t.name}>{t.name}</option>
            ))}
          </select>
        </div>

        {/* --- Email Fields --- */}
        <div className="mb-4">
          <label htmlFor="subject" className="block text-sm font-medium text-gray-400 mb-2">Subject</label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="input-modern w-full"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="body" className="block text-sm font-medium text-gray-400 mb-2">Body</label>
          <textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="input-modern w-full h-48"
            rows="10"
          />
        </div>

        {/* --- Action Buttons --- */}
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-400">{status}</div>
          <div className="flex gap-4">
            <button onClick={onClose} className="btn-secondary" disabled={isSending}>
              Cancel
            </button>
            <button onClick={handleSendEmail} className="btn-primary" disabled={isSending}>
              {isSending ? 'Sending...' : 'Send Email'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
