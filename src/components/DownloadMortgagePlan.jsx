// src/components/DownloadMortgagePlan.jsx
import React from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function DownloadMortgagePlan({ scheduleMonthFull = [], scheduleYearFull = [] }) {
  const handleDownloadExcel = () => {
    if (!scheduleMonthFull.length && !scheduleYearFull.length) {
      alert("No data to export!");
      return;
    }

    const wsMonth = XLSX.utils.json_to_sheet(scheduleMonthFull);
    const wsYear = XLSX.utils.json_to_sheet(scheduleYearFull);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, wsMonth, "Monthly Schedule");
    XLSX.utils.book_append_sheet(wb, wsYear, "Yearly Schedule");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(dataBlob, "MortgageSchedule.xlsx");
  };

  return (
    <button className="download-btn" onClick={handleDownloadExcel}>
      Download
    </button>
  );
}
