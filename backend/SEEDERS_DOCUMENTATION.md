# Seeders Documentation

## Overview
The database seeders create sample data that showcases the difference between **Super Admin** and **Regular Admin** roles and their accessible data.

## Admin Accounts

### Super Admin
- **Email**: `super@admin.com`
- **Password**: `admin123`
- **Access**: Full access to all modules and data

### Regular Admin (Youth House Director)
- **Email**: `admin@admin.com`
- **Password**: `admin123`
- **Access**: Limited to local events and their assigned resources

## Seeded Data Summary

### Users (14 total)
- **4 users in Sétif** (Regular Admin's area)
- **10 users in other wilayas** (Alger, Oran, Constantine, Annaba, Blida, Tizi Ouzou)
- Users have varying scores (800-1500 points) and attendance counts (4-8 events)
- All users can participate in national/online events

### Events (8 total)

#### Super Admin Events (4 events)
1. **National Youth Conference 2025**
   - Type: National | Attendance: Hybrid
   - Price: 2000 DA
   - Location: Alger, Palais des Congrès

2. **Virtual Coding Workshop**
   - Type: Online | Attendance: Online
   - Price: 500 DA
   - Location: Online

3. **National Entrepreneurship Summit**
   - Type: National | Attendance: Hybrid
   - Price: 1500 DA
   - Location: Alger

4. **Online Mental Health Workshop**
   - Type: Online | Attendance: Online
   - Price: Free (has_price: false)

#### Regular Admin Events (4 events)
1. **Local Football Tournament**
   - Type: Local | Attendance: In-Person
   - Price: Free
   - Location: Youth House - Sétif

2. **Art & Crafts Workshop**
   - Type: Local | Attendance: In-Person
   - Price: 300 DA
   - Location: Youth House - Sétif

3. **Community Service Day**
   - Type: Local | Attendance: In-Person
   - Price: Free
   - Location: Various locations in Sétif

4. **Cooking Class - Traditional Recipes**
   - Type: Local | Attendance: In-Person
   - Price: 500 DA
   - Location: Youth House Kitchen - Sétif

### Event Inscriptions (42 total)

#### Super Admin Event Inscriptions (27)
- Users from different wilayas registered for national/online events
- Status distribution: Mix of pending, approved, rejected, and attended
- Multiple users per event (5-10 participants per event)

#### Regular Admin Event Inscriptions (15)
- Mainly Sétif users registered for local events
- Status distribution: Mix of pending, approved, and attended
- 3-8 participants per event

### Payments (18 total)

#### Super Admin Event Payments (14)
- Payments for national events with pricing
- Status: Mainly completed, some pending
- Payment methods: bank_transfer, cash, mobile_payment, credit_card
- Transaction IDs generated for completed payments

#### Regular Admin Event Payments (4)
- Payments for local events with pricing (Art & Crafts, Cooking Class)
- Status: Mix of completed and pending

### Chats (8 total)

#### Super Admin Chats (4)
1. National Conference Discussion (Active, linked to event)
2. Virtual Workshop Q&A (Active, linked to event)
3. National Events Hub (Inactive, linked to event)
4. General Community Chat (Active, no event)

#### Regular Admin Chats (4)
1. Local Events Chat (Active, linked to event)
2. Football Tournament Group (Active, linked to event)
3. Arts & Crafts Workshop (Active, linked to event)
4. Local House Chat (Active, no event)

### Livestreams (4 total)

#### Super Admin Livestreams (2)
1. National Conference Live Stream (Not live, linked to event)
2. Virtual Workshop Stream (Live, linked to event)

#### Regular Admin Livestreams (2)
1. Local Tournament Broadcast (Not live, linked to event)
2. Cooking Class Live (Live, linked to event)

## Role-Based Access Differences

### Super Admin Dashboard View

#### Events
- ✅ **See ALL events**: 4 Super Admin events + 4 Regular Admin events = **8 total**
- ✅ **Can create**: National, Online, Hybrid, and Local events
- ✅ **Can manage**: All events regardless of creator

#### Participants
- ✅ **See ALL registrations**: 27 Super Admin + 15 Regular Admin = **42 total**
- ✅ **Can filter by**: Any event (national/local), any wilaya

#### Users
- ✅ **See ALL users**: **14 total users** from all wilayas
- ✅ **Can filter by**: Any wilaya or commune

#### Payments
- ✅ **See ALL payments**: 14 Super Admin + 4 Regular Admin = **18 total**
- ✅ **Can manage**: All payments regardless of event

#### Chats
- ✅ **See ALL chats**: 4 Super Admin + 4 Regular Admin = **8 total**
- ✅ **Can manage**: All chats regardless of creator

#### Livestreams
- ✅ **See ALL livestreams**: 2 Super Admin + 2 Regular Admin = **4 total**
- ✅ **Can manage**: All livestreams regardless of creator

#### Inscriptions
- ✅ **See ALL inscriptions**: 27 Super Admin + 15 Regular Admin = **42 total**
- ✅ **Can manage**: All inscription statuses

#### Leaderboard
- ✅ **Can view**: Global, Algeria, or Wilaya scope
- ✅ **See all users** regardless of location

### Regular Admin Dashboard View

#### Events
- ❌ **Only see LOCAL events**: Only their 4 local events = **4 total**
- ✅ **Can only create**: Local, In-Person events
- ✅ **Can only manage**: Their own events (admin_id match)

#### Participants
- ❌ **Only see registrations for their events**: Only 15 registrations for local events
- ✅ **Can filter by**: Only their events, any wilaya

#### Users
- ✅ **See ALL users**: **14 total users** (no restriction)
- ✅ **Can filter by**: Any wilaya or commune

#### Payments
- ❌ **Only see payments for their events**: Only 4 payments for local events
- ✅ **Can only manage**: Payments for their events

#### Chats
- ❌ **Only see chats for their events**: Only 4 chats (their events + general chat)
- ✅ **Can only manage**: Their own chats

#### Livestreams
- ❌ **Only see livestreams for their events**: Only 2 livestreams for local events
- ✅ **Can only manage**: Their own livestreams

#### Inscriptions
- ❌ **Only see inscriptions for their events**: Only 15 inscriptions for local events
- ✅ **Can only manage**: Inscription statuses for their events

#### Leaderboard
- ✅ **Can view**: Global, Algeria, or Wilaya scope
- ✅ **See all users** (same as Super Admin)

## Testing the Differences

### To test Super Admin access:
1. Login with: `super@admin.com` / `admin123`
2. Navigate to Events → Should see **8 events**
3. Navigate to Participants → Should see **42 registrations**
4. Navigate to Payments → Should see **18 payments**
5. Navigate to Chats → Should see **8 chats**
6. Navigate to Livestreams → Should see **4 livestreams**

### To test Regular Admin access:
1. Login with: `admin@admin.com` / `admin123`
2. Navigate to Events → Should see **4 events** (only local)
3. Navigate to Participants → Should see **15 registrations** (only for their events)
4. Navigate to Payments → Should see **4 payments** (only for their events)
5. Navigate to Chats → Should see **4 chats** (their chats + general)
6. Navigate to Livestreams → Should see **2 livestreams** (only for their events)

## Key Differences Summary

| Feature | Super Admin | Regular Admin |
|---------|------------|---------------|
| **Events View** | All 8 events | Only 4 local events |
| **Event Creation** | Any type (national/online/hybrid/local) | Only local/in-person |
| **Participants View** | All 42 registrations | Only 15 (their events) |
| **Users View** | All 14 users | All 14 users |
| **Payments View** | All 18 payments | Only 4 (their events) |
| **Chats View** | All 8 chats | Only 4 (their chats) |
| **Livestreams View** | All 4 livestreams | Only 2 (their events) |
| **Inscriptions View** | All 42 inscriptions | Only 15 (their events) |
| **Leaderboard** | Global/Algeria/Wilaya | Global/Algeria/Wilaya |

## Running Seeders

### Fresh Migration + Seed
```bash
php artisan migrate:fresh --seed
```

### Seed Only (if tables exist)
```bash
php artisan db:seed
```

### Seed Individual Seeders
```bash
php artisan db:seed --class=EventSeeder
php artisan db:seed --class=EventInscriptionSeeder
php artisan db:seed --class=PaymentSeeder
php artisan db:seed --class=ChatSeeder
php artisan db:seed --class=LivestreamSeeder
```

## Notes

- All passwords are hashed using bcrypt
- Event dates are set to future dates (7-45 days from now)
- Payments are linked to events with pricing only
- Inscriptions include various statuses for testing approval/rejection workflows
- Users are distributed across different wilayas to test filtering
- Regular Admin's users are primarily from Sétif to simulate local youth house scenario

