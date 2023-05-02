import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Pagination from "@mui/material/Pagination";
import { generateKey } from "../services/generateKey";
import { splitKey, deconstruct, manipulate } from "../services/dataTable";
import { Autocomplete } from "@mui/material";
import TextField from "@mui/material/TextField";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#2c3e50",
    color: "#f1f2f6",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function (props) {
  const { headers = [], data = [], keys = [], actions = [] } = props;
  const [page, setPage] = React.useState(1);
  const [filteredData, setFilteredData] = React.useState(data || []);

  const [searchQuery, setSearchQuery] = React.useState("");
  const rowsPerPage = 4;
  const [sorting, setSorting] = React.useState({
    column: null,
    key: null,
    direction: null,
  });
  const hasActions = actions.length > 0;

  const handleClickHeader = (column) => {
    const isAscending =
      sorting.column === column && sorting.direction === "asc";
    setSorting({ column, direction: isAscending ? "desc" : "asc" });
    const newFilteredData = filteredData.sort((a, b) => {
      if (isAscending) {
        return a[column] > b[column] ? -1 : 1;
      } else {
        return a[column] > b[column] ? 1 : -1;
      }
    });

    newFilteredData.sort((a, b) => {
      if (a[keys] < b[keys]) {
        return direction === "asc" ? -1 : 1;
      }
      if (a[keys] > b[keys]) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    });
    setFilteredData(newFilteredData);
  };

  const filter = (query) => {
    const newData = data.filter((row) => {
      return Object.values(row).some((column) => {
        if (typeof column !== "string") {
          return false;
        }
        return column.toLowerCase().includes(query.toLowerCase());
      });
    });

    setFilteredData(newData);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData =
    filteredData && filteredData.slice(startIndex, endIndex);

  return (
    <TableContainer component={Paper}>
      <div>
        <Autocomplete
          freeSolo
          disableClearable
          options={[]}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search"
              variant="outlined"
              onChange={(event) => setSearchQuery(event.target.value)}
              onInput={(event) => {
                setSearchQuery(event.target.value);
                filter(event.target.value);
              }}
              sx={{
                marginTop: ".5rem",
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
              }}
            />
          )}
          value={searchQuery}
        />
      </div>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        {headers && headers.length > 0 && (
          <TableHead>
            <TableRow>
              {headers.map((header) => (
                <StyledTableCell
                  key={generateKey(5)}
                  align="center"
                  onClick={() => handleClickHeader(header)}
                >
                  {header}
                  {sorting && sorting.column === header && (
                    <span>{sorting.direction === "asc" ? " ▲" : " ▼"}</span>
                  )}
                </StyledTableCell>
              ))}

              {hasActions && (
                <StyledTableCell align="center">Actions</StyledTableCell>
              )}
            </TableRow>
          </TableHead>
        )}

        <TableBody>
          {paginatedData &&
            paginatedData.map((paginatedRow) => {
              const rowKeys =
                keys.length > 0 ? splitKey(generateKey(), keys) : null;
              const rowData = deconstruct(paginatedRow, headers, rowKeys);
              return (
                <StyledTableRow key={generateKey(5)}>
                  {keys.map((e) => {
                    const { key, operation } = e;
                    const splitted = splitKey(key);
                    const hasOperation = operation;
                    let tempValue = paginatedRow[key];

                    if (splitted.length > 1)
                      tempValue = deconstruct(splitted, paginatedRow);

                    return (
                      <StyledTableCell key={generateKey(5)} align="center">
                        {hasOperation
                          ? manipulate(tempValue, paginatedRow, hasOperation)
                          : tempValue}
                      </StyledTableCell>
                    );
                  })}
                  {hasActions && (
                    <StyledTableCell align="center">
                      <ButtonGroup>
                        {actions.map((action) => (
                          <Button
                            sx={{
                              backgroundColor: "#2c3e50",
                              marginRight: " .5rem",
                              color: "#dfe4ea",
                              "&:hover": {
                                backgroundColor: "#dfe4ea",
                                color: "#2c3e50",
                                transition: "transform 0.2s ease-in-out",
                                transform: "scale(1.1)",
                                borderColor: "#2c3e50",
                              },
                            }}
                            key={generateKey(5)}
                            onClick={() => {
                              action.onClick(paginatedRow["_id"]);
                            }}
                          >
                            {action.title}
                          </Button>
                        ))}
                      </ButtonGroup>
                    </StyledTableCell>
                  )}
                </StyledTableRow>
              );
            })}
        </TableBody>
      </Table>
      <Pagination
        count={Math.ceil(data.length / rowsPerPage)}
        page={page}
        onChange={handleChangePage}
        sx={{
          display: "flex",
          justifyContent: "center",
          padding: "1rem",
        }}
      />
    </TableContainer>
  );
}
