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
    ".cursor/skills/boss",
    ".cursor/skills/sdlc-roles",
    ".cursor/skills/project-vision",
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

$reports = Join-Path $TargetRoot ".cursor/team/reports"
if (-not (Test-Path $reports)) { New-Item -ItemType Directory -Force -Path $reports | Out-Null }

$registry = Join-Path $TargetRoot ".cursor/team/registry.json"
if (-not (Test-Path $registry)) {
    $emptyRegistry = '{"version":"1.0","maintained-by":"boss","teams":[]}'
    Set-Content -Path $registry -Value $emptyRegistry -Encoding UTF8
}

Write-Host "BOSS kit copied to $TargetRoot"
Write-Host "Customize .cursor/skills/project-vision/SKILL.md for your project."