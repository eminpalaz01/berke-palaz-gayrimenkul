import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminAuth } from '@/lib/auth-helper'
import { promises as fs } from 'fs'
import path from 'path'
import { ApiResponse } from '@/types/api'

// POST /api/admin/config/upload - Upload a new config file
export async function POST(request: NextRequest) {
  // Check authentication
  const auth = await verifyAdminAuth(request)
  if (!auth.authenticated) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const targetPath = formData.get('path') as string

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    if (!targetPath) {
      return NextResponse.json(
        { success: false, error: 'Target path is required' },
        { status: 400 }
      )
    }

    // Security: Ensure path is within public/configs directory
    const normalizedPath = path.normalize(targetPath)
    if (!normalizedPath.startsWith('public/configs/') && !normalizedPath.startsWith('public\\configs\\')) {
      return NextResponse.json(
        { success: false, error: 'Invalid config path. Must be within public/configs directory.' },
        { status: 400 }
      )
    }

    // Validate file is JSON
    if (!file.name.endsWith('.json')) {
      return NextResponse.json(
        { success: false, error: 'Only JSON files are allowed' },
        { status: 400 }
      )
    }

    // Read and validate JSON content
    const fileContent = await file.text()
    let jsonContent
    try {
      jsonContent = JSON.parse(fileContent)
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON file' },
        { status: 400 }
      )
    }

    const fullPath = path.join(process.cwd(), normalizedPath)
    
    // Create backup if file exists
    try {
      await fs.access(fullPath)
      const existingContent = await fs.readFile(fullPath, 'utf-8')
      const backupPath = fullPath.replace('.json', `.backup.${Date.now()}.json`)
      await fs.writeFile(backupPath, existingContent, 'utf-8')
    } catch {
      // File doesn't exist, no backup needed
    }

    // Ensure directory exists
    const dir = path.dirname(fullPath)
    await fs.mkdir(dir, { recursive: true })

    // Write the file
    await fs.writeFile(fullPath, JSON.stringify(jsonContent, null, 2), 'utf-8')

    const response: ApiResponse = {
      success: true,
      message: 'Config file uploaded successfully'
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error uploading config:', error)
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload config file'
    }
    return NextResponse.json(response, { status: 500 })
  }
}
