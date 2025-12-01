import express from "express";
import cors from "cors";
import multer from "multer";
import ExcelJS from "exceljs";
import fs from "fs";

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json({ limit: '8mb' }));

const upload = multer({ dest: "uploads/" });

// Utility: Extract first row headers from Excel file
async function getHeaders(filePath) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const sheet = workbook.worksheets[0];
    const headerRow = sheet.getRow(1);
    return headerRow.values.slice(1).map(h => (h || "").toString().trim());
}

// Utility: Extract all data rows (as objects with header keys)
async function getRows(filePath, headerList) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const sheet = workbook.worksheets[0];
    const rows = [];
    sheet.eachRow({ includeEmpty: false }, (row, rowNum) => {
        if (rowNum === 1) return; // Skip header
        const obj = {};
        headerList.forEach((h, i) => {
          obj[h] = row.getCell(i+1).value ?? "";
        });
        rows.push(obj);
    });
    return rows;
}

// Simple mapping: returns { destCol: matchedSourceCol|null }
function autoMapColumns(sourceHeaders, destHeaders) {
    const norm = s => s.toLowerCase().replace(/[^a-z0-9]/gi, "");
    return Object.fromEntries(
      destHeaders.map(dh => {
        const found = sourceHeaders.find(sh => norm(sh) === norm(dh));
        return [dh, found || null];
      })
    );
}

// Upload source and destination Excel files
app.post("/upload", upload.fields([
    { name: "source", maxCount: 1 },
    { name: "destination", maxCount: 1 }
]), async (req, res) => {
    try {
        const sourcePath = req.files.source[0].path;
        const destPath = req.files.destination[0].path;
        const sourceHeaders = await getHeaders(sourcePath);
        const destHeaders = await getHeaders(destPath);
        const mapping = autoMapColumns(sourceHeaders, destHeaders);
        // Get all source data rows as array of objects
        const sourceRows = await getRows(sourcePath, sourceHeaders);
        // Optionally: clean up uploaded files
        setTimeout(() => { fs.unlink(sourcePath, ()=>{}); fs.unlink(destPath, ()=>{}); }, 10000);
        res.json({
            sourceHeaders,
            destHeaders,
            mapping,
            sourceRows
        });
    } catch (err) {
        res.status(500).json({ error: "Failed to process Excel files", details: err.message });
    }
});

// Receive mapping, source data, and dest headers, return generated Excel
app.post("/map", async (req, res) => {
    try {
        const { mapping, sourceRows, destHeaders } = req.body;
        // Create new workbook
        const wb = new ExcelJS.Workbook();
        const ws = wb.addWorksheet('Sheet1');
        // Write destination headers
        ws.addRow(destHeaders);
        // Write data rows in dest header order, using mapping
        sourceRows.forEach(row => {
            const outRow = destHeaders.map(dest => {
              const sourceKey = mapping[dest];
              return sourceKey ? row[sourceKey] : "";
            });
            ws.addRow(outRow);
        });
        // Stream as download
        res.setHeader(
          "Content-Disposition",
          "attachment; filename=remapped-data.xlsx"
        );
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        await wb.xlsx.write(res);
        res.end();
    } catch (err) {
        res.status(500).json({ error: 'Failed to assemble export file', details: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Backend API running on port ${PORT}`);
});
