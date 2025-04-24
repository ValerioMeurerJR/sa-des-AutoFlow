import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';

type paginationModel = { 
  page: number, 
  pageSize: number
};

type DataLista = {
    id: string,
    nome?: string, 
    quantidade?: number, 
    fabricante?: string, 
    tipo?: string 
    modelo?: string,
    kitPneu?: number,
    motor?: number,
    chassi?: number,
    statusPneu?: string,
    statusMotor?: string,
    statusChassi?: string,
    action?: (id: number) => void,
    createDate: Date,
    cor?: string
}

type DatatableProps = {
    dataLista: DataLista[];
    columns: GridColDef[];
    paginationModel: paginationModel;
}

export default function DataTable({columns, dataLista, paginationModel}: DatatableProps) {
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
