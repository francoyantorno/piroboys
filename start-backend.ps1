$backendPath = "$PSScriptRoot\backend"

if (-Not (Test-Path "$backendPath\venv")) {
    python -m venv "$backendPath\venv"
}

& "$backendPath\venv\Scripts\Activate.ps1"

pip install -r "$backendPath\requirements.txt"

if (-Not (Test-Path "$backendPath\.env")) {
    copy "$backendPath\env.example" "$backendPath\.env"
}

Set-Location $backendPath

uvicorn src.app:app --reload
