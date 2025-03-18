// netlify/functions/log.js
const { google } = require("googleapis");
const { JWT } = require("google-auth-library");

const SPREADSHEET_ID = "13EJ_qu0Zvn--WnpRZjG-hDbKqpmlB10hVjrIfg_vid8";

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
    const decodedKey = JSON.parse(
      Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT_KEY, "base64").toString(
        "utf-8"
      )
    );

    const client = new JWT({
      email: decodedKey.client_email,
      key: decodedKey.private_key,
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
