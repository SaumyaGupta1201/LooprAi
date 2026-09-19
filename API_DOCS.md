# Penta — API Documentation

Base URL: `http://localhost:5000/api`

All endpoints except `POST /auth/login` require an `Authorization` header:
```
Authorization: Bearer <jwt_token>
```


## Response Envelope

**Success**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error**
```json
{
  "success": false,
  "message": "Human-readable error description"
}
```

## Status Codes

| Code | Meaning                                      |
|------|-----------------------------------------------|
| 200  | Success                                        |
| 400  | Validation error (bad request body/params)    |
| 401  | Missing, invalid, or expired token / bad login credentials |
| 404  | Resource not found                             |
| 429  | Rate limit exceeded (200 requests/min per IP)  |
| 500  | Internal server error                          |

---

## Auth

### `POST /auth/login`

Authenticate and receive a JWT.

**Auth required:** No

**Request body**
```json
{
  "email": "analyst@loopr.ai",
  "password": "Loopr@123"
}
```

**Response `200`**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "665f1c2e8a1b2c3d4e5f6789",
    "email": "analyst@loopr.ai",
    "name": "Saumya Gupta",
    "avatar": "https://i.pravatar.cc/120?img=47"
  }
}
```

**Errors:** `400` invalid email/missing password · `401` incorrect email or password

---

### `GET /auth/me`

Return the currently authenticated account.

**Auth required:** Yes

**Response `200`**
```json
{
  "success": true,
  "user": {
    "id": "665f1c2e8a1b2c3d4e5f6789",
    "email": "analyst@loopr.ai",
    "name": "Namrata Shirdhankar",
    "avatar": "https://i.pravatar.cc/120?img=47"
  }
}
```

---

### `POST /auth/logout`

Stateless — exists for a clean client-side logout flow. The client is
responsible for discarding the JWT.

**Auth required:** Yes

**Response `200`**
```json
{ "success": true, "message": "Logged out successfully" }
```

---

## Transactions

### `GET /transactions`

Paginated, filtered, sorted, and searchable transaction list.

**Auth required:** Yes

**Query parameters**

| Param       | Type   | Description                                       |
|-------------|--------|-----------------------------------------------------|
| `page`      | number | Page number (default `1`)                          |
| `limit`     | number | Rows per page, max `100` (default `10`)             |
| `sortBy`    | string | `date` \| `amount` \| `category` \| `status` \| `userName` \| `txnId` |
| `order`     | string | `asc` \| `desc` (default `desc`)                    |
| `search`    | string | Free-text search across user, category, status, amount, ID |
| `category`  | string | Comma-separated: `Revenue,Expense`                  |
| `status`    | string | Comma-separated: `Paid,Pending`                     |
| `user_id`   | string | Comma-separated user IDs                            |
| `startDate` | string | ISO date, inclusive lower bound on `date`           |
| `endDate`   | string | ISO date, inclusive upper bound on `date`           |
| `minAmount` | number | Inclusive lower bound on `amount`                   |
| `maxAmount` | number | Inclusive upper bound on `amount`                   |

**Example**

```
GET /api/transactions?page=1&limit=10&sortBy=date&order=desc&category=Revenue&status=Paid
```

**Response `200`**
```json
{
  "success": true,
  "data": [
    {
      "_id": "665f1c...",
      "txnId": 1042,
      "date": "2026-08-14T00:00:00.000Z",
      "amount": 2450.5,
      "category": "Revenue",
      "status": "Paid",
      "user_id": "user_002",
      "userName": "Floyd Miles",
      "avatar": "https://i.pravatar.cc/120?img=33"
    }
  ],
  "pagination": { "page": 1, "limit": 10, "total": 300, "totalPages": 30 }
}
```

---

### `GET /transactions/filters`

Returns the distinct values available for building filter UIs — populates the
category, status, and user dropdowns without hardcoding them client-side.

**Auth required:** Yes

**Response `200`**
```json
{
  "success": true,
  "data": {
    "categories": ["Revenue", "Expense"],
    "statuses": ["Paid", "Pending"],
    "users": [
      { "user_id": "user_001", "name": "Matheus Ferrero", "avatar": "https://i.pravatar.cc/120?img=12" }
    ],
    "amountRange": { "min": 12.5, "max": 9800 }
  }
}
```

---

## Analytics

All analytics endpoints accept the same filter query parameters as
`GET /transactions` (`search`, `category`, `status`, `user_id`, `startDate`,
`endDate`, `minAmount`, `maxAmount`), so every chart — including "Recent
Transactions" — reflects the currently active filters.

### `GET /analytics/summary`

`revenue`, `expenses`, `balance`, and `savings` are computed from
**`status: "Paid"` transactions only** — Pending amounts are reported
separately via `pendingRevenue` / `pendingExpenses` rather than included in
the headline totals.

**Auth required:** Yes

**Response `200`**
```json
{
  "success": true,
  "data": {
    "revenue": 84210.5,
    "expenses": 32110.25,
    "balance": 52100.25,
    "savings": 52100.25,
    "savingsRate": 61.9,
    "pendingRevenue": 4200,
    "pendingExpenses": 1100,
    "transactionCount": 300
  }
}
```

### `GET /analytics/trend`

Revenue vs. expenses over time, bucketed into weekly, monthly, or yearly
intervals. Powers the Overview chart's period toggle.

**Auth required:** Yes

**Query parameters** (in addition to the shared filters listed above)

| Param    | Type   | Description                                          |
|----------|--------|-------------------------------------------------------|
| `period` | string | `weekly` \| `monthly` \| `yearly`. Defaults to `monthly`. |

**Example**

GET /api/analytics/trend?period=weekly&category=Revenue


**Response `200`**

Each object in `data` represents one bucket for the selected `period`, sorted
chronologically. `key` is a stable, sortable identifier for the bucket;
`label` is the human-readable string used in the chart's X-axis; `net` is
`revenue - expenses` for that bucket.

`period=monthly` (default) — `key` format `YYYY-MM`:
```json
{
  "success": true,
  "data": [
    { "key": "2026-07", "label": "Jul 2026", "revenue": 12000, "expenses": 4500, "net": 7500 }
  ]
}
```

`period=weekly` — `key` format `YYYY-Www` (ISO 8601 week numbering, per
[`$isoWeek`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/isoWeek/)):
```json
{
  "success": true,
  "data": [
    { "key": "2026-W29", "label": "Wk 29 '26", "revenue": 3200, "expenses": 1100, "net": 2100 }
  ]
}
```

`period=yearly` — `key` format `YYYY`:
```json
{
  "success": true,
  "data": [
    { "key": "2026", "label": "2026", "revenue": 195302, "expenses": 145803, "net": 49499 }
  ]
}
```

**Notes:**
- Like `GET /analytics/summary`, this endpoint only aggregates
  `status: "Paid"` transactions — Pending amounts are excluded from
  `revenue`, `expenses`, and `net` in every bucket.
- Buckets with no matching transactions are omitted rather than returned with
  zero values — the frontend renders only the buckets present in the response.
- `period=weekly` uses ISO week numbering (weeks start Monday, week 1 is the
  week containing the year's first Thursday), which may place late-December
  or early-January transactions in a week labeled under the adjacent year.

### `GET /analytics/breakdown`

Aggregated totals by category, by status, and by user.

**Auth required:** Yes

**Response `200`**
```json
{
  "success": true,
  "data": {
    "byCategory": [{ "name": "Revenue", "total": 84210.5, "count": 180 }],
    "byStatus": [{ "name": "Paid", "total": 90000, "count": 260 }],
    "byUser": [{ "name": "Floyd Miles", "revenue": 21000, "expenses": 8000 }]
  }
}
```

### `GET /analytics/recent`

**Auth required:** Yes

**Query parameters:** `limit` (number, default `5`, max `20`)

**Response `200`**
```json
{
  "success": true,
  "data": [ { "_id": "...", "txnId": 1050, "date": "...", "amount": 500, "category": "Revenue", "status": "Paid", "userName": "..." } ]
}
```

---

## CSV Export

### `GET /export/columns`

Returns the list of columns available for CSV export, in display order.

**Auth required:** Yes

**Response `200`**
```json
{
  "success": true,
  "data": [
    { "key": "txnId", "label": "Transaction ID" },
    { "key": "date", "label": "Date" },
    { "key": "amount", "label": "Amount" },
    { "key": "category", "label": "Category" },
    { "key": "status", "label": "Status" },
    { "key": "userName", "label": "User Name" },
    { "key": "user_id", "label": "User ID" },
    { "key": "user_profile", "label": "Profile URL" }
  ]
}
```

---

### `POST /export/csv`

Generates and streams a CSV file for download, using the same filter/sort
pipeline as the transaction list.

**Auth required:** Yes

**Request body**
```json
{
  "columns": ["txnId", "date", "amount", "category", "status"],
  "filters": { "category": "Revenue", "status": "Paid" },
  "sortBy": "date",
  "order": "desc",
  "filename": "revenue-report"
}
```

| Field      | Type     | Required | Notes                                             |
|------------|----------|----------|-----------------------------------------------------|
| `columns`  | string[] | Yes      | At least one valid column key                       |
| `filters`  | object   | No       | Same shape as `GET /transactions` query params      |
| `sortBy`   | string   | No       | Defaults to `date`                                  |
| `order`    | string   | No       | `asc` \| `desc`                                     |
| `filename` | string   | No       | Defaults to `loopr-transactions-<YYYY-MM-DD>`       |

**Response `200`** — binary CSV stream

```
Content-Type: text/csv; charset=utf-8
Content-Disposition: attachment; filename="revenue-report.csv"
X-Row-Count: 42
```

CSV body (UTF-8 with BOM for Excel compatibility):
```csv
Transaction ID,Date,Amount,Category,Status
1042,2026-08-14,2450.50,Revenue,Paid
```

**Errors:**
- `400` — no columns selected, or none of the selected columns are valid
- `404` — no transactions match the given filters

**Security note:** Any cell value beginning with `=`, `+`, `-`, or `@` is
prefixed with `'` in the output to neutralize spreadsheet formula injection.

---

## Rate Limiting

All `/api/*` routes are limited to **200 requests per minute per IP**. Exceeding
this returns `429 Too Many Requests` with standard `RateLimit-*` response
headers.
