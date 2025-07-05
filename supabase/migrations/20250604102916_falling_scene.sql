/*
  # Create Portfolio Database Schema
  
  1. Tables
    - `projects` - Portfolio projects showcase
    - `services` - Professional services offered
    - `experiences` - Work history and experience
    - `testimonials` - Client reviews and testimonials
    - `contacts` - Contact form submissions
  
  2. Security
    - Enable RLS on all tables
    - Add policies for public read access
    - Add policies for authenticated admin write access
*/

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  technologies TEXT[] DEFAULT '{}',
  image_url TEXT NOT NULL,
  live_url TEXT,
  github_url TEXT,
  featured BOOLEAN DEFAULT false
);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  price NUMERIC,
  featured BOOLEAN DEFAULT false
);

-- Create experiences table
CREATE TABLE IF NOT EXISTS experiences (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  job_title TEXT NOT NULL,
  company TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  description TEXT NOT NULL,
  achievements TEXT[] DEFAULT '{}',
  tools_used TEXT[] DEFAULT '{}',
  current BOOLEAN DEFAULT false
);

-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  client_name TEXT NOT NULL,
  client_company TEXT NOT NULL,
  project_type TEXT NOT NULL,
  review TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  image_url TEXT
);

-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  responded BOOLEAN DEFAULT false
);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Public read access policies
CREATE POLICY "Public can view projects" 
  ON projects FOR SELECT 
  USING (true);

CREATE POLICY "Public can view services" 
  ON services FOR SELECT 
  USING (true);

CREATE POLICY "Public can view experiences" 
  ON experiences FOR SELECT 
  USING (true);

CREATE POLICY "Public can view testimonials" 
  ON testimonials FOR SELECT 
  USING (true);

CREATE POLICY "Public can create contacts" 
  ON contacts FOR INSERT 
  WITH CHECK (true);

-- Admin policies for full access
CREATE POLICY "Authenticated users can manage projects" 
  ON projects FOR ALL 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage services" 
  ON services FOR ALL 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage experiences" 
  ON experiences FOR ALL 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage testimonials" 
  ON testimonials FOR ALL 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage contacts" 
  ON contacts FOR ALL 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);