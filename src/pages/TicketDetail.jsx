import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebase/config";
import Sidebar from "../components/Sidebar";
import jsPDF from "jspdf";
import domtoimage from "dom-to-image-more";
import RegularGoaInvoice from "../components/invoices/RegularGoaInvoice";
import RegularOutstationInvoice from "../components/invoices/RegularOutstationInvoice";
import GSTGoaInvoice from "../components/invoices/GSTGoaInvoice";
import GSTOutstationInvoice from "../components/invoices/GSTOutstationInvoice";
import EmailSmsForm from "../components/EmailSmsForm";

export default function TicketDetail() {
  const { bookingType, ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [status, setStatus] = useState("");
  const [actions, setActions] = useState("");
  const navigate = useNavigate();

  // New state for payment management
  const [newPaymentAmount, setNewPaymentAmount] = useState("");
  const [newPaymentNote, setNewPaymentNote] = useState("");
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);

  // State for invoice generation
  const [invoiceType, setInvoiceType] = useState("Regular - Goa");
  const [partyName, setPartyName] = useState("");
  const [partyGST, setPartyGST] = useState("");
  const [sgst, setSGST] = useState("");
  const [cgst, setCGST] = useState("");
  const [igst, setIGST] = useState("");
  const [totalAmount, setTotalAmount] = useState("0");

  const invoiceTypes = ["Regular - Goa", "Regular - Outstation", "GST - Goa", "GST - Outstation"];

  const fetchTicket = async () => {
    const ref = doc(db, "tickets", bookingType, "bookings", ticketId);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const data = snap.data();
      setTicket(data);
      setStatus(data.status);
      setActions(data.actions || "");
      setTotalAmount(String(data.price || "0"));
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [bookingType, ticketId]);

  const handleUpdateTicketDetails = async () => {
    const ref = doc(db, "tickets", bookingType, "bookings", ticketId);
    await updateDoc(ref, { status, actions });
    alert("✅ Ticket details updated!");
  };

  const handleAddPayment = async () => {
    const amount = parseFloat(newPaymentAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid payment amount.");
      return;
    }
    if (isSubmittingPayment) return;
    setIsSubmittingPayment(true);

    const ticketRef = doc(db, "tickets", bookingType, "bookings", ticketId);

    try {
      const newPaymentRecord = {
        amount: amount,
        note: newPaymentNote || "Payment received",
        date: new Date().toISOString(),
      };

      // Calculate new totals
      const currentTotalPaid = Number(ticket.payment) || 0;
      const newTotalPaid = currentTotalPaid + amount;
      const newPendingAmount = (Number(ticket.price) || 0) - newTotalPaid;

      // Update Firestore document
      await updateDoc(ticketRef, {
        payment: newTotalPaid,
        pendingAmount: newPendingAmount,
        paymentHistory: arrayUnion(newPaymentRecord),
      });

      // Reset form and refetch data to show updated state
      setNewPaymentAmount("");
      setNewPaymentNote("");
      await fetchTicket(); // Refetch to get the latest ticket data
      alert("✅ Payment added successfully!");

    } catch (error) {
      console.error("Error adding payment:", error);
      alert("❌ Failed to add payment. Please try again.");
    } finally {
      setIsSubmittingPayment(false);
    }
  };

const generateInvoicePDF = async () => {
  const originalNode = document.getElementById("invoice-content");

  if (!originalNode) {
    console.error("The invoice content element was not found!");
    return;
  }

  const clone = originalNode.cloneNode(true);

  clone.style.position = 'absolute';
  clone.style.top = '-9999px';
  clone.style.left = '0px';
  clone.style.width = originalNode.offsetWidth + 'px';

  const allElements = clone.querySelectorAll('*');
  allElements.forEach((el) => {
    // --- THIS IS THE NEW LOGIC ---
    // Only strip styles if the element is NOT the amount box
    if (el.id !== 'amount-box') {
      el.style.border = 'none';
      el.style.outline = 'none';
      el.style.boxShadow = 'none';
    }
  });

  document.body.appendChild(clone);

  try {
    const dataUrl = await domtoimage.toPng(clone, {
      quality: 1.0,
      scale: 2,
    });

    const pdf = new jsPDF("p", "mm", "a4", true);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const imgProps = pdf.getImageProperties(dataUrl);
    const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, imgHeight);
    pdf.save(`invoice-${ticketId}.pdf`);

  } catch (error) {
    console.error("PDF generation failed!", error);
    
  } finally {
    document.body.removeChild(clone);
  }
};

  if (!ticket) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black">
        <Sidebar selected={bookingType} />
        <div className="ml-80 flex justify-center items-center min-h-screen text-lg text-gray-400">
          <div className="text-center">
            <div className="loading-spinner mx-auto mb-4"></div>
            <p>Loading ticket details...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      <Sidebar selected={bookingType} />
      <div className="ml-80 p-8 min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-indigo-500/5"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-white">{bookingType} - Ticket Details</h1>
            <button onClick={() => navigate(`/dashboard/${bookingType}`)} className="btn-secondary">
              Back
            </button>
          </div>

          {/* Ticket Info Card */}
          <div className="card p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white">Booking ID: {ticketId}</h2>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  status === "Active" ? "bg-green-500/20 text-green-400" :
                  status === "Processed" ? "bg-yellow-500/20 text-yellow-400" :
                  status === "Cancelled" ? "bg-red-500/20 text-red-400" :
                  "bg-gray-500/20 text-gray-400"
                }`}>
                  {status}
                </span>
            </div>

            {/* Customer & Booking Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 border-b border-gray-800 pb-8">
              <div><label className="text-sm text-gray-400">Customer</label><p className="text-white">{ticket.custName}</p></div>
              <div><label className="text-sm text-gray-400">Email</label><p className="text-white">{ticket.custEmail}</p></div>
              <div><label className="text-sm text-gray-400">Phone</label><p className="text-white">{ticket.custPhone}</p></div>
              <div><label className="text-sm text-gray-400">Vehicle</label><p className="text-white">{ticket.vehicle}</p></div>
              <div><label className="text-sm text-gray-400">Guests</label><p className="text-white">{ticket.passengers}</p></div>
              <div><label className="text-sm text-gray-400">Date</label><p className="text-white">{ticket.date}</p></div>
              <div><label className="text-sm text-gray-400">From</label><p className="text-white">{ticket.fromLoc}</p></div>
              <div><label className="text-sm text-gray-400">To</label><p className="text-white">{ticket.toLoc}</p></div>
            </div>

            {/* Payment Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div><label className="text-sm text-gray-400">Amount Payable</label><p className="text-2xl font-bold text-blue-400">₹{Number(ticket.price || 0).toLocaleString()}</p></div>
                <div><label className="text-sm text-gray-400">Total Paid</label><p className="text-2xl font-bold text-green-400">₹{Number(ticket.payment || 0).toLocaleString()}</p></div>
                <div><label className="text-sm text-gray-400">Pending Amount</label><p className="text-2xl font-bold text-red-400">₹{Number(ticket.pendingAmount || 0).toLocaleString()}</p></div>
            </div>
          </div>

          {/* Payment History and Management */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Add Payment & History */}
            <div className="card p-8">
              <h3 className="text-xl font-bold text-white mb-6">Payment History</h3>
              {/* New Payment Form */}
              <div className="space-y-4 mb-8 p-4 border border-gray-800 rounded-lg">
                  <h4 className="font-semibold text-white">Add New Payment</h4>
                  <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Amount (₹)</label>
                      <input type="number" className="input-modern w-full" placeholder="e.g., 500" value={newPaymentAmount} onChange={(e) => setNewPaymentAmount(e.target.value)} />
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Note (Optional)</label>
                      <input type="text" className="input-modern w-full" placeholder="e.g., Advance via UPI" value={newPaymentNote} onChange={(e) => setNewPaymentNote(e.target.value)} />
                  </div>
                  <button onClick={handleAddPayment} className="btn-primary w-full" disabled={isSubmittingPayment}>
                      {isSubmittingPayment ? "Submitting..." : "Add Payment"}
                  </button>
              </div>

              {/* History List */}
              <div className="space-y-3">
                {(ticket.paymentHistory && ticket.paymentHistory.length > 0) ? (
                  ticket.paymentHistory.slice().reverse().map((p, index) => (
                    <div key={index} className="flex justify-between items-center bg-gray-900/50 p-3 rounded-lg">
                      <div>
                        <p className="font-semibold text-white">₹{p.amount.toLocaleString()}</p>
                        <p className="text-xs text-gray-400">{p.note}</p>
                      </div>
                      <p className="text-xs text-gray-500">{new Date(p.date).toLocaleString()}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4">No payment history.</p>
                )}
              </div>
            </div>

            {/* Ticket Management */}
            <div className="card p-8">
              <h3 className="text-xl font-bold text-white mb-6">Ticket Management</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Current Status</label>
                  <select className="input-modern w-full" value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option>Active</option><option>Processed</option><option>Closed</option><option>Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Actions / Notes</label>
                  <textarea className="input-modern w-full h-32" value={actions} onChange={(e) => setActions(e.target.value)} />
                </div>
                <div className="flex justify-end">
                  <button onClick={handleUpdateTicketDetails} className="btn-secondary">Save Ticket Details</button>
                </div>
              </div>
            </div>
          </div>
          {/* {INVOICE GENERATION} */}
<div className="card p-8 mt-8">
  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
    <span className="text-blue-400">📄</span>
    Invoice Preview & Export
  </h3>

  {/* Invoice Type Selector */}
  <div className="grid md:grid-cols-2 gap-4 mb-6">
    <div>
      <label className="block text-sm font-medium text-gray-400 mb-2">Invoice Type</label>
      <select
        className="input-modern w-full"
        value={invoiceType}
        onChange={(e) => setInvoiceType(e.target.value)}
      >
        {invoiceTypes.map((type) => (
          <option key={type} value={type}>{type}</option>
        ))}
      </select>
    </div>

    {/* Party Info (for GST types) */}
    {(invoiceType.includes("GST")) && (
      <>
        <div>
          <label className="block text-sm text-gray-400 mb-2">Party's Name</label>
          <input type="text" className="input-modern w-full" value={partyName} onChange={(e) => setPartyName(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-2">Party's GST</label>
          <input type="text" className="input-modern w-full" value={partyGST} onChange={(e) => setPartyGST(e.target.value)} />
        </div>
      </>
    )}

    {/* Tax Inputs */}
    {(invoiceType.includes("Goa")) && (
      <>
        <div>
          <label className="block text-sm text-gray-400 mb-2">SGST (₹)</label>
          <input type="number" className="input-modern w-full" value={sgst} onChange={(e) => setSGST(e.target.value)}
          onWheel={(e) => e.target.blur()}/>
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-2">CGST (₹)</label>
          <input type="number" className="input-modern w-full" value={cgst} onChange={(e) => setCGST(e.target.value)}
          onWheel={(e) => e.target.blur()}/>
        </div>
      </>
    )}
    {(invoiceType.includes("Outstation")) && (
      <div>
        <label className="block text-sm text-gray-400 mb-2">IGST (₹)</label>
        <input type="number" className="input-modern w-full" value={igst} onChange={(e) => setIGST(e.target.value)}
        onWheel={(e) => e.target.blur()}/>
      </div>
    )}

    {/* Total Amount */}
    <div>
      <label className="block text-sm text-gray-400 mb-2">Total Amount (₹)</label>
      <input type="number" className="input-modern w-full" value={totalAmount} onChange={(e) => setTotalAmount(e.target.value)}
      onWheel={(e) => e.target.blur()} />
    </div>
  </div>

  {/* Render Invoice Preview */}
  <div id="invoice-export" className="my-6 flex justify-center bg-gray-800 p-4 rounded-lg shadow-md">
    {invoiceType === "Regular - Goa" && (
      <RegularGoaInvoice ticket={ticket} ticketId={ticketId} bookingType={bookingType} totalAmount={totalAmount} sgst={sgst} cgst={cgst} />
    )}
    {invoiceType === "Regular - Outstation" && (
      <RegularOutstationInvoice ticket={ticket} ticketId={ticketId} bookingType={bookingType} totalAmount={totalAmount} igst={igst} />
    )}
    {invoiceType === "GST - Goa" && (
      <GSTGoaInvoice ticket={ticket} ticketId={ticketId} bookingType={bookingType} totalAmount={totalAmount} partyName={partyName} partyGST={partyGST} sgst={sgst} cgst={cgst} />
    )}
    {invoiceType === "GST - Outstation" && (
      <GSTOutstationInvoice ticket={ticket} ticketId={ticketId} bookingType={bookingType} totalAmount={totalAmount} partyName={partyName} partyGST={partyGST} igst={igst} />
    )}
  </div>
  {/* Generate PDF Button */}
  <div className="mt-6 flex justify-end">
                <button
                    onClick={generateInvoicePDF}
                    className="btn-primary flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11V3m0 0l3.5 3.5M12 3L8.5 6.5M12 21h8m-8 0H4m8 0v-4" />
                    </svg>
                    Generate PDF Invoice
                </button>
            </div>
</div>
{ticket && (
  <EmailSmsForm ticket={{ ...ticket, id: ticketId, bookingType }} />
)}


        </div>
      </div>
    </div>
  );
}
