#!/bin/bash

# Check if commit message is provided
if [ -z "$1" ]; then
  echo "❌ Please provide a commit message."
  exit 1
fi

# Git workflow
git add .
git commit -m "$1"
git push
