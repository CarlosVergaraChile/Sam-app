# Generador MVP - Technical Contract

## Overview
The Generador feature allows authenticated users with the `generador` feature flag enabled to generate material by consuming credits atomically.

## API Endpoint: POST /api/generate

### Authentication
- **Method**: Session-based (Supabase Auth)
- **Required**: Valid `sb-token` cookie
- **Header**: Set automatically by Supabase client

### Request
```json
{
  "prompt": "string (optional in stub)"
}
```

### Response (200 OK)
```json
{
  "ok": true,
  "material": "string",
  "creditsRemaining": integer
}
```

### Error Responses

#### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "code": "NO_SESSION"
}
```
Cause: No valid session token in cookies

#### 403 Forbidden
```json
{
  "error": "Feature not enabled",
  "code": "FEATURE_NOT_ENABLED"
}
```
Cause: User does not have `generador` feature enabled in user_features table

#### 402 Payment Required
```json
{
  "error": "Insufficient credits",
  "code": "INSUFFICIENT_CREDITS"
}
```
Cause: User has < 1 credit remaining

#### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "code": "SERVER_ERROR"
}
```
Cause: Unexpected server error

## Credit Consumption

### Atomic Transaction
- Each successful call to `/api/generate` consumes exactly 1 credit
- Transaction executed via RPC `consume_credit(user_id, 1)`
- **Guarantee**: Credits only deducted if 200 OK response is returned
- **Guarantee**: No partial consumption (atomic RPC)

### Deduction Logic
```sql
UPDATE user_credits
SET balance = balance - 1,
    used_this_month = used_this_month + 1,
    last_updated = NOW()
WHERE user_id = $1
AND balance >= 1;
```

## Feature Flag: generador

### Table: user_features
Columns:
- `id` (uuid, primary key)
- `user_id` (uuid)
- `feature_name` (string, 'generador')
- `enabled` (boolean)
- `activated_at` (timestamp)

### Checking Feature Availability
GET /api/features/generador
- Returns: `{ "isEnabled": boolean }`
- Requires valid session
- Falls back to global feature_flags table if user record not found

## RPC: consume_credit

### Signature
```sql
consume_credit(p_user_id uuid, p_amount integer)
RETURNS TABLE(success boolean, new_balance integer, error text)
```

### Behavior
1. Reads current balance from `user_credits`
2. Returns `(false, 0, 'Insufficient credits')` if balance < amount
3. Otherwise, atomically deducts amount
4. Returns `(true, new_balance, NULL)` on success
5. Updates `last_updated = NOW()`

### Usage Example
```sql
SELECT * FROM consume_credit(
  '754f3fa8-df35-4329-b480-4024bba0c1d4'::uuid,
  1
);
-- Returns: (true, 199, NULL) if balance was >= 1
```

## Logging

All requests are logged in JSON format:
```json
{
  "requestId": "uuid",
  "userId": "uuid",
  "timestamp": "ISO8601",
  "message": "string",
  "...metadata": "any"
}
```

### Log Events
- `Unauthorized: no session token` (401)
- `Unauthorized: invalid token` (401)
- `Feature disabled` (403)
- `Insufficient credits` (402)
- `Material generated successfully` (200)
- `Unexpected error` (500)

## UI Component: /sam (Generador Section)

### Behavior
- Checks `/api/features/generador` on mount
- If `isEnabled === false`, shows: "Generador feature is not enabled for your account"
- If `isEnabled === true`, shows:
  - Textarea for prompt input
  - "Generate" button (disabled while generating)
  - Generated material output with credits remaining

## Deployment

- **Production URL**: https://sam-app-mu.vercel.app/sam
- **API Base**: https://sam-app-mu.vercel.app/api
- **Latest Deployment**: C1hDPSDeH (Ready, 2026-01-15)

## Testing Checklist

- [ ] User with feature enabled can generate (credits deduct)
- [ ] User without feature gets 403 on API, no UI option
- [ ] Insufficient credits returns 402, no deduction
- [ ] Invalid session returns 401
- [ ] All errors logged with request_id
- [ ] Response includes X-Request-ID header
