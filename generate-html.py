#!/usr/bin/python3




import math




_style = """
	
	
	html:root,
	html:root > body {
		margin : 0px;
		padding : 0px;
	}
	
	.bits-main,
	.bits-main * {
		display : block;
		align-items : center;
		align-content : center;
		justify-content : center;
		flex-wrap : nowrap;
		flex-basis : auto;
		flex-grow : 1;
		flex-shrink : 1;
		box-sizing : border-box;
		left : 0px;
		right : 0px;
		top : 0px;
		bottom : 0px;
		margin : 0px;
		padding : 0px;
		color : inherit;
		background : transparent;
		font-family : inherit;
		font-size : inherit;
		line-height : inherit;
	}
	
	.bits-main {
		font-family : "JetBrains Mono NL", "JetBrains Mono", "Fira Mono", "Fira Sans", "Verdana", "Trebuchet MS", sans-serif;
		font-size : 16px;
		line-height : 24px;
	}
	
	.bits-main {
		overflow : auto;
	}
	
	.bits-main {
		display : flex;
		flex-direction : column;
	}
	.bits-main-content {
		display : flex;
		flex-direction : column;
	}
	.key-bits,
	.crc-bits,
	.outputs {
		display : flex;
		flex-direction : column;
	}
	.bits-wrapper {
		display : flex;
		flex-direction : row;
		flex-wrap : wrap;
	}
	.word-bits {
		display : flex;
		flex-direction : column;
	}
	.word-bits-row {
		display : flex;
		flex-direction : row;
	}
	.bit-wrapper {
		display : flex;
		flex-direction : row;
	}
	.output-pair {
		display : flex;
		flex-direction : row;
		flex-wrap : wrap;
	}
	
	.key-bits .bits-wrapper,
	.crc-bits .bits-wrapper {
		border : solid 1px;
	}
	.word-bits {
		margin : 0.5ex;
	}
	.bit-wrapper {
		border : solid 1px;
		margin : 0.5ex;
	}
	.bit-checkbox {
		width : 2ex;
		height : 2ex;
		border : none;
	}
	
	.output-label,
	.output-field {
		height : 1.1lh;
		margin : 0.5ex;
	}
	.output-field {
		border : solid 1px;
		padding-left : 0.5ch;
		padding-right : 0.5ch;
	}
	
	
	.bits-main-content > * {
		margin : 0.5ex;
	}
	.bits-main {
		max-width : 100vw;
	}
	.bits-main-content > *,
	.output-pair {
		width : 100%;
		width : -moz-available;
		max-width : 95vw;
	}
	.output-field {
		text-align: center;
		min-width : 10ch;
		max-width : 42ch;
		flex-grow : 1;
		flex-shrink : 1;
	}
	.output-label {
		text-align: center;
		min-width : 8ch;
		flex-grow : 0;
		flex-shrink : 0;
	}
	.bits-main-content > h2 {
		text-align : center;
	}
	
	
"""




