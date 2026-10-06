import * as XLSX from "xlsx";
import {
  emptySreoRow,
  emptyTrackRow,
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
    const address = cell(row, "PROPERTY ADDRESS", "Property Address", "property address");
    const city = cell(row, "CITY", "City");
    if (!address && !city) continue;
    const next = emptyTrackRow();
    next.status = mapTrackStatus(cell(row, "STATUS Current or Complete", "STATUS", "Status"));
    next.project_type = mapTrackType(
      cell(row, "TYPE OF PROJECT Fix & Flip, Fix & Hold, or Ground Up Construction (GUC)", "TYPE OF PROJECT", "Type"),
    );
    next.titled_owner = cell(row, "TITLED OWNER", "Titled Owner");
    next.property_address = address;
    next.city = city;
    next.state = cell(row, "STATE", "State");
    next.zip = cell(row, "ZIP CODE", "Zip", "ZIP");
    next.purchase_date = cell(row, "PURCHASE DATE", "Purchase Date");
    next.purchase_price = cell(row, "PURCHASE PRICE", "Purchase Price");
    next.renovation_costs = cell(row, "RENOVATION COSTS", "Renovation Costs");
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
    const streetName = cell(row, "Street Name", "street name");
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
    next.property_type = cell(row, "Property Type", "property type");
    next.units_occupied = cell(row, "Number of Units Occupied", "units occupied");
    next.lease_start = cell(row, "Lease Start Date", "lease start");
    next.lease_end = cell(row, "Lease End Date", "lease end");
    next.purchase_date = cell(row, "Purchase Date", "purchase date");
    next.purchase_price = cell(row, "Purchase Price", "purchase price");
    next.capital_improvements = cell(row, "Capital Improvements", "capital improvements");
    next.estimated_as_is_value = cell(row, "Estimated As-is Value", "as-is value");
    next.total_debt_payoff = cell(row, "Total Debt Payoff", "debt payoff");
    next.monthly_gross_rent = cell(row, "Monthly Gross Rent", "gross rent");
    next.other_monthly_income = cell(row, "Other Monthly Income (e.g. Pet Fees)", "Other Monthly Income");
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
