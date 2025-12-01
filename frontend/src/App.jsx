import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Container, Paper, Box, CircularProgress, Alert, Button } from "@mui/material";
import { FileUpload } from "./components/FileUpload";
import { MappingEditor } from "./components/MappingEditor";

export default function App() {
  const [step, setStep] = useState(0); // 0: upload, 1: mapping, 2: export
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [mapping, setMapping] = useState({});
  const [error, setError] = useState("");
  const [exporting, setExporting] = useState(false);

  const handleFilesSelected = async ({ source, destination }) => {
    setUploading(true);
    setError("");
    const formData = new FormData();
    formData.append("source", source);
    formData.append("destination", destination);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5001"}/upload`, {
        method: "POST",
        body: formData
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setUploadResult(data);
      setMapping(data.mapping || {});
      setStep(1); // Proceed to mapping
    } catch (err) {
      setError("Failed to upload and process Excel files.");
    } finally {
      setUploading(false);
    }
  };

  const handleMappingChange = updated => {
    setMapping(updated);
  };

  const handleProceedToExport = () => setStep(2);

  const handleExport = async () => {
    setExporting(true);
    setError("");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5001"}/map`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mapping,
          destHeaders: uploadResult.destHeaders,
          sourceRows: uploadResult.sourceRows,
        }),
      });
      if (!res.ok) throw new Error("Export failed");
      // Download as file
      const buf = await res.arrayBuffer();
      const url = window.URL.createObjectURL(new Blob([buf], { type: res.headers.get('Content-Type') }));
      const a = document.createElement('a');
      a.href = url;
      a.download = "remapped-data.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError("Failed to export mapped Excel file.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Excel Mapper</Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 4 }}>
          {step === 0 && (
            <FileUpload onFilesSelected={handleFilesSelected} uploading={uploading} />
          )}
          {uploading && (
            <Box textAlign="center" mt={2}><CircularProgress /></Box>
          )}
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          {step === 1 && uploadResult && (
            <>
              <MappingEditor
                sourceHeaders={uploadResult.sourceHeaders}
                destHeaders={uploadResult.destHeaders}
                mapping={mapping}
                onChange={handleMappingChange}
              />
              <Box textAlign="right" mt={3}>
                <Button variant="contained" color="primary" onClick={handleProceedToExport}>
                  Export Mapped Excel
                </Button>
              </Box>
            </>
          )}
          {step === 2 && (
            <Box textAlign="center">
              <Typography variant="h6" mb={2}>Download Your Result</Typography>
              <Button onClick={handleExport} disabled={exporting} variant="contained" color="primary" size="large">
                {exporting ? <CircularProgress size={24} /> : "Download Excel File"}
              </Button>
            </Box>
          )}
        </Paper>
      </Container>
    </>
  );
}