_script = """
	
	
	"use strict";
	
	function _bit_changed () {
		let _key_b10 = BigInt (0);
		for (let _word_index = 0; _word_index < 2; _word_index += 1) {
			for (let _bit_row = 0; _bit_row < 8; _bit_row += 1) {
				for (let _bit_column = 0; _bit_column < 8; _bit_column += 1) {
					const _bit_checkbox = document.getElementById ("key-bit-" + _word_index + "-" + _bit_row + "-" + _bit_column);
					const _bit_value = (_bit_checkbox.checked ? 1 : 0);
					_key_b10 <<= BigInt (1);
					if (_bit_value)
						_key_b10 |= BigInt (_bit_value);
				}
			}
		}
		_refresh (_key_b10);
	}
	
	function _key_b10_changed () {
		const _key_b10_input = document.getElementById ("key-b10");
		const _key_b10_string = _key_b10_input.value.replaceAll (" ", "");
		if (/^[0-9 ]*$/.test (_key_b10_string)) {
			const _key_b10 = BigInt (_key_b10_string);
			_refresh (_key_b10);
		} else {
			_bit_changed ();
		}
	}
	
	function _key_hex_changed () {
		const _key_hex_input = document.getElementById ("key-hex");
		const _key_hex_string = _key_hex_input.value.replaceAll (" ", "") .replaceAll (":", "") .replaceAll ("-", "");
		if (/^[0-9a-fA-F ]*$/.test (_key_hex_string)) {
			const _key_b10 = BigInt ((_key_hex_string != "") ? ("0x" + _key_hex_string) : 0);
			_refresh (_key_b10);
		} else {
			_bit_changed ();
		}
	}
	
	function _key_txt_changed () {
		const _key_txt_input = document.getElementById ("key-txt");
		const _key_txt_string = _key_txt_input.value.replaceAll (" ", "");
		if (/^[!-~]*$/.test (_key_txt_string)) {
			let _key_b10 = BigInt (1);
			if (_key_txt_string == "") {
				_key_b10 = BigInt (0);
			} else {
				for (const _char_txt of _key_txt_string) {
					const _char_index = _char_txt.codePointAt (0) - 33;
					_key_b10 = (_key_b10 * BigInt (94)) + BigInt (_char_index);
				}
			}
			_refresh (_key_b10);
		} else {
			_bit_changed ();
		}
	}
	
	function _refresh (_key_b10_raw) {
		const _bytes = new Array (16) .fill (0);
		for (let _key_b10 = _key_b10_raw, _byte_index = 15; _key_b10 > 0; _key_b10 >>= BigInt (8), _byte_index -= 1) {
			_bytes[_byte_index] = Number (BigInt.asUintN (8, _key_b10));
		}
		let _key_b10 = BigInt (0);
		let _key_hex = "";
		for (const _byte of _bytes) {
			_key_b10 = (_key_b10 << BigInt (8)) | BigInt (_byte);
			_key_hex += ((_byte <= 0x0f) ? "0" : "") + _byte.toString (16);
		}
		for (let _word_index = 0; _word_index < 2; _word_index += 1) {
			for (let _bit_row = 0; _bit_row < 8; _bit_row += 1) {
				for (let _bit_column = 0; _bit_column < 8; _bit_column += 1) {
					const _bit_checkbox = document.getElementById ("key-bit-" + _word_index + "-" + _bit_row + "-" + _bit_column);
					const _bit_index = (_word_index * 64) + (_bit_row * 8) + _bit_column;
					const _byte_subindex = _bit_index % 8;
					const _byte_index = (_bit_index - _byte_subindex) / 8;
					const _bit_value = (_bytes[_byte_index] >> (7 - _byte_subindex)) & 1;
					_bit_checkbox.checked = _bit_value ? true : false;
				}
			}
		}
		let _crc = _crc16_ccitt (_bytes);
		for (let _crc_bit = 0; _crc_bit < 16; _crc_bit += 1) {
			const _bit_checkbox = document.getElementById ("crc-bit-" + (15 - _crc_bit));
			_bit_checkbox.checked = (_crc >> _crc_bit) & 1;
		}
		let _key_txt = "";
		{
			let _key_txt_seed = _key_b10;
			while (true) {
				if (_key_txt_seed == 1) {
					break;
				}
				if (_key_txt_seed == 0) {
					_key_txt = "";
					break;
				}
				const _char_index = Number (_key_txt_seed % BigInt (94));
				_key_txt_seed = _key_txt_seed / BigInt (94);
				const _char_txt = String.fromCodePoint (33 + _char_index);
				_key_txt = _char_txt + _key_txt;
			}
		}
		if (_key_b10 > 0) {
			_key_b10 = _key_b10.toString ();
		} else {
			_key_b10 = "";
			_key_hex = "";
		}
		const _key_txt_input = document.getElementById ("key-txt");
		const _key_b10_input = document.getElementById ("key-b10");
		const _key_hex_input = document.getElementById ("key-hex");
		_key_txt_input.value = _key_txt;
		_key_b10_input.value = _key_b10;
		_key_hex_input.value = _key_hex;
		
		if ((_key_txt == "") && (_key_b10 != "")) {
			_key_txt_input.placeholder = "(invalid)";
		} else {
			_key_txt_input.placeholder = "";
		}
	}
	
	function _crc16_ccitt (_bytes) {
		let crc = 0;
		for (const b of _bytes) {
			for (let i = 0; i < 8; i++) {
				const bit = ((b >> (7 - i) & 1) === 1);
				const c15 = ((crc >> 15 & 1) === 1);
				crc <<= 1;
				if (c15 ^ bit) crc ^= 0x1021;
			}
		}
		return (crc & 0xffff);
	}
	
	document.addEventListener ("DOMContentLoaded", function () {
			_bit_changed ();
		});
	
	
"""




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
	
	_blocks.append ("<main class='bits-main'>")
	_blocks.append ("<div class='bits-main-content'>")
	
	_blocks.append (f"<h2>PunchCard Key Backup</h2>")
	_blocks.append (f"<img class='cr80' src='data:image/svg+xml;base64,{_cr80_svg}' />")
	
	_blocks.append ("<div class='key-bits'>")
	_blocks.append ("<div class='bits-wrapper'>")
	for _word_index in range (2) :
		_blocks.append ("<div class='word-bits'>")
		_blocks.append ("<p class='word-label'>key word %d</p>" % (_word_index + 1))
		for _bit_row in range (8) :
			_blocks.append ("<div class='word-bits-row'>")
			for _bit_column in range (8) :
				_blocks.append ("<span class='bit-wrapper'>")
				_bit_index = (_word_index * 64) + (_bit_row * 8) + _bit_column
				_bit_tooltip = "key bit %03d, (word %d, row %d, column %d)" % (_bit_index, _word_index + 1, _bit_row + 1, _bit_column + 1)
				_blocks.append (f"<input id='key-bit-{_word_index}-{_bit_row}-{_bit_column}' type='checkbox' class='bit-checkbox' title='{_bit_tooltip}' onchange='_bit_changed()' />")
				_blocks.append ("</span>")
			_blocks.append ("</div>")
		_blocks.append ("</div>")
	_blocks.append ("</div>")
	_blocks.append ("</div>")
	
	_blocks.append ("<div class='crc-bits'>")
	_blocks.append ("<div class='bits-wrapper'>")
	for _word_index in range (2) :
		_blocks.append ("<div class='word-bits'>")
		_blocks.append ("<p class='word-label'>crc word %d</p>" % (_word_index + 1))
		for _bit_row in range (1) :
			_blocks.append ("<span class='word-bits-row'>")
			for _bit_column in range (8) :
				_blocks.append ("<span class='bit-wrapper'>")
				_bit_index = (_word_index * 8) + _bit_column
				_bit_tooltip = "crc bit %02d, (word %d, column %d)" % (_bit_index, _word_index + 1, _bit_column + 1)
				_blocks.append (f"<input id='crc-bit-{_bit_index}' type='checkbox' class='bit-checkbox' title='{_bit_tooltip}' disabled='disabled' />")
				_blocks.append ("</span>")
			_blocks.append ("</span>")
		_blocks.append ("</div>")
	_blocks.append ("</div>")
	_blocks.append ("</div>")
	
	_key_txt_length_max = math.floor (math.log (math.pow (2, 128), 94))
	_key_b10_length_max = math.ceil (math.log (math.pow (2, 128), 10))
	_key_hex_length_max = 128 // 8 * 2
	
	_blocks.append ("<div class='outputs'>")
	_blocks.append ("<div class='output-pair'><label class='output-label'>key txt</label>")
	_blocks.append (f"<input id='key-txt' class='output-field' onchange='_key_txt_changed()' pattern='[!-~]*' minlength='0' maxlength='{_key_txt_length_max}' />")
	_blocks.append ("</div>")
	_blocks.append ("<div class='output-pair'><label class='output-label'>key b10</label>")
	_blocks.append (f"<input id='key-b10' class='output-field' onchange='_key_b10_changed()' pattern='[0-9]*' minlength='0' maxlength='{_key_b10_length_max}' />")
	_blocks.append ("</div>")
	_blocks.append ("<div class='output-pair'><label class='output-label'>key hex</label>")
	_blocks.append (f"<input id='key-hex' class='output-field' onchange='_key_hex_changed()' pattern='[0-9a-fA-F]*' minlength='0' maxlength='{_key_hex_length_max}' />")
	_blocks.append ("</div>")
	_blocks.append ("</div>")
	
	_blocks.append ("</div>")
	_blocks.append ("</main>")
	
	_blocks.append ("</body>")
	
	_blocks.append ("</html>")
	
	for _block in _blocks :
		print (_block)


_generate ()


