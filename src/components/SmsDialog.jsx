import React, { useState, useEffect } from 'react';

// --- Template Definitions for SMS ---
const smsTemplates = [
  {
    name: 'Booking Confirmation',
    body: `WahCabs: Your booking for {bookingType} on {date} is confirmed. Vehicle: {vehicle}. Total: Rs{amount}. Thank you!`,
  },
  {
    name: 'Payment Reminder',
    body: `WahCabs Reminder: Payment of Rs{pendingAmount} is pending for booking {id}. Please pay soon.`,
  },
  {
    name: 'Driver Details',
    body: `WahCabs Update: Your driver for trip on {date} is {driverName} ({driverPhone}). Vehicle: {vehicleNumber}.`,
  },
];

// --- Helper function to replace placeholders ---
const fillTemplate = (templateString, ticket) => {
  if (!ticket) return templateString;
  return templateString.replace(/\{(\w+)\}/g, (placeholder, key) => {
    const dummyData = {
        driverName: "Ramesh K",
        driverPhone: "+919876543210",
        vehicleNumber: "GA01AB1234",
        pendingAmount: ticket.pendingAmount || ticket.price,
    };
    return ticket[key] || dummyData[key] || placeholder;
  });
};

export default function SmsDialog({ isOpen, onClose, ticket }) {
  const [body, setBody] = useState('');
  const [status, setStatus] = useState('');
  const [isSending, setIsSending] = useState(false);

  // --- Effect to initialize the dialog ---
  useEffect(() => {
    if (isOpen && ticket) {
      const defaultTemplate = smsTemplates[0];
      setBody(fillTemplate(defaultTemplate.body, ticket));
      setStatus('');
    }
  }, [isOpen, ticket]);

  // --- Handle template selection ---
  const handleTemplateChange = (e) => {
    const templateName = e.target.value;
    const selectedTemplate = smsTemplates.find(t => t.name === templateName);
    if (selectedTemplate) {
      setBody(fillTemplate(selectedTemplate.body, ticket));
    }
  };

  // --- Handle sending the SMS ---
  // NOTE: This assumes your API can handle a 'text' field for custom messages.
  // If your API strictly requires a template ID, this part needs adjustment.
  const handleSendSms = async () => {
    if (!ticket || !ticket.custPhone) {
      setStatus('❌ Error: Customer phone not found.');
      return;
    }
    setIsSending(true);
    setStatus('⏳ Sending...');

    try {
      const res = await fetch('https://get-my-cab-bot-api-chi.vercel.app/api/send-sms-text', { // Assuming a new endpoint for raw text
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: ticket.custPhone,
          text: body,
        }),
      });

      const result = await res.json();
      if (result.success) {
        setStatus('✅ SMS sent successfully!');
      } else {
        setStatus(`❌ Failed to send SMS: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error sending SMS:', error);
      setStatus('❌ Network or server error.');
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-gray-900 text-white rounded-lg shadow-2xl p-8 w-full max-w-lg transform transition-all duration-300 scale-100">
        <h2 className="text-2xl font-bold mb-4">Compose SMS</h2>

        <div className="mb-4">
          <label htmlFor="template-select-sms" className="block text-sm font-medium text-gray-400 mb-2">
            Load a Template
          </label>
          <select
            id="template-select-sms"
            onChange={handleTemplateChange}
            className="input-modern w-full"
            defaultValue="Booking Confirmation"
          >
            {smsTemplates.map(t => (
              <option key={t.name} value={t.name}>{t.name}</option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label htmlFor="sms-body" className="block text-sm font-medium text-gray-400 mb-2">Message</label>
          <textarea
            id="sms-body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="input-modern w-full h-32"
            rows="5"
          />
        </div>

        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-400">{status}</div>
          <div className="flex gap-4">
            <button onClick={onClose} className="btn-secondary" disabled={isSending}>
              Cancel
            </button>
            <button onClick={handleSendSms} className="btn-primary" disabled={isSending}>
              {isSending ? 'Sending...' : 'Send SMS'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
