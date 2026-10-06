import * as XLSX from "xlsx";
import {
  emptyConstructionBudgetLine,
  emptySreoRow,
  emptyTrackRow,
  type ConstructionBudgetLine,
  type ConstructionBudgetPackage,
  type ConstructionLevel,
  type FinishLevel,
  type SreoPropertyRow,
  type TrackProjectStatus,
  type TrackProjectType,
  type TrackRecordRow,
} from "@/lib/apply/package";

function cell(row: Record<string, unknown>, ...keys: string[]): string {
  for (const key of keys) {
    const direct = row[key];
    if (direct != null && String(direct).trim()) return String(direct).trim();
  }
  const normalized = Object.entries(row).reduce<Record<string, unknown>>((acc, [k, v]) => {
    acc[k.toLowerCase().replace(/\s+/g, " ").trim()] = v;
    return acc;
  }, {});
  for (const key of keys) {
    const v = normalized[key.toLowerCase().replace(/\s+/g, " ").trim()];
    if (v != null && String(v).trim()) return String(v).trim();
  }
  return "";
}

function mapTrackStatus(raw: string): TrackProjectStatus | "" {
  const v = raw.toLowerCase();
  if (v.includes("complete")) return "complete";
  if (v.includes("active")) return "active";
  if (v.includes("current")) return "current";
  return "";
}

function mapTrackType(raw: string): TrackProjectType | "" {
  const v = raw.toLowerCase();
  if (v.includes("ground") || v.includes("guc")) return "ground_up";
  if (v.includes("hold")) return "fix_hold";
  if (v.includes("flip")) return "fix_flip";
  return "";
}

export async function parseTrackRecordFile(file: File): Promise<TrackRecordRow[]> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });
  const parsed: TrackRecordRow[] = [];
  for (const row of rows) {
    const address = cell(row, "PROPERTY ADDRESS", "Property Address", "property address", "Address");
    const city = cell(row, "CITY", "City");
    if (!address && !city) continue;
    const next = emptyTrackRow();
    next.status = mapTrackStatus(cell(row, "STATUS Current or Complete", "STATUS", "Status"));
    next.project_type = mapTrackType(
      cell(
        row,
        "TYPE OF PROJECT Fix & Flip, Fix & Hold, or Ground Up Construction (GUC)",
        "TYPE OF PROJECT",
        "Type",
      ),
    );
    next.titled_owner = cell(row, "TITLED OWNER", "Titled Owner", "Entity/Name on Title");
    next.property_address = address;
    next.city = city;
    next.state = cell(row, "STATE", "State");
    next.zip = cell(row, "ZIP CODE", "Zip", "ZIP");
    next.purchase_date = cell(row, "PURCHASE DATE", "Purchase Date", "Acquisition Date");
    next.purchase_price = cell(row, "PURCHASE PRICE", "Purchase Price");
    next.renovation_costs = cell(
      row,
      "RENOVATION COSTS",
      "Renovation Costs",
      "Rehab Cost",
      "Rehab Costs",
    );
    next.disposition_date = cell(row, "DISPOSITION DATE", "Disposition Date", "Sale Date");
    next.disposition_price = cell(
      row,
      "DISPOSITION PRICE",
      "Disposition Price",
      "Sale Price",
      "Sold Price",
    );
    parsed.push(next);
  }
  return parsed.length ? parsed : [emptyTrackRow()];
}

export async function parseSreoFile(file: File): Promise<SreoPropertyRow[]> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });
  const parsed: SreoPropertyRow[] = [];
  for (const row of rows) {
    const streetNumber = cell(row, "Street Number", "street number");
    const streetName = cell(row, "Street Name", "street name", "Address", "Property Address");
    const city = cell(row, "City", "city");
    if (!streetNumber && !streetName && !city) continue;
    if (String(streetNumber).toLowerCase().includes("property count")) continue;
    const next = emptySreoRow();
    next.street_number = streetNumber;
    next.street_name = streetName;
    next.unit_count = cell(row, "Unit Count", "unit count");
    next.unit_apt = cell(row, "Unit/Apt. #", "Unit/Apt #", "unit/apt");
    next.city = city;
    next.state = cell(row, "State", "state");
    next.zip = cell(row, "Zip", "ZIP", "zip");
    next.entity_name_on_title = cell(
      row,
      "Entity/Name on Title",
      "Entity Name on Title",
      "Name on Title",
    );
    next.ownership_percent = cell(row, "% of Ownership", "Ownership %", "Ownership Percent");
    next.investment_type = cell(row, "Investment Type", "investment type");
    next.property_type = cell(row, "Property Type", "property type");
    next.units_occupied = cell(row, "Number of Units Occupied", "units occupied");
    next.lease_start = cell(row, "Lease Start Date", "lease start");
    next.lease_end = cell(row, "Lease End Date", "lease end");
    next.purchase_date = cell(row, "Purchase Date", "purchase date", "Acquisition Date");
    next.purchase_price = cell(row, "Purchase Price", "purchase price");
    next.capital_improvements = cell(row, "Capital Improvements", "capital improvements");
    next.estimated_as_is_value = cell(
      row,
      "Estimated As-is Value",
      "as-is value",
      "Present Market Value",
    );
    next.total_debt_payoff = cell(
      row,
      "Total Debt Payoff",
      "debt payoff",
      "Mortgages & Liens",
      "Mortgages and Liens",
    );
    next.monthly_gross_rent = cell(
      row,
      "Monthly Gross Rent",
      "gross rent",
      "Net Rental Income",
    );
    next.other_monthly_income = cell(
      row,
      "Other Monthly Income (e.g. Pet Fees)",
      "Other Monthly Income",
    );
    next.annual_property_mgmt_fee = cell(row, "Annual Property Mgmt Fee");
    next.annual_taxes = cell(row, "Annual Taxes");
    next.annual_insurance = cell(row, "Annual Insurance");
    next.annual_hoa = cell(row, "Annual HOA");
    next.annual_capex = cell(row, "Annual Capital Expenditures");
    next.annual_vacancy_cost = cell(row, "Annual Vacancy Cost");
    next.other_annual_owner_expenses = cell(row, "Other Annual Owner Paid Expenses");
    next.annual_utilities = cell(row, "Annual Utilities cost", "Annual Utilities Cost");
    next.annual_repair_maintenance = cell(
      row,
      "Annual Repair and Maintence Expenses",
      "Annual Repair and Maintenance Expenses",
    );
    parsed.push(next);
  }
  return parsed.length ? parsed : [emptySreoRow()];
}

