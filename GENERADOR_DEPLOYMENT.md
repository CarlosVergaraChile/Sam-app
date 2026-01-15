# Generador MVP - Deployment Status

## Endpoints Implemented

### 1. POST /api/generate
- **Path**: `app/api/generate/route.ts`
- **Status**: ✅ Implemented
- **Features**:
  - Authentication check (403 if not logged in)
  - Feature gating (403 if generador not enabled)
  - Credit balance check (402 if insufficient credits)
  - Atomic credit deduction on success
  - Stub material generation response

### 2. GET /api/features/[feature]
- **Path**: `app/api/features/[feature]/route.ts`
- **Status**: ✅ Implemented
- **Features**:
  - Checks user authentication
  - Queries user_features table
  - Returns `{ enabled: boolean }`

## Frontend Integration

- **File**: `app/sam/page.tsx`
- **Changes**:
  - Added `generadorEnabled` useState
  - Added useEffect to fetch feature status on mount
  - Calls `/api/features/generador` to check availability

## Database Structure

- **Table**: `user_features`
  - `user_id` (UUID, FK to auth.users)
  - `feature_name` (TEXT, e.g., 'generador')
  - `enabled` (BOOLEAN)

- **Table**: `user_credits`
  - `user_id` (UUID)
  - `credits` (INTEGER)

## Production URL

- **App**: https://sam-app-mu.vercel.app/sam
- **API Endpoint**: https://sam-app-mu.vercel.app/api/generate
- **Feature Check**: https://sam-app-mu.vercel.app/api/features/generador

## Testing

Test user: monica.silvaricci@gmail.com
- Feature enabled: ✅
- Credits: 200
