export default function RegularGoaInvoice({ ticket, ticketId, bookingType, totalAmount, sgst, cgst }) {
  const today = new Date().toISOString().split("T")[0];

  // Define simple, compatible colors to override Tailwind's classes
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

  return (
    // We add the inline style to the main container
    <div id="invoice-content" style={styles.container} className="bg-white text-black p-6 w-[700px] rounded-md text-sm border border-gray-300">
      
      {/* And here for the bottom border */}
      <div style={styles.borderBottom} className="text-center font-bold border-b pb-2 mb-2">Invoice</div>

      <div className="flex justify-between text-xs">
        <div>
          <p className="font-bold text-2xl mb-1">WAH CABS</p>
          <p>A unit of Aaryan Travel and Events Private Limited</p>
          <p>G4, Bhat Tara Niwas, Behind Ambirkar Temple</p>
          <p>Off Chogum Road, Alto Porvorim</p>
          <p>Bardez, North Goa - 403521</p>
        </div>
        <div className="mt-8">
          <p><strong>GSTIN: 30AASCS0521R2Z1</strong></p>
          <p><strong>PAN: AASCS0521R</strong></p>
          <p><strong>S. TAX: AASCS0521RS0001</strong></p>
          <p><strong>CIN: U63000GA2012PTCOO7041</strong></p>
          <p><strong>HSN CODE: 996609</strong></p>
        </div>
      </div>

      <p className="font-semibold mt-4">Booking ID: {ticketId}</p>
      <p><strong>Date:</strong> {today}</p>
      <p><strong>To,</strong></p>
      <p>Customer Name: {ticket.custName}</p>
      <p>Email: {ticket.custEmail}</p>
      <p>Phone no: {ticket.custPhone}</p>

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

      {/* And here for the border around the amount */}
      <div id="amount-box" style={{ borderColor: '#D1D5DB' }} className="border border-gray-300 mt-4 p-2">
          <p><strong>Amount Payable:</strong></p>
        <div className="text-right">
          <p><strong>CGST:</strong> ₹{cgst}</p>
          <p><strong>SGST:</strong> ₹{sgst}</p>
        </div>
        <p className="text-right font-bold mt-2">Total: ₹{totalAmount}</p>
      </div>

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
              {/* This image will now be captured correctly */}
              <img src="/src/images/stamp.webp" alt="Authorized Signature" className="w-full h-full object-contain" />
            </div>
            <p className="text-xs">Authorized Signature</p>
          </div>
        </div>
      </div>
    </div>
  );
}