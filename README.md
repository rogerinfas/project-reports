# project-reports

Repositorio de informes técnicos generados con **LaTeX** para distintos proyectos de implementación (por ejemplo, CMLINE, Machu Picchu, PERU FLORES). Aquí se versionan las plantillas, carátulas y contenido de los informes finales en formato `.tex` y sus recursos asociados (imágenes, secciones, etc.).

## Estructura del repositorio

- **CMLINE/**
  - `InformeImplementacionCMLineEIRL/`  
    Contiene un informe completo en LaTeX, con:
    - `main.tex`: archivo principal del informe, que incluye todas las secciones (`sections/*.tex`).
    - `sections/`: capítulos y secciones del informe (introducción, antecedentes, objetivos, alcance, metodología, situación inicial, implementación Odoo, resultados, capacitación y gestión del cambio, conclusiones, recomendaciones, etc.).
    - `Makefile`: archivo de automatización para compilar el informe con `pdflatex`.
- **MachuPicchu/**
  - `InformeImplementacionMachuPicchu/`  
    Proyecto LaTeX con portada gráfica (`assets/`), carátula formal y secciones del informe para Machu Picchu.
- **PERUFLORES/**
  - `InformeImplementacionPeruFLores/`  
    Documento LaTeX con carátula y contenido específico para el proyecto PERU FLORES.
- **TESIS_ROGER_INFA_SANCHEZ/**
  - `main.tex`: documento principal de tesis.
  - `chapters/`: capítulos principales (planteamiento, revisión, etc.).
  - `backmatter/`: referencias y anexos.
  - `imgs/`: recursos gráficos (logo e imágenes).

Además, el repositorio incluye archivos auxiliares generados por LaTeX (`*.aux`, `*.log`, `*.out`, `*.toc`, etc.), que normalmente se pueden limpiar con las reglas del `Makefile`.

## Compilador de LaTeX utilizado

El repositorio está pensado para compilarse con **pdflatex**, usando el siguiente comando base:

```bash
pdflatex -interaction=nonstopmode main.tex
```

En el caso del proyecto CMLINE se utiliza además un **Makefile** para automatizar la compilación:

```makefile
all:
	pdflatex -interaction=nonstopmode main.tex
	pdflatex -interaction=nonstopmode main.tex
```

Esto asegura que se resuelvan correctamente las referencias internas (tabla de contenidos, referencias cruzadas, etc.) ejecutando `pdflatex` dos veces.

## Requisitos e instalación en Arch Linux

En un entorno Arch Linux (como el tuyo), se recomienda instalar una distribución LaTeX relativamente completa. Dos opciones típicas:

- **texlive-most**: colección grande de paquetes LaTeX (recomendada si quieres “todo listo”).
- **texlive-core** + paquetes adicionales según necesidad.

Comandos de instalación con `pacman`:

```bash
sudo pacman -Syu
sudo pacman -S texlive-most make
```

Si prefieres una instalación más mínima:

```bash
sudo pacman -S texlive-core texlive-latexextra texlive-langspanish make
```

Con esto tendrás `pdflatex` disponible en el sistema y soporte adecuado para documentos en español (`babel`, codificación UTF-8, etc.).

## Cómo compilar los informes

### 1. CMLINE – `InformeImplementacionCMLineEIRL`

1. Abre una terminal en la carpeta del informe:

   ```bash
   cd CMLINE/InformeImplementacionCMLineEIRL
   ```

2. Compila usando el **Makefile**:

   ```bash
   make
   ```

   Esto ejecutará `pdflatex -interaction=nonstopmode main.tex` dos veces y generará `main.pdf`.

3. Para abrir el PDF (en Linux con entorno gráfico):

   ```bash
   make view
   ```

4. Para limpiar archivos temporales:

   ```bash
   make clean
   ```

### 2. MachuPicchu – `InformeImplementacionMachuPicchu`

1. Ir a la carpeta del informe:

   ```bash
   cd MachuPicchu/InformeImplementacionMachuPicchu
   ```

2. Compilar directamente con `pdflatex`:

   ```bash
   pdflatex -interaction=nonstopmode main.tex
   pdflatex -interaction=nonstopmode main.tex
   ```

3. Abrir el PDF resultante:

   ```bash
   xdg-open main.pdf
   ```

### 3. PERUFLORES – `InformeImplementacionPeruFLores`

1. Ir a la carpeta del informe:

   ```bash
   cd PERUFLORES/InformeImplementacionPeruFLores
   ```

2. Compilar igualmente con `pdflatex`:

   ```bash
   pdflatex -interaction=nonstopmode main.tex
   pdflatex -interaction=nonstopmode main.tex
   ```

3. Abrir el PDF:

   ```bash
   xdg-open main.pdf
   ```

## Configuración recomendada del editor (opcional)

Aunque el repositorio se puede compilar sólo con terminal, es cómodo usar un editor con soporte LaTeX:

- **VS Code / Cursor** con extensiones como:
  - `LaTeX Workshop` (compilación, visor integrado, autocompletado).
- **Configuración típica**:
  - Configurar la herramienta de compilación principal como `pdflatex`.
  - Usar el comando de compilación continua (watch) si quieres ver cambios en tiempo real.

Ejemplo de comando de compilación personalizado en el editor:

```bash
pdflatex -interaction=nonstopmode main.tex
```

Con esto, cualquier persona que clone el repositorio en Arch Linux puede instalar LaTeX, compilar y mantener los informes tal como tú los trabajas actualmente.
