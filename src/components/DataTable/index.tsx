import Paper from '@mui/material/Paper';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

type paginationModel = {
  page: number,
  pageSize: number
};

type DatatableProps = {
  dataLista: CarProduction[];
  columns: GridColDef[];
  paginationModel: paginationModel;
}

export default function DataTable({ columns, dataLista, paginationModel }: DatatableProps) {
  return (
    <Paper sx={{ width: "100%", backgroundColor: "#858585", display: "flex", flexDirection: "column" }}>
      <DataGrid
        rows={dataLista}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[10, 20]}
        sx={{ border: 0 }}
      />
    </Paper>
  );
}
