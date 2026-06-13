# Transportation Management System

Admin-Only Transportation Management System (TMS) built with Next.js 14+, Supabase, and Tailwind CSS. This system allows administrators to manage vehicle reservations, drivers, inventory, and generate trip tickets.

## Features

- 🔐 **Authentication**: Secure admin login with Supabase Auth
- 👥 **User Management**: Role-based access control with supervisor and admin roles:
  - Supervisors can add, remove, and promote admins
  - Admins can view user list but cannot manage users
  - Self-deletion prevention for security
- 🚗 **Vehicle Management**: CRUD operations for vehicles with status tracking
- 👤 **Driver Management**: Manage drivers and their availability
- 📅 **Reservation System**: Create and manage vehicle reservations with:
  - Availability checking to prevent double-booking
  - Approval letter uploads
  - Trip ticket generation
- 📦 **Inventory Management**: Track lubricants, spare parts, and supplies:
  - Stock level monitoring
  - Restock and consume operations
  - Low stock alerts
  - Transaction history
- 🖨️ **Trip Ticket Printing**: Generate printable trip tickets for reservations
- 📊 **Dashboard**: Overview with low stock alerts

## Tech Stack

- **Frontend**: Next.js 14+ (App Router) with TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query (ready for implementation)

## Prerequisites

- Node.js 18+ and npm
- A Supabase account and project

## Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd Transpo_new
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API and copy your project credentials
3. Set up the database schema:
   - Contact the project maintainer for the database schema
   - Or if you're the original developer, use your backed-up schema file
   - Open the SQL Editor in your Supabase dashboard
   - Execute the SQL script to create tables, RLS policies, and functions
4. Create storage buckets:
   - Go to Storage in your Supabase dashboard
   - Create buckets: `approval-letters`, `vehicle-documents`, `driver-documents`
   - Configure appropriate access policies
   - Set file size limits (recommended: 5MB)
5. Enable Email/Password authentication:
   - Go to Authentication > Providers
   - Enable Email provider

### 4. Configure Environment Variables

Copy the example environment file:

```bash
# Windows (PowerShell)
Copy-Item env.example .env.local

# Windows (CMD)
copy env.example .env.local

# Mac/Linux
cp env.example .env.local
```

Then edit `.env.local` and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

**Important**: Never commit `.env.local` to version control. It's already in `.gitignore`.

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Create Your First Admin Account

**⚠️ Important**: Make sure you've completed step 3 (Set Up Supabase) and run the database schema before creating users!

Create your first admin user through the Supabase Dashboard:

1. Go to Authentication > Users in your Supabase dashboard
2. Click "Add user" and create a new user with email/password
3. Copy the user's UUID
4. Go to SQL Editor and run:
   ```sql
   INSERT INTO admin_users (id, email, name, role)
   VALUES ('paste-user-uuid-here', 'your-email@example.com', 'Your Name', 'supervisor');
   ```

**Note**: The first user should be a `supervisor` so they can manage other users later.

## Project Structure

```
app/
  (auth)/              # Authentication routes
    login/
  (dashboard)/         # Protected dashboard routes
    dashboard/         # Main dashboard
    reservations/      # Reservation management
    vehicles/          # Vehicle management
    drivers/           # Driver management
    inventory/         # Inventory management
    admin/             # User management (RBAC)
      users/           # User list and management
  actions/             # Server actions
  api/                 # API routes
components/
  forms/               # Form components
  ui/                  # UI components
lib/
  supabase/            # Supabase client utilities
  utils/               # Utility functions
  types.ts             # TypeScript type definitions
```

## Database Schema

The system uses the following main tables:

- `admin_users` - Admin user accounts with role-based access control
- `vehicles` - Vehicle information with document storage (OR, CR)
- `drivers` - Driver information with license and photo storage
- `reservations` - Reservation records with approval letters
- `inventory_items` - Inventory items
- `inventory_logs` - Inventory transaction history

All tables are protected with Row Level Security (RLS) policies for secure access control.

## User Roles & Permissions

The system implements role-based access control (RBAC) with two roles:

### Supervisor
- Full access to all TMS features (vehicles, drivers, reservations, inventory)
- Can view all admin users
- Can add new admin users or supervisors
- Can promote admins to supervisors
- Can demote supervisors to admins
- Can remove admin users (except themselves)

### Admin
- Full access to all TMS features (vehicles, drivers, reservations, inventory)
- Can view all admin users
- Cannot add, edit, or remove users

## Usage

### Managing Users (Supervisors Only)

1. Navigate to Admin > Users
2. View all admin users with their roles
3. Click "Add Admin" to create a new user
4. Fill in name, email, password, and select role
5. Use "Promote" to upgrade an admin to supervisor
6. Use "Demote" to downgrade a supervisor to admin
7. Use "Remove" to delete a user (cannot remove yourself)

### Creating a Reservation

1. Navigate to Reservations > New Reservation
2. Fill in the department, requestor, route, and time details
3. Select an available vehicle and driver
4. Optionally upload an approval letter
5. Submit the reservation

### Managing Inventory

1. Navigate to Inventory
2. Add new items with initial quantities
3. Restock items when new supplies arrive
4. Consume items when used for maintenance
5. Monitor low stock alerts on the dashboard

### Generating Trip Tickets

1. Navigate to a reservation's details page
2. Click "Print Trip Ticket"
3. Use your browser's print dialog to save as PDF or print

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Style

This project uses:
- TypeScript for type safety
- ESLint for code quality
- Tailwind CSS for styling

## Security

- All database operations are protected by Row Level Security (RLS) policies
- File uploads are validated on both client and server
- Service role key is only used in server actions
- Protected routes require authentication

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Troubleshooting

### Common Issues

**"Failed to upload file"**
- Check that the `approval-letters` bucket exists in Supabase Storage
- Verify the bucket is set to public or signed URLs are configured
- Check file size (max 5MB) and file type

**"Authentication failed"**
- Verify your Supabase credentials in `.env.local`
- Check that Email/Password authentication is enabled in Supabase
- Ensure the auth trigger function is created (see `supabase-schema.sql`)

**"RLS policy violation"**
- Make sure you're logged in as an admin user
- Verify the RLS policies are correctly set up in Supabase

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For issues and questions, please open an issue on the GitHub repository.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Database powered by [Supabase](https://supabase.com)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
