import React from "react";
import { Table, TableBody, TableCell, TableHead, TableRow, Select, MenuItem, Typography } from "@mui/material";

export function MappingEditor({ sourceHeaders, destHeaders, mapping, onChange }) {
  // Local copy of mapping for user edits
  const [localMapping, setLocalMapping] = React.useState(mapping);

  React.useEffect(() => {
    setLocalMapping(mapping);
  }, [mapping]);

  const handleChange = (dest, value) => {
    const updated = { ...localMapping, [dest]: value };
    setLocalMapping(updated);
    onChange(updated);
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>Column Mapping</Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Destination Column</TableCell>
            <TableCell>Source Column (mapped)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {destHeaders.map(dest => (
            <TableRow key={dest}>
              <TableCell>{dest}</TableCell>
              <TableCell>
                <Select
                  value={localMapping[dest] || ""}
                  displayEmpty
                  onChange={e => handleChange(dest, e.target.value)}
                  size="small"
                  sx={{ minWidth: 180 }}
                >
                  <MenuItem value=""><em>-- None --</em></MenuItem>
                  {sourceHeaders.map(sh => (
                    <MenuItem key={sh} value={sh}>{sh}</MenuItem>
                  ))}
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
