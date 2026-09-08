from PIL import Image, ImageDraw, ImageFont
import glob, os

FDIR = '/mnt/skills/examples/canvas-design/canvas-fonts'
bold = lambda s: ImageFont.truetype(f'{FDIR}/Outfit-Bold.ttf', s)
reg  = lambda s: ImageFont.truetype(f'{FDIR}/Outfit-Regular.ttf', s)

K = 1584/1128                     # la portada se muestra a ~1128 px en escritorio
AV_D, AV_X, AV_CY = round(152*K), round(24*K), 396+40
SAFE_X = AV_X + AV_D + round(20*K)
NAME, ROLE = 'Eduardo Gamboa', 'Fisioterapeuta y desarrollador web'

def chrome(d):
    d.rectangle([0, 396-96, SAFE_X, 396], fill=(255, 90, 90, 22))
    d.line([(SAFE_X, 0), (SAFE_X, 396)], fill=(255, 90, 90, 60), width=2)
    box = [AV_X, AV_CY-AV_D//2, AV_X+AV_D, AV_CY+AV_D//2]
    d.ellipse(box, fill=(12, 15, 22, 255), outline=(255, 255, 255, 255), width=7)
    d.text((AV_X+AV_D//2, 396-34), 'FOTO', font=bold(24), fill=(150,165,185,255), anchor='mm')

def variant_a(d):   # texto a la izquierda, centrado vertical — el test más duro
    tx = SAFE_X + 60
    d.text((tx, 148), NAME, font=bold(60), fill=(255,255,255,255))
    d.text((tx, 226), ROLE, font=reg(36), fill=(228,234,244,255))

def variant_b(d):   # texto arriba a la derecha
    tx = 1584 - 70
    d.text((tx, 62),  NAME, font=bold(56), fill=(255,255,255,255), anchor='ra')
    d.text((tx, 134), ROLE, font=reg(34), fill=(228,234,244,255), anchor='ra')

os.makedirs('preview', exist_ok=True)
for f in sorted(glob.glob('banner/*.png')):
    im = Image.open(f).convert('RGBA')
    assert im.size == (1584, 396)
    for tag, fn in (('a-texto-izq', variant_a), ('b-texto-der', variant_b)):
        ov = Image.new('RGBA', im.size, (0,0,0,0)); d = ImageDraw.Draw(ov)
        chrome(d); fn(d)
        out = Image.alpha_composite(im, ov).convert('RGB')
        out.save('preview/' + os.path.basename(f).replace('.png', f'-{tag}.png'))
print('ok')
