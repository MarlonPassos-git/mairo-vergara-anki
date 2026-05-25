Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$toolPath = Join-Path $root "tools\whisper-transcript-json.html"

function Read-ToolHtml {
  if (-not (Test-Path -LiteralPath $toolPath)) {
    throw "Missing file '$toolPath'. Expected Whisper transcript helper HTML."
  }

  return Get-Content -LiteralPath $toolPath -Raw
}

function Assert-ContainsText {
  param([string]$Text, [string]$Expected)

  if ($Text.Contains($Expected)) {
    return
  }

  throw "Missing text '$Expected'. Expected helper contract marker."
}

$html = Read-ToolHtml

Assert-ContainsText $html "http://127.0.0.1:8090/transcribe"
Assert-ContainsText $html 'form.append("wordTimestamps", "true")'
Assert-ContainsText $html 'form.append("responseFormat", "verbose_json")'
Assert-ContainsText $html "function toTimedWord"
Assert-ContainsText $html "Transcricao JSON"

Write-Host "whisper-transcript-json helper contract OK"
