import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import Sidebar from "../components/Sidebar";
import jsPDF from "jspdf";


export default function TicketDetail() {
  const { bookingType, ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [status, setStatus] = useState("");
  const [actions, setActions] = useState("");
  const [payment, setPayment] = useState("");
  const navigate = useNavigate();
  const invoiceTypes = [
  "Regular - Goa",
  "Regular - Outstation",
  "GST - Goa",
  "GST - Outstation",
];

  useEffect(() => {
    const fetchTicket = async () => {
      const ref = doc(db, "tickets", bookingType, "bookings", ticketId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setTicket(data);
        setStatus(data.status);
        setActions(data.actions || "");
        setPayment(data.payment || "0");
        setTotalAmount(data.amount || "0");
      }
    };
    fetchTicket();
  }, [bookingType, ticketId]);

  const handleSave = async () => {
    const ref = doc(db, "tickets", bookingType, "bookings", ticketId);
    await updateDoc(ref, { status, actions, payment });
    alert("✅ Ticket updated!");
    navigate(`/dashboard/${bookingType}`);
  };
const [invoiceType, setInvoiceType] = useState("Regular - Goa");

const [partyName, setPartyName] = useState("");
const [partyGST, setPartyGST] = useState("");

const [sgst, setSGST] = useState("");
const [cgst, setCGST] = useState("");
const [igst, setIGST] = useState("");

const [totalAmount, setTotalAmount] = useState("4000"); // can be fetched dynamically
const [showPreview, setShowPreview] = useState(false);

const generateInvoicePDF = async () => {
  try {
    console.log("Starting PDF generation...");
    
    // Create PDF using jsPDF directly
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    let currentY = 20;

    // Helper function to add text with better formatting
    const addText = (text, x, y, options = {}) => {
      pdf.setFontSize(options.fontSize || 10);
      pdf.setFont("helvetica", options.fontStyle || "normal");
      
      if (options.align === 'center') {
        pdf.text(text, pageWidth / 2, y, { align: 'center' });
      } else if (options.align === 'right') {
        pdf.text(text, pageWidth - 20, y, { align: 'right' });
      } else {
        pdf.text(text, x, y);
      }
      
      return y + (options.lineHeight || 6);
    };

    // Header - INVOICE
    pdf.setFontSize(20);
    pdf.setFont("helvetica", "bold");
    currentY = addText("INVOICE", 0, currentY, { align: 'center', fontSize: 20, lineHeight: 10 });
    
    // Header line
    pdf.line(20, currentY, pageWidth - 20, currentY);
    currentY += 15;

    // Company Details (Left) and Registration Details (Right)
    const leftStartY = currentY;
    let leftY = leftStartY;
    let rightY = leftStartY;

    // Left side - Company details
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    leftY = addText("WAH CABS", 20, leftY, { fontSize: 16, fontStyle: "bold", lineHeight: 6 });
    
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    leftY = addText("A unit of Aaryan Travel and Events Private Limited", 20, leftY, { lineHeight: 5 });
    leftY = addText("G4, Bhat Tara Niwas, Behind Ambirkar Temple", 20, leftY, { lineHeight: 5 });
    leftY = addText("Off Chogum Road, Alto Porvorim", 20, leftY, { lineHeight: 5 });
    leftY = addText("Bardez, North Goa - 403521", 20, leftY, { lineHeight: 8 });

    // Right side - Registration details
    pdf.setFontSize(9);
    rightY = addText("GSTIN: 30AASCS0521R2Z1", 120, rightY, { fontSize: 9, lineHeight: 5 });
    rightY = addText("PAN: AASCS0521R", 120, rightY, { fontSize: 9, lineHeight: 5 });
    rightY = addText("S. TAX: AASCS0521RS0001", 120, rightY, { fontSize: 9, lineHeight: 5 });
    rightY = addText("CIN: U63000GA2012PTCOO7041", 120, rightY, { fontSize: 9, lineHeight: 5 });
    rightY = addText("HSN CODE: 996609", 120, rightY, { fontSize: 9, lineHeight: 5 });

    currentY = Math.max(leftY, rightY) + 10;

    // Invoice Details
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "bold");
    currentY = addText(`Booking ID: ${ticketId}`, 20, currentY, { fontSize: 11, fontStyle: "bold", lineHeight: 6 });
    currentY = addText(`Date: ${new Date().toISOString().split("T")[0]}`, 20, currentY, { fontSize: 11, fontStyle: "bold", lineHeight: 8 });

    // Customer Details
    pdf.setFont("helvetica", "bold");
    currentY = addText("To,", 20, currentY, { fontStyle: "bold", lineHeight: 6 });
    pdf.setFont("helvetica", "normal");
    currentY = addText(`Customer Name: ${ticket.custName}`, 20, currentY, { lineHeight: 5 });
    currentY = addText(`Email: ${ticket.custEmail}`, 20, currentY, { lineHeight: 5 });
    currentY = addText(`Phone: ${ticket.custPhone || "N/A"}`, 20, currentY, { lineHeight: 8 });

    // GST Party Details (if GST invoice and party info provided)
    if (invoiceType.includes("GST") && partyName) {
      // Add a subtle background for party details
      pdf.setFillColor(245, 245, 245);
      pdf.rect(20, currentY - 2, pageWidth - 40, 20, 'F');
      
      pdf.setFont("helvetica", "bold");
      currentY = addText("Party Details:", 25, currentY + 3, { fontStyle: "bold", lineHeight: 6 });
      pdf.setFont("helvetica", "normal");
      currentY = addText(`Party Name: ${partyName}`, 25, currentY, { lineHeight: 5 });
      currentY = addText(`Party GST: ${partyGST}`, 25, currentY, { lineHeight: 8 });
    }

    // Booking Details
    pdf.setFont("helvetica", "bold");
    currentY = addText("Booking Details:", 20, currentY, { fontStyle: "bold", lineHeight: 6 });
    
    pdf.setFont("helvetica", "normal");
    // Create two columns for booking details
    const leftCol = 20;
    const rightCol = 110;
    let leftColY = currentY;
    let rightColY = currentY;

    leftColY = addText(`Booking Type: ${bookingType}`, leftCol, leftColY, { lineHeight: 5 });
    rightColY = addText(`Vehicle: ${ticket.vehicle}`, rightCol, rightColY, { lineHeight: 5 });
    
    leftColY = addText(`Passengers: ${ticket.passengers || "—"}`, leftCol, leftColY, { lineHeight: 5 });
    rightColY = addText(`From: ${ticket.fromLoc}`, rightCol, rightColY, { lineHeight: 5 });
    
    leftColY = addText(`To: ${ticket.toLoc}`, leftCol, leftColY, { lineHeight: 5 });
    if (ticket.kmsSlab) {
      rightColY = addText(`KMs Slab: ${ticket.kmsSlab}`, rightCol, rightColY, { lineHeight: 5 });
    }
    
    currentY = Math.max(leftColY, rightColY);
    currentY = addText(`Date of Booking: ${ticket.date}`, 20, currentY, { lineHeight: 10 });

    // Amount Details Box
    const boxStartY = currentY;
    pdf.rect(20, boxStartY, pageWidth - 40, 25);
    currentY = boxStartY + 8;
    
    pdf.setFont("helvetica", "bold");
    currentY = addText("Amount Payable:", 25, currentY, { fontStyle: "bold", lineHeight: 6 });
    
    pdf.setFont("helvetica", "normal");
    // Tax details on the right side of the box
    if (invoiceType.includes("Goa")) {
      currentY = addText(`CGST: ₹${cgst || 0}`, 0, currentY - 6, { align: 'right', lineHeight: 5 });
      currentY = addText(`SGST: ₹${sgst || 0}`, 0, currentY, { align: 'right', lineHeight: 5 });
    } else if (invoiceType.includes("Outstation")) {
      currentY = addText(`IGST: ₹${igst || 0}`, 0, currentY - 6, { align: 'right', lineHeight: 5 });
    }
    
    // Total amount
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    pdf.line(pageWidth - 80, currentY + 2, pageWidth - 25, currentY + 2);
    currentY = addText(`Total: ₹${totalAmount}`, 0, currentY + 8, { align: 'right', fontSize: 12, fontStyle: "bold" });

    currentY = boxStartY + 30;

    // Terms and Conditions & Bank Details in two columns
    const termsStartY = currentY;
    
    // Left column - Terms and Conditions
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    currentY = addText("Terms and Conditions:", 20, termsStartY, { fontSize: 10, fontStyle: "bold", lineHeight: 8 });
    
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "normal");
    const terms = [
      "Thank you for your purchase and availing our travel services!",
      "This is a computer generated invoice and does not require signature/stamp.",
      "Late Payment interest 24% per annum will be applicable in case of delay in payment of dues.",
      "All payments must be made in favour of Aaryan Travel and Events Private Limited.",
      "Drafts should be crossed 'A/C Payee Only'."
    ];
    
    let termsY = currentY;
    terms.forEach(term => {
      // Word wrap for long terms
      const lines = pdf.splitTextToSize(`• ${term}`, 85);
      lines.forEach(line => {
        termsY = addText(line, 25, termsY, { fontSize: 8, lineHeight: 4 });
      });
    });

    // Right column - Bank Details
    let bankY = termsStartY;
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    bankY = addText("Bank Details:", 110, bankY, { fontSize: 10, fontStyle: "bold", lineHeight: 8 });
    
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "normal");
    bankY = addText("Beneficiary: Aaryans Travel and Events Private Limited", 110, bankY, { fontSize: 8, lineHeight: 4 });
    bankY = addText("Bank: IDFC Bank", 110, bankY, { fontSize: 8, lineHeight: 4 });
    bankY = addText("Branch: Porvorim", 110, bankY, { fontSize: 8, lineHeight: 4 });
    bankY = addText("Type: Current Account", 110, bankY, { fontSize: 8, lineHeight: 4 });
    bankY = addText("Account Number: 53108202312", 110, bankY, { fontSize: 8, lineHeight: 4 });
    bankY = addText("IFSC: IDFB 0042 405", 110, bankY, { fontSize: 8, lineHeight: 8 });

    // Signature section
    pdf.setFont("helvetica", "bold");
    bankY = addText("For Aaryan Travel and Events Pvt Ltd", 110, bankY, { fontSize: 9, fontStyle: "bold", lineHeight: 15 });
    
    pdf.setFont("helvetica", "normal");
    addText("Authorized Signature", 110, bankY, { fontSize: 8 });

    // Save the PDF
    pdf.save(`invoice-${ticketId}.pdf`);
    console.log("PDF generated successfully!");
    
  } catch (error) {
    console.error("PDF generation failed:", error);
    alert(`❌ PDF generation failed: ${error.message}`);
  }
};


  if (!ticket)
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      <Sidebar selected={bookingType} />
      <div className="ml-80 p-8 min-h-screen relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-indigo-500/5"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-white">{bookingType} - Ticket Details</h1>
            <button
              onClick={() => navigate(`/dashboard/${bookingType}`)}
              className="btn-secondary"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to {bookingType}
            </button>
          </div>

          {/* Ticket Info Card */}
          <div className="card p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                  <span className="text-xl">🎫</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Booking ID: {ticketId}</h2>
                  <p className="text-gray-400">Ticket Management</p>
                </div>
              </div>
              
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  status === "Active"
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                    : status === "Processed"
                    ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
                    : status === "Cancelled"
                    ? "bg-gradient-to-r from-red-500 to-pink-500 text-white"
                    : "bg-gradient-to-r from-gray-500 to-gray-600 text-white"
                }`}
              >
                {status}
              </span>
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div>
                <label className="text-sm text-gray-400 font-medium">Customer Name</label>
                <p className="text-white font-semibold">{ticket.custName}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400 font-medium">Customer Email</label>
                <p className="text-white font-semibold">{ticket.custEmail}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400 font-medium">Phone</label>
                <p className="text-white font-semibold">{ticket.custPhone || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400 font-medium">Vehicle</label>
                <p className="text-white font-semibold">{ticket.vehicle}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400 font-medium">Amount Payable</label>
                <p className="text-green-400 font-bold text-lg">₹{ticket.amount}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400 font-medium">Guests</label>
                <p className="text-white font-semibold">{ticket.passengers || "—"}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400 font-medium">Date</label>
                <p className="text-white font-semibold">{ticket.date}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400 font-medium">From</label>
                <p className="text-white font-semibold">{ticket.fromLoc}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400 font-medium">To</label>
                <p className="text-white font-semibold">{ticket.toLoc}</p>
              </div>
              
              {(bookingType === "Local Rides" || bookingType === "Outstation Rides") && ticket.tripType && ticket.tripType !== "N/A" && (
                <div>
                  <label className="text-sm text-gray-400 font-medium">Trip Type</label>
                  <p className="text-white font-semibold">{ticket.tripType}</p>
                </div>
              )}
              
              {(bookingType === "Local Rides" || bookingType === "Outstation Rides") && ticket.kmsSlab && (
                <div>
                  <label className="text-sm text-gray-400 font-medium">KMs Slab</label>
                  <p className="text-white font-semibold">{ticket.kmsSlab}</p>
                </div>
              )}
              
              {(bookingType === "Local Rides" || bookingType === "Outstation Rides") && ticket.rideType && (
                <div>
                  <label className="text-sm text-gray-400 font-medium">Ride Type</label>
                  <p className="text-white font-semibold">{ticket.rideType}</p>
                </div>
              )}
            </div>
          </div>

          {/* Management Section */}
          <div className="card p-8">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="text-blue-400">⚙️</span>
              Ticket Management
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Current Status</label>
                <select
                  className="input-modern w-full"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Active">Active</option>
                  <option value="Processed">Processed</option>
                  <option value="Closed">Closed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              {/* Payment */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Payment Received (₹)</label>
                <input
                  type="number"
                  className="input-modern w-full"
                  placeholder="Enter payment amount"
                  value={payment}
                  onChange={(e) => setPayment(e.target.value)}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-400 mb-2">Actions Taken / Notes</label>
              <textarea
                className="input-modern w-full h-32 resize-none"
                placeholder="Enter any actions taken or notes about this ticket..."
                value={actions}
                onChange={(e) => setActions(e.target.value)}
              />
            </div>

            {/* Save Button */}
            <div className="mt-8 flex justify-end">
              <button onClick={handleSave} className="btn-primary">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save Changes
              </button>
            </div>
          </div>
          {/* Invoice Generation */}
<div className="card p-8 mt-8">
  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
    <span className="text-blue-400">📄</span>
    Invoice Generation
  </h3>

  {/* Invoice Configuration */}
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
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
          <input 
            type="text" 
            className="input-modern w-full" 
            placeholder="Enter party name"
            value={partyName} 
            onChange={(e) => setPartyName(e.target.value)} 
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-2">Party's GST</label>
          <input 
            type="text" 
            className="input-modern w-full" 
            placeholder="Enter GST number"
            value={partyGST} 
            onChange={(e) => setPartyGST(e.target.value)} 
          />
        </div>
      </>
    )}

    {/* Tax Inputs */}
    {(invoiceType.includes("Goa")) && (
      <>
        <div>
          <label className="block text-sm text-gray-400 mb-2">SGST (₹)</label>
          <input 
            type="number" 
            className="input-modern w-full" 
            placeholder="0"
            value={sgst} 
            onChange={(e) => setSGST(e.target.value)}
            onWheel={(e) => e.target.blur()}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-2">CGST (₹)</label>
          <input 
            type="number" 
            className="input-modern w-full" 
            placeholder="0"
            value={cgst} 
            onChange={(e) => setCGST(e.target.value)}
            onWheel={(e) => e.target.blur()}
          />
        </div>
      </>
    )}
    {(invoiceType.includes("Outstation")) && (
      <div>
        <label className="block text-sm text-gray-400 mb-2">IGST (₹)</label>
        <input 
          type="number" 
          className="input-modern w-full" 
          placeholder="0"
          value={igst} 
          onChange={(e) => setIGST(e.target.value)}
          onWheel={(e) => e.target.blur()}
        />
      </div>
    )}

    {/* Total Amount */}
    <div>
      <label className="block text-sm text-gray-400 mb-2">Total Amount (₹)</label>
      <input 
        type="number" 
        className="input-modern w-full" 
        placeholder="Enter total amount"
        value={totalAmount} 
        onChange={(e) => setTotalAmount(e.target.value)}
        onWheel={(e) => e.target.blur()} 
      />
    </div>
  </div>

  {/* Generate PDF Button */}
  <div className="flex justify-between items-center">
    <button
      onClick={() => setShowPreview(!showPreview)}
      className="btn-secondary flex items-center gap-2"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        />
      </svg>
      {showPreview ? 'Hide Preview' : 'Show Preview'}
    </button>
    
    <button
      onClick={generateInvoicePDF}
      className="btn-primary flex items-center gap-2"
      disabled={!totalAmount || totalAmount === "0"}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      Generate PDF Invoice
    </button>
  </div>
  
  {(!totalAmount || totalAmount === "0") && (
    <p className="text-yellow-400 text-sm mt-2 text-right">
      Please enter a total amount to generate the invoice
    </p>
  )}

  {/* Invoice Preview */}
  {showPreview && (
    <div className="mt-8 p-6 bg-gray-800 rounded-lg">
      <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Invoice Preview
      </h4>
      
      <div className="bg-white text-black p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center text-xl font-bold border-b-2 border-gray-300 pb-4 mb-6">
          INVOICE
        </div>

        {/* Company Details */}
        <div className="flex justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold mb-2">WAH CABS</h3>
            <p className="text-sm">A unit of Aaryan Travel and Events Private Limited</p>
            <p className="text-sm">G4, Bhat Tara Niwas, Behind Ambirkar Temple</p>
            <p className="text-sm">Off Chogum Road, Alto Porvorim</p>
            <p className="text-sm">Bardez, North Goa - 403521</p>
          </div>
          <div className="text-right text-sm">
            <p><strong>GSTIN:</strong> 30AASCS0521R2Z1</p>
            <p><strong>PAN:</strong> AASCS0521R</p>
            <p><strong>S. TAX:</strong> AASCS0521RS0001</p>
            <p><strong>CIN:</strong> U63000GA2012PTCOO7041</p>
            <p><strong>HSN CODE:</strong> 996609</p>
          </div>
        </div>

        {/* Invoice Details */}
        <div className="mb-6">
          <p className="font-semibold">Booking ID: {ticketId}</p>
          <p><strong>Date:</strong> {new Date().toISOString().split("T")[0]}</p>
          <p className="mt-2"><strong>To,</strong></p>
          <p>Customer Name: {ticket.custName}</p>
          <p>Email: {ticket.custEmail}</p>
          <p>Phone: {ticket.custPhone || "N/A"}</p>
        </div>

        {/* GST Party Details */}
        {invoiceType.includes("GST") && partyName && (
          <div className="mb-6 p-4 bg-gray-50 rounded">
            <p className="font-semibold mb-2">Party Details:</p>
            <p>Party Name: {partyName}</p>
            <p>Party GST: {partyGST}</p>
          </div>
        )}

        {/* Booking Details */}
        <div className="mb-6">
          <p className="font-semibold mb-2">Booking Details:</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <p><strong>Booking Type:</strong> {bookingType}</p>
            <p><strong>Vehicle:</strong> {ticket.vehicle}</p>
            <p><strong>Passengers:</strong> {ticket.passengers || "—"}</p>
            <p><strong>From:</strong> {ticket.fromLoc}</p>
            <p><strong>To:</strong> {ticket.toLoc}</p>
            {ticket.kmsSlab && <p><strong>KMs Slab:</strong> {ticket.kmsSlab}</p>}
            <p><strong>Date of Booking:</strong> {ticket.date}</p>
          </div>
        </div>

        {/* Amount Details */}
        <div className="border-2 border-gray-300 p-4 mb-6">
          <p className="font-semibold mb-2">Amount Payable:</p>
          <div className="text-right">
            {invoiceType.includes("Goa") && (
              <>
                <p>CGST: ₹{cgst || 0}</p>
                <p>SGST: ₹{sgst || 0}</p>
              </>
            )}
            {invoiceType.includes("Outstation") && (
              <p>IGST: ₹{igst || 0}</p>
            )}
            <p className="font-bold text-lg mt-2 border-t pt-2">Total: ₹{totalAmount}</p>
          </div>
        </div>

        {/* Terms and Bank Details */}
        <div className="grid grid-cols-2 gap-8 text-sm">
          <div>
            <p className="font-semibold mb-2">Terms and Conditions:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Thank you for your purchase and availing our travel services!</li>
              <li>This is a computer generated invoice and does not require signature/stamp.</li>
              <li>Late Payment interest 24% per annum will be applicable in case of delay in payment of dues.</li>
              <li>All payments must be made in favour of Aaryan Travel and Events Private Limited.</li>
              <li>Drafts should be crossed "A/C Payee Only".</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-2">Bank Details:</p>
            <p className="text-xs">Beneficiary: Aaryans Travel and Events Private Limited</p>
            <p className="text-xs">Bank: IDFC Bank</p>
            <p className="text-xs">Branch: Porvorim</p>
            <p className="text-xs">Type: Current Account</p>
            <p className="text-xs">Account Number: 53108202312</p>
            <p className="text-xs">IFSC: IDFB 0042 405</p>
            <div className="mt-4">
              <p className="font-semibold text-xs">For Aaryan Travel and Events Pvt Ltd</p>
              <div className="mt-8">
                <p className="text-xs">Authorized Signature</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )}
</div>

        </div>
      </div>
    </div>
  );
}
