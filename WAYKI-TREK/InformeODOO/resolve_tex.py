import subprocess
import re
import sys

for i in range(20):
    res = subprocess.run(["pdflatex", "-interaction=nonstopmode", "main.tex"], capture_output=True, text=True, errors="replace")
    if res.returncode == 0:
        print("Compilation successful!")
        sys.exit(0)
    
    match = re.search(r"! LaTeX Error: File `(.*?).sty'\s*not found", res.stdout)
    if not match:
        match = re.search(r"! LaTeX Error: File `(.*?).def'\s*not found", res.stdout)
    
    if match:
        pkg = match.group(1)
        print(f"Missing package detected: {pkg}. Installing...")
        subprocess.run(["tlmgr", "--usermode", "install", pkg])
    else:
        print("Compilation failed for a non-missing-package reason or parsing failed.")
        print(res.stdout[-1000:])
        sys.exit(1)
