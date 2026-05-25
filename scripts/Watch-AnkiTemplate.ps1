param(
  [string]$Template = ".\templates\basic-editorial-v1",
  [switch]$CreateIfMissing
)

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ankiRoot = Split-Path -Parent $scriptDir
$templateDir = [System.IO.Path]::GetFullPath((Join-Path $ankiRoot $Template))
$syncScript = Join-Path $scriptDir "Sync-AnkiTemplate.ps1"

if (-not (Test-Path -LiteralPath $templateDir)) {
  throw "Pasta do template não encontrada: $templateDir"
}

$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = $templateDir
$watcher.Filter = "*.*"
$watcher.IncludeSubdirectories = $false
$watcher.EnableRaisingEvents = $true

$eventData = @{
  SyncScript      = $syncScript
  Template        = $Template
  CreateIfMissing = [bool]$CreateIfMissing
}

$action = {
  $changedPath = $Event.SourceEventArgs.FullPath
  $changedName = [System.IO.Path]::GetFileName($changedPath)
  $eventData = $Event.MessageData

  if ($changedName -notin @("front.template.html", "back.template.html", "styling.css", "anki.model.json")) {
    return
  }

  Start-Sleep -Milliseconds 250

  try {
    $args = @(
      "-File", $eventData.SyncScript,
      "-Template", $eventData.Template
    )

    if ($eventData.CreateIfMissing) {
      $args += "-CreateIfMissing"
    }

    & pwsh @args
  } catch {
    Write-Host "Erro ao sincronizar após alteração em $changedName"
    Write-Host $_
  }
}

$created = Register-ObjectEvent -InputObject $watcher -EventName Created -Action $action -MessageData $eventData
$changed = Register-ObjectEvent -InputObject $watcher -EventName Changed -Action $action -MessageData $eventData
$renamed = Register-ObjectEvent -InputObject $watcher -EventName Renamed -Action $action -MessageData $eventData

Write-Host "Observando alterações em $templateDir"
Write-Host "Pressione Ctrl+C para encerrar."

try {
  while ($true) {
    Start-Sleep -Seconds 1
  }
} finally {
  Unregister-Event -SourceIdentifier $created.Name
  Unregister-Event -SourceIdentifier $changed.Name
  Unregister-Event -SourceIdentifier $renamed.Name
  $watcher.Dispose()
}
