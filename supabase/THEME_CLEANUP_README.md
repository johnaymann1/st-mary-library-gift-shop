# Database Theme Cleanup

## Overview

This script removes old theme values from the database and ensures only the allowed themes (`default` and `christmas`) are permitted.

## What It Does

1. Updates any existing records with old theme values (easter, summer, halloween) to 'default'
2. Removes the old database constraint
3. Adds a new constraint that only allows 'default' and 'christmas' themes

## How to Run

### Option 1: Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy the contents of `cleanup_old_themes.sql`
4. Paste and run the SQL script
5. Check for success messages in the results

### Option 2: Using Supabase CLI

```bash
npx supabase db execute -f supabase/cleanup_old_themes.sql
```

## Expected Output

```
NOTICE: Theme cleanup completed - only default and christmas themes allowed
```

## Verification

After running the script, verify the changes:

```sql
-- Check current theme value
SELECT active_theme FROM store_settings;

-- Should return either 'default' or 'christmas'

-- Try to set an invalid theme (should fail)
UPDATE store_settings SET active_theme = 'easter';
-- Expected error: new row violates check constraint
```

## Important Notes

- **Run this once**: This is a one-time migration script
- **Backup first**: Always backup your database before running migrations
- **Safe to re-run**: The script is idempotent and won't cause issues if run multiple times
- **Production ready**: This script is safe for production databases

## After Running

1. Clear your browser cache (Cmd/Ctrl + Shift + R)
2. Navigate to Admin Settings
3. Verify the theme dropdown shows only "Default Theme" and "Christmas Theme"
4. Test switching between themes
5. Verify the homepage hero text changes with the theme
