# 📚 PaperVault — Class Exam Sets Vault & Daily Practice Hub

A collaborative web application designed for separated classes (Set A, Set B, Set C, Set D) to upload, track, and practice daily exam question papers together.

---

## ⚡ Quick Start for GitHub & Vercel Deployment

### 1. Push to GitHub
```bash
# 1. Initialize git
git init

# 2. Stage and commit files
git add .
git commit -m "Initial commit: PaperVault"

# 3. Rename branch to main
git branch -M main

# 4. Add your GitHub repository remote and push
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

---

### 2. Deploy to Vercel (1-Click)
1. Go to **[vercel.com](https://vercel.com)** and log in with your GitHub account.
2. Click **"Add New..."** -> **"Project"**.
3. Import your GitHub repository.
4. (Optional) In **Environment Variables**, add:
   - `VITE_SUPABASE_URL` = Your Supabase Project URL
   - `VITE_SUPABASE_ANON_KEY` = Your Supabase Public Anon Key
5. Click **"Deploy"**!

---

### 3. Setup Free Supabase Cloud Database (5 Seconds)
1. Go to **[supabase.com](https://supabase.com)** and create a free project.
2. Open the **SQL Editor** in your Supabase Dashboard.
3. Open `supabase-schema.sql` from this repo, copy all the SQL, paste and click **Run**.
4. Go to **Project Settings -> API** and copy:
   - **Project URL**
   - **Project API Anon Key**
5. Either add them to Vercel Environment Variables, or click the **Cloud icon ☁️** in PaperVault's navbar to paste them directly in the UI!

---

## 🌟 Key Features
- **Daily Exam Sets Tracker**: Live board showing today's exam status for Set A, B, C, and D.
- **Missing Set Alert**: Instant notification and 1-click WhatsApp request if any classmate hasn't uploaded their set.
- **Practice All 4 Sets**: Consolidated practice hub combining questions from all 4 sets with checklist tracking.
- **Other Question Papers**: Dedicated repository for model papers, unit tests, supplementary exams, and lab practicals.
- **Scanned Photo & PDF Uploads**: High-resolution image viewer with zoom, rotation, and direct downloads.
- **Offline & Cloud Sync**: Seamless synchronization with Supabase and fast local IndexedDB caching.
