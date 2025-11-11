import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminAuth } from '@/lib/auth-helper'
import { promises as fs } from 'fs'
import path from 'path'
import { ApiResponse } from '@/types/api'

// Clean up old backup files (older than 7 days)
async function cleanupOldBackups(dir: string) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000) // 7 days in milliseconds

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      
      if (entry.isDirectory()) {
        await cleanupOldBackups(fullPath)
      } else if (entry.name.includes('.backup.') || entry.name.includes('.deleted.')) {
        const stats = await fs.stat(fullPath)
        if (stats.mtimeMs < oneWeekAgo) {
          await fs.unlink(fullPath)
          console.trace(`Deleted old backup: ${fullPath}`)
        }
      }
    }
  } catch (error) {
    console.error('Error cleaning up old backups:', error)
  }
}

// POST /api/admin/config/list - List available config files
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
    const configsDir = path.join(process.cwd(), 'public/configs')
    
    // Clean up old backups (older than 7 days)
    await cleanupOldBackups(configsDir)
    
    async function getConfigFiles(dir: string, baseDir: string = dir): Promise<string[]> {
      const files: string[] = []
      const entries = await fs.readdir(dir, { withFileTypes: true })

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name)
        if (entry.isDirectory()) {
          const subFiles = await getConfigFiles(fullPath, baseDir)
          files.push(...subFiles)
        } else if (entry.name.endsWith('.json') && !entry.name.includes('.backup.') && !entry.name.includes('.deleted.')) {
          const relativePath = path.relative(process.cwd(), fullPath)
          files.push(relativePath.replace(/\\/g, '/'))
        }
      }

      return files
    }

    const configFiles = await getConfigFiles(configsDir)

    const response: ApiResponse<string[]> = {
      success: true,
      data: configFiles
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error listing config files:', error)
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to list config files'
    }
    return NextResponse.json(response, { status: 500 })
  }
}
