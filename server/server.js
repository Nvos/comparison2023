const express = require("express");
const cors = require("cors");
const path = require("path");
const buildPath = path.resolve(__dirname, "../dist");
const server = express();

const appReact = path.resolve(__dirname, "../app-react/dist");
const appSvelte = path.resolve(__dirname, "../app-svelte/dist");

server.use(cors({ origin: "http://localhost:3000" }));

server.use("/app-react", express.static(appReact));
server.use("/app-svelte", express.static(appSvelte));

server.get('/import-map', (req, res) => {
  const imports = {
    imports: {
      'react': 'https://esm.sh/react@18.2.0',
      'react/': 'https://esm.sh/react@18.2.0/',
      'react-dom': 'https://esm.sh/react-dom@18.2.0',
      // 'react-router-dom': 'https://esm.sh/react-router-dom@6.10.0',
      // 'react-router-dom/': 'https://esm.sh/react-router-dom@6.10.0/',
      'app-react/': 'http://localhost:7000/app-react/',
      'app-react': 'http://localhost:7000/app-react/app.js',
      'app-svelte/': 'http://localhost:7000/app-svelte/',
    },
    scopes: {
      'react-router-dom': {
        'react': 'https://esm.sh/react@18.2.0',
        'react/': 'https://esm.sh/react@18.2.0/',
      }
    }
  };

  res.json(imports)
})

server.listen(7000, () => console.log("Server listening on port 7000"));
