# Backend Logic (Serverless)

This project uses **Supabase** as a Backend-as-a-Service (BaaS). 

The "Backend" logic for this project consists of:

1.  **Authentication**: Handled via `frontend/src/lib/auth.tsx`.
2.  **API Connections**: Supabase client initialization in `frontend/src/integrations/supabase/client.ts`.
3.  **BaaS Policies**: Database security is enforced via **Row Level Security (RLS)** in the Database.
4.  **Admin Logic**: Managed via `frontend/src/pages/Admin.tsx` which communicates with the Supabase APIs.

This structure allows the application to scale without managing a dedicated Node.js/Express server.
