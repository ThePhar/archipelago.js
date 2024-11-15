---
title: Installation
group: Documents
category: Installation
---
# Installation

## In a Node-based environment (to be run server-side or be bundled for running in a browser)...

**archipelago.js** supports all currently supported versions of [Node](https://nodejs.org), [Bun](https://bun.sh), and 
[Deno](https://deno.land). To install, follow the installation directions for your desired runtime and create a new
project directory.

Then, navigate to your new project directory and run `npm install archipelago.js` (or whatever your package
manager's flavor of doing the same thing is).

### Node.js

```bash
mkdir my-project
cd my-project
npm init
npm install archipelago.js
```

### Bun
```bash
mkdir my-project
cd my-project
bun init
bun add archipelago.js
```

### Deno (v2)
```bash
deno init my-project
cd my-project
deno add npm:archipelago.js
```

Then, in your JavaScript or TypeScript files, just import using ESM syntax.

```js
import { /* ... */ } from "archipelago.js";

// Rest of your code here...
```

## In the browser without using a bundler... 

If you are planning to run in the browser without bundling your code first, you can import **archipelago.js** using
the ESM module syntax in your HTML files. See below for an example using the unpkg CDN as a source:

```html
<script type="module">
    import { /* ... */ } from "https://unpkg.com/archipelago.js/dist/archipelago.min.js";
    
    // Rest of your code here...
</script>
```

If you package the **archipelago.js** files with your code, you can change the CDN url with a relative path to your
provided **archipelago.js** bundle.

[//]: # (Page navigation footer; needs to be updated manually for now.)
<footer style="display: flex; justify-content: space-between">
  <div>
    <b>Previous</b>
    <div>
      <a href="./introduction/doc_improvements.md">Report Errors or Improvements to these Guides</a>
    </div>
  </div>
  <div style="text-align: right">
    <b>Next</b>
    <div>
      <a></a>
    </div>
  </div>
</footer>
