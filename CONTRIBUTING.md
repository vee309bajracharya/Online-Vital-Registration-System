## 🤝 Contributing to Online Vital Registration System

Thank you for your interest in contributing to the **Online Vital Registration System**! Your help is crucial to complete the Death and Migration Registration modules, and maintain the existing Birth Registration module.

Following these guidelines ensures a smooth process for everyone involved and helps us review your contributions efficiently.

### 📝 Code of Conduct

Please note that this project is governed by a **Code of Conduct**. By participating, you are expected to uphold this code. Please report unacceptable behavior to @vee309bajracharya.

### 🚨 How to Report Bugs and Suggest Features

Before submitting a Pull Request, please check the existing **GitHub Issues**.

* **Bugs:** If you find a bug in the existing **Birth Registration** workflow, please open a new Issue, clearly describing the problem. Include steps to reproduce the issue, and detail the expected vs. actual results.
* **New Features:** For major work, such as implementing the **Death** or **Migration** Registration modules, check if an issue already exists. If not, open a new Issue to discuss the feature's scope and design before writing significant code.

We encourage newcomers to look for Issues labeled **`good first issue`** or **`help wanted`**!

### 🏗️ Contribution Workflow

We use the standard **Fork & Pull Request** workflow.

1.  **Fork** the repository on GitHub.
2.  **Clone** your forked repository locally:
    ```bash
    git clone [https://github.com.com/YOUR_USERNAME/Online-Vital-Registration-System.git](https://github.com.com/YOUR_USERNAME/Online-Vital-Registration-System.git)
    ```
3.  **Install** dependencies (Backend & Frontend) using the instructions in the `README.md`.
4.  **Create a New Branch:** Base your work on the `main` branch. Name your branch descriptively (e.g., `feature/death-module-api`, `bug/fix-date-format`).
    ```bash
    git checkout -b feature/your-feature-name
    ```
5.  **Make Changes:** Implement your feature or bug fix. Ensure you test both the Laravel API endpoints and the React frontend components.
6.  **Commit Changes:** Write clear, descriptive commit messages. Follow the conventional format (e.g., `feat: Add endpoint for death certificate creation`).
    * *Good Example:* `fix: correct date format display on birth certificate preview`
    * *Bad Example:* `some changes`
7.  **Push** your branch to your fork on GitHub.
    ```bash
    git push origin feature/your-feature-name
    ```
8.  **Submit a Pull Request (PR):**
    * Go to the original repository on GitHub.
    * Open a new Pull Request comparing your branch to the **`main`** branch of the original repository.
    * In the description, reference the Issue you are solving (e.g., "Closes #123").
    * Describe the changes and the testing you performed.

### 💻 Development Guidelines

#### Backend (Laravel)

* **API Only:** All backend contributions must be implemented as **RESTful API endpoints** in `routes/api.php` and handled by Controllers.
* **Database:** Ensure any new features include appropriate **migration** files and, if necessary, seeders.
* **Testing:** Describe your testing steps (API requests, expected response, etc.) in your Pull Request.

#### Frontend (React JS)

* **Structure:** Follow the existing file structure in `src/pages` and `src/components`.
* **Validation:** Use the existing **Yup validation** patterns found in `src/components/validations`.
* **Context:** Utilize the `AuthContext` for user state management where necessary.

### 🔑 Initial Login Credentials

For local testing, the seeders automatically create the following users (see `database/seeders` for exact details):

| Role | Email | Password |
| :--- | :--- | :--- |
| **Default Admin** | `admin@gov.np` | `admin@123` |
For Citizen, Begin with Signup Process and Login to the account
For Officer Login, You can login either with EmployeeId or EmployeeEmail. The employee's id and email are based on the officer's municipality and ward role. You can check out it in **officer_profiles** Migration and **OfficerSeeder.php** Seeder files. Set your desired password for officers in .env
***
