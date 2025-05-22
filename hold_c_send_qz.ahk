#NoEnv  ; Recommended for performance and compatibility with future AutoHotkey releases
#SingleInstance Force  ; Ensures only one instance of the script is running
SetWorkingDir %A_ScriptDir%  ; Ensures a consistent starting directory

; When C is held down, send Q+Z
$c::
    Send {q down}{z down}  ; Press Q and Z
    KeyWait, c  ; Wait for C to be released
    Send {q up}{z up}  ; Release Q and Z
return 