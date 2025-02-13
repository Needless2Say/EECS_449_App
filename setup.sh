#!/bin/bash

# Step 1: Create the EECS_449 folder
mkdir EECS_449

# Step 2: Navigate into the EECS_449 folder
cd EECS_449 || exit

# Step 3: Create a Next.js application named "caloriq" using all defaults
npx create-next-app@latest caloriq --use-npm --typescript <<< $'\n'

# Step 4: Navigate into the "caloriq" folder
cd caloriq || exit

# Step 5: Remove the default .gitignore file (custom one will be pulled later)
rm -f .gitignore

# Step 6: Move back to the EECS_449 folder
cd ..

# Step 7: Initialize a new Git repository
git init

# Step 8: Set up the remote repository (Replace with your actual GitHub repository URL)
git remote add origin https://github.com/Needless2Say/EECS_449_App.git

# Step 9: Verify that the remote repository is set up correctly
git remote -v

# Step 10: Rename the current branch to "main"
git branch -M main

# Step 11: Set the upstream branch for tracking
git branch --set-upstream-to=origin/main main

# Step 12: Pull the latest changes from the remote main branch
git pull --rebase --allow-unrelated-histories origin main

# Step 13: Navigate into the FastAPI directory
mkdir -p fastapi  # Ensure the directory exists
cd fastapi || exit

# Step 14: Initialize a Python Virtual Environment
# Ensure Python 3.12.9 is installed before running this command
python3.12 -m venv venv

# Step 15: Activate the Virtual Environment
source venv/bin/activate  # macOS/Linux
# venv\Scripts\activate  # Windows (uncomment if running on Windows)

# Step 16: Install dependencies from requirements.txt
pip install -r requirements.txt

echo "Project setup complete!"
