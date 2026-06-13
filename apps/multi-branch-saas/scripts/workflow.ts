#!/usr/bin/env node
/**
 * Workflow Automation CLI
 *
 * Usage:
 *   npm run workflow status
 *   npm run workflow done "Task Name"
 *   npm run workflow next
 *   npm run workflow checkpoint
 */

import * as fs from 'fs'
import * as path from 'path'

const WORKFLOW_FILE = path.join(process.cwd(), 'docs', 'workflow.md')

interface Task {
  id: string
  title: string
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED'
  priority: 'P0' | 'P1' | 'P2'
  estimatedTime?: string
  dependencies?: string[]
}

// Read workflow.md
function readWorkflow(): string {
  if (!fs.existsSync(WORKFLOW_FILE)) {
    console.error('❌ workflow.md not found at:', WORKFLOW_FILE)
    process.exit(1)
  }
  return fs.readFileSync(WORKFLOW_FILE, 'utf-8')
}

// Write workflow.md
function writeWorkflow(content: string): void {
  fs.writeFileSync(WORKFLOW_FILE, content, 'utf-8')
}

// Extract current task from workflow
function getCurrentTask(content: string): Task | null {
  const lines = content.split('\n')
  let inTask = false
  let task: Partial<Task> = {}

  for (const line of lines) {
    if (line.includes('⏳ NOT_STARTED') || line.includes('🔄 IN_PROGRESS')) {
      const match = line.match(/#### Task \d+: (.+?) [⏳🔄]/)
      if (match) {
        task.title = match[1]
        task.status = line.includes('⏳') ? 'NOT_STARTED' : 'IN_PROGRESS'
        inTask = true
      }
    }

    if (inTask) {
      if (line.includes('priority:')) {
        task.priority = line.match(/P[0-2]/)?.[0] as Task['priority']
      }
      if (line.includes('estimated_time:')) {
        task.estimatedTime = line.split(':')[1]?.trim()
      }
      if (line.startsWith('#### Task') && task.title) {
        break
      }
    }
  }

  return task.title ? (task as Task) : null
}

// Get next N tasks
function getNextTasks(content: string, count: number = 3): Task[] {
  const tasks: Task[] = []
  const lines = content.split('\n')

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (line.match(/#### Task \d+:.*NOT_STARTED/)) {
      const match = line.match(/#### Task \d+: (.+?) ⏳/)
      if (match) {
        tasks.push({
          id: `task-${tasks.length + 1}`,
          title: match[1],
          status: 'NOT_STARTED',
          priority: 'P0', // default
        })

        if (tasks.length >= count) break
      }
    }
  }

  return tasks
}

// Mark task as done
function markTaskDone(content: string, taskTitle: string): string {
  const timestamp = new Date().toISOString().split('T')[0]

  // Find the task and update status
  let updated = content.replace(
    new RegExp(`(#### Task \\d+: ${taskTitle}) [⏳🔄] (NOT_STARTED|IN_PROGRESS)`),
    `$1 ✅ COMPLETED`
  )

  // Update YAML status
  updated = updated.replace(
    new RegExp(
      `(status: )(NOT_STARTED|IN_PROGRESS)(\n)(?=[^]*?#### Task \\d+: ${taskTitle}|$)`,
      'm'
    ),
    `$1COMPLETED$3`
  )

  // Add to session notes
  const sessionSection = `### Session Notes\n\n#### Latest Update - ${timestamp}\n**Completed:**\n- ✅ ${taskTitle}\n\n`

  if (updated.includes('## 📝 Session Notes')) {
    updated = updated.replace('## 📝 Session Notes', `## 📝 Session Notes\n\n${sessionSection}`)
  } else {
    updated += `\n\n---\n\n## 📝 Session Notes\n\n${sessionSection}`
  }

  return updated
}

// Add checkpoint
function addCheckpoint(content: string): string {
  const timestamp = new Date().toISOString().split('T')[0]
  const time = new Date().toTimeString().split(' ')[0].substring(0, 5)

  const checkpoint = `
## 🎯 CHECKPOINT - ${timestamp} ${time}

**Session Summary:**
- Modified files: [List files here]
- Completed tasks: [List completed tasks]
- Token usage: [Current/Total]

**Key Changes:**
1. [Change 1]
2. [Change 2]

**Next Focus:**
- [Next priority]

---
`

  if (content.includes('## 📝 Session Notes')) {
    return content.replace('## 📝 Session Notes', `## 📝 Session Notes\n${checkpoint}`)
  }

  return content + checkpoint
}

// CLI Commands
const command = process.argv[2]
const arg = process.argv[3]

switch (command) {
  case 'status': {
    const content = readWorkflow()
    const current = getCurrentTask(content)
    const next = getNextTasks(content, 3)

    console.log('\n📊 WORKFLOW STATUS\n')

    if (current) {
      console.log('🎯 Current Task:')
      console.log(`   ${current.title}`)
      console.log(`   Priority: ${current.priority}`)
      console.log(`   Status: ${current.status}`)
      if (current.estimatedTime) {
        console.log(`   Estimated: ${current.estimatedTime}`)
      }
    } else {
      console.log('✅ No active tasks - all caught up!')
    }

    console.log('\n⏭️  Next Tasks:')
    next.forEach((task, i) => {
      console.log(`   ${i + 1}. ${task.title}`)
    })

    console.log('')
    break
  }

  case 'done': {
    if (!arg) {
      console.error('❌ Please provide task title: npm run workflow done "Task Name"')
      process.exit(1)
    }

    const content = readWorkflow()
    const updated = markTaskDone(content, arg)
    writeWorkflow(updated)

    console.log(`\n✅ Marked as done: ${arg}`)

    const next = getNextTasks(updated, 1)
    if (next.length > 0) {
      console.log(`\n⏭️  Next task: ${next[0].title}\n`)
    }
    break
  }

  case 'next': {
    const content = readWorkflow()
    const next = getNextTasks(content, 1)

    if (next.length === 0) {
      console.log('\n✅ No pending tasks!\n')
      break
    }

    const task = next[0]
    console.log('\n⏭️  NEXT TASK\n')
    console.log(`📋 ${task.title}`)
    console.log(`🏷️  Priority: ${task.priority}`)
    console.log('')
    break
  }

  case 'checkpoint': {
    const content = readWorkflow()
    const updated = addCheckpoint(content)
    writeWorkflow(updated)

    console.log('\n💾 Checkpoint saved to workflow.md')
    console.log('📝 Please edit and add details manually\n')
    break
  }

  default:
    console.log(`
Workflow Automation CLI

Usage:
  npm run workflow status       - Show current status
  npm run workflow done "Task"  - Mark task as done
  npm run workflow next         - Show next task
  npm run workflow checkpoint   - Add checkpoint

Examples:
  npm run workflow status
  npm run workflow done "GitHub Repository Setup"
  npm run workflow next
  npm run workflow checkpoint
`)
}
