import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';

const supabaseUrl = 'https://qfvxrajoiopyqjajvngr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmdnhyYWpvaW9weXFqYWp2bmdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwMzI0MjIsImV4cCI6MjA2NDYwODQyMn0.FIU8gF6YcSAT50Z5T1s7VX9UqEbvfcyPFue1-GVANik';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export type Tables = Database['public']['Tables'];
export type Project = Tables['projects']['Row'];
export type Service = Tables['services']['Row'];
export type Testimonial = Tables['testimonials']['Row'];
export type Experience = Tables['experiences']['Row'];
export type Contact = Tables['contacts']['Row'];
export type WorkExperience = Tables['work_experiences']['Row'];