export interface ColumnDef {
  key: string;
  label: string;
}

/** All columns the user is allowed to export. */
export const EXPORTABLE_COLUMNS: ColumnDef[] = [
  { key: "txnId", label: "Transaction ID" },
  { key: "date", label: "Date" },
  { key: "amount", label: "Amount" },
  { key: "category", label: "Category" },
  { key: "status", label: "Status" },
  { key: "userName", label: "User Name" },
  { key: "user_id", label: "User ID" },
  { key: "user_profile", label: "Profile URL" },
];

const escapeCell = (value: unknown): string => {
  if (value === null || value === undefined) return "";
  const str = String(value);
  // Neutralise spreadsheet formula injection
  const safe = /^[=+\-@\t\r]/.test(str) ? `'${str}` : str;
  return /[",\n\r]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
};

  const formatCell = (key: string, row: Record<string, unknown>): string => {
    const raw = row[key];
    // A leading zero-width space (invisible, U+200B) breaks Excel's date-pattern
    // auto-detection so it keeps this column as plain text — avoiding both the
    // #### column-overflow bug and a visible leading apostrophe in the cell.
    if (key === "date" && raw) return `\u200B${new Date(raw as string).toISOString().split("T")[0]}`;
    if (key === "amount" && typeof raw === "number") return escapeCell(raw.toFixed(2));
    return escapeCell(raw);
  };

export const generateCsv = (
  rows: Record<string, unknown>[],
  selectedKeys: string[]
): string => {
  const columns = EXPORTABLE_COLUMNS.filter((c) => selectedKeys.includes(c.key));
  const header = columns.map((c) => escapeCell(c.label)).join(",");
  const body = rows.map((row) =>
    columns.map((c) => formatCell(c.key, row)).join(",")
  );
  // BOM so Excel opens UTF-8 correctly
  return "\uFEFF" + [header, ...body].join("\r\n");
};