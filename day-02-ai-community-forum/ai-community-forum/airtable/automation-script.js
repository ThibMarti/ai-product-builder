/**
 * Airtable Automation — "Run script" action
 *
 * Trigger : When record is created  (table: Posts)
 * Purpose : notify the n8n webhook that a new post exists.
 *
 * Input variable to declare in the Airtable script editor (left panel):
 *   name  : recordId
 *   value : Record (from trigger) > Airtable record ID
 *
 * Note: only the record ID travels. n8n fetches the full record itself.
 */

const WEBHOOK_URL = "YOUR_N8N_PRODUCTION_WEBHOOK_URL";

const { recordId } = input.config();

const response = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ recordID: recordId }),
});

if (!response.ok) {
    throw new Error(
        `n8n webhook returned ${response.status} ${response.statusText}`
    );
}

console.log(`Notified n8n for record ${recordId} (HTTP ${response.status})`);
