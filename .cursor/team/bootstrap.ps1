param(
    [Parameter(Mandatory = $true)]
    [string]$TargetPath
)

$ErrorActionPreference = "Stop"
$SourceRoot = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
$TargetRoot = Resolve-Path $TargetPath -ErrorAction SilentlyContinue
if (-not $TargetRoot) {
    $TargetRoot = New-Item -ItemType Directory -Force -Path $TargetPath
}

$paths = @(
    ".cursor/agents/boss.md",
    ".cursor/agents/README.md",
    ".cursor/agents/roles",
    ".cursor/agents/specialists",
    ".cursor/skills/boss",
    ".cursor/skills/sdlc-roles",
    ".cursor/skills/specialist-roles",
    ".cursor/skills/mcp-routing",
    ".cursor/skills/skills-catalog",
    ".cursor/skills/project-vision",
    ".cursor/mcps",
    ".cursor/mcp.json",
    ".cursor/team"
)

foreach ($rel in $paths) {
    $src = Join-Path $SourceRoot $rel
    $dst = Join-Path $TargetRoot $rel
    if (Test-Path $src -PathType Container) {
        if (-not (Test-Path $dst)) { New-Item -ItemType Directory -Force -Path $dst | Out-Null }
        Copy-Item -Path (Join-Path $src '*') -Destination $dst -Recurse -Force
    } elseif (Test-Path $src) {
        $parent = Split-Path $dst -Parent
        if (-not (Test-Path $parent)) { New-Item -ItemType Directory -Force -Path $parent | Out-Null }
        Copy-Item -Path $src -Destination $dst -Force
    }
}

# Gate validator script
$scriptsSrc = Join-Path $SourceRoot "scripts\validate-boss-gates.js"
$scriptsDstDir = Join-Path $TargetRoot "scripts"
if (Test-Path $scriptsSrc) {
    if (-not (Test-Path $scriptsDstDir)) { New-Item -ItemType Directory -Force -Path $scriptsDstDir | Out-Null }
    Copy-Item -Path $scriptsSrc -Destination (Join-Path $scriptsDstDir "validate-boss-gates.js") -Force
}

# GitHub workflows
$workflowSrc = Join-Path $SourceRoot ".github\workflows"
$workflowDst = Join-Path $TargetRoot ".github\workflows"
if (Test-Path $workflowSrc) {
    if (-not (Test-Path $workflowDst)) { New-Item -ItemType Directory -Force -Path $workflowDst | Out-Null }
    Copy-Item -Path (Join-Path $workflowSrc "boss-*.yml") -Destination $workflowDst -Force
}

$dirs = @(
    (Join-Path $TargetRoot ".cursor/team/reports"),
    (Join-Path $TargetRoot ".cursor/team/checkpoints"),
    (Join-Path $TargetRoot ".cursor/team/gates")
)
foreach ($d in $dirs) {
    if (-not (Test-Path $d)) { New-Item -ItemType Directory -Force -Path $d | Out-Null }
}

$registry = Join-Path $TargetRoot ".cursor/team/registry.json"
if (-not (Test-Path $registry)) {
    $emptyRegistry = '{"version":"2.0","maintained-by":"boss","mcps":{"active":[],"catalog":".cursor/mcps/catalog.json"},"skills":{"catalog":".cursor/skills/skills-catalog/SKILL.md"},"teams":[]}'
    Set-Content -Path $registry -Value $emptyRegistry -Encoding UTF8NoBOM
}

Write-Host "BOSS kit copied to $TargetRoot"
Write-Host "Customize .cursor/skills/project-vision/SKILL.md for your project."
Write-Host "Run 'Use BOSS to mcp list' to configure MCPs."
Write-Host "Validate gates: node scripts/validate-boss-gates.js --feature <slug>"
