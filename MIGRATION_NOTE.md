# Database Migration Required

The pre-order form now includes a quantity field. You need to add this column to your Supabase database.

## Migration SQL

Run this SQL in your Supabase SQL Editor:

```sql
-- Add quantity column to pre_orders table
ALTER TABLE pre_orders 
ADD COLUMN IF NOT EXISTS quantity INTEGER DEFAULT 1;

-- Set default value for existing rows
UPDATE pre_orders 
SET quantity = 1 
WHERE quantity IS NULL;
```

## After Running Migration

After applying the migration, regenerate the TypeScript types:

```bash
# Using Supabase CLI
supabase gen types typescript --project-id YOUR_PROJECT_ID > src/integrations/supabase/types.ts
```

This will update the TypeScript types to include the new `quantity` field.
