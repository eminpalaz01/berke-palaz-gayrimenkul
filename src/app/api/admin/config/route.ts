import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminAuth } from '@/lib/auth-helper'
import { promises as fs } from 'fs'
import path from 'path'
import { ApiResponse } from '@/types/api'

interface ConfigData {
  path: string
  content: Record<string, unknown>
}

// GET /api/admin/config - Get config file content
export async function GET(request: NextRequest) {
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
    const configPath = searchParams.get('path') || 'public/configs/config.json'

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

    const fileContent = await fs.readFile(fullPath, 'utf-8')
    const jsonContent = JSON.parse(fileContent)

    const response: ApiResponse<ConfigData> = {
      success: true,
      data: {
        path: configPath,
        content: jsonContent
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error reading config:', error)
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to read config file'
    }
    return NextResponse.json(response, { status: 500 })
  }
}

// PUT /api/admin/config - Update config file
export async function PUT(request: NextRequest) {
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
    const { path: configPath, content } = body

    if (!configPath || !content) {
      return NextResponse.json(
        { success: false, error: 'Path and content are required' },
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

    // Validate JSON structure
    if (typeof content !== 'object' || content === null) {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON content' },
        { status: 400 }
      )
    }

    const fullPath = path.join(process.cwd(), normalizedPath)
    
    // Create backup before updating
    try {
      const existingContent = await fs.readFile(fullPath, 'utf-8')
      const backupPath = fullPath.replace('.json', `.backup.${Date.now()}.json`)
      await fs.writeFile(backupPath, existingContent, 'utf-8')
    } catch (error) {
      console.warn('Could not create backup:', error)
    }

    // Write new content
    await fs.writeFile(fullPath, JSON.stringify(content, null, 2), 'utf-8')

    const response: ApiResponse = {
      success: true,
      message: 'Config file updated successfully'
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error updating config:', error)
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update config file'
    }
    return NextResponse.json(response, { status: 500 })
  }
}
