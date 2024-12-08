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
- `/src` contains most of the source code. 
   - `/app` include the pages and each folder under it represents the separate pages. 
      - `/page.tsx` corresponds to the main page of the app when logged in.
      - Subfolders indicate the primary page associated with features:
         - `/workflow`, for example, corresponding to all the pages for workflow and can be
access using `localhost:3000/workflows`, and subpage like `/onboarding`
      - Other auxillary folders utilized for styling(`/globals.css`), specifying website layout(`/layout`), and more.
   - `/components` include commonly used react component throughout the frontend. Subfolders within the `/components` indicate feature-based organization of components(`/tasks` for example) or `/general` corresponding to components not just designed with one feature in mind.
   - `/hooks` corresponding to commonly utilized frontend React functions across the Next.js app. In this case, `/useAuth.tsx` to access the logged in user.
   - `/util` corresponding to useful general utilies like universal types(`/ZodTypes.ts`), the api-path(`/api-path.ts`), and more.
- `/public/icons` contains icons utilized throughout the app like `/task-edit.svg` which is the icon shown for editing a task
- Auxillary configuration files like `/package.json` for app dependencies, `/tailwind.config.ts` for TailwindCSS, and more.

## Workflow
user can create a workflow by clicking `Create Workflow` button and inputing corresponding field, then assign to next assignee,
then the next assignee will have the workflow displayed at their end, with all the fields being
filled properly from the previous person. user can view the workflow being assigned to them by inputing url like
`localhost:3000/workflows/onboarding/100` or click the detail button. After reviewing the workflow, user can also approve it, which 
will mark related workflow as completed, and take changes on the db.\
User can also archive the workflow to make a clean view by clicking the archive button.

## Tasks
User can toggle between personal tasks and employee tasks(if they are a manager). Then they can assign tasks to themselves(or employees) via the plus button on the bottom right. They can delete a task by clicking the trash can icon on the right end of a task card. Tasks can also be edited by clicking the pencil icon on the right end of a task card. Task information synchronizes seamlessly across managers and subordinates.