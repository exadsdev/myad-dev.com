/*
  Windows helper:
  - Kills any process listening on a given port (default 3010)
  - Removes the Next.js output directory (default .next)

  Usage:
    node scripts/unlock-next-trace.js
    PORT=3010 NEXT_DIR=.next node scripts/unlock-next-trace.js
*/

const { execSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const port = Number(process.env.PORT || 3010);
const nextDir = process.env.NEXT_DIR || '.next';

function sleep(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function run(cmd) {
  return execSync(cmd, { stdio: ['ignore', 'pipe', 'pipe'] }).toString('utf8');
}

function findListeningPids(p) {
  let output = '';
  try {
    output = run('netstat -ano -p tcp');
  } catch {
    return [];
  }

  const lines = output.split(/\r?\n/);
  const pids = new Set();
  for (const line of lines) {
    if (!line.includes('LISTENING')) continue;
    if (!line.includes(`:${p}`)) continue;

    // Typical netstat line:
    // TCP    0.0.0.0:3010   0.0.0.0:0   LISTENING   13924
    const parts = line.trim().split(/\s+/);
    const pid = Number(parts[parts.length - 1]);
    if (Number.isFinite(pid)) pids.add(pid);
  }
  return [...pids];
}

function killPid(pid) {
  try {
    run(`taskkill /PID ${pid} /F`);
    return true;
  } catch {
    return false;
  }
}

function rmRfWithRetries(targetPath, retries = 10) {
  for (let i = 0; i < retries; i++) {
    try {
      if (fs.existsSync(targetPath)) {
        fs.rmSync(targetPath, { recursive: true, force: true });
      }
      return true;
    } catch (err) {
      // EPERM/EBUSY: wait and retry
      sleep(300);
      if (i === retries - 1) {
        throw err;
      }
    }
  }
  return false;
}

function main() {
  const repoRoot = process.cwd();
  const target = path.resolve(repoRoot, nextDir);

  const pids = findListeningPids(port);
  if (pids.length) {
    for (const pid of pids) {
      const ok = killPid(pid);
      process.stdout.write(`kill port ${port} pid ${pid}: ${ok ? 'ok' : 'failed'}\n`);
    }
    sleep(800);
  } else {
    process.stdout.write(`no LISTENING pid found on port ${port}\n`);
  }

  process.stdout.write(`removing ${target}...\n`);
  rmRfWithRetries(target, 12);
  process.stdout.write('done\n');
}

main();
