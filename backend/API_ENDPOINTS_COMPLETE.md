# Complete API Endpoints Documentation

## Overview
All endpoints are prefixed with `/api/admin` and require JWT authentication (`auth:admin` middleware).

## Authentication Endpoints

### POST `/api/admin/login`
Admin login

### POST `/api/admin/logout`
Admin logout

### GET `/api/admin/me`
Get authenticated admin profile

### POST `/api/admin/refresh`
Refresh JWT token

## Events Endpoints

### GET `/api/admin/events`
List all events with role-based filtering

**Query Parameters:**
- `type` - Filter by event type (national, local, online, hybrid)
- `attendance_type` - Filter by attendance type (online, in-person, hybrid)

**Role-Based:**
- Super Admin: All events
- Regular Admin: Only their events or local events

### POST `/api/admin/events`
Create new event

**Body:**
```json
{
  "title": "Event Title",
  "description": "Description",
  "type": "local",
  "attendance_type": "in-person",
  "date": "2025-11-15 10:00:00",
  "location": "Location",
  "price": 100.00,
  "has_price": true
}
```

**Role Restrictions:**
- Super Admin: Any type
- Regular Admin: Only local, in-person

### GET `/api/admin/events/{id}`
Get specific event

### PUT `/api/admin/events/{id}`
Update event

### DELETE `/api/admin/events/{id}`
Delete event

## Participants Endpoints

### GET `/api/admin/participants`
List all participants (users/participants from mobile app)

**Query Parameters:**
- `wilaya` - Filter by wilaya (province)

**Response includes:**
- id, nom, prenom, email, wilaya, commune, score, attended_events_count

### GET `/api/admin/participants/{id}`
Get specific participant details

### GET `/api/admin/participants/{id}/attendance`
Get participant's attendance history (events they attended)

## Leaderboard Endpoints

### GET `/api/admin/leaderboard`
Get leaderboard with different scopes

**Query Parameters:**
- `scope` - 'global', 'algeria', or 'wilaya'
- `wilaya` - Required if scope is 'wilaya'

**Response:**
```json
{
  "success": true,
  "data": {
    "leaderboard": [
      {
        "rank": 1,
        "user_id": 1,
        "nom": "Doe",
        "prenom": "John",
        "wilaya": "Alger",
        "score": 1000,
        "attended_events_count": 10
      }
    ]
  }
}
```

## Chats Endpoints

### GET `/api/admin/chats`
List all chats

**Query Parameters:**
- `event_id` - Filter by event

**Role-Based:**
- Super Admin: All chats
- Regular Admin: Only chats for their events

### POST `/api/admin/chats`
Create new chat

**Body:**
```json
{
  "title": "Chat Title",
  "description": "Description",
  "is_active": true,
  "event_id": 1
}
```

### PUT `/api/admin/chats/{id}`
Update chat

### DELETE `/api/admin/chats/{id}`
Delete chat

**Role-Based:** Admin can only manage their own chats

## Livestreams Endpoints

### GET `/api/admin/livestreams`
List all livestreams

**Query Parameters:**
- `event_id` - Filter by event

**Role-Based:**
- Super Admin: All livestreams
- Regular Admin: Only livestreams for their events

### POST `/api/admin/livestreams`
Create new livestream

**Body:**
```json
{
  "title": "Livestream Title",
  "description": "Description",
  "stream_url": "https://example.com/stream",
  "is_live": false,
  "event_id": 1
}
```

### PUT `/api/admin/livestreams/{id}`
Update livestream

### DELETE `/api/admin/livestreams/{id}`
Delete livestream

**Role-Based:** Admin can only manage their own livestreams

## Event Inscriptions Endpoints

### GET `/api/admin/event-inscriptions`
List all event inscriptions

**Query Parameters:**
- `event_id` - Filter by event
- `status` - Filter by status (pending, approved, rejected, attended)

**Role-Based:**
- Super Admin: All inscriptions
- Regular Admin: Only inscriptions for their events

### PATCH `/api/admin/event-inscriptions/{id}/status`
Update inscription status

**Body:**
```json
{
  "status": "approved"
}
```

**Allowed Status Values:**
- `approved`
- `rejected`

## Payments Endpoints

### GET `/api/admin/payments`
List all payments

**Query Parameters:**
- `event_id` - Filter by event
- `user_id` - Filter by user
- `status` - Filter by status (pending, completed, failed, refunded)
- `start_date` - Filter by start date (YYYY-MM-DD)
- `end_date` - Filter by end date (YYYY-MM-DD)

**Role-Based:**
- Super Admin: All payments
- Regular Admin: Only payments for their events

### GET `/api/admin/payments/{id}`
Get specific payment

### PATCH `/api/admin/payments/{id}/status`
Update payment status

**Body:**
```json
{
  "status": "completed"
}
```

**Allowed Status Values:**
- `completed`
- `failed`
- `refunded`

## Database Tables

### events
- id, title, description, type, attendance_type, date, location, admin_id, price, has_price, timestamps

### payments
- id, user_id, event_id, amount, status, payment_method, transaction_id, paid_at, timestamps

### event_inscriptions
- id, user_id, event_id, status, timestamps
- Unique constraint: (user_id, event_id)

### chats
- id, title, description, is_active, event_id, admin_id, timestamps

### livestreams
- id, title, description, stream_url, is_live, event_id, admin_id, timestamps

### users
- id, name, nom, prenom, email, password, wilaya, commune, score, attended_events_count, timestamps

## Role-Based Access Summary

### Super Admin
- ✅ Full access to all events (create any type)
- ✅ Full access to all participants
- ✅ Full access to all payments
- ✅ Full access to all chats/livestreams
- ✅ Full access to all inscriptions
- ✅ Can view global/Algeria/wilaya leaderboards

### Regular Admin (Youth House Director)
- ✅ Can only create/manage local, in-person events
- ✅ Can only see their own events (admin_id match)
- ✅ Can see all participants (can filter by wilaya)
- ✅ Can only see payments for their events
- ✅ Can only manage chats/livestreams for their events
- ✅ Can only manage inscriptions for their events
- ✅ Can view leaderboard (filtered by scope)

## Response Format

All successful responses:
```json
{
  "success": true,
  "message": "Optional message",
  "data": {
    ...
  }
}
```

All error responses:
```json
{
  "success": false,
  "message": "Error message",
  "errors": {
    "field": ["Validation errors"]
  }
}
```

## HTTP Status Codes

- `200` - Success
- `201` - Created
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (role-based access denied)
- `404` - Not Found
- `422` - Validation Error

