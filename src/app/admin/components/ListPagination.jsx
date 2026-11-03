"use client";

import { Box, MenuItem, Pagination, Select, Typography } from "@mui/material";
import { BRAND } from "../../../lib/brand";

/**
 * "Showing 1–10 of 34 · Rows [10] · < 1 2 3 >"
 * Stacks neatly on phones. Hidden when there's nothing to show.
 */
export default function ListPagination({
  count,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50],
}) {
  if (!count) return null;
  const pages = Math.max(1, Math.ceil(count / pageSize));
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, count);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 1.5,
        px: { xs: 1.5, sm: 2.25 },
        py: 1.5,
        borderTop: "1px solid #eef0f3",
        bgcolor: "#fafafa",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
        <Typography sx={{ fontSize: "0.76rem", color: "#6b7280" }}>
          Showing <b>{from}</b>–<b>{to}</b> of <b>{count}</b>
        </Typography>
        {onPageSizeChange ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
            <Typography sx={{ fontSize: "0.76rem", color: "#6b7280" }}>Rows</Typography>
            <Select
              size="small"
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              sx={{ fontSize: "0.76rem", height: 28, "& .MuiSelect-select": { py: 0.4 } }}
            >
              {pageSizeOptions.map((n) => (
                <MenuItem key={n} value={n}>
                  {n}
                </MenuItem>
              ))}
            </Select>
          </Box>
        ) : null}
      </Box>
      {pages > 1 ? (
        <Pagination
          count={pages}
          page={page}
          onChange={(_, p) => onPageChange(p)}
          size="small"
          siblingCount={0}
          boundaryCount={1}
          sx={{
            "& .MuiPaginationItem-root.Mui-selected": {
              bgcolor: BRAND.primary,
              color: "#fff",
              "&:hover": { bgcolor: BRAND.primaryDark },
            },
          }}
        />
      ) : null}
    </Box>
  );
}
