export default function RegularInvoice({ ticket, ticketId, bookingType }) {
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="bg-white text-black p-6 w-[700px] rounded-md text-sm font-sans border border-gray-300">
      {/* Header */}
      <div className="border-b border-gray-400 pb-2 mb-4">
        <h2 className="text-center font-bold text-lg">Invoice</h2>
      </div>

      {/* Company Info */}
      <div className="flex justify-between mb-4">
        <div>
          <h3 className="font-bold text-sm mb-1">WAH CABS</h3>
          <p className="text-xs leading-4">
            A unit of Aaryan Travel and Events Private Limited<br />
            G4, Bhat Tara Niwas, Behind Ambirkar Temple<br />
            Off Chogam Road, Alto Porvorim<br />
            Bardez, North Goa - 403521
          </p>
        </div>
        <div className="text-xs leading-5">
          <p><strong>GSTIN:</strong></p>
          <p><strong>PAN:</strong></p>
          <p><strong>S.TAX:</strong></p>
          <p><strong>CIN:</strong></p>
          <p><strong>HSN CODE:</strong></p>
        </div>
      </div>

      {/* Booking ID */}
      <div className="text-sm font-medium mb-2">
        <strong>Booking ID:</strong> {ticketId}
      </div>

      {/* Customer Info */}
      <div className="mb-4 text-sm">
        <p><strong>Date:</strong> {today}</p>
        <p><strong>To,</strong></p>
        <p>Customer Name: {ticket.custName}</p>
        <p>Email: {ticket.custEmail}</p>
        <p>Phone no: {ticket.custPhone}</p>
      </div>

      {/* Booking Details */}
      <div className="text-sm mb-6">
        <p><strong>Booking Type:</strong> {bookingType}</p>
        <p><strong>Vehicle:</strong> {ticket.vehicle}</p>
        <p><strong>Guests:</strong> {ticket.passengers}</p>
        <p><strong>From:</strong> {ticket.fromLoc}</p>
        <p><strong>To:</strong> {ticket.toLoc}</p>
        <p><strong>Pickup Date:</strong> {ticket.date}</p>
        {ticket.kmsSlab && <p><strong>KMs Slab:</strong> {ticket.kmsSlab}</p>}
      </div>

      {/* Amount Box */}
      <div className="flex justify-between items-center border border-gray-400 p-3 mb-4 font-semibold">
        <span className="text-lg">TOTAL AMOUNT</span>
        <div className="text-right text-sm">
          <p><strong>CGST:</strong></p>
          <p><strong>SGST:</strong></p>
          <p><strong>Total:</strong> ₹{ticket.amount}</p>
        </div>
      </div>

      {/* Terms & Bank Details */}
      <div className="grid grid-cols-2 gap-4 text-xs">
        <div>
          <p className="mb-2 font-medium">Terms and Conditions:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Thank you for your purchase and availing our travel services.</li>
            <li>This is a computer generated invoice and does not require signature / stamp.</li>
            <li>Late Payment interest 24% per annum will be applicable in case of delay in payment of dues.</li>
            <li>All payments must be made in favour of <strong>Aaryan Travel and Events Private Limited</strong>.</li>
            <li>Demand Draft in payment of bills should be crossed "A/C Payee Only" and drawn in favour of Aaryan Travel and Events.</li>
          </ul>
        </div>
        <div>
          <p className="mb-2 font-medium">Bank Details:</p>
          <p>Bank: HDFC Bank</p>
          <p>Branch: Porvorim</p>
          <p>Type: Current Account</p>
          <p>Account Number: _______</p>
          <p>IFSC: _______</p>

          <div className="mt-6">
            <p className="mb-1 font-semibold">For Aaryan Travel and Events Pvt Ltd</p>
            <div className="h-12 w-32 border border-gray-300 mb-1">
              {/* 👇 Put your signature image here */}
              <img
                src="/path-to-your-signature.png"
                alt="Authorized Signature"
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-xs">Authorized Signature</p>
          </div>
        </div>
      </div>
    </div>
  );
}
