#NoEnv  ; Recommended for performance and compatibility with future AutoHotkey releases
#SingleInstance Force  ; Ensures only one instance of the script is running
SetWorkingDir %A_ScriptDir%  ; Ensures a consistent starting directory

; When C is held down, send Q+Z
$c::
    Send {q down}{z down}  ; Press Q and Z
    KeyWait, c  ; Wait for C to be released
    Send {q up}{z up}  ; Release Q and Z
return 

; When V is pressed: Hold F(640ms) and during that time press D(320ms), wait 630ms, then D(120ms)
$v::
    Send {f down}  ; Start holding F
    Send {d down}  ; Start holding D
    Sleep 320      ; Hold D for 320ms
    Send {d up}    ; Release D
    Sleep 320      ; Continue holding F for remaining time (640-320 = 320ms)
    Send {f up}    ; Release F
    
    Sleep 630      ; Wait for 630ms
    
    Send {d down}  ; Press D again
    Sleep 120      ; Hold for 120ms
    Send {d up}    ; Release D
return 