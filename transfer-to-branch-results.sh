#!/bin/bash
git config --global init.defaultBranch main
rm -rf .git
git init

git config --local user.email "binsarjr121@gmail.com"
git config --local user.name "binsarjr"

git branch -m main
git checkout -b results
# Use the git merge --no-commit <source-branch> command to merge the changes from the source branch (the branch that currently has the folder) into the target branch. The --no-commit option prevents Git from automatically committing the changes, which will allow you to make additional changes before committing.
git merge --no-commit main
# Use the git reset HEAD <folder-name> command to unstage the folder changes.
git reset HEAD results
# Use the git checkout -- <folder-name> command to overwrite the folder changes in the target branch with the version from the source branch.
git checkout -- results