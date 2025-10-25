---
mode: agent
---

Commit and push all current changes to the git repository for the AI notes project. Follow these steps:

1. Check the current git status to see what files have been modified, added, or deleted
2. Explicitly list the modified and untracked files that will be added to the staging area (e.g., by parsing the output of `git status` or using `git ls-files --others --modified`)
3. Add all changes to the staging area using `git add .` and verify the staged changes by running `git status` to see what files were added
4. Create a commit with a descriptive message that summarizes the changes
5. Push the committed changes to the remote repository

Ensure the commit message is clear and follows conventional commit format when applicable. Verify that the push is successful and there are no conflicts.
