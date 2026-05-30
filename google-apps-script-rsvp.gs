const SPREADSHEET_ID = "";

const RSVP_SHEET_NAME = "RSVP";
const RSVP_HEADERS = [
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

const GUESTBOOK_SHEET_NAME = "GUESTBOOK";
const GUESTBOOK_HEADERS = [
  "id",
  "createdAt",
  "target",
  "message",
  "name",
  "relation",
  "passwordHash",
  "source",
  "deletedAt",
];

function doPost(e) {
  const payload = JSON.parse((e && e.postData && e.postData.contents) || "{}");

  if (payload.action === "createGuestbook") {
    return output_({ ok: true, item: createGuestbook_(payload) });
  }

  if (payload.action === "deleteGuestbook") {
    return output_(deleteGuestbook_(payload));
  }

  appendRsvp_(payload);
  return output_({ ok: true });
}

function doGet(e) {
  const params = (e && e.parameter) || {};

  if (params.action === "listGuestbook") {
    return output_(
      {
        ok: true,
        messages: listGuestbook_(),
      },
      params.callback,
    );
  }

  if (params.action === "deleteGuestbook") {
    return output_(deleteGuestbook_(params), params.callback);
  }

  return ContentService
    .createTextOutput("Wedding invitation endpoint is ready.")
    .setMimeType(ContentService.MimeType.TEXT);
}

function setup() {
  getSheet_(RSVP_SHEET_NAME, RSVP_HEADERS);
  getSheet_(GUESTBOOK_SHEET_NAME, GUESTBOOK_HEADERS);
}

function appendRsvp_(payload) {
  const sheet = getSheet_(RSVP_SHEET_NAME, RSVP_HEADERS);

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
}

function createGuestbook_(payload) {
  const sheet = getSheet_(GUESTBOOK_SHEET_NAME, GUESTBOOK_HEADERS);
  const item = {
    id: payload.id || Utilities.getUuid(),
    createdAt: payload.savedAt || payload.createdAt || new Date().toISOString(),
    target: payload.target || "",
    message: payload.message || "",
    name: payload.name || "",
    relation: payload.relation || "",
    source: payload.source || "",
  };

  sheet.appendRow([
    item.id,
    item.createdAt,
    item.target,
    item.message,
    item.name,
    item.relation,
    hashPassword_(payload.password || ""),
    item.source,
    "",
  ]);

  return item;
}

function listGuestbook_() {
  const sheet = getSheet_(GUESTBOOK_SHEET_NAME, GUESTBOOK_HEADERS);
  const values = sheet.getDataRange().getValues();
  if (values.length <= 1) {
    return [];
  }

  const headers = values[0];
  const index = headerIndex_(headers);

  return values
    .slice(1)
    .filter(function(row) {
      return !row[index.deletedAt];
    })
    .map(function(row) {
      return {
        id: row[index.id],
        savedAt: row[index.createdAt],
        target: row[index.target],
        message: row[index.message],
        name: row[index.name],
        relation: row[index.relation],
      };
    })
    .reverse()
    .slice(0, 50);
}

function deleteGuestbook_(payload) {
  const id = payload.id || "";
  const password = payload.password || "";

  if (!id || !password) {
    return { ok: false, message: "삭제할 메시지와 비밀번호를 확인해 주세요." };
  }

  const sheet = getSheet_(GUESTBOOK_SHEET_NAME, GUESTBOOK_HEADERS);
  const values = sheet.getDataRange().getValues();
  const index = headerIndex_(values[0]);
  const passwordHash = hashPassword_(password);

  for (let rowIndex = 1; rowIndex < values.length; rowIndex += 1) {
    const row = values[rowIndex];
    if (row[index.id] !== id || row[index.deletedAt]) {
      continue;
    }

    if (row[index.passwordHash] !== passwordHash) {
      return { ok: false, message: "비밀번호가 맞지 않아요." };
    }

    sheet.getRange(rowIndex + 1, index.deletedAt + 1).setValue(new Date().toISOString());
    return { ok: true };
  }

  return { ok: false, message: "삭제할 메시지를 찾을 수 없어요." };
}

function getSheet_(name, headers) {
  const spreadsheet = getSpreadsheet_();
  let sheet = spreadsheet.getSheetByName(name);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(name);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function getSpreadsheet_() {
  const spreadsheet = SPREADSHEET_ID
    ? SpreadsheetApp.openById(SPREADSHEET_ID)
    : SpreadsheetApp.getActiveSpreadsheet();

  if (!spreadsheet) {
    throw new Error("Create this script from Google Sheets, or set SPREADSHEET_ID.");
  }

  return spreadsheet;
}

function headerIndex_(headers) {
  return headers.reduce(function(index, header, columnIndex) {
    index[header] = columnIndex;
    return index;
  }, {});
}

function hashPassword_(password) {
  const digest = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    String(password),
    Utilities.Charset.UTF_8,
  );

  return digest
    .map(function(byte) {
      const value = byte < 0 ? byte + 256 : byte;
      return `0${value.toString(16)}`.slice(-2);
    })
    .join("");
}

function output_(payload, callback) {
  const safeCallback = sanitizeCallback_(callback);
  const json = JSON.stringify(payload);

  if (safeCallback) {
    return ContentService
      .createTextOutput(`${safeCallback}(${json});`)
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  return ContentService
    .createTextOutput(json)
    .setMimeType(ContentService.MimeType.JSON);
}

function sanitizeCallback_(callback) {
  if (!callback) {
    return "";
  }

  return /^[A-Za-z_$][0-9A-Za-z_$]*(\.[A-Za-z_$][0-9A-Za-z_$]*)*$/.test(callback)
    ? callback
    : "";
}
