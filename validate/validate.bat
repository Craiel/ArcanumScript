@echo off
cls

node validate.js ../GameData/stable stable
node validate.js ../GameData/unstable unstable

pause