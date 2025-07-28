export default function GSTOutstationInvoice({ ticket, ticketId, bookingType, totalAmount, sgst, cgst }) {
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="bg-white text-black p-6 w-[700px] rounded-md text-sm border border-gray-300">
      <div className="text-center font-bold border-b pb-2 mb-2">Invoice</div>

      <div className="flex justify-between text-xs">
        <div>
          <p className="font-bold text-sm mb-1">WAH CABS</p>
          <p>A unit of Aaryan Travel and Events Private Limited</p>
          <p>G4, Bhat Tara Niwas, Behind Ambirkar Temple</p>
          <p>Off Chogam Road, Alto Porvorim</p>
          <p>Bardez, North Goa - 403521</p>
        </div>
        <div>
          <p><strong>GSTIN:</strong></p>
          <p><strong>PAN:</strong></p>
          <p><strong>S. TAX:</strong></p>
          <p><strong>CIN:</strong></p>
          <p><strong>HSN CODE:</strong></p>
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
        <p><strong>KMs Slab:</strong> {ticket.kmsSlab}</p>
        <p><strong>Date of Booking:</strong> {ticket.date}</p>
      </div>

      <div className="border border-gray-300 mt-4 p-2">
        <div className="flex justify-between">
          <p><strong>CGST:</strong> ₹{cgst}</p>
          <p><strong>SGST:</strong> ₹{sgst}</p>
        </div>
        <p className="text-right font-bold mt-2">Total: ₹{totalAmount}</p>
      </div>

      <div className="grid grid-cols-2 text-xs mt-6">
        <div>
          <p className="font-semibold mb-1">Terms and conditions:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Thank you for your purchase and availing our travel services.</li>
            <li>This is a computer generated invoice and does not require signature / stamp.</li>
            <li>Late Payment interest 24% per annum will be applicable in case of delay in payment of dues.</li>
            <li>All payments must be made in favour of Aaryan Travel and Events Private Limited.</li>
            <li>Demand Draft in payment of bills should be crossed "A/C Payee Only".</li>
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
            <p className="font-semibold">For Aaryan Travel and Events Pvt Ltd</p>
            <div className="w-32 h-12 border mt-2">
              <img src="/path-to-your-signature.png" alt="Authorized Signature" className="w-full h-full object-contain" />
            </div>
            <p className="text-xs">Authorized Signature</p>
          </div>
        </div>
      </div>
    </div>
  );
}