Ensayo con Strudel y OSC

1. Descargar Strudel

[strudel](https://codeberg.org/uzu/strudel/src/branch/main)

1. Instalar pnpm

[Installation | pnpm](https://pnpm.io/installation#using-npm)

El paso es este:

npm install -g pnpm@latest-10

1. Clonar este repo

https://github.com/juanferfranco/sf1-test

Este repo es un servidor que cargará la página p5.js y escuchará los mensajes OSC que vienen del bridge OSC de strudel.

- npm install
- node server.js
1. Abrir la aplicación p5.js
2. Poner a correr el bridge de strudel
- pnpm run osc
1. Lanzar strudel REPL
- pnpm dev
1. Escribir este tema código strudel

```jsx
setcps(1)

const seq = "[bd <hh oh>]*2" 

$: s(seq).bank("tr909").dec(.4)

$: s(seq).osc()

```
