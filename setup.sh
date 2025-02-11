#!/bin/bash

# make this bash file executable with the following command
# chmod +x setup_project.sh

# run the script via
# ./setup_project.sh


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
git remote add origin https://github.com/your-username/repository-name.git

# Step 9: Verify that the remote repository is set up correctly
git remote -v

# Step 10: Rename the current branch to "main"
git branch -M main

# Step 11: Set the upstream branch for tracking
git branch --set-upstream-to=origin/main main

# Step 12: Pull the latest changes from the remote main branch
git pull --rebase --allow-unrelated-histories origin main
