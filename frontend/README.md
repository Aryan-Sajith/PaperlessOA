# PaperlessOA

Office Automation software for CS520

---

## Project Setup

### Prerequisites
- **Node.js**: Make sure you have Node.js version >= 18.18.0 installed.
  - Check your version with:
    ```bash
    node -v
    ```

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. **Install Dependencies**:
   ```bash
   npm config set legacy-peer-deps true # needed for react-select
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
## File Structure
`/src` contains most of the source code. \
`/app` include the pages and each folder under it represents the separate pages, for example. 
`/workflow` corresponding to all the pages for workflow and can be
access using `localhost:3000/workflows`, and subpage like `/onboarding`\
`/components` include commonly used react component through the frontend, such as emoloyee drop down\

## Workflow
user can create a workflow by clicking `Create Workflow` button and inputing corresponding field, then assign to next assignee,
then the next assignee will have the workflow displayed at their end, with all the fields being
filled properly from the previous person. user can view the workflow being assigned to them by inputing url like
`localhost:3000/workflows/onboarding/100` or click the detail button. After reviewing the workflow, user can also approve it, which 
will mark related workflow as completed, and take changes on the db.\
User can also archive the workflow to make a clean view by clicking the archive button.