function mapConstructionLevel(raw: string): ConstructionLevel | "" {
  const v = raw.toLowerCase();
  if (v.includes("level 5") || v.includes("ground up")) return "5";
  if (v.includes("level 4") || v.includes("footprint")) return "4";
  if (v.includes("level 3") || v.includes("heavy")) return "3";
  if (v.includes("level 2") || v.includes("medium")) return "2";
  if (v.includes("level 1") || v.includes("light")) return "1";
  return "";
}

function mapFinishLevel(raw: string): FinishLevel | "" {
  const v = raw.toLowerCase();
  if (v.includes("high")) return "high_end";
  if (v.includes("mid")) return "mid_range";
  if (v.includes("basic")) return "basic";
  return "";
}

function sheetMatrix(sheet: XLSX.WorkSheet): unknown[][] {
  return XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: "" });
}

function findLabeledValue(matrix: unknown[][], labelIncludes: string[]): string {
  const needles = labelIncludes.map((s) => s.toLowerCase());
  for (const row of matrix) {
    for (let i = 0; i < row.length; i++) {
      const cellText = String(row[i] ?? "")
        .toLowerCase()
        .trim();
      if (!cellText) continue;
      if (needles.some((n) => cellText.includes(n))) {
        for (let j = i + 1; j < Math.min(i + 4, row.length); j++) {
          const v = String(row[j] ?? "").trim();
          if (v && !needles.some((n) => v.toLowerCase().includes(n))) return v;
        }
      }
    }
  }
  return "";
}

/** Parse Vault Construction Budget Template (F-028) or a simple Line Item / Amount sheet. */
export async function parseConstructionBudgetFile(file: File): Promise<{
  meta: Partial<ConstructionBudgetPackage>;
  line_items: ConstructionBudgetLine[];
}> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const names = workbook.SheetNames;

  const meta: Partial<ConstructionBudgetPackage> = {};
  const startName =
    names.find((n) => n.toLowerCase().includes("start") || n.toLowerCase().includes("project")) ??
    names[0];
  if (startName) {
    const matrix = sheetMatrix(workbook.Sheets[startName]);
    meta.construction_level = mapConstructionLevel(
      findLabeledValue(matrix, ["construction level"]),
    );
    meta.finish_level = mapFinishLevel(findLabeledValue(matrix, ["finish level"]));
    const duration = findLabeledValue(matrix, ["how long will the project", "in months"]);
    if (duration) meta.project_duration_months = duration.replace(/[^\d.]/g, "") || duration;
  }

  const budgetName =
    names.find(
      (n) =>
        n.toLowerCase().includes("construction budget") && !n.toLowerCase().includes("draw"),
    ) ??
    names.find((n) => n.toLowerCase() === "construction budget") ??
    names[0];

  const line_items: ConstructionBudgetLine[] = [];
  if (budgetName) {
    const matrix = sheetMatrix(workbook.Sheets[budgetName]);
    for (const row of matrix) {
      const d = String(row[3] ?? "").trim();
      const iAmt = String(row[8] ?? "").trim();
      const jDesc = String(row[9] ?? "").trim();
      if (!d) continue;
      const lower = d.toLowerCase();
      if (
        lower === "line item" ||
        lower === "total:" ||
        lower.startsWith("please follow") ||
        lower.includes("renovation description")
      ) {
        continue;
      }
      const amount = iAmt.replace(/^\$/, "");
      const description = jDesc.startsWith("***") || jDesc === "-" ? "" : jDesc;
      const next = emptyConstructionBudgetLine(d.replace(/\s+/g, " "));
      next.budget_amount = amount === "0" ? "" : amount;
      next.description = description;
      line_items.push(next);
    }
  }

  if (!line_items.length) {
    const sheet = workbook.Sheets[names[0]];
    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });
    for (const row of rows) {
      const lineItem = cell(row, "Line Item", "line item", "Item", "Category");
      const amount = cell(row, "Budget Amount", "Amount", "budget amount", "Cost");
      if (!lineItem && !amount) continue;
      if (lineItem.toLowerCase().includes("line item")) continue;
      const next = emptyConstructionBudgetLine(lineItem);
      next.budget_amount = amount;
      next.description = cell(row, "Description", "Notes");
      line_items.push(next);
    }
  }

  return { meta, line_items };
}
