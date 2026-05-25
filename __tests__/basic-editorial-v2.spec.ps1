Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$templateDir = Join-Path $root "templates\basic-editorial-v2"

function Read-TemplateText {
  param([string]$RelativePath)

  $path = Join-Path $templateDir $RelativePath
  if (-not (Test-Path -LiteralPath $path)) {
    throw "Missing file '$path'. Expected basic-editorial-v2 template file."
  }

  return Get-Content -LiteralPath $path -Raw
}

function Assert-ContainsText {
  param([string]$Text, [string]$Expected)

  if ($Text.Contains($Expected)) {
    return
  }

  throw "Missing text '$Expected'. Expected template contract marker."
}

function Assert-MultiWordTargetSupport {
  param([string]$Text)

  Assert-ContainsText $Text "flatMap(readHighlightedWordTokens)"
  Assert-ContainsText $Text '.split(/[^\p{L}\p{N}]+/gu)'
  Assert-ContainsText $Text ".filter(Boolean)"
}

function Assert-ModelContract {
  param([object]$Model)

  $expectedFields = @(
    "Frase em ingles",
    "Traducao do trecho",
    "Traducao da frase",
    "Audio em ingles",
    "Transcricao JSON"
  )
  $actualFields = @($Model.fields)
  if (@(Compare-Object $expectedFields $actualFields).Count -eq 0) {
    return
  }

  throw "Invalid fields '$($actualFields -join ', ')'. Expected '$($expectedFields -join ', ')'."
}

$model = Read-TemplateText "anki.model.json" | ConvertFrom-Json
$back = Read-TemplateText "back.template.html"
$front = Read-TemplateText "front.template.html"
$css = Read-TemplateText "styling.css"

Assert-ModelContract $model
Assert-ContainsText $back 'id="answer"'
Assert-ContainsText $back "{{#Traducao do trecho}}"
Assert-ContainsText $back "{{#Traducao da frase}}"
Assert-ContainsText $back "{{#Transcricao JSON}}"
Assert-ContainsText $front "{{#Transcricao JSON}}"
Assert-ContainsText $front ".mp-transcript-json"
Assert-ContainsText $front "restartOnReplayClick"
Assert-ContainsText $front "window.setTimeout(() => runFallbackTimer(words), 250)"
Assert-ContainsText $back "drawAnswerConnector"
Assert-ContainsText $back ".mp-connector-path"
Assert-ContainsText $back 'id="mp-connector-arrow"'
Assert-ContainsText $css ".mp-n1-answer"
Assert-ContainsText $css ".mp-connector-path"
Assert-ContainsText $css ".mp-timed-word.is-target.is-active"
Assert-ContainsText $css ".mp-sentence-translation"
Assert-ContainsText $css ".mp-timed-word.is-active"
Assert-MultiWordTargetSupport $front
Assert-MultiWordTargetSupport $back

Write-Host "basic-editorial-v2 template contract OK"
