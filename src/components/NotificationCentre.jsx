import React, { useState, useEffect } from 'react';

// --- Template Definitions ---
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
];

const smsTemplates = [
  {
    name: 'Booking Confirmation',
    body: `WahCabs: Your booking for {bookingType} on {date} is confirmed. Vehicle: {vehicle}. Total: Rs{amount}. Thank you!`,
  },
  {
    name: 'Payment Reminder',
    body: `WahCabs Reminder: Payment of Rs{pendingAmount} is pending for booking {id}. Please pay soon.`,
  },
];

// --- Helper function to replace placeholders ---
const fillTemplate = (templateString, ticket) => {
  if (!ticket) return templateString;
  return templateString.replace(/\{(\w+)\}/g, (placeholder, key) => {
    const dummyData = {
        pendingAmount: ticket.pendingAmount || ticket.price,
        amount: ticket.price, // Use price for amount if not present
    };
    return ticket[key] || dummyData[key] || placeholder;
  });
};


export default function NotificationCenter({ ticket }) {
  // State for Email
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [emailStatus, setEmailStatus] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  // State for SMS
  const [smsBody, setSmsBody] = useState('');
  const [smsStatus, setSmsStatus] = useState('');
  const [isSendingSms, setIsSendingSms] = useState(false);

  // --- Effect to initialize the forms when ticket data is available ---
  useEffect(() => {
    if (ticket) {
      // Initialize Email form with the first template
      const defaultEmailTemplate = emailTemplates[0];
      setEmailSubject(fillTemplate(defaultEmailTemplate.subject, ticket));
      setEmailBody(fillTemplate(defaultEmailTemplate.body, ticket));

      // Initialize SMS form with the first template
      const defaultSmsTemplate = smsTemplates[0];
      setSmsBody(fillTemplate(defaultSmsTemplate.body, ticket));
    }
  }, [ticket]);

  // --- Handlers for Email ---
  const handleEmailTemplateChange = (e) => {
    const templateName = e.target.value;
    const selectedTemplate = emailTemplates.find(t => t.name === templateName);
    if (selectedTemplate) {
      setEmailSubject(fillTemplate(selectedTemplate.subject, ticket));
      setEmailBody(fillTemplate(selectedTemplate.body, ticket));
    }
  };

  const handleSendEmail = async () => {
    setIsSendingEmail(true);
    setEmailStatus('⏳ Sending...');
    try {
      const res = await fetch('https://get-my-cab-bot-api-chi.vercel.app/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: ticket.custEmail,
          subject: emailSubject,
          text: emailBody,
        }),
      });
      const result = await res.json();
      setEmailStatus(result.success ? '✅ Email sent successfully!' : `❌ Failed: ${result.error || 'Unknown error'}`);
    } catch (error) {
      setEmailStatus('❌ Network or server error.');
    } finally {
      setIsSendingEmail(false);
    }
  };

  // --- Handlers for SMS ---
  const handleSmsTemplateChange = (e) => {
    const templateName = e.target.value;
    const selectedTemplate = smsTemplates.find(t => t.name === templateName);
    if (selectedTemplate) {
      setSmsBody(fillTemplate(selectedTemplate.body, ticket));
    }
  };

  const handleSendSms = async () => {
    setIsSendingSms(true);
    setSmsStatus('⏳ Sending...');
    try {
      // NOTE: This assumes your backend has an endpoint that accepts raw text for SMS.
      const res = await fetch('https://get-my-cab-bot-api-chi.vercel.app/api/send-sms-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: ticket.custPhone,
          text: smsBody,
        }),
      });
      const result = await res.json();
      setSmsStatus(result.success ? '✅ SMS sent successfully!' : `❌ Failed: ${result.error || 'Unknown error'}`);
    } catch (error) {
      setSmsStatus('❌ Network or server error.');
    } finally {
      setIsSendingSms(false);
    }
  };


  if (!ticket) {
    return null; // Don't render anything if ticket data isn't ready
  }

  return (
    <div className="card p-8 mt-8">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
        <span className="text-blue-400">📨</span>
        Customer Notifications
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* --- Email Section --- */}
        <div className="border border-gray-800 rounded-lg p-6 flex flex-col">
          <h4 className="text-lg font-semibold text-white mb-4">Compose Email</h4>
          <div className="space-y-4 flex-grow">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Template</label>
              <select onChange={handleEmailTemplateChange} className="input-modern w-full">
                {emailTemplates.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Subject</label>
              <input type="text" value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} className="input-modern w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Body</label>
              <textarea value={emailBody} onChange={(e) => setEmailBody(e.target.value)} className="input-modern w-full h-40" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-800">
             <button onClick={handleSendEmail} className="btn-primary w-full" disabled={isSendingEmail}>
              {isSendingEmail ? 'Sending...' : 'Send Email'}
            </button>
             {emailStatus && <p className="text-sm text-center text-gray-400 mt-3">{emailStatus}</p>}
          </div>
        </div>

        {/* --- SMS Section --- */}
        <div className="border border-gray-800 rounded-lg p-6 flex flex-col">
          <h4 className="text-lg font-semibold text-white mb-4">Compose SMS</h4>
          <div className="space-y-4 flex-grow">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Template</label>
              <select onChange={handleSmsTemplateChange} className="input-modern w-full">
                {smsTemplates.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Message</label>
              <textarea value={smsBody} onChange={(e) => setSmsBody(e.target.value)} className="input-modern w-full h-40" />
            </div>
          </div>
           <div className="mt-4 pt-4 border-t border-gray-800">
            <button onClick={handleSendSms} className="btn-primary w-full" disabled={isSendingSms}>
              {isSendingSms ? 'Sending...' : 'Send SMS'}
            </button>
            {smsStatus && <p className="text-sm text-center text-gray-400 mt-3">{smsStatus}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
