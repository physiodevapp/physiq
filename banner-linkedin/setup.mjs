import fs from 'fs';
import path from 'path';
const FD = path.resolve('fonts');
const gfcss = fs.readFileSync(path.join(FD,'gf.css'),'utf8');

export async function prep(ctx){
  await ctx.route('**://fonts.googleapis.com/**', r => r.fulfill({ contentType:'text/css', body: gfcss }));
  await ctx.route('**://fonts.gstatic.com/**', r => {
    const f = path.join(FD, path.basename(new URL(r.request().url()).pathname));
    if (fs.existsSync(f)) return r.fulfill({ contentType:'font/woff2', body: fs.readFileSync(f) });
    return r.abort();
  });
  // everything else external -> abort fast (workers, CDNs) so nothing hangs
  await ctx.route('**', r => {
    const u = r.request().url();
    if (u.startsWith('http://localhost:8080') || u.startsWith('data:') || u.startsWith('blob:')) return r.continue();
    return r.abort();
  });
}
export const HUB = 'http://localhost:8080/physiq/';
