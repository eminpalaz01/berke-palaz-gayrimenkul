import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminAuth } from '@/lib/auth-helper'
import { promises as fs } from 'fs'
import path from 'path'
import { ApiResponse } from '@/types/api'

// DELETE /api/admin/config/delete - Delete a config file
export async function DELETE(request: NextRequest) {
  // Check authentication
  const auth = await verifyAdminAuth(request)
  if (!auth.authenticated) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const { searchParams } = new URL(request.url)
    const configPath = searchParams.get('path')

    if (!configPath) {
      return NextResponse.json(
        { success: false, error: 'Path is required' },
        { status: 400 }
      )
    }

    // Security: Ensure path is within public/configs directory
    const normalizedPath = path.normalize(configPath)
    if (!normalizedPath.startsWith('public/configs/') && !normalizedPath.startsWith('public\\configs\\')) {
      return NextResponse.json(
        { success: false, error: 'Invalid config path. Must be within public/configs directory.' },
        { status: 400 }
      )
    }

    const fullPath = path.join(process.cwd(), normalizedPath)
    
    // Check if file exists
    try {
      await fs.access(fullPath)
    } catch {
      return NextResponse.json(
        { success: false, error: 'Config file not found' },
        { status: 404 }
      )
    }

    // Create backup before deleting
    try {
      const existingContent = await fs.readFile(fullPath, 'utf-8')
      const backupPath = fullPath.replace('.json', `.deleted.${Date.now()}.json`)
      await fs.writeFile(backupPath, existingContent, 'utf-8')
    } catch (error) {
      console.warn('Could not create backup:', error)
    }

    // Delete the file
    await fs.unlink(fullPath)

    const response: ApiResponse = {
      success: true,
      message: 'Config file deleted successfully'
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error deleting config:', error)
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete config file'
    }
    return NextResponse.json(response, { status: 500 })
  }
}
