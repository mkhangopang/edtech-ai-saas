/**
 * Test script to verify user creation and document insertion fixes
 * 
 * This script tests the fixes for the 406 and 409 errors by:
 * 1. Ensuring the user exists in the users table
 * 2. Attempting to insert a document with proper foreign key references
 */

import { createBrowserClient } from '@supabase/ssr'

async function testUserCreation() {
  console.log('Testing user creation and document insertion...')
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  try {
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      console.log('❌ No authenticated user found')
      return
    }
    
    console.log('✅ Authenticated user found:', user.email)
    
    // Check if user exists in users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, email, full_name, credits')
      .eq('id', user.id)
      .single()
    
    if (userError) {
      console.log('⚠️ User not found in users table, creating...')
      
      // Create user profile
      const { error: insertError } = await supabase
        .from('users')
        .insert([
          {
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || '',
            credits: 10,
          }
        ])
      
      if (insertError) {
        console.log('❌ Failed to create user profile:', insertError.message)
        return
      }
      
      console.log('✅ User profile created successfully')
    } else {
      console.log('✅ User profile found:', userData)
    }
    
    // Test document insertion
    console.log('🧪 Testing document insertion...')
    
    const testDocument = {
      user_id: user.id,
      title: 'Test Document',
      file_url: 'https://example.com/test.pdf',
      file_path: 'test/test.pdf',
    }
    
    const { data: docData, error: docError } = await supabase
      .from('documents')
      .insert([testDocument])
      .select('id')
      .single()
    
    if (docError) {
      console.log('❌ Document insertion failed:', docError.message)
      return
    }
    
    console.log('✅ Document inserted successfully with ID:', docData.id)
    
    // Clean up - delete test document
    const { error: deleteError } = await supabase
      .from('documents')
      .delete()
      .eq('id', docData.id)
    
    if (deleteError) {
      console.log('⚠️ Failed to clean up test document:', deleteError.message)
    } else {
      console.log('🧹 Test document cleaned up successfully')
    }
    
    console.log('🎉 All tests passed!')
  } catch (error: any) {
    console.log('❌ Test failed with error:', error.message)
  }
}

// Run the test
testUserCreation()