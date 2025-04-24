import React from "react";
import { Skeleton } from "@mui/material";

type SkeletonTableProps = {
  rowCount?: number; 
  width: number;
}

const SkeletonTable: React.FC<SkeletonTableProps> = ({ rowCount = 10, width }) => {
  return (
    <div style={{ width: "100%"}}>
      {[...Array(rowCount)].map((_, index) => (
        <div key={index} style={{ display: "flex", gap: "10px", marginBottom: "5px" }}>
          <Skeleton variant="rectangular" width={width} height={30} />
          <Skeleton variant="rectangular" width={width} height={30} />
          <Skeleton variant="rectangular" width={width} height={30} />
          <Skeleton variant="rectangular" width={width} height={30} />
          <Skeleton variant="rectangular" width={width} height={30} />
          <Skeleton variant="rectangular" width={width} height={30} />
          <Skeleton variant="rectangular" width={width} height={30} />
        </div>
      ))}
    </div>
  );
};

export default SkeletonTable;
