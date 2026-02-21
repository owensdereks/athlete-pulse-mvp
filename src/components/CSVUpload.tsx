import { useRef } from "react";
import Papa from "papaparse";
import "./CSVUpload.css";

interface CSVUploadProps {
  onUpload: (athletes: Array<{
    firstName: string;
    lastName: string;
    email: string;
    memberSince: string;
    lastContactedDate: null;
    tenureStatus: 'new' | 'tenured';
  }>) => void;
}

interface CSVRow {
  firstName?: string;
  lastName?: string;
  email?: string;
  memberSince?: string;
}

export const CSVUpload = ({ onUpload }: CSVUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse<CSVRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const validAthletes: Array<{
          firstName: string;
          lastName: string;
          email: string;
          memberSince: string;
          lastContactedDate: null;
          tenureStatus: 'new' | 'tenured';
        }> = [];
        let skippedCount = 0;

        results.data.forEach((row) => {
          // Skip rows missing required fields
          if (!row.firstName?.trim() || !row.lastName?.trim()) {
            skippedCount++;
            return;
          }

          validAthletes.push({
            firstName: row.firstName.trim(),
            lastName: row.lastName.trim(),
            email: row.email?.trim() || "",
            memberSince: row.memberSince?.trim() || new Date().toISOString().split('T')[0],
            lastContactedDate: null,
            tenureStatus: 'new', // Will be computed dynamically
          });
        });

        if (validAthletes.length === 0) {
          alert("No valid athletes found in CSV. Make sure the file has firstName and lastName columns.");
          return;
        }

        onUpload(validAthletes);

        let message = `${validAthletes.length} athlete${validAthletes.length === 1 ? '' : 's'} added successfully!`;
        if (skippedCount > 0) {
          message += ` (${skippedCount} row${skippedCount === 1 ? '' : 's'} skipped due to missing data)`;
        }
        alert(message);

        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      },
      error: (error) => {
        alert(`Error parsing CSV: ${error.message}`);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      },
    });
  };

  return (
    <div className="csv-upload">
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        style={{ display: "none" }}
        id="csv-upload-input"
      />
      <label htmlFor="csv-upload-input" className="btn-secondary csv-upload-btn">
        Upload CSV
      </label>
      <p className="csv-help-text">
        CSV format: firstName, lastName, email, memberSince
      </p>
    </div>
  );
};
