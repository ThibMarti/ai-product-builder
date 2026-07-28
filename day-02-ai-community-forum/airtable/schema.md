# Airtable schema

Two tables drive the forum. Field **types** matter more than field names — the
automation breaks on a type mismatch, not on a naming one.

---

## `Posts`

| Field | Type | Notes |
|---|---|---|
| `Post content` | Long text | The student's question |
| `Author` | Linked record | Who asked |
| `Timestamp` | Date / Created time | When the post was made |

Read by the n8n `Get a record` node using the ID received on the webhook.

## `Comments`

| Field | Type | Written as |
|---|---|---|
| `Comment content` | Long text | `{{ $json.text }}` — the LLM output |
| `Post` | Linked record → `Posts` | `{{ [$('Webhook').item.json.body.recordID] }}` |
| `Comment author` | Linked record | `{{ ["recXXXXXXXXXXXXXX"] }}` — the AI bot record |
| `Timestamp` | Date | `{{ $now }}` |

---

## Writing to a linked record field

A linked record field does not accept a display string. The API expects an
**array of record IDs**:

```json
{ "Comment author": ["recXXXXXXXXXXXXXX"] }
```

Not `"recXXXXXXXXXXXXXX"`, and definitely not `"AI Bot"` — that string is what
Airtable *renders* (the primary field of the linked record), not what it stores.

Two ways to supply a valid value:

1. **Pass the ID directly.** Surface it in a view with a formula field:
   ```
   RECORD_ID()
   ```
   The ID must belong to the table the field links to. A valid record ID from
   the *wrong* table is rejected exactly like a malformed one.
2. **Enable Typecast** on the n8n Airtable node, then pass the primary-field
   value (`"AI Bot"`) and let Airtable resolve — or create — the matching record.

Pick one. Passing a record ID *and* leaving Typecast on is ambiguous: Typecast
applies to string values, so the ID can end up being treated as a name to match
rather than as a reference to resolve.

Typecast converts a *value*. It cannot convert a *field type*: if the field was
created as Text when it should be a Linked Record, no n8n option will fix it.
