@echo off

SET TARGET=ArcanumEnhancements.user.js
echo Building %TARGET%
del %TARGET%

cd src
for %%i in (*) do (
    echo %%i
    type "%%i" >> ..\%TARGET%

    echo. >> ..\%TARGET%
    echo. >> ..\%TARGET%
)
cd ..