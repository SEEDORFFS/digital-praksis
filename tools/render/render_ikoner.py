"""
Renderer forsidens tre 3D-ikoner.

Kør fra projektets rod:   python3 tools/render/render_ikoner.py [organisering undervisning video]
Kræver: pip install playwright && playwright install chromium

Skriver assets/ikoner/<id>.webp (objektet) og assets/ikoner/<id>-skygge.webp (kontaktskyggen).
Begge billeder har samme ramme, så de kan lægges oven på hinanden.
"""
import asyncio, base64, os, sys, threading, functools
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from playwright.async_api import async_playwright

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
OUT = os.path.join(ROOT, 'assets', 'ikoner')
PORT = 8793
IDS = ['organisering', 'undervisning', 'video']


def serve():
    h = functools.partial(SimpleHTTPRequestHandler, directory=ROOT)
    h.log_message = lambda *a: None
    ThreadingHTTPServer(('127.0.0.1', PORT), h).serve_forever()


def save(data_url, path):
    with open(path, 'wb') as f:
        f.write(base64.b64decode(data_url.split(',', 1)[1]))


async def main(only):
    threading.Thread(target=serve, daemon=True).start()
    os.makedirs(OUT, exist_ok=True)
    async with async_playwright() as p:
        b = await p.chromium.launch(args=['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'])
        pg = await b.new_page()
        pg.on('pageerror', lambda e: print('JS-fejl:', e))
        await pg.goto(f'http://127.0.0.1:{PORT}/tools/render/ikoner.html')
        await pg.wait_for_function('window.READY === true', timeout=60000)
        for i in IDS:
            if only and i not in only:
                continue
            res = await pg.evaluate('(s) => window.renderIkon(s)', {'id': i, 'size': 900, 'passes': 48})
            save(res['icon'], os.path.join(OUT, f'{i}.webp'))
            save(res['shadow'], os.path.join(OUT, f'{i}-skygge.webp'))
            print(i, 'ok')
        await b.close()


asyncio.run(main(set(sys.argv[1:])))
