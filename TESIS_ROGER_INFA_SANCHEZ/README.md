# Tesis Roger Infa Sanchez

Estructura recomendada para mantener el documento ordenado y escalable:

- `main.tex`: archivo principal de compilación.
- `chapters/`: capítulos de contenido principal.
- `backmatter/`: secciones finales (referencias y anexos).
- `imgs/`: imágenes y recursos gráficos.

## Compilación

Desde esta carpeta:

```bash
pdflatex -interaction=nonstopmode main.tex
pdflatex -interaction=nonstopmode main.tex
```

## Convención sugerida

- Capítulos: `chapters/01-*.tex`, `chapters/02-*.tex`, etc.
- Secciones finales: `backmatter/referencias.tex`, `backmatter/anexos.tex`.
- Mantener nombres en minúsculas y con guiones.
