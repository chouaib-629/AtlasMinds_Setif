# Dashboard Features Documentation

## Overview

The AtlasMinds Admin Dashboard provides a comprehensive interface for managing youth centers, events, participants, and all related activities. The dashboard features role-based access control with two distinct admin roles.

## Admin Roles

### Super Admin
**Access & Responsibilities:**
- Manage **national, online, and hybrid** events/activities
- Access to Virtual Youth House (national online platform)
- View and manage **all participants** across Algeria
- Filter participants by wilaya (province)
- View global, Algeria-wide, or wilaya-specific leaderboards
- CRUD operations for chats and livestreams (national scope)
- Manage event inscriptions for all events
- Access to system-wide statistics and analytics

**Event Types Available:**
- National events
- Online events
- Hybrid events
- Local events

**Attendance Types:**
- Online attendance
- In-person attendance
- Hybrid attendance

### Admin (Youth House Director)
**Access & Responsibilities:**
- Manage **local in-house** events/activities only
- View participants assigned to their specific youth house
- View leaderboard for their youth house participants
- CRUD operations for chats and livestreams (local scope)
- Manage event inscriptions for local events
- Access to local house statistics

**Event Types Available:**
- Local events only

**Attendance Types:**
- In-person attendance only

## Dashboard Pages

### 1. Dashboard (Home)
- **Statistics Overview**: Quick stats cards showing:
  - Total Events
  - Total Participants
  - Total Inscriptions
  - Active Chats
  - Active Livestreams
- **Quick Actions**: Shortcuts to key features
- **Role Information**: Display of current admin role and access level

### 2. Events & Activities
**Super Admin:**
- View all events (national, local, online, hybrid)
- Filter by event type and attendance type
- Create/Edit/Delete any event type
- Full event management capabilities

**Admin:**
- View only local events
- Create/Edit/Delete local in-person events
- Filter options limited to local scope

**Features:**
- Event creation form with:
  - Title and description
  - Event type selection
  - Attendance type selection
  - Date and location
- Event cards displaying key information
- Direct link to view inscriptions for each event

### 3. Participants
**Super Admin:**
- View all participants across Algeria
- Filter by wilaya
- View participant details including:
  - Full profile information
  - Score/points
  - Events attended count
  - Attendance history
  - Location (wilaya and commune)

**Admin:**
- View only participants assigned to their youth house
- Same detail view capabilities (limited scope)

**Features:**
- Participant table with sortable columns
- Detailed participant modal showing:
  - Contact information
  - Location details
  - Score breakdown
  - Complete attendance history with event details

### 4. Leaderboard
**Super Admin:**
- Global leaderboard (all participants)
- Algeria-wide leaderboard
- Wilaya-specific leaderboard (with wilaya filter)
- Top 3 highlighted with special cards

**Admin:**
- Leaderboard for their youth house participants only

**Features:**
- Rank display with medals for top 3
- Score and events attended metrics
- Filter options based on role
- Visual highlighting of top performers

### 5. Chats
**Both Roles:**
- Create, Read, Update, Delete chat rooms
- Link chats to specific events
- Activate/deactivate chats
- View all chats with status indicators

**Scope:**
- Super Admin: Can manage chats for all events
- Admin: Can manage chats for local events only

**Features:**
- Chat creation form
- Active/Inactive status toggle
- Event association (optional)
- Chat cards with status indicators

### 6. Livestreams
**Both Roles:**
- Create, Read, Update, Delete livestreams
- Link livestreams to specific events
- Toggle live status
- Manage stream URLs

**Scope:**
- Super Admin: Can manage livestreams for all events
- Admin: Can manage livestreams for local events only

**Features:**
- Livestream creation form
- Live/Offline status indicator (with animation for live)
- Stream URL management
- Event association (optional)

### 7. Event Inscriptions
**Super Admin:**
- View all event inscriptions
- Filter by event and status
- Approve/Reject pending inscriptions
- View participant and event details

**Admin:**
- View inscriptions for local events only
- Same approval/rejection capabilities (limited scope)

**Features:**
- Inscription table with filters
- Status management:
  - Pending (default)
  - Approved
  - Rejected
  - Attended
- Quick approve/reject actions
- Statistics summary cards:
  - Total inscriptions
  - Pending count
  - Approved count
  - Attended count

## API Endpoints Used

All endpoints are prefixed with `/api/admin` and require JWT authentication.

### Events
- `GET /admin/events` - List events (with filters)
- `GET /admin/events/:id` - Get event details
- `POST /admin/events` - Create event
- `PUT /admin/events/:id` - Update event
- `DELETE /admin/events/:id` - Delete event

### Participants
- `GET /admin/participants` - List participants (with filters)
- `GET /admin/participants/:id` - Get participant details
- `GET /admin/participants/:id/attendance` - Get participant attendance

### Leaderboard
- `GET /admin/leaderboard` - Get leaderboard (with scope filters)

### Chats
- `GET /admin/chats` - List chats
- `POST /admin/chats` - Create chat
- `PUT /admin/chats/:id` - Update chat
- `DELETE /admin/chats/:id` - Delete chat

### Livestreams
- `GET /admin/livestreams` - List livestreams
- `POST /admin/livestreams` - Create livestream
- `PUT /admin/livestreams/:id` - Update livestream
- `DELETE /admin/livestreams/:id` - Delete livestream

### Event Inscriptions
- `GET /admin/event-inscriptions` - List inscriptions (with filters)
- `PATCH /admin/event-inscriptions/:id/status` - Update inscription status

## Design Features

- **Modern UI**: Clean, professional design with Tailwind CSS
- **Dark Mode**: Full dark mode support throughout
- **Responsive**: Works on desktop, tablet, and mobile devices
- **Role-Based UI**: Interface adapts based on admin role
- **Real-time Updates**: Statistics and data refresh automatically
- **User-Friendly**: Intuitive navigation and clear visual feedback

## Navigation

The sidebar navigation adapts based on role:
- **Super Admin**: Full access to all features
- **Admin**: Limited to local house management features

All pages are protected with authentication and role-based access control.

## Getting Started

1. Login with admin credentials
2. Dashboard automatically detects your role
3. Navigate to desired section via sidebar
4. Use filters and actions as needed based on your role

## Notes for Backend Implementation

The dashboard expects these backend endpoints to be implemented:
- All CRUD operations for events, chats, livestreams
- Participant listing with filters
- Leaderboard calculation with different scopes
- Event inscription management
- Attendance tracking

Ensure backend endpoints respect role-based access:
- Super Admin endpoints return all data
- Admin endpoints filter by `youth_house_id` associated with the admin

