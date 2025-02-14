# Project Setup Guide

## Getting Started

Follow the instructions below to set up the project structure.

### 1. Open Git Bash and Run the Setup Script

```bash
chmod +x setup.sh
./setup.sh
```

### 2. Set the OS Type

Before running the script, ensure the correct OS type is set:

- **Linux**: `OS_TYPE="linux"`
- **macOS**: `OS_TYPE="macos"`
- **Windows**: `OS_TYPE="windows"`

This ensures the correct commands are used when activating the virtual environment.

### 3. Git Initialization Check

If Git is **already initialized** in the repository (`.git` folder exists), the script **skips Steps 1-8** and moves directly to installing dependencies. Otherwise, it performs the full setup.

### 4. Project Setup Steps

#### Git Configuration (Steps 1-8)

```bash
mkdir EECS_449
cd EECS_449
git init
git remote add origin https://github.com/Needless2Say/EECS_449_App.git
git remote -v
git branch -M main
git branch --set-upstream-to=origin/main main
git pull --rebase --allow-unrelated-histories origin main
```

#### Install Next.js Application (Step 9)

```bash
cd caloriq
npm install
```

#### Move Back to the Home Directory (Step 10)

```bash
cd ..
```

#### FastAPI Setup (Steps 11-14)

```bash
mkdir -p fastapi
cd fastapi
python3.12 -m venv venv
```

#### Activate the Virtual Environment Based on OS Type (Step 13)

```bash
# Linux/macOS
source venv/bin/activate

# Windows
venv\Scripts\activate
```

#### Install Dependencies (Step 14)

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

If `pip install` is not using the correct Python environment, verify it with:

```bash
which python
which pip
pip -V
```

If you need further assistance, reach out to the repository maintainers.

Happy coding! 🚀
