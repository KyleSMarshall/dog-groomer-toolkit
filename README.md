# Dog Groomer Toolkit

A full-stack scheduling and management tool for dog groomers — built with **React**, **AWS Amplify DataStore**, **AWS Lambda**, **AWS SNS**, **FullCalendar**, and **MUI DataGrid**.

I built this for my sister as a birthday present, who is a very talented dog groomer and works independently. Her one complaint was that there was no software available with an intuitive UI and calendar functionality that allowed her to manage human contacts, their associated dog contacts, and schedule appointments all in one relational database. Prior to building this, I had zero experience in AWS. I learned the Azure ecosystem from the ground up during my time at Axis. Axis provided me the opportunity and support to really dig into and explore Azure cloud solutions, and so I wore many hats during that time (solutions architect, MLOps pipeline developer, data scientist/engineer). I was excited to explore the similarities and differences between the AWS and Azure ecosystem as part of this project. Furthermore, I was excited to explore how quickly I could learn and leverage AWS to launch an end-to-end CRUD responsive (phone, PC, iPad) calendar webapp with offline availability and automated appointment text-message reminders. The entire project was completed, online, and delivered in 3 weeks.

---

## 📌 Overview

This app lets dog grooming businesses:

- 🐶 **Manage Clients & Dogs**: Create, edit, and delete records for dogs and their owners.
- 📅 **Schedule Appointments**: View and manage bookings in a modern calendar UI.
- 📊 **Analyze Data**: Use a rich table viewer with filters to find records quickly.

Built as a hands-on project to learn AWS Amplify, GraphQL models, and React from scratch.

---

## ⚙️ Tech Stack

- **Frontend**: React (Hooks, Context API, React Router)
- **Backend**: AWS Amplify DataStore (GraphQL models, offline-first sync)
- **UI Libraries**:
  - [Material UI](https://mui.com/) (DataGrid, Modals, Autocomplete)
  - [FullCalendar](https://fullcalendar.io/) for interactive scheduling
- **Date Utilities**: Day.js for formatting

---

## 🚀 Features

- Dynamic CRUD forms for Dogs, Clients, and Events
- Age calculation logic (date-of-birth ↔️ age input)
- Lookup dropdowns (Dogs linked to Clients)
- Inline field validation with visual error feedback
- Calendar view + DataGrid table view
- Success/error modals for user feedback

---

## 📂 Project Structure

  src
  - App.js # Main app & routing
  - models # Amplify auto-generated models
  - CustomDogForms.js # Create/Update Dog
  - CustomClientForms.js # Create/Update Client
  - DataViewer.js # MUI DataGrid view
  - CalendarView.js # FullCalendar view
  - App.css # Styles


## 📈 Roadmap / Improvements
- Clean up large files into reusable components
- Replace direct DOM style hacks with React state
- Add loading spinners for DataStore operations
- Add basic unit tests for helper logic
- Polish responsive styling
