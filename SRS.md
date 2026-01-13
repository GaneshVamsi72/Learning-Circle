## Project Title

**Private Group Learning Progress Tracker**

---

## Project Overview

A full-stack web application that helps a **small group of friends track and stay accountable for their learning progress** in a **private, controlled environment**.

The platform is **NOT public**, **NOT social media**, and **NOT a teaching platform**.
It is a **privacy-focused accountability tool** for committed learners.

---

## Core Concept

Users form **private learning groups** where each member’s **current learning progress is visible to the group**.
All group access is **admin-controlled** to ensure privacy and seriousness.

---

## Technology Constraints

* Backend: **Node.js + Express**
* Architecture: **MVC pattern strictly**
* Database: **MongoDB (Mongoose)**
* Frontend: **EJS templates (server-side rendering)**
* Authentication: **Session-based authentication**
* Styling: Simple CSS or Bootstrap (no frontend frameworks)
* No third-party auth (no Google login)

---

## Authentication Requirements

1. User Registration

   * Username
   * Email
   * Password (hashed)

2. User Login \& Logout
3. Protected routes using authentication middleware

---

## Group System Requirements

### Group Creation

* Any authenticated user can create a group
* Creator becomes **Group Admin**
* Each group has:

  * Group name
  * Unique invite code or invite link
  * Admin user

---

### Group Joining (IMPORTANT – MUST FOLLOW EXACTLY)

* **Users CANNOT join a group directly**, even with invite code or link
* When a user enters an invite code or visits invite link:

  * A **join request** is created
  * User is NOT added as a member yet

---

### Admin Controls (VERY IMPORTANT)

Only the **group admin** can:

* View pending join requests
* Approve a join request
* Reject a join request
* Remove (kick) any group member

No other member has these permissions.

---

## Learning Progress Tracking

Each **group member** must have **individual learning progress**, visible only to members of the same group.

### Learning Progress Fields

* Learning topic (e.g., “React Basics”)
* Resource link (YouTube / Course / Book)
* Total units (e.g., total videos or chapters)
* Completed units
* Deadline (date)
* Last updated date (auto)

---

### Daily Updates

* Members can update **only their own progress**
* Completed units are updated daily
* Remaining progress is auto-calculated
* Progress updates are visible to all group members

---

## Group Dashboard

Inside a group, members can:

* See a list of all members
* View each member’s:

  * Current topic
  * Progress (completed / total)
  * Deadline
  * Last update time

Admin additionally sees:

* Pending join requests section
* Remove member buttons

---

## Authorization Rules (CRITICAL)

* Only group members can view group dashboard
* Only admin can approve/reject/remove members
* Members can edit only their own learning progress
* Non-members cannot access group data

---

## Database Design (Expected)

### User

* username
* email
* password
* groupsJoined\[]

### Group

* name
* admin (userId)
* members \[userId]
* pendingRequests \[userId]
* inviteCode

### Progress

* userId
* groupId
* topic
* resourceLink
* totalUnits
* completedUnits
* deadline
* lastUpdated

---

## MVC Structure (MANDATORY)

```
models/
controllers/
routes/
views/
middlewares/
public/
```

* Models handle database logic
* Controllers handle request logic
* Routes only map URLs
* Views use EJS only

---

## MVP Scope 

❌ No chat
❌ No notifications
❌ No email system
❌ No analytics graphs
❌ No streaks

Focus ONLY on:

* Authentication
* Group control
* Progress tracking
* Privacy \& authorization

---

## Output Expectation

* Clean, readable code
* Clear separation of concerns (MVC)
* Working authentication \& authorization
* Simple UI (functionality > design)

---

## 

# 

