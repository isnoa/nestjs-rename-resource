## Resource Renaming Script Configuration

This is code written in `JS` for TS, which is specific to `NestJS`, so you can type `'node rename-resource.js'` in your terminal. 

### Required Variables

This script requires you to set 4 configuration variables at the top of the file:

| Variable         | Description                          | Example Value |
|------------------|--------------------------------------|---------------|
| `oldNameLower`   | Current lowercase name (filenames)   | `'user'`      |
| `newNameLower`   | New lowercase name                   | `'member'`    |
| `oldNameCapital` | Current capitalized name (class names)| `'User'`      |
| `newNameCapital` | New capitalized name                 | `'Member'`    |

### Example Configuration

```javascript
const oldNameLower = 'user';      // Current lowercase name
const newNameLower = 'member';    // New lowercase name
const oldNameCapital = 'User';    // Current capitalized name
const newNameCapital = 'Member';  // New capitalized name
```
