import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminAuth } from '@/lib/auth-helper'
import { promises as fs } from 'fs'
import path from 'path'
import { ApiResponse } from '@/types/api'

// POST /api/admin/config/rename - Rename a config file
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
    const body = await request.json()
    const { oldPath, newPath } = body

    if (!oldPath || !newPath) {
      return NextResponse.json(
        { success: false, error: 'Old path and new path are required' },
        { status: 400 }
      )
    }

    // Security: Ensure both paths are within public/configs directory
    const normalizedOldPath = path.normalize(oldPath)
    const normalizedNewPath = path.normalize(newPath)
    
    if (!normalizedOldPath.startsWith('public/configs/') && !normalizedOldPath.startsWith('public\\configs\\')) {
      return NextResponse.json(
        { success: false, error: 'Invalid old path. Must be within public/configs directory.' },
        { status: 400 }
      )
    }

    if (!normalizedNewPath.startsWith('public/configs/') && !normalizedNewPath.startsWith('public\\configs\\')) {
      return NextResponse.json(
        { success: false, error: 'Invalid new path. Must be within public/configs directory.' },
        { status: 400 }
      )
    }

    const fullOldPath = path.join(process.cwd(), normalizedOldPath)
    const fullNewPath = path.join(process.cwd(), normalizedNewPath)
    
    // Check if old file exists
    try {
      await fs.access(fullOldPath)
    } catch {
      return NextResponse.json(
        { success: false, error: 'Config file not found' },
        { status: 404 }
      )
    }

    // Check if new file already exists
    try {
      await fs.access(fullNewPath)
      return NextResponse.json(
        { success: false, error: 'A file with the new name already exists' },
        { status: 400 }
      )
    } catch {
      // File doesn't exist, which is what we want
    }

    // Ensure new directory exists
    const newDir = path.dirname(fullNewPath)
    await fs.mkdir(newDir, { recursive: true })

    // Rename the file
    await fs.rename(fullOldPath, fullNewPath)

    const response: ApiResponse = {
      success: true,
      message: 'Config file renamed successfully'
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error renaming config:', error)
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to rename config file'
    }
    return NextResponse.json(response, { status: 500 })
  }
}
