# Build a Production-Ready Survey Landing Page

You are a Senior Full Stack Engineer with 15+ years of experience building production SaaS applications.

Your task is to build a **beautiful, modern, mobile-first landing page** containing a questionnaire for online shop owners.

The purpose of this project is to collect market research before building a SaaS platform for e-commerce businesses.

The final result should be production-ready, scalable, and easy to extend.

---

# Tech Stack

Use exactly these technologies:

* Next.js 15 (App Router)
* React
* TypeScript
* Tailwind CSS
* shadcn/ui
* React Hook Form
* Zod
* Supabase
* Lucide React

Deploy on:

* Vercel

The project must run with:

```bash
npm install
npm run dev
```

without requiring any modifications.

---

# Project Structure

Organize the project professionally.

Example:

```text
app/
components/
components/ui/
hooks/
lib/
services/
types/
utils/
public/
styles/
```

Requirements:

* Clean architecture
* Reusable components
* Strong TypeScript typing
* No duplicated code
* Well commented
* Production-ready

---

# UI / UX Design

The landing page should have a premium SaaS appearance inspired by:

* Stripe
* Linear
* Vercel

Design requirements:

* Minimal
* Modern
* Mobile-first
* Fully responsive
* Beautiful typography
* Large whitespace
* Rounded cards
* Soft shadows
* Smooth animations
* Accessible
* Fast loading

Color palette:

Primary

#2563EB

Background

#F8FAFC

Cards

White

Buttons

Rounded

Animations

Subtle fade

Hover transitions

Smooth scrolling

Do NOT create a plain survey form.

The final result should look like a premium SaaS landing page.

---

# Landing Page

## Hero Section

Title

Help Us Build the Best Commerce Management Platform

Subtitle

This survey takes less than 5 minutes to complete.

Your feedback will directly influence the features we build for online businesses.

Primary Button

Start Survey

Clicking the button should smoothly scroll to the questionnaire.

---

# Survey

Display each section inside its own card.

Each card should include:

* Section title
* Short description
* Proper spacing

Use:

* Radio Groups for single-choice questions
* Checkbox Groups for multiple-choice questions
* Textareas for descriptive answers

Whenever "Other" is selected, automatically display a textarea.

---

# Progress

Display:

* Progress Bar
* Completion Percentage
* Current Question

Example:

35%

Question 7 of 20

Progress updates dynamically.

---

# Survey Questions

## Section 1 — Business Information

### 1. What type of products do you sell?

Radio

* Fashion & Clothing
* Shoes
* Beauty & Cosmetics
* Electronics
* Food & Beverage
* Home & Living
* Accessories
* Other

If "Other" is selected, display a textarea.

---

### 2. How many orders do you receive per day?

Radio

* Less than 5
* 5–20
* 20–50
* 50–100
* More than 100

---

### 3. How many people manage your business?

Radio

* Just me
* Two people
* Three to five people
* More than five

---

### 4. Which sales channels do you currently use?

Checkbox

* Instagram
* WhatsApp
* Website
* Facebook
* TikTok
* Etsy
* Amazon
* eBay
* Other

If "Other" is selected, show a textarea.

---

## Section 2 — Order Management Workflow

### 5. Where do most of your customers first contact you?

Radio

* Instagram DM
* WhatsApp
* Facebook Messenger
* Website Chat
* Email
* Phone
* Other

---

### 6. After a customer decides to buy, what is your first step?

Radio

* Check inventory
* Collect shipping information
* Send payment instructions
* Create the order
* Other

---

### 7. Where do you record customer orders?

Radio

* I don't record them
* Excel / Google Sheets
* Notebook
* CRM
* E-commerce Platform
* ERP
* Other

---

### 8. How do you manage inventory?

Radio

* Memory
* Spreadsheet
* Inventory software
* Website
* ERP
* Other

---

### 9. How do you confirm customer payments?

Radio

* Bank transfer verification
* Payment gateway
* PayPal
* Stripe
* Cash on delivery
* Other

---

### 10. What happens after payment is confirmed?

Checkbox

