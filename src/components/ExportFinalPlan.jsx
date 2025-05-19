// ExportFinalPlan.jsx
import React from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function ExportFinalPlan({
  scheduleMonthFull = [],
  scheduleYearFull = [],
  yearlyArray = []
}) {
  const handleExport = () => {
    if (!scheduleMonthFull.length || !scheduleYearFull.length || !yearlyArray.length) {
      alert("Missing data to export!");
      return;
    }

    // 1. Tạo workbook
    const wb = XLSX.utils.book_new();

    // 2. Thêm sheet Monthly
    const wsMonth = XLSX.utils.json_to_sheet(scheduleMonthFull);
    XLSX.utils.book_append_sheet(wb, wsMonth, "Monthly Schedule");

    // 3. Thêm sheet Yearly
    const wsYear = XLSX.utils.json_to_sheet(scheduleYearFull);
    XLSX.utils.book_append_sheet(wb, wsYear, "Yearly Schedule");

    const wsSaving = XLSX.utils.json_to_sheet(yearlyArray);
    XLSX.utils.book_append_sheet(wb, wsSaving, "Saving Plan");

    // 4. Ghi file excel
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const excelBlob = new Blob([excelBuffer], { type: "application/octet-stream" });

    saveAs(excelBlob, "FinalPlanSchedules.xlsx");
  };

  return (
    <button className="export-btn" onClick={handleExport}>
      EXPORT
    </button>
  );
}
