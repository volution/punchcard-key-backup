#!/usr/bin/python3




import hashlib, base64, re
import math




_script = open ("./generate-html.js", "rt") .read ()
_script = re.sub (r"\n+\s*\n+", "\n", "\n" + _script + "\n")
_script_sha256 = base64.b64encode (hashlib.sha256 (_script.encode ("ascii")) .digest ()) .decode ("ascii")

_style = open ("./generate-html.css", "rt") .read ()
_style = re.sub (r"\n+\s*\n+", "\n", "\n" + _style + "\n")
_style_sha256 = base64.b64encode (hashlib.sha256 (_style.encode ("ascii")) .digest ()) .decode ("ascii")

_cr80_svg = open ("./cr80.svg", "rt") .read ()
_cr80_svg_sha256 = base64.b64encode (hashlib.sha256 (_cr80_svg.encode ("ascii")) .digest ()) .decode ("ascii")
_cr80_svg_base64 = base64.b64encode (_cr80_svg.encode ("ascii")) .decode ("ascii")

_cr80_png = open ("./cr80.png", "rb") .read ()
_cr80_png_sha256 = base64.b64encode (hashlib.sha256 (_cr80_png) .digest ()) .decode ("ascii")
_cr80_png_base64 = base64.b64encode (_cr80_png) .decode ("ascii")




