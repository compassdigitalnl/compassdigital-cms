# Platform Authentication

## Current Implementation

The platform admin interface (`/platform/*`) is protected by Next.js middleware that checks for authentication.

### How It Works

1. **Middleware Check** (`src/middleware.ts`)
   - All `/platform/*` routes require authentication
   - Checks for `payload-token` cookie
   - If not present, redirects to `/admin/login`

2. **Access Control** (Payload Collections)
   - `Clients` and `Deployments` collections require authenticated user
   - Currently allows any logged-in user
   - TODO: Add `platform-admin` role check

### Setup

**For Development:**
1. Start server: `npm run dev`
2. Navigate to http://localhost:3020/admin
3. Create first user account
4. Navigate to http://localhost:3020/platform
5. You should be logged in automatically

**For Production:**
1. Create admin user via Payload admin
2. Access `/platform` with admin credentials

### Adding Platform Admin Role

To restrict access to only platform administrators:

1. **Update Users Collection** (`src/collections/Users.ts`)
   ```typescript
   {
     name: 'role',
     type: 'select',
     options: [
       { label: 'Admin', value: 'admin' },
       { label: 'Editor', value: 'editor' },
       { label: 'Platform Admin', value: 'platform-admin' }, // Add this
     ],
     required: true,
     defaultValue: 'admin',
   }
   ```

2. **Update Access Control**
   - Uncomment role checks in `src/platform/collections/Clients.ts`
   - Uncomment role checks in `src/platform/collections/Deployments.ts`

3. **Update Middleware** (`src/middleware.ts`)
   - Uncomment token validation logic
   - Verify user role is `platform-admin`

### Security Notes

- The `payload-token` is an HTTP-only cookie
- Token is validated by Payload CMS
- Middleware runs on Edge runtime (fast!)
- Session expires based on Payload config

### Future Enhancements

- [ ] Add 2FA for platform admins
- [ ] Add audit logging for admin actions
- [ ] Add IP whitelisting option
- [ ] Add API key authentication for programmatic access
