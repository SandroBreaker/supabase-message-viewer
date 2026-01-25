
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yggpwbvhyieaqvwwjcot.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlnZ3B3YnZoeWllYXF2d3dqY290Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwODE4MjksImV4cCI6MjA4MzY1NzgyOX0.UK00JUukbjaLkLob3cW1XWaQBJ9cZd5-TuJZ384Q3Rc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
