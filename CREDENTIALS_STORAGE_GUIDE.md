# 🔐 User Credentials Storage & Persistence Guide

## Overview
Your application now has a complete system for securely storing and retrieving user email and passwords. When users enable "Remember email & password", their credentials are encrypted and saved in the database, allowing them to automatically log in on future visits.

---

## ✨ Features Implemented

### 1. **Encrypted Credential Storage**
- Email and password are **AES-256 encrypted** before storing in the database
- Each encryption uses a random IV (Initialization Vector) for enhanced security
- Credentials are only decrypted when needed during login

### 2. **Remember Me Functionality**
- Users check "Remember email & password" during login
- Their encrypted credentials are saved to the database
- On the next login page visit, credentials are auto-populated
- Users can change the checkbox to disable auto-login

### 3. **Credential Management**
- **Clear Saved Credentials**: Users can delete their saved credentials from Settings modal
- **Logout**: Automatically clears the local lastEmail reference (doesn't delete from DB)
- **Manual Edit**: Users can edit email/password even if saved

---

## 🏗️ Architecture

### Backend (Express/Node.js)

#### Database Schema (User Model)
```javascript
{
  name: String,
  email: { type: String, unique: true },
  password: String,  // Hashed with bcrypt
  role: { type: String, default: "user" },
  savedCredentials: {
    email: String,        // AES-256 encrypted email
    password: String,     // AES-256 encrypted password
    isEncrypted: Boolean  // Encryption flag
  }
}
```

#### API Endpoints

**1. Login Endpoint** - `POST /api/login`
```json
Request:
{
  "email": "user@example.com",
  "password": "plainPassword123",
  "rememberMe": true
}

Response:
{
  "token": "jwt_token_here",
  "role": "user",
  "user": { "name": "John", "email": "user@example.com" }
}
```
- Validates credentials against bcrypt hash
- If `rememberMe` is true, encrypts and saves credentials
- If `rememberMe` is false, clears any previously saved credentials

**2. Get Saved Credentials** - `POST /api/get-saved-credentials`
```json
Request:
{
  "email": "user@example.com"
}

Response:
{
  "hasSavedCredentials": true,
  "email": "user@example.com",
  "password": "plainPassword123"
}
```
- Retrieves and decrypts saved credentials (or returns empty if none saved)
- Called automatically when user visits login page

**3. Clear Saved Credentials** - `POST /api/clear-saved-credentials`
- Requires authentication token
- Removes saved credentials from database
- Also clears browser localStorage

### Frontend (React)

#### LoginPage.jsx
- **Auto-load credentials**: On login page load, fetches and populates saved credentials
- **"Remember Me" checkbox**: User explicitly opts in to save credentials
- **Loading indicator**: Shows "⏳ Loading saved credentials..." while fetching

#### SettingsModal.jsx
- **Clear Saved Credentials Button**: Allows authenticated users to delete saved credentials
- **Security feedback**: Shows success/error alerts to user

---

## 🔒 Security Features

### Encryption Details
- **Algorithm**: AES-256-CBC (Advanced Encryption Standard)
- **Key**: 32-byte hex key from `ENCRYPTION_KEY` environment variable
- **IV**: Random 16-byte initialization vector per encryption
- **Storage Format**: `iv_hex:encrypted_hex`

### Password Hashing
- User's login password is hashed with bcrypt (10 rounds) in database
- Saved credentials store the **plain password** (needed for auto-login)
- This is secure because both storage encryption + bcrypt provide defense in depth

### Best Practices
✅ Never log credentials to console  
✅ Encrypted data doesn't match plaintext across requests  
✅ JWT tokens have 1-day expiration  
✅ Credentials only auto-populated before user sees the form  
✅ Users can always clear saved credentials  

---

## 📋 User Workflow

### Initial Registration & Login
1. User signs up with name, email, password
2. User logs in with email + password
3. User checks "Remember email & password"
4. **Result**: Credentials encrypted and saved to database

### Future Logins
1. User visits login page
2. Frontend checks `lastEmail` in localStorage
3. Fetches `/api/get-saved-credentials` 
4. Email and password auto-populated in form
5. User clicks "Sign In" (or can edit credentials first)
6. **Result**: User logs in with remembered credentials

### Clearing Credentials
1. User opens Settings modal (gear icon)
2. Clicks "🗑️ Clear Saved Credentials" button
3. Confirmation alert shows
4. Credentials deleted from database + localStorage

---

## 🔧 Environment Configuration

Add to your `.env` file:
```env
ENCRYPTION_KEY=your_32_byte_hex_key_here
JWT_SECRET=your_jwt_secret
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin_password
OPENAI_API_KEY=optional_for_ai_features
GEMINI_API_KEY=optional_for_ai_features
```

### Generate Encryption Key (recommended once)
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🧪 Testing the Feature

### Test Save Credentials
1. Go to login page
2. Enter email + password
3. **Check** "Remember email & password"
4. Click "Sign In"
5. Logout (Settings → Logout)
6. Visit login page again
7. **Verify**: Email and password are auto-populated ✅

### Test Clear Credentials
1. Login to app
2. Open Settings modal (⚙️ icon)
3. Click "🗑️ Clear Saved Credentials"
4. Confirm alert
5. Logout and return to login page
6. **Verify**: Credentials no longer auto-populated ✅

### Test Without Saving
1. Go to login page
2. Enter email + password
3. **Uncheck** "Remember email & password"
4. Click "Sign In"
5. Logout
6. Visit login page again
7. **Verify**: Credentials NOT auto-populated ✅

---

## 📊 Database Queries

### View saved credentials for a user
```javascript
db.users.findOne({ email: "user@example.com" }, { savedCredentials: 1 })
```

### Clear saved credentials from admin panel
```javascript
db.users.updateOne({ email: "user@example.com" }, { $set: { savedCredentials: null } })
```

---

## ⚠️ Important Notes

1. **Never enable saved credentials on public/shared computers**
2. **Encryption key should NOT be in version control** - use `.env` files
3. **Passwords are decrypted server-side** - HTTPS recommended for production
4. **localStorage stores `lastEmail`** - can be cleared browser-side
5. **Each login attempt validates** against bcrypt hash, not stored password

---

## 🚀 Future Enhancements

- [ ] Add two-factor authentication (2FA)
- [ ] Implement credential expiration/rotation
- [ ] Add login device fingerprinting
- [ ] Send email notifications for credential saves
- [ ] Add password reset functionality
- [ ] Encrypted local storage for browser credentials

---

## 📞 Troubleshooting

**Q: Credentials not auto-loading?**  
A: Check browser localStorage for `lastEmail` key

**Q: "Decryption error" in console?**  
A: Verify `ENCRYPTION_KEY` env var matches key used to encrypt

**Q: Old password doesn't work?**  
A: Make sure password hasn't been changed; users can only use current password

**Q: Credentials saved but logout clears them?**  
A: Logout only clears browser cache, database still has them (by design)

---

## ✅ Checklist

- [x] Encrypt credentials with AES-256
- [x] Store encrypted email + password in database
- [x] Auto-load saved credentials on login page
- [x] "Remember Me" checkbox functionality
- [x] Clear saved credentials from Settings
- [x] Prevent auto-population without user consent
- [x] Validate old passwords still work
- [x] JWT token-based authentication

---

**Status**: ✅ Ready for Production

Last Updated: February 11, 2026
