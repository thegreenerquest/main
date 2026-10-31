/**
 * GreenerQuest — Google Apps Script Backend
 * 
 * Instructions:
 * 1. Open your Google Sheet ("GreenerQuest_BE_Database").
 * 2. Click Extensions > Apps Script.
 * 3. Replace any code in Code.gs with this entire file.
 * 4. Click Deploy > New deployment.
 * 5. Select type: "Web app".
 * 6. Under "Execute as", choose: "Me".
 * 7. Under "Who has access", choose: "Anyone" (crucial for web submissions without login).
 * 8. Click Deploy, authorize permissions if prompted, and copy the Web App URL.
 * 9. Paste the Web App URL into your questionnaire HTML files or app.js as CARBON_QUEST_SAVE_URL.
 */

function doPost(e) {
  try {
    var raw = e && e.postData && e.postData.contents ? e.postData.contents : '';
    if (!raw) {
      throw new Error('No payload received');
    }

    var data = JSON.parse(raw);

    // Map questionnaire audience track to sheet tab name
    var sheetMap = {
      'junior': 'Junior_Student',
      'junior school': 'Junior_Student',
      'senior': 'Senior_Student',
      'senior school': 'Senior_Student',
      'school': 'Senior_Student',
      'college': 'College_Student',
      'employee': 'Employee',
      'individual': 'Individual'
    };

    var trackKey = String(data.trackKey || data.studentPath || '').toLowerCase().trim();
    var tabName = sheetMap[trackKey] || 'Individual';

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(tabName);
    if (!sheet) {
      sheet = ss.insertSheet(tabName);
    }

    // Ensure headers exist if tab is empty
    var headers = [
      'Submission_ID',
      'Submitted_At',
      'Participant_Name',
      'Email',
      'City',
      'Category',
      'Responses_JSON',
      'Monthly_CO2_kg',
      'Annual_CO2_Total',
      'Green_Points',
      'Suggestions_JSON'
    ];

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(headers);
    }

    var submissionId = data.submissionId || Utilities.getUuid();
    var submittedAt = data.submittedAt || new Date().toISOString();
    var name = data.name || '';
    var email = data.email || '';
    var city = data.city || '';
    var category = data.category || (data.emissions && data.emissions.tier) || data.studentPath || '';
    var responsesJson = typeof data.responses === 'string' ? data.responses : JSON.stringify(data.responses || []);

    var annualKg = (data.annualKg !== null && data.annualKg !== undefined)
      ? data.annualKg
      : (data.emissions && typeof data.emissions.totalKg === 'number' ? data.emissions.totalKg : null);

    var annualCO2 = annualKg !== null ? Math.round(annualKg * 100) / 100 : '';
    var monthlyCO2 = annualKg !== null ? Math.round((annualKg / 12) * 100) / 100 : '';
    var greenPoints = data.greenPoints || (data.score && data.score.xp) || 0;
    var suggestionsJson = typeof data.suggestions === 'string' ? data.suggestions : JSON.stringify(data.suggestions || []);

    sheet.appendRow([
      submissionId,
      submittedAt,
      name,
      email,
      city,
      category,
      responsesJson,
      monthlyCO2,
      annualCO2,
      greenPoints,
      suggestionsJson
    ]);

    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      id: submissionId,
      tab: tabName
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'ok',
    message: 'GreenerQuest Apps Script backend is active.'
  })).setMimeType(ContentService.MimeType.JSON);
}
