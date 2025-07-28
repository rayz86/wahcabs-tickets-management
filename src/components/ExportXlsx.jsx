import React from 'react';
import * as XLSX from 'xlsx';

/**
 * A reusable button component to export an array of data to an Excel file.
 * @param {object[]} tickets - The array of ticket objects to export.
 * @param {string} fileName - The desired name for the downloaded file (without extension).
 * @param {boolean} disabled - Whether the button should be disabled.
 */
const ExportXlsx = ({ tickets, fileName, disabled }) => {

  const handleExport = () => {
    if (!tickets || tickets.length === 0) {
      alert("There is no data to export.");
      return;
    }

    // 1. Format the data for the Excel sheet, defining the column order
    const dataToExport = tickets.map((ticket) => ({
      "Date": ticket.date,
      "Booking Type": ticket.bookingType,
      "Booking ID": ticket.id,
      "Customer Name": ticket.custName,
      "Ride Type": ticket.tripType || "N/A",
      "Vehicle": ticket.vehicle,
      "From": ticket.fromLoc,
      "To": ticket.toLoc,
      "Amount": ticket.amount,
      "Status": ticket.status,
      "Payment": ticket.payment || 0,
      "Customer Phone": ticket.custPhone,
      "Customer Email": ticket.custEmail,
      "Guests": ticket.passengers,
      "Actions Taken": ticket.actions || "",
    }));

    // 2. Create worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "All_Tickets");

    // 3. Set column widths for better readability (optional)
    worksheet["!cols"] = [
      { wch: 12 }, { wch: 18 }, { wch: 15 }, { wch: 20 }, { wch: 15 },
      { wch: 15 }, { wch: 20 }, { wch: 20 }, { wch: 10 }, { wch: 12 },
      { wch: 15 }, { wch: 15 }, { wch: 25 }, { wch: 8 }, { wch: 40 },
    ];

    // 4. Trigger the download
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  return (
    <button
      onClick={handleExport}
      disabled={disabled || !tickets || tickets.length === 0}
      className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      Export to Excel
    </button>
  );
};

export default ExportXlsx;