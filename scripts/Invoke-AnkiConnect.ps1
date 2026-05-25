param(
  [Parameter(Mandatory = $true)]
  [string]$Action,

  [hashtable]$Params = @{},

  [int]$Version = 6,

  [string]$BaseUrl = "http://127.0.0.1:8765"
)

$payload = @{
  action  = $Action
  version = $Version
  params  = $Params
} | ConvertTo-Json -Depth 20

try {
  $response = Invoke-RestMethod -Uri $BaseUrl -Method Post -ContentType "application/json" -Body $payload
} catch {
  throw "Falha ao conectar no AnkiConnect em $BaseUrl. Confirme que o Anki está aberto e o add-on AnkiConnect está instalado e ativo."
}

if ($null -ne $response.error -and $response.error -ne "") {
  throw "AnkiConnect retornou erro em '$Action': $($response.error)"
}

$response.result
