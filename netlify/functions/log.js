// netlify/functions/log.js
const { google } = require("googleapis");
const { JWT } = require("google-auth-library");

const SPREADSHEET_ID = "13EJ_qu0Zvn--WnpRZjG-hDbKqpmlB10hVjrIfg_vid8";
const SERVICE_ACCOUNT_KEY = require("./google-service-account-key.json");

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const logEntry = JSON.parse(event.body);
  const values = [
    [
      logEntry.timestamp,
      logEntry.videoId,
      logEntry.videoTitle,
      logEntry.eventType,
      logEntry.duration,
    ],
  ];

  try {
    const client = new JWT({
      email: SERVICE_ACCOUNT_KEY.client_email,
      key: SERVICE_ACCOUNT_KEY.private_key,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth: client });

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: "Sheet1", // Or your sheet name
      valueInputOption: "USER_ENTERED",
      resource: { values },
    });

    return { statusCode: 200, body: "Log saved to Google Sheets" };
  } catch (error) {
    console.error("Error saving to Google Sheets:", error);
    return { statusCode: 500, body: "Error saving to Google Sheets" };
  }
};
