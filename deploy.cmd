:: Setup
:: -----

setlocal enabledelayedexpansion

SET PATH=%PATH%;D:\home\tools
SET ARTIFACTS=%~dp0%..\artifacts
SET DEPLOYMENT_SOURCE=%~dp0%.
SET DEPLOYMENT_TARGET=%~dp0%..\wwwroot

IF NOT DEFINED NEXT_MANIFEST_PATH (
  SET NEXT_MANIFEST_PATH=%ARTIFACTS%\manifest

  IF NOT DEFINED PREVIOUS_MANIFEST_PATH (
    SET PREVIOUS_MANIFEST_PATH=%ARTIFACTS%\manifest
  )
)

call npm config set prefix "D:\home\tools"
call npm i -g yarn
call yarn
call yarn run build
call yarn run deploy
