const SPREADSHEET_ID = "";
const SHEET_NAME = "RSVP";
const HEADERS = [
  "submittedAt",
  "name",
  "phone",
  "attendance",
  "side",
  "guests",
  "meal",
  "memo",
  "source",
];

function doPost(e) {
  const payload = JSON.parse((e && e.postData && e.postData.contents) || "{}");
  const sheet = getSheet_();

  sheet.appendRow([
    payload.submittedAt || new Date().toISOString(),
    payload.name || "",
    payload.phone || "",
    payload.attendance || "",
    payload.side || "",
    payload.guests || "",
    payload.meal || "",
    payload.memo || "",
    payload.source || "",
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return ContentService
    .createTextOutput("RSVP endpoint is ready.")
    .setMimeType(ContentService.MimeType.TEXT);
}

function setup() {
  getSheet_();
}

function getSheet_() {
  const spreadsheet = SPREADSHEET_ID
    ? SpreadsheetApp.openById(SPREADSHEET_ID)
    : SpreadsheetApp.getActiveSpreadsheet();

  if (!spreadsheet) {
    throw new Error("Create this script from Google Sheets, or set SPREADSHEET_ID.");
  }

  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }

  return sheet;
}
