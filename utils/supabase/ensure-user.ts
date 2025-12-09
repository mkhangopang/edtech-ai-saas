import { createBrowserClient } from '@supabase/ssr'

export async function ensureUserExists() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  try {
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      console.log('No authenticated user found')
      return { success: false, error: authError?.message || 'No user found' }
    }

    // Check if user exists in our users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('id', user.id)
      .single()

    if (userError) {
      // User doesn't exist in our table, but should be created by the trigger
      // Wait a moment and try again
      console.log('User profile not found, waiting for trigger to create it...')
      
      // Wait 1 second for the trigger to create the user
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Try again
      const { data: userDataRetry, error: userErrorRetry } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single()
      
      if (userErrorRetry) {
        console.error('User profile still not found after waiting')
        return { success: false, error: 'User profile not found' }
      }
      
      console.log('User profile found after waiting')
      return { success: true, created: false }
    } else {
      // User already exists
      console.log('User profile already exists')
      return { success: true, created: false }
    }
  } catch (error: any) {
    console.error('Error in ensureUserExists:', error)
    return { success: false, error: error.message }
  }
}