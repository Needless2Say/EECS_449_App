# Project Setup Guide

## Getting Started

Follow the instructions below to set up the project structure.

### 1. Create the Project Directory

```bash
mkdir EECS_449
```

### 2. Navigate into the Project Directory

```bash
cd EECS_449
```

### 3. Set Up the Next.js Application

Run the following command to create a Next.js application. When prompted, name the app **"caloriq"** and press the **Enter** key for all options to use the default settings.

```bash
npx create-next-app@latest
```

### 4. Navigate into the Next.js Application Directory

```bash
cd caloriq
```

### 5. Remove the Default `.gitignore` File

Since a custom `.gitignore` file will be used from the main repository, delete the default one:

```bash
rm -f .gitignore
```

### 6. Move Back to the Main Project Directory

```bash
cd ..
```

### 7. Initialize a Local Git Repository

```bash
git init
```

### 8. Set Up the Remote Repository

Replace **"Needless2Say"** with your GitHub username in the following command:

```bash
git remote add origin https://github.com/Needless2Say/EECS_449_App.git
```

### 9. Verify the Remote Repository Connection

```bash
git remote -v
```

### 10. Set the Main Branch

```bash
git branch -M main
```

### 11. Track the Remote Main Branch

```bash
git branch --set-upstream-to=origin/main main
```

### 12. Pull the Latest Changes from the Remote Main Branch

```bash
git pull
```

### 13. Navigate into the FastAPI Directory

```bash
cd EECS_449/fastapi
```

### 14. Initialize a Python Virtual Environment

Ensure you have Python **3.12.9** installed, then create and activate a virtual environment:

```bash
python3.12 -m venv venv
source venv/bin/activate  # For macOS/Linux
venv\Scripts\activate  # For Windows
```

### 15. Install Dependencies from `requirements.txt`

```bash
pip install -r requirements.txt
```

---

## Next Steps

Once the setup is complete, you can start developing by navigating into the `caloriq` directory and running the Next.js development server:

```bash
cd caloriq
npm run dev
```

This will start the application locally at `http://localhost:3000/`.

---

## Troubleshooting

If you encounter any issues while pulling from the remote repository, try running:

```bash
git pull --rebase --allow-unrelated-histories origin main
```

If you need further assistance, reach out to the repository maintainers.

Happy coding! 🚀

