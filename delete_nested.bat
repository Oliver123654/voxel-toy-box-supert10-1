@echo off
cd /d "C:\Users\94234\Downloads\voxel-toy-box-supert10-1-main"
if exist "voxel-toy-box-supert10-1-main" (
    rd /s /q "voxel-toy-box-supert10-1-main"
    echo Deleted successfully
) else (
    echo Folder does not exist
)
pause