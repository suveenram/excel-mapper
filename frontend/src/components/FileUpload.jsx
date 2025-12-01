import React from "react";
import { Box, Button, Typography } from "@mui/material";

export function FileUpload({ onFilesSelected, uploading }) {
  const [sourceFile, setSourceFile] = React.useState(null);
  const [destFile, setDestFile] = React.useState(null);

  const handleFileChange = (event, type) => {
    const file = event.target.files[0];
    if (type === "source") setSourceFile(file);
    else setDestFile(file);
  };

  const handleUpload = () => {
    if (sourceFile && destFile) {
      onFilesSelected({ source: sourceFile, destination: destFile });
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Typography variant="subtitle1">Upload Source Excel (.xlsx):</Typography>
      <input
        type="file"
        accept=".xlsx,.xls"
        disabled={uploading}
        onChange={e => handleFileChange(e, "source")}
      />
      <Typography variant="subtitle1">Upload Destination Template Excel (.xlsx):</Typography>
      <input
        type="file"
        accept=".xlsx,.xls"
        disabled={uploading}
        onChange={e => handleFileChange(e, "destination")}
      />
      <Button
        variant="contained"
        color="primary"
        disabled={!(sourceFile && destFile) || uploading}
        onClick={handleUpload}
      >
        Upload & Continue
      </Button>
    </Box>
  );
}
