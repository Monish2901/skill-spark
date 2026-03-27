# SkillSpark Backend Logic

This directory contains the serverless architecture logic and API specifications for the project.

## Structure
- **Models**: Defines the schema for Users and Questions.
- **Auth**: Logic for Supabase authentication and JWT verification.
- **API**: Integration points for fetching skill assessments.

Note: This project utilizes **Supabase** for a serverless backend. All live database logic is handled via the `@/integrations/supabase` client in the frontend.
