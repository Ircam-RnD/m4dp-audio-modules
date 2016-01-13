# Media4DPlayer Audio Modules

When you modify the library code in ```lib``` folder, you need to bundle it:
```
npm run bundle
```

An example is in ```examples``` folder. To ear it, you can use http-serve node package (```npm install -g http-server```), and run
```http-server``` from the root directory of m4dp-audio-modules, and open http://0.0.0.0:8080/examples/index.html .

To generate doc from source code:
```
npm run doc
```
