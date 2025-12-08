import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/utils/supabase/server'
import pdfParse from 'pdf-parse'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Get user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { documentId } = await request.json()
    
    // Get document
    const { data: document, error: documentError } = await supabase
      .from('documents')
      .select('id, file_url, extracted_text')
      .eq('id', documentId)
      .eq('user_id', user.id)
      .single()
    
    if (documentError || !document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }
    
    // If text is already extracted, return early
    if (document.extracted_text) {
      return NextResponse.json({ message: 'Text already extracted' })
    }
    
    // Download PDF from Supabase storage
    const { data: fileData, error: fileError } = await supabase.storage
      .from('curricula')
      .download(document.file_url.split('/').pop())
    
    if (fileError || !fileData) {
      return NextResponse.json({ error: 'Failed to download PDF' }, { status: 500 })
    }
    
    // Extract text from PDF
    const arrayBuffer = await fileData.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const pdfData = await pdfParse(buffer)
    let extractedText = pdfData.text
    
    // Limit text length to prevent issues with large files
    if (extractedText.length > 100000) {
      extractedText = extractedText.substring(0, 100000)
    }
    
    // Update document with extracted text
    const { error: updateError } = await supabase
      .from('documents')
      .update({ extracted_text: extractedText })
      .eq('id', documentId)
    
    if (updateError) {
      return NextResponse.json({ error: 'Failed to update document' }, { status: 500 })
    }
    
    return NextResponse.json({ message: 'Text extracted successfully' })
  } catch (error) {
    console.error('PDF extraction error:', error)
    return NextResponse.json({ error: 'Failed to extract text from PDF' }, { status: 500 })
  }
}