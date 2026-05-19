# Telegram-like UI Updates for New Bot

## Overview
Updated the new-bot frontend to match the old-bot's Telegram-like design and user flows from [OLD_BOT_DOCUMENTATION.md](../../OLD_BOT_DOCUMENTATION.md).

---

## Changes Made

### 1. New Telegram Components
**Location:** `frontend/src/components/telegram/`

#### TelegramButton.tsx
- Full-width button (matches Telegram button style)
- Variants: primary (blue), secondary (gray), danger (red), success (green)
- Telegram's standard button appearance

#### TelegramMessage.tsx
- Message card with icon and text
- Whitespace preservation for multi-line messages
- Blue-bordered design matching Telegram

### 2. Updated Pages

#### Home.tsx (Main Menu)
- **Before:** Card-based layout with descriptive text
- **After:** Telegram-like message display with role-based buttons
- **Features:**
  - Welcome message with user info
  - Role-based menu buttons (full width)
  - Role description with bullet points
  - Admin/Sales Manager/Developer specific options

#### ScheduleView.tsx (View Schedule)
- **Before:** Multi-step with standard buttons
- **After:** Telegram-style 3-step flow
- **Steps:**
  1. Developer selection (👨‍💻 buttons)
  2. Date selection (Today/Tomorrow/Custom)
  3. Schedule display with call list
- **Features:**
  - Quick shortcuts for Today/Tomorrow
  - Custom date picker
  - Formatted time display (HH:MM)
  - Call details display

#### BookCall.tsx (Set Up Call - 9 Steps)
- **Before:** Simplified 4-step flow
- **After:** Complete 9-step flow matching old-bot exactly
- **Steps:**
  1. **Developer Selection** - Choose developer (👨‍💻)
  2. **Date Selection** - Today/Tomorrow/Custom date
  3. **Time Selection** - HH:MM format input
  4. **Duration Selection** - 30 min / 1 hour / 1.5 hours (⏱)
  5. **Account Name** - Company/account name (📌)
  6. **Call Link** - Zoom/Meet URL (📎 optional)
  7. **Salary Fork** - Salary range (💰 optional)
  8. **Job Post Link** - Job posting URL (📄 optional)
  9. **Confirmation** - Review and book call

- **Features:**
  - Conflict detection (to be integrated)
  - Full input persistence across steps
  - Back navigation at every step
  - Skip buttons for optional fields
  - Error handling display

---

## Design System

### Colors (Telegram-inspired)
```
Primary (Blue):     #3B82F6 (TelegramButton variant="primary")
Secondary (Gray):   #9CA3AF (TelegramButton variant="secondary")
Success (Green):    #10B981 (TelegramButton variant="success")
Danger (Red):       #EF4444 (TelegramButton variant="danger")
Message BG:         #FFFFFF with border
```

### Button Style
- **Size:** Full width
- **Padding:** px-4 py-3
- **Font:** Medium weight
- **Border:** Rounded lg (8px)
- **Hover:** Color darkening
- **Disabled:** 50% opacity

### Message Style
- **Background:** White
- **Border:** 1px gray-200
- **Padding:** p-4
- **Border Radius:** rounded-lg
- **Text:** Preserves whitespace with `whitespace-pre-wrap`

### Emoji Usage (matching old-bot)
```
👤 User/Admin        📞 Call            🔔 Notifications
👨‍💻 Developer       📅 Date/Schedule    ⏱ Duration
🔐 Admin/Permissions ⏰ Time            🎯 Action
📌 Account/Title     📎 Link            💰 Salary
📄 Job Post          ⏳ Loading         ✅ Success
❌ Error             🔙 Back            🏠 Home
```

---

## Screens Implemented

### ✅ Admin Flow
- [x] Main Menu (Home.tsx) - Select Manage Developers/Access/Schedule
- [x] View Schedule - 3-step flow
- [ ] Manage Developers - List/Create/Edit (needs update)
- [ ] Manage Access - List/Add/Delete (needs update)

### ✅ Sales Manager Flow
- [x] Main Menu (Home.tsx)
- [x] Check Schedule - 3-step flow
- [x] Set Up Call - 9-step flow with all fields
- [ ] My Calls - List calls and suspend/delete (needs update)
- [ ] Toggle Notifications (needs update)

### ✅ Developer Flow
- [x] Main Menu (Home.tsx)
- [ ] My Schedule - View own calls (needs update)

---

## Still To Do

### Pages Needing Updates

1. **DeveloperManagement.tsx** (Admin)
   - List view with 📌 buttons for each developer
   - Developer detail view with notification toggle (🔔)
   - Create developer modal or step
   - Display format: Name, notification status