def _generate () :
	
	_blocks = []
	
	_blocks.append ("""<!DOCTYPE html>""")
	_blocks.append ("""<html lang="en">""")
	
	_blocks.append ("""<head>""")
	_blocks.append ("""<title>PunchCard Key Backup</title>""")
	
	_blocks.append ("""<meta charset="UTF-8" />""")
	_blocks.append ("""<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />""")
	
	_csp_policy = [
			
			"base-uri 'none'",
			"default-src 'none'",
			f"script-src-elem 'sha256-{_script_sha256}'",
			f"style-src-elem 'sha256-{_style_sha256}'",
			"img-src data:",
			"form-action 'none'",
			
			"upgrade-insecure-requests",
			"block-all-mixed-content",
			
			#  NOTE:  Not allowed via `<meta>`!
			"sandbox",
			"frame-ancestors 'none'",
		]
	_csp_policy = "; ".join (_csp_policy)
	_blocks.append (f"""<meta http-equiv="Content-Security-Policy" content="{_csp_policy}" />""")
	
	_blocks.append ("""<meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, minimum-scale=0.5, maximum-scale=2.0, user-scalable=yes" />""")
	_blocks.append ("""<meta name="color-scheme" content="dark light" />""")
	_blocks.append ("""<link rel="icon" href="data:image/x-icon;base64," />""")
	
	_blocks.append (f"""<style type="text/css" integrity="sha256-{_style_sha256}">{_style}</style>""")
	_blocks.append (f"""<script type="text/javascript" integrity="sha256-{_script_sha256}">{_script}</script>""")
	
	_blocks.append ("""</head>""")
	
	_blocks.append ("""<body>""")
	
	_blocks.append ("""<main id="pckb--main" class="pckb--main-wrapper">""")
	_blocks.append ("""<div class="pckb--main-content">""")
	
	
	_blocks.append ("""<h2 class="pckb--main-title pckb--text">PunchCard Key Backup</h2>""")
	
	if True :
		_blocks.append (f"""<img class="pckb--cr80" alt="CR80 (standard ID card) stencil" integrity="sha256-{_cr80_png_sha256}" width="480" height="320" src="data:image/png;base64,{_cr80_png_base64}" />""")
	else :
		_blocks.append (f"""<img class="pckb--cr80" alt="CR80 (standard ID card) stencil" integrity="sha256-{_cr80_svg_sha256}" src="data:image/svg+xml;base64,{_cr80_svg_base64}" />""")
	
	_blocks.append ("""<noscript class="pckb--knobs-admonition pckb--text">Unfortunately, JavaScript is required to execute the encoder / decoder!</noscript>""")
	
	
	_blocks.append ("""<div id="pckb--knobs" class="pckb--knobs pckb--knobs-disabled">""")
	
	
	_blocks.append ("""<div class="pckb--key-bits">""")
	_blocks.append ("""<div class="pckb--bits-wrapper">""")
	for _word_index in range (2) :
		_blocks.append ("""<div class="pckb--word-bits">""")
		_blocks.append (f"""<p class="pckb--word-label">key word { _word_index + 1 }</p>""")
		for _bit_row in range (8) :
			_blocks.append ("""<div class="pckb--word-bits-row">""")
			for _bit_column in range (8) :
				_blocks.append ("""<span class="pckb--bit-wrapper">""")
				_bit_index = (_word_index * 64) + (_bit_row * 8) + _bit_column
				_bit_tooltip = "key bit %03d, (word %d, row %d, column %d)" % (_bit_index, _word_index + 1, _bit_row + 1, _bit_column + 1)
				_blocks.append (f"""<input id="pckb--key-bit-checkbox--{_word_index}-{_bit_row}-{_bit_column}" type="checkbox" class="pckb--bit-checkbox" title="{_bit_tooltip}" />""")
				_blocks.append ("""</span>""")
			_blocks.append ("""</div>""")
		_blocks.append ("""</div>""")
	_blocks.append ("""</div>""")
	_blocks.append ("""</div>""")
	
	
	_blocks.append ("""<div class="pckb--crc-bits">""")
	_blocks.append ("""<div class="pckb--bits-wrapper">""")
	for _word_index in range (2) :
		_blocks.append ("""<div class="pckb--word-bits">""")
		_blocks.append (f"""<p class="pckb--word-label">crc word {_word_index + 1}</p>""")
		for _bit_row in range (1) :
			_blocks.append ("""<span class="pckb--word-bits-row">""")
			for _bit_column in range (8) :
				_blocks.append ("""<span class="pckb--bit-wrapper">""")
				_bit_index = (_word_index * 8) + _bit_column
				_bit_tooltip = "crc bit %02d, (word %d, column %d)" % (_bit_index, _word_index + 1, _bit_column + 1)
				_blocks.append (f"""<input id="pckb--crc-bit-checkbox--{_bit_index}" type="checkbox" class="pckb--bit-checkbox" title="{_bit_tooltip}" disabled="disabled" />""")
				_blocks.append ("""</span>""")
			_blocks.append ("""</span>""")
		_blocks.append ("""</div>""")
	_blocks.append ("""</div>""")
	_blocks.append ("""</div>""")
	
	
	_blocks.append ("""<div class="pckb--outputs">""")
	
	_blocks.append ("""<div class="pckb--output-pair">""")
	_blocks.append ("""<label class="pckb--output-label">key txt</label>""")
	_blocks.append ("""<input id="pckb--key-txt--input" class="pckb--output-field" pattern="[!-~ ]*" />""")
	_blocks.append ("""</div>""")
	
	_blocks.append ("""<div class="pckb--output-pair">""")
	_blocks.append ("""<label class="pckb--output-label">key b10</label>""")
	_blocks.append ("""<input id="pckb--key-b10--input" class="pckb--output-field" pattern="[0-9 ]*" />""")
	_blocks.append ("""</div>""")
	
	_blocks.append ("""<div class="pckb--output-pair">""")
	_blocks.append ("""<label class="pckb--output-label">key hex</label>""")
	_blocks.append ("""<input id="pckb--key-hex--input" class="pckb--output-field" pattern="[0-9a-fA-F ]*" />""")
	_blocks.append ("""</div>""")
	
	_blocks.append ("""</div>""")
	
	
	_blocks.append ("""<div class="pckb--buttons">""")
	_blocks.append ("""<button id="pckb--key-random--button" type="button" class="pckb--button">random</button>""")
	_blocks.append ("""<button id="pckb--key-reset--button" type="button" class="pckb--button">reset</button>""")
	_blocks.append ("""</div>""")
	
	
	_blocks.append ("""<div class="pckb--paste-wrapper">""")
	_blocks.append ("""<textarea id="pckb--paste--input" class="pckb--paste-field" rows="30" cols="65" disabled="disabled"></textarea>""")
	_blocks.append ("""</div>""")
	
	
	_blocks.append ("""</div>""")
	
	
	_blocks.append ("""</div>""")
	_blocks.append ("""</main>""")
	
	_blocks.append ("""</body>""")
	
	_blocks.append ("""</html>""")
	
	return _blocks


print (*_generate (), sep = "\n", end = "\n")


