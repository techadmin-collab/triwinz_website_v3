"use client";

import { useState } from "react";
import { Autocomplete, Box, Chip, TextField, Typography, createFilterOptions } from "@mui/material";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import { toast } from "react-hot-toast";
import { BRAND } from "../../../../lib/brand";

const filter = createFilterOptions({
  stringify: (o) => [o.name, o.company, o.designation, o.email].filter(Boolean).join(" "),
});

/**
 * Choose one or more interviewers. Typing a new name offers "Add <name>",
 * which creates the interviewer straight away (details can be filled in later).
 */
export default function InterviewerPicker({ interviewers, value, onChange, onCreated, error }) {
  const [creating, setCreating] = useState(false);
  const options = interviewers.filter((i) => i.active || value.includes(i.id));
  const selected = value
    .map((id) => interviewers.find((i) => i.id === id))
    .filter(Boolean);

  async function createInterviewer(name) {
    setCreating(true);
    const res = await fetch("/api/admin/interviewers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    setCreating(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error || "Could not add interviewer");
      return;
    }
    const created = await res.json();
    onCreated?.(created);
    onChange([...value, created.id]);
    toast.success(`Added ${created.name}`);
  }

  return (
    <Autocomplete
      multiple
      options={options}
      value={selected}
      loading={creating}
      filterSelectedOptions
      getOptionLabel={(o) => o.name || ""}
      isOptionEqualToValue={(a, b) => a.id === b.id}
      filterOptions={(opts, params) => {
        const filtered = filter(opts, params);
        const input = params.inputValue.trim();
        const exists = interviewers.some((i) => i.name.toLowerCase() === input.toLowerCase());
        if (input && !exists) filtered.push({ id: "__new__", name: input, isNew: true });
        return filtered;
      }}
      onChange={(_, items) => {
        const added = items.find((i) => i.isNew);
        if (added) {
          createInterviewer(added.name);
          return;
        }
        onChange(items.map((i) => i.id));
      }}
      renderOption={(props, option) => {
        const { key, ...rest } = props;
        return (
          <Box component="li" key={option.id} {...rest}>
            {option.isNew ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: BRAND.primary, fontWeight: 700 }}>
                <PersonAddAltOutlinedIcon fontSize="small" />
                Add “{option.name}” as a new interviewer
              </Box>
            ) : (
              <Box>
                <Typography sx={{ fontWeight: 600, fontSize: "0.9rem" }}>{option.name}</Typography>
                {option.designation || option.company ? (
                  <Typography sx={{ fontSize: "0.75rem", color: "#6b7280" }}>
                    {[option.designation, option.company].filter(Boolean).join(" · ")}
                  </Typography>
                ) : null}
              </Box>
            )}
          </Box>
        );
      }}
      renderTags={(items, getTagProps) =>
        items.map((item, index) => {
          const { key, ...tagProps } = getTagProps({ index });
          return (
            <Chip
              key={item.id}
              {...tagProps}
              size="small"
              label={item.name}
              sx={{ bgcolor: "#E6F7F6", color: BRAND.primary, fontWeight: 600 }}
            />
          );
        })
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label="Interviewers"
          placeholder={selected.length ? "" : "Search or type a new name"}
          error={Boolean(error)}
          helperText={error || "Choose one or more. Type a new name to add an outside interviewer."}
        />
      )}
    />
  );
}
