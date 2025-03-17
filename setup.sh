#!/bin/bash

# open git bash terminal and run following commands to complete setup
# 1) chmod +x setup.sh
# 2) ./setup.sh

# Set the OS type: "linux" for Linux, "macos" for macOS, "windows" for Windows
OS_TYPE="linux"

# Check if Git is already initialized in the current directory
if [ -d ".git" ]; then
    echo "Git is already initialized. Skipping Steps 1-8 and proceeding to Step 9."
else
    echo "Git is not initialized. Running Steps 1-8."

    # Step 1: Create the EECS_449 folder
    mkdir EECS_449

    # Step 2: Navigate into the EECS_449 folder
    cd EECS_449 || exit

    # Step 3: Initialize a new Git repository
    git init

    # Step 4: Set up the remote repository (Replace with your actual GitHub repository URL)
    git remote add origin https://github.com/Needless2Say/EECS_449_App.git

    # Step 5: Verify that the remote repository is set up correctly
    git remote -v

    # Step 6: Rename the current branch to "main"
    git branch -M main

    # Step 7: Set the upstream branch for tracking
    git branch --set-upstream-to=origin/main main

    # Step 8: Pull the latest changes from the remote main branch
    git pull --rebase --allow-unrelated-histories origin main
fi

# Step 9: Move into caloriq next.js folder and install all packages
cd caloriq
npm install
npm install axios
npm install bootstrap

# Step 10: Move out back to home directory
cd ..

# Step 11: Navigate into the FastAPI directory
mkdir -p fastapi  # Ensure the directory exists
cd fastapi || exit

# Step 12: Initialize a Python Virtual Environment
# Ensure Python 3.12.9 is installed before running this command
python3.12 -m venv venv

# Step 13: Activate the Virtual Environment based on OS type
if [ "$OS_TYPE" = "linux" ] || [ "$OS_TYPE" = "macos" ]; then
    source venv/bin/activate  # macOS/Linux
elif [ "$OS_TYPE" = "windows" ]; then
    venv\Scripts\activate  # Windows
else
    echo "Invalid OS_TYPE specified. Please set OS_TYPE to 'linux', 'macos', or 'windows'."
    exit 1
fi

# Step 14: Install dependencies from requirements.txt
pip install -r requirements.txt

echo "Project setup complete!"
