param(
  [string]$Template = ".\templates\basic-editorial-v2",
  [switch]$CreateIfMissing
)

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ankiRoot = Split-Path -Parent $scriptDir
$templateDir = [System.IO.Path]::GetFullPath((Join-Path $ankiRoot $Template))
$configPath = Join-Path $templateDir "anki.model.json"
$invokeScript = Join-Path $scriptDir "Invoke-AnkiConnect.ps1"

if (-not (Test-Path -LiteralPath $configPath)) {
  throw "Arquivo de configuração não encontrado: $configPath"
}

$config = Get-Content -LiteralPath $configPath -Raw | ConvertFrom-Json

$frontPath = Join-Path $templateDir $config.files.front
$backPath = Join-Path $templateDir $config.files.back
$cssPath = Join-Path $templateDir $config.files.css

foreach ($path in @($frontPath, $backPath, $cssPath)) {
  if (-not (Test-Path -LiteralPath $path)) {
    throw "Arquivo do template não encontrado: $path"
  }
}

$front = Get-Content -LiteralPath $frontPath -Raw
$back = Get-Content -LiteralPath $backPath -Raw
$css = Get-Content -LiteralPath $cssPath -Raw

$version = & $invokeScript -Action "version"
if ($version -lt 6) {
  throw "AnkiConnect respondeu com versão $version. Este setup usa ações da API v6."
}

$modelNames = & $invokeScript -Action "modelNames"
$modelExists = $modelNames -contains $config.modelName

if (-not $modelExists) {
  if (-not $CreateIfMissing) {
    throw "O note type '$($config.modelName)' não existe no Anki. Crie-o manualmente ou rode o script com -CreateIfMissing."
  }

  $createParams = @{
    modelName     = $config.modelName
    inOrderFields = @($config.fields)
    css           = $css
    isCloze       = $false
    cardTemplates = @(
      @{
        Name  = $config.cardTemplateName
        Front = $front
        Back  = $back
      }
    )
  }

  & $invokeScript -Action "createModel" -Params $createParams | Out-Null
  Write-Host "Modelo criado no Anki: $($config.modelName)"
  exit 0
}

$modelFieldNames = & $invokeScript -Action "modelFieldNames" -Params @{
  modelName = $config.modelName
}

foreach ($fieldName in @($config.fields)) {
  if ($modelFieldNames -contains $fieldName) {
    continue
  }

  & $invokeScript -Action "modelFieldAdd" -Params @{
    modelName = $config.modelName
    fieldName = $fieldName
  } | Out-Null

  Write-Host "Campo criado no modelo '$($config.modelName)': $fieldName"
}

$templateParams = @{
  model = @{
    name      = $config.modelName
    templates = @{
      ($config.cardTemplateName) = @{
        Front = $front
        Back  = $back
      }
    }
  }
}

$stylingParams = @{
  model = @{
    name = $config.modelName
    css  = $css
  }
}

& $invokeScript -Action "updateModelTemplates" -Params $templateParams | Out-Null
& $invokeScript -Action "updateModelStyling" -Params $stylingParams | Out-Null

Write-Host "Template sincronizado com sucesso:"
Write-Host "  Modelo: $($config.modelName)"
Write-Host "  Card:   $($config.cardTemplateName)"
