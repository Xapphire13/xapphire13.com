SET PATH=%PATH%;D:\home\tools

call npm config set prefix "D:\home\tools"
call npm i -g yarn
call yarn
call yarn run build
call yarn run deploy
