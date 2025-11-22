# 🇳🇵 Online Vital Registration System

Vital Registration System is a web application designed to simplify and digitize the process of vital registration (Birth, Death, Migration) for Nepali citizens and government officers. It aims to provide an efficient, secure, and user-friendly platform for submitting, reviewing, and approving vital records online.

The **Birth Registration** process is fully accomplished, including user submission and officer approval/rejection workflows. The primary goal of open-sourcing this project is to collaborate with the community to implement the **Death Registration** and **Migration Registration** modules, as well as resolve minor bugs in the existing system.

## ✨ Project Status

**Birth Registration** - fully implemented

**Death Registration** - Planned yet not started

**Migration Registration** - Planned yet not started

**User Role as Officers** - officer details of only 3 districts municipalities and its ward, still other districts and their municipalities are to be added

**Admin** - planned for it (as the Admin will manage all the officers in districts and their details) and did some code on AdminOfficerController - not the front-end yet

**Responsive** - still yet to be done for whole front-end


## 📚 Key Features

* **User Authentication & Authorization**
    * Separate login/roles for Citizens, Registering Officers, and Admin
* **Phone Number Verification (via OTP received on Mail)**
    * Implemented on platform Mailtrap 
* **Birth Registration Process**
    * Before User submits Birth Registration form , they must verify their Phone Number
    * Once Form is Submitted, the Form automatically sets to PENDING status and can preview the Birth Certificate
    * Certificate Review Modal for Ward BirthOfficers
    * Approval/Rejection Workflow
* **Geographical Structure**
    * Database models for Districts and Municipalities/Wards
    * Currently, Available Districts: Bhaktapur, Kathmandu and Lalitpur and their respectives TotalWards are included
    * Each ward officers are given Employee_id based on their role
* **RESTful API** (Laravel Backend)
    * Tested routes on Postman 

## 🛠️ Tech Stack
This project uses a standard LAMP/MERN stack hybrid architecture.

| Component | Technology | Badge |
| :--- | :--- | :--- |
| **Backend** | **Laravel** | ![Laravel](https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white) |
| **Frontend** | **React JS** | ![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white) ![Context-API](https://img.shields.io/badge/Context--Api-000000?style=for-the-badge&logo=react)|
| **Database** | **MySQL** | ![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white) |
| **API Testing** | **Postman** |  ![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white) |
| **Validation** | **Yup** | ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black) |

## ⚙️ Prerequisites

Before you begin, ensure you have the following software installed on your system.

* **Development Environment:** Laragon (Recommended) or a similar environment with PHP, Composer, and MySQL. ![Laragon](https://img.shields.io/badge/Laragon-00ADD8?style=for-the-badge&logoColor=white&logo=laragon)
* **Version Control:** ![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
* **PHP Dependency Manager:** ![Composer](https://img.shields.io/badge/Composer-885630?style=for-the-badge&logo=composer&logoColor=white)
* **Frontend Tools:** ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)

## 🚀 Project Installation 
## Backend Setup (Using Laragon)
Follow these steps to get **Online Vital Registration System** running on your local machine.

### 1. Clone the Repository

Clone the project to your computer's `laragon/www` directory.

```bash
cd C:\laragon\www
git clone [https://github.com/YOUR_USERNAME/Online-Vital-Registration-System.git](https://github.com/YOUR_USERNAME/Online-Vital-Registration-System.git)
cd Online-Vital-Registration-System
```
### 2. Install PHP & Node Dependencies
Open the terminal within the Online Vital Registration System folder and change directory to back-end and run the following commands:

```bash
composer install
npm install
npm run dev
```

### 3. Configure Environment File
Create your environment file from the example provided.
```bash
cp .env.example .env
php artisan key:generate
```
Now, open the newly created .env file and update the variables to match your settings

### 4. Run Database Migrations and Seeders
Create a database in your Laragon environment with the name you specified (example: vital_reg_system). Then, run the migration and seeder command to create the database tables and seed the initial data.
```bash
php artisan migrate --seed
```
### Frontend Setup
Open the terminal within the Online Vital Registration System folder and change directory to front-end and run the following commands:
```bash
npm install
npm run dev
```
This will install all React dependencies and start the Vite development server.

### Run the Application
The Laravel API should be running on your virtual host (e.g., http://vital-regist.test), or you can run back-end as **php artisan serve** as well
and the React frontend will be running on a separate port (usually http://localhost:5173).