* Package the order
* Print invoice
* Create shipping label
* Send tracking number
* Update inventory
* Other

---

## Section 3 — Current Tools

### 11. Which tools do you use every day?

Checkbox

* Instagram
* WhatsApp
* Google Sheets
* Excel
* Shopify
* WooCommerce
* Etsy
* Amazon Seller
* Trello
* Notion
* Other

---

### 12. Approximately how many times per day do you switch between different apps?

Radio

* Less than 10
* 10–30
* 30–50
* More than 50

---

### 13. Approximately how many times do you copy and paste customer information each day?

Radio

* Less than 5
* 5–10
* 10–20
* More than 20

---

## Section 4 — Biggest Challenges

### 14. Which tasks consume the most time?

Checkbox

* Replying to customers
* Creating orders
* Managing inventory
* Confirming payments
* Shipping
* Customer support
* Reporting
* Marketing
* Content creation
* Other

---

### 15. Which problems have you experienced during the last week?

Checkbox

* Oversold products
* Lost orders
* Incorrect addresses
* Late shipping
* Missing payments
* Slow customer replies
* None
* Other

---

### 16. If you could completely eliminate one task from your daily work, which would it be?

Radio

* Replying to messages
* Creating orders
* Managing inventory
* Shipping
* Payment verification
* Reporting
* Other

---

## Section 5 — Software & Budget

### 17. Do you currently use any software to manage your business?

Radio

* Yes
* No

---

### 18. If yes, which software do you use?

Textarea

---

### 19. What is the biggest weakness of your current software?

Textarea

---

### 20. How much would you be willing to pay each month for software that automates most of your daily work?

Radio

* Less than $10
* $10–30
* $30–75
* $75–150
* More than $150

---

## Final Question

Please describe the last order you completed from beginning to end.

Start from the moment the customer contacted you until the order was shipped.

Use a large textarea.

Minimum length:

100 characters.

Display a live character counter.

---

# Validation

Use Zod.

Validate all required fields.

Display friendly validation messages.

Disable the Submit button until the form is valid.

---

# Auto Save

Automatically save responses to LocalStorage.

When the user returns, ask:

"Would you like to continue your previous survey?"

Allow restoring progress.

---

# Database

Use Supabase.

Create a table:

survey_responses

Schema:

* id (UUID)
* created_at (TIMESTAMP)
* answers (JSONB)

Store answers in JSON format.

Never access Supabase directly from React components.

Create:

* lib/supabase.ts
* services/surveyService.ts

---

# Server Actions

Use Next.js Server Actions (preferred) or Route Handlers.

Keep database logic on the server.

---

# Success Page

After submission, display a beautiful confirmation page.

Message:

Thank you for taking the time to complete our survey!

Your feedback has been successfully recorded and will help us build better tools for online businesses.

---

# Admin Dashboard

Create:

/admin

Protect it with an environment-variable password.

Features:

* Total Responses
* Response List
* View Individual Response
* Search
* Filter
* Export CSV

Export filename:

survey-responses.csv

---

# SEO

Include:

* Metadata
* Open Graph
* Twitter Cards
* Favicon

Title:

Online Store Owner Research Survey

Description:

Help us understand the biggest challenges online business owners face so we can build better software.

---

# Accessibility

Implement:

* Semantic HTML
* Keyboard navigation
* Proper labels
* ARIA attributes where appropriate
* WCAG-compliant color contrast

---

# Performance

* Use Server Components whenever possible.
* Lazy-load non-critical components.
* Optimize all images.
* Minimize client-side JavaScript.

---

# Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=

NEXT_PUBLIC_SUPABASE_ANON_KEY=

SUPABASE_SERVICE_ROLE_KEY=

ADMIN_PASSWORD=
```

---

# Deployment

Prepare for one-click deployment on Vercel.

Include a complete README explaining:

1. Install dependencies
2. Configure Supabase
3. Add environment variables
4. Run locally
5. Deploy to Vercel

---

# Final Deliverable

Generate a complete production-ready application.

Do not generate placeholder code, TODO comments, mock APIs, or unfinished components.

Everything should be fully functional, clean, scalable, and ready for deployment.
