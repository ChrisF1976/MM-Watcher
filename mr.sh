#!/bin/bash
# Check if Wayland is running
if [ -n "$WAYLAND_DISPLAY" ]; then
    # For Wayland systems
    if command -v ydotool &> /dev/null; then
        ydotool key ctrl+r
    else
        # Fallback for Xwayland (like your current system)
        export DISPLAY=:0
        export XAUTHORITY=/home/$USER/.Xauthority
        xdotool key ctrl+r
    fi
else
    # For X11 systems
    export DISPLAY=:0.0
    xdotool key ctrl+r
fi
