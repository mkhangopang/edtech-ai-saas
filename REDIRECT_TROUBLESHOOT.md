# 🚨 Redirect Issue Troubleshooting Guide

## 🔍 Problem Analysis

The redirect from dashboard to generate page after PDF upload is failing in both environments. Based on code analysis, here are the potential issues:

### 1. Document Insertion Issue
In `app/dashboard/page.tsx` line 141:
```javascript
router.push(`/dashboard/generate?docId=${docData.id}`)
```

The `docData` might not be properly returned from the Supabase insert operation.

### 2. Supabase Query Issue
Lines 122-133 show the document insertion:
```javascript
const { data: docData, error: docError } = await supabase
  .from('documents')
  .insert([
    {
      user_id: authUser.id,
      title: file.name,
      file_url: publicUrl,
      file_path: fileName,
    },
  ])
  .select()
  .single()
```

The issue might be that `.select()` without specifying fields might not return the `id` properly.

## 🔧 Solutions

### Solution 1: Fix Document Insertion Query
Update the document insertion to explicitly select the id:

```javascript
const { data: docData, error: docError } = await supabase
  .from('documents')
  .insert([
    {
      user_id: authUser.id,
      title: file.name,
      file_url: publicUrl,
      file_path: fileName,
    },
  ])
  .select('id')  // Explicitly select the id
  .single()
```

### Solution 2: Add Error Handling for Missing docData
Add a check to ensure docData exists before redirecting:

```javascript
if (docData && docData.id) {
  router.push(`/dashboard/generate?docId=${docData.id}`)
} else {
  toast.error('Upload completed but redirect failed. Please click "Generate" button below.')
}
```

## 📋 Where to Paste OAuth URLs

### Supabase Dashboard Location:
1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **URL Configuration**
3. In the **Site URL** field, enter: `https://edtech-ai-saas.vercel.app`
4. In the **Redirect URLs** section, add:
   - `https://edtech-ai-saas.vercel.app/*`
   - `https://edtech-ai-saas-2gvb7lwoq-muhammad-khan-s-projects-0b0b82e6.vercel.app/*`
   - `https://edtech-ai-saas-jkp5skswc-muhammad-khan-s-projects-0b0b82e6.vercel.app/*`

### For Google OAuth (if using):
1. In the same **Authentication** section, go to **Providers**
2. Enable Google provider
3. Add authorized redirect URIs:
   - `https://edtech-ai-saas.vercel.app/auth/callback`
   - `https://edtech-ai-saas-2gvb7lwoq-muhammad-khan-s-projects-0b0b82e6.vercel.app/auth/callback`
   - `https://edtech-ai-saas-jkp5skswc-muhammad-khan-s-projects-0b0b82e6.vercel.app/auth/callback`

## 🛠️ Recommended Fix

Let's implement both solutions to ensure the redirect works properly.