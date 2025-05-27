#!/usr/bin/python3




import math




_script = open ("./generate-html.js") .read ()
_style = open ("./generate-html.css") .read ()
_cr80_svg = open ("./cr80.svg.b64") .read ()




def _generate () :
	
	_blocks = []
	
	_blocks.append ("<!DOCTYPE html>")
	_blocks.append ("<html lang='en'>")
	
	_blocks.append ("<head>")
	_blocks.append ("<title>PunchCard Key Backup</title>")
	
	_blocks.append ("<meta charset='utf-8' />")
	_blocks.append ("<meta name='viewport' content='width=device-width, height=device-height, initial-scale=1.0, minimum-scale=0.5, maximum-scale=2.0, user-scalable=yes' />")
	_blocks.append ("<meta name='color-scheme' content='dark light' />")
	
	_blocks.append ("<style>")
	_blocks.append (_style)
	_blocks.append ("</style>")
	
	_blocks.append ("<script>")
	_blocks.append (_script)
	_blocks.append ("</script>")
	
	_blocks.append ("</head>")
	
	_blocks.append ("<body>")
	
	_blocks.append ("<main id='pckb--main' class='pckb--bits-main'>")
	_blocks.append ("<div class='pckb--bits-main-content'>")
	
	_blocks.append (f"<h2>PunchCard Key Backup</h2>")
	
	_blocks.append (f"<img class='pckb--cr80' src='data:image/svg+xml;base64,{_cr80_svg}' />")
	
	_blocks.append ("<div class='pckb--key-bits'>")
	_blocks.append ("<div class='pckb--bits-wrapper'>")
	for _word_index in range (2) :
		_blocks.append ("<div class='pckb--word-bits'>")
		_blocks.append ("<p class='pckb--word-label'>key word %d</p>" % (_word_index + 1))
		for _bit_row in range (8) :
			_blocks.append ("<div class='pckb--word-bits-row'>")
			for _bit_column in range (8) :
				_blocks.append ("<span class='pckb--bit-wrapper'>")
				_bit_index = (_word_index * 64) + (_bit_row * 8) + _bit_column
				_bit_tooltip = "key bit %03d, (word %d, row %d, column %d)" % (_bit_index, _word_index + 1, _bit_row + 1, _bit_column + 1)
				_blocks.append (f"<input id='pckb--key-bit-checkbox--{_word_index}-{_bit_row}-{_bit_column}' type='checkbox' class='pckb--bit-checkbox' title='{_bit_tooltip}' onchange='pckb.key_bit_changed()' />")
				_blocks.append ("</span>")
			_blocks.append ("</div>")
		_blocks.append ("</div>")
	_blocks.append ("</div>")
	_blocks.append ("</div>")
	
	_blocks.append ("<div class='pckb--crc-bits'>")
	_blocks.append ("<div class='pckb--bits-wrapper'>")
	for _word_index in range (2) :
		_blocks.append ("<div class='pckb--word-bits'>")
		_blocks.append ("<p class='pckb--word-label'>crc word %d</p>" % (_word_index + 1))
		for _bit_row in range (1) :
			_blocks.append ("<span class='pckb--word-bits-row'>")
			for _bit_column in range (8) :
				_blocks.append ("<span class='pckb--bit-wrapper'>")
				_bit_index = (_word_index * 8) + _bit_column
				_bit_tooltip = "crc bit %02d, (word %d, column %d)" % (_bit_index, _word_index + 1, _bit_column + 1)
				_blocks.append (f"<input id='pckb--crc-bit-checkbox--{_bit_index}' type='checkbox' class='pckb--bit-checkbox' title='{_bit_tooltip}' disabled='disabled' />")
				_blocks.append ("</span>")
			_blocks.append ("</span>")
		_blocks.append ("</div>")
	_blocks.append ("</div>")
	_blocks.append ("</div>")
	
	_key_txt_length_max = math.floor (math.log (math.pow (2, 128), 26))
	_key_b10_length_max = math.ceil (math.log (math.pow (2, 128), 10))
	_key_hex_length_max = 128 // 8 * 2
	
	_blocks.append ("<div class='pckb--outputs'>")
	_blocks.append ("<div class='pckb--output-pair'><label class='pckb--output-label'>key txt</label>")
	_blocks.append (f"<input id='pckb--key-txt--input' class='pckb--output-field' onchange='pckb.key_txt_changed()' pattern='[!-~]*' minlength='0' maxlength='{_key_txt_length_max}' />")
	_blocks.append ("</div>")
	_blocks.append ("<div class='pckb--output-pair'><label class='pckb--output-label'>key b10</label>")
	_blocks.append (f"<input id='pckb--key-b10--input' class='pckb--output-field' onchange='pckb.key_b10_changed()' pattern='[0-9]*' minlength='0' maxlength='{_key_b10_length_max}' />")
	_blocks.append ("</div>")
	_blocks.append ("<div class='pckb--output-pair'><label class='pckb--output-label'>key hex</label>")
	_blocks.append (f"<input id='pckb--key-hex--input' class='pckb--output-field' onchange='pckb.key_hex_changed()' pattern='[0-9a-fA-F]*' minlength='0' maxlength='{_key_hex_length_max}' />")
	_blocks.append ("</div>")
	_blocks.append ("</div>")
	
	_blocks.append ("<div class='pckb--buttons'>")
	_blocks.append ("<button id='pckb--key-random--button' type='button' class='pckb--button' onclick='pckb.key_random()'>random</button>")
	_blocks.append ("<button id='pckb--key-reset--button' type='button' class='pckb--button' onclick='pckb.key_reset()'>reset</button>")
	_blocks.append ("</div>")
	
	_blocks.append ("</div>")
	_blocks.append ("</main>")
	
	_blocks.append ("</body>")
	
	_blocks.append ("</html>")
	
	for _block in _blocks :
		print (_block)


_generate ()