2. **AccessManagement.tsx** (Admin)
   - Three sections: Sales Managers, Admins, Grant Access
   - 👤 buttons for Sales Managers
   - 🔐 buttons for Admins
   - User details view (name, role, telegram_id, status)
   - Delete user confirmation

3. **MyCalls.tsx** (Sales Manager)
   - Date selection (Today/Tomorrow/Custom)
   - Show calls booked by current user only
   - ⏸️ buttons for each call
   - Suspension/delete confirmation
   - Two-step process: Select date → Select call → Confirm delete

4. **MySchedule.tsx** (Developer)
   - Read-only view of developer's scheduled calls
   - Date selection
   - Call details display
   - No actions available (read-only)

### Features Needing Integration

1. **Conflict Detection**
   - In BookCall step 4 (duration selection)
   - Show message if time slot unavailable
   - Display conflicting call details
   - Allow user to go back and choose different time

2. **Notifications**
   - Toggle button in menus
   - Status label (🔔 ON/OFF)
   - Update on click

3. **Backend Integration**
   - API calls for all new endpoints
   - Error handling with Telegram-like messages
   - Loading states with ⏳ emoji

### Styling Refinements

1. **Responsive Design**
   - Ensure buttons work on mobile (Telegram width constraint)
   - Test touch targets (minimum 44px)
   - Safe area insets for notch devices

2. **Accessibility**
   - ARIA labels on buttons
   - Keyboard navigation
   - Color contrast verification

3. **Loading States**
   - Show ⏳ in button text
   - Disable button during load
   - Loading spinner for full-screen loads

---

## Code References

### Components
- `TelegramButton` - Use for all action buttons
- `TelegramMessage` - Use for displaying information
- `Layout` - Wraps page content
- `Header` - Shows title at top

### Patterns
```tsx
// Message with icon
<TelegramMessage icon="📅">
  Select a date:
</TelegramMessage>

// Full-width button
<TelegramButton onClick={handleClick}>
  👨‍💻 Developer Name
</TelegramButton>

// Button variants
<TelegramButton variant="primary">   {/* Blue */}
<TelegramButton variant="secondary"> {/* Gray */}
<TelegramButton variant="success">   {/* Green */}
<TelegramButton variant="danger">    {/* Red */}

// Multi-line messages with line breaks
<TelegramMessage>
  Line 1
  {'\n\n'}
  Line 2
</TelegramMessage>
```

---

## Testing Checklist

### Home Page
- [ ] Shows correct menu for Admin
- [ ] Shows correct menu for Sales Manager
- [ ] Shows correct menu for Developer
- [ ] Display role description
- [ ] All buttons navigate correctly

### Schedule View
- [ ] Developer list loads
- [ ] Date selection works (Today/Tomorrow/Custom)
- [ ] Calls load for selected date
- [ ] Time format correct (HH:MM)
- [ ] Back buttons work at each step

### Book Call
- [ ] All 9 steps work correctly
- [ ] Data persists across steps
- [ ] Back navigation works
- [ ] Skip buttons for optional fields
- [ ] Confirmation displays all info
- [ ] Call creation successful
- [ ] Error messages display properly

### Other Pages
- [ ] Manage Developers matches design
- [ ] Access Management matches design
- [ ] My Calls flow matches old-bot
- [ ] Notifications toggle works
- [ ] All back buttons return to correct state

---

## Notes

1. **Button Width**: All TelegramButton components are full-width (w-full)
2. **Spacing**: Use `space-y-2` or `space-y-4` between button groups
3. **Messages**: Use TelegramMessage for informational text
4. **Icons**: Use emoji from list above consistently
5. **Colors**: Follow Telegram color scheme (blue primary)
6. **Step Navigation**: Always show option to go back
7. **Loading**: Show loading state during API calls
8. **Errors**: Display error messages in TelegramMessage with ❌ icon

---

## Next Steps

1. Update remaining pages (DeveloperManagement, AccessManagement, MyCalls, MySchedule)
2. Add conflict detection to BookCall
3. Integrate backend API calls
4. Add loading and error states
5. Test on mobile devices
6. Add keyboard navigation
7. Test accessibility

---

## Files Modified

- `frontend/src/pages/Home.tsx` - Updated
- `frontend/src/pages/ScheduleView.tsx` - Updated
- `frontend/src/pages/manager/BookCall.tsx` - Completely rewritten
- `frontend/src/components/telegram/TelegramButton.tsx` - Created
- `frontend/src/components/telegram/TelegramMessage.tsx` - Created
- `frontend/src/components/telegram/index.ts` - Created

## Files Needing Updates

- `frontend/src/pages/admin/DeveloperManagement.tsx`
- `frontend/src/pages/admin/AccessManagement.tsx`
- `frontend/src/pages/manager/MyCalls.tsx`
- `frontend/src/pages/developer/MySchedule.tsx`
