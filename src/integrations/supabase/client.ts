// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://vxsdlfarqslchzvdeipw.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4c2RsZmFycXNsY2h6dmRlaXB3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2MDEyMjMsImV4cCI6MjA1NjE3NzIyM30.l__o9tW4znWR8c5elHVLHXe9HaTTyUz1vlb8J308tsU";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);