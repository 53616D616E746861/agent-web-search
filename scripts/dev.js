// Dependency-free adapter for local development. Worker production code uses only Web APIs.
import { createServer } from 'node:http';
import worker from '../src/worker.js';
const port = Number(process.env.PORT ?? 8787);
createServer(async (req,res) => {
  try {
    const result = await worker.fetch(new Request(new URL(req.url,`http://localhost:${port}`),{method:req.method}));
    res.writeHead(result.status,Object.fromEntries(result.headers));
    res.end(await result.text());
  } catch { res.writeHead(500); res.end('Local server error'); }
}).listen(port,'127.0.0.1',()=>console.log(`Local fixture search: http://localhost:${port}`));
