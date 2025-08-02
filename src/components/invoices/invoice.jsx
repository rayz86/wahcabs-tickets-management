export default function Invoice({
  ticket,
  ticketId,
  bookingType,
  totalAmount,
  invoiceType,
  sgst,
  cgst,
  igst,
  partyName,
  partyGST,
}) {
  const today = new Date().toISOString().split("T")[0];

  // These inline styles are used to ensure they are applied correctly during PDF generation.
  const styles = {
    container: {
      backgroundColor: '#FFFFFF',
      color: '#000000',
      borderColor: '#D1D5DB' // Hex for gray-300
    },
    borderBottom: {
      borderBottomColor: '#D1D5DB'
    }
  };

  // Determine if the invoice is for a GST party.
  const isGstInvoice = invoiceType.includes("GST");
  // Determine if the invoice is for a Goa location (vs. Outstation).
  const isGoaInvoice = invoiceType.includes("Goa");

  return (
    // The id "invoice-content" is crucial for the PDF download functionality.
    <div id="invoice-content" style={styles.container} className="bg-white text-black p-6 w-[700px] rounded-md text-sm border border-gray-300">
      
      <div style={styles.borderBottom} className="text-center font-bold border-b pb-2 mb-2">Invoice</div>

      {/* Header Section */}
      <div className="flex justify-between text-xs">
        <div>
          <div className="flex items-center mb-1">
            <img src="/src/images/wahcabs_logo.png" alt="Wah Cabs Logo" className="h-20 w-90 mr-4" />
          </div>
          <p>A unit of Aaryan Travel and Events Private Limited</p>
          <p>G4, Bhat Tara Niwas, Behind Ambirkar Temple</p>
          <p>Off Chogum Road, Alto Porvorim</p>
          <p>Bardez, North Goa - 403521</p>
        </div>
        <div className="mt-8">
          <p><strong>GSTIN: 30AASCS0521R2Z1</strong></p>
          <p><strong>PAN: AASCS0521R</strong></p>
          <p><strong>CIN: U63000GA2012PTCOO7041</strong></p>
          <p><strong>HSN CODE: 996609</strong></p>
        </div>
      </div>

      {/* Billing Information Section */}
      <p className="font-semibold mt-4">Booking ID: {ticketId}</p>
      <p><strong>Date:</strong> {today}</p>
      <p><strong>To,</strong></p>
      {/* Conditionally render Party/Customer details */}
      {isGstInvoice ? (
        <>
          <p>Party Name: {partyName || 'N/A'}</p>
          <p>Party GST: {partyGST || 'N/A'}</p>
        </>
      ) : (
        <>
          <p>Customer Name: {ticket.custName}</p>
          <p>Email: {ticket.custEmail}</p>
          <p>Phone no: {ticket.custPhone}</p>
        </>
      )}

      {/* Booking Details Section */}
      <div className="my-4 text-sm">
        <p><strong>Booking Type:</strong> {bookingType}</p>
        <p><strong>Vehicle:</strong> {ticket.vehicle}</p>
        <p><strong>Guests:</strong> {ticket.passengers}</p>
        <p><strong>From:</strong> {ticket.fromLoc}</p>
        <p><strong>To:</strong> {ticket.toLoc}</p>
        {(bookingType === "Local Ride" || bookingType === "Outstation Ride") && (
            <p><strong>KMs Slab:</strong> {ticket.kmsSlab}</p>
        )}
        <p><strong>Date of Booking:</strong> {ticket.date}</p>
      </div>

      {/* Amount and Tax Section */}
      <div id="amount-box" style={{ borderColor: '#D1D5DB' }} className="border border-gray-300 mt-4 p-2">
          <p><strong>Amount Payable:</strong></p>
        <div className="text-right">
          {/* Conditionally render tax fields */}
          {isGoaInvoice ? (
            <>
              <p><strong>CGST:</strong> ₹{cgst || 0}</p>
              <p><strong>SGST:</strong> ₹{sgst || 0}</p>
            </>
          ) : (
            <p><strong>IGST:</strong> ₹{igst || 0}</p>
          )}
        </div>
        <p className="text-right font-bold mt-2">Total: ₹{totalAmount}</p>
      </div>

      {/* Footer Section */}
      <div className="grid grid-cols-2 text-xs mt-6">
        <div>
          <p className="font-semibold mb-1"><strong>Terms and conditions:</strong></p>
          <p>Thank you for your purchase and availing our travel services!</p>
          <ul className="list-disc list-inside space-y-1">
            <li>This is a computer generated invoice and does not require signature / stamp.</li>
            <li>Late Payment interest 24% per annum will be applicable in case of delay in payment of dues.</li>
            <li>All payments must be made in favour of the name Aaryan Travel and Events Private Limited.</li>
            <li>Drafts should be crossed "A/C Payee Only".</li>
          </ul>
        </div>
        <div>
          <p className="mb-2 font-medium">Bank Details:</p>
          <p>Beneficiary: Aaryans Travel and Events Private Limited</p>
          <p>Bank: IDFC Bank</p>
          <p>Branch: Porvorim</p>
          <p>Type: Current Account</p>
          <p>Account Number: 53108202312</p>
          <p>IFSC: IDFB 0042 405</p>
          <div className="mt-6">
            <p className="font-semibold">For Aaryan Travel and Events Pvt Ltd</p>
            <div className="w-32 h-12 mt-2">
              <img src="/src/images/stamp.webp" alt="Authorized Signature" className="w-full h-full object-contain" />
            </div>
            <p className="text-xs">Authorized Signature</p>
          </div>
        </div>
      </div>
    </div>
  );
}