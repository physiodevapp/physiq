from PIL import Image, ImageDraw, ImageFont
FDIR='/mnt/skills/examples/canvas-design/canvas-fonts'
bold=lambda s: ImageFont.truetype(f'{FDIR}/Outfit-Bold.ttf', s)
reg =lambda s: ImageFont.truetype(f'{FDIR}/Outfit-Regular.ttf', s)

items=[('01-fuerza-curva','01 · Fuerza — curva en vivo (dinamómetro)'),
       ('02-rom-rodilla','02 · ROM rodilla — izquierda / derecha'),
       ('03-equilibrio-estabilograma','03 · Equilibrio — estabilograma (COP)'),
       ('04-wiki-cicatrizacion','04 · Wiki — tiempos de cicatrización'),
       ('05-hub-suite','05 · Hub — rejilla de la suite'),
       ('06-extra-equilibrio-score','06 · extra — anillo de puntuación'),
       ('07-extra-fuerza-solo-curva','07 · extra — solo la curva de fuerza')]

BIG_W, SMALL_W, PAD, LBL = 900, 360, 26, 40
rows=[]
for name,label in items:
    big=Image.open(f'banner/{name}.png').resize((BIG_W, BIG_W*396//1584), Image.LANCZOS)
    sml=Image.open(f'banner/{name}.png').resize((SMALL_W, SMALL_W*396//1584), Image.LANCZOS)
    rows.append((label,big,sml))

RH = max(r[1].height for r in rows) + LBL + PAD
W  = PAD*3 + BIG_W + SMALL_W
H  = PAD + RH*len(rows)
sheet=Image.new('RGB',(W,H),(9,11,16)); d=ImageDraw.Draw(sheet)
y=PAD
for label,big,sml in rows:
    d.text((PAD,y), label, font=bold(24), fill=(232,238,248))
    sheet.paste(big,(PAD,y+LBL))
    sheet.paste(sml,(PAD*2+BIG_W, y+LBL+(big.height-sml.height)//2))
    d.text((PAD*2+BIG_W, y+LBL+(big.height-sml.height)//2 - 22),
           'a tamaño móvil', font=reg(18), fill=(130,145,168))
    y+=RH
sheet.save('preview/00-contact-sheet.png')
print(sheet.size)
