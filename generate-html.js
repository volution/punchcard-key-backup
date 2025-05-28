
"use strict";


function pckb (pckb) {
	
	
	let __key_bit_checkboxes = undefined;
	let __crc_bit_checkboxes = undefined;
	
	let __key_txt_input = undefined;
	let __key_b10_input = undefined;
	let __key_hex_input = undefined;
	let __paste_input = undefined;
	
	let __key_random_button = undefined;
	let __key_reset_button = undefined;
	
	let __key_bytes = undefined;
	let __key_bits = undefined;
	let __crc_number = undefined;
	let __crc_bits = undefined;
	let __key_txt_mode = undefined;
	let __key_txt_string = undefined;
	let __key_b10_number = undefined;
	let __key_b10_string = undefined;
	let __key_hex_string = undefined;
	let __paste_string = undefined;
	
	let __key_bits_count_x = undefined;
	let __key_bits_count_y = undefined;
	let __crc_bits_count = undefined;
	
	
	function __dom_initialize () {
		
		__key_bit_checkboxes = new Array (128);
		for (let _word_index = 0; _word_index < 2; _word_index += 1) {
			for (let _bit_row = 0; _bit_row < 8; _bit_row += 1) {
				for (let _bit_column = 0; _bit_column < 8; _bit_column += 1) {
					const _bit_index = (_word_index * 64) + (_bit_row * 8) + _bit_column;
					__key_bit_checkboxes[_bit_index] = document.getElementById ("pckb--key-bit-checkbox--" + _word_index + "-" + _bit_row + "-" + _bit_column);
					__key_bit_checkboxes[_bit_index].onchange = key_bit_changed;
				}
			}
		}
		
		__crc_bit_checkboxes = new Array (16);
		for (let _bit_column = 0; _bit_column < 16; _bit_column += 1) {
			__crc_bit_checkboxes[_bit_column] = document.getElementById ("pckb--crc-bit-checkbox--" + _bit_column);
		}
		
		__key_txt_input = document.getElementById ("pckb--key-txt--input");
		__key_txt_input.onchange = key_txt_changed;
		
		__key_b10_input = document.getElementById ("pckb--key-b10--input");
		__key_b10_input.onchange = key_b10_changed;
		
		__key_hex_input = document.getElementById ("pckb--key-hex--input");
		__key_hex_input.onchange = key_hex_changed;
		
		__paste_input = document.getElementById ("pckb--paste--input");
		
		__key_random_button = document.getElementById ("pckb--key-random--button");
		__key_random_button.onclick = key_random;
		
		__key_reset_button = document.getElementById ("pckb--key-reset--button");
		__key_reset_button.onclick = key_reset;
		
		if ((__key_b10_number === undefined) && __test__enabled) {
			window.setTimeout (__test__execute, __test__interval);
		} else {
			key_bit_changed ();
		}
	}
	
	
	function __dom_refresh () {
		
		for (let _bit_index = 0; _bit_index < 128; _bit_index += 1) {
			__key_bit_checkboxes[_bit_index].checked = __key_bits[_bit_index];
		}
		for (let _bit_index = 0; _bit_index < 16; _bit_index += 1) {
			__crc_bit_checkboxes[_bit_index].checked = __crc_bits[_bit_index];
		}
		
		__key_txt_input.value = __key_txt_string;
		__key_b10_input.value = __key_b10_string;
		__key_hex_input.value = __key_hex_string;
		__paste_input.value = __paste_string;
		
		if (__key_b10_number != 0) {
			if (__key_txt_string == "") {
				__key_txt_input.placeholder = "(invalid)";
			} else {
				__key_txt_input.placeholder = "";
			}
			__key_b10_input.placeholder = "";
			__key_hex_input.placeholder = "";
			__paste_input.placeholder = "";
		} else {
			__key_txt_input.placeholder = "(input)";
			__key_b10_input.placeholder = "(input)";
			__key_hex_input.placeholder = "(input)";
			__paste_input.placeholder = "(waiting)";
		}
	}
	
	
	function __dom_enable (_enabled) {
		for (const _bit_checkbox of __key_bit_checkboxes)
			_bit_checkbox.disabled = !_enabled;
		for (const _bit_checkbox of __crc_bit_checkboxes)
			_bit_checkbox.disabled = true;
		__key_txt_input.disabled = !_enabled;
		__key_b10_input.disabled = !_enabled;
		__key_hex_input.disabled = !_enabled;
		__key_random_button.disabled = !_enabled;
		__key_reset_button.disabled = !_enabled;
		__paste_input.disabled = true;
	}
	
	function __dom_break () {
		__dom_enable (false);
		for (const _bit_checkbox of __key_bit_checkboxes)
			_bit_checkbox.checked = false;
		for (const _bit_checkbox of __crc_bit_checkboxes)
			_bit_checkbox.checked = false;
		__key_txt_input.value = "(tests failed)";
		__key_b10_input.value = "(tests failed)";
		__key_hex_input.value = "(tests failed)";
	}
	
	function key_bit_changed () {
		if (!__test__succeeded) return;
		let _key_b10 = BigInt (0);
		for (let _bit_index = 0; _bit_index < 128; _bit_index += 1) {
			_key_b10 <<= BigInt (1);
			if (__key_bit_checkboxes[_bit_index].checked)
				_key_b10 |= BigInt (1);
		}
		return key_refresh (_key_b10);
	}
	
	function key_b10_changed () {
		if (!__test__succeeded) return;
		const _key_b10_string = __key_b10_input.value.replaceAll (" ", "");
		if (_key_b10_string == "") {
			return key_refresh (BigInt (0));
		}
		if ((/^[0-9]*$/).test (_key_b10_string)) {
			const _key_b10 = BigInt (_key_b10_string);
			return key_refresh (_key_b10);
		} else {
			if (__test__index === undefined) {
				alert ("key b10 invalid!");
			} else {
				__test__failed += 1;
			}
			return key_refresh (undefined);
		}
	}
	
	function key_hex_changed () {
		if (!__test__succeeded) return;
		const _key_hex_string = __key_hex_input.value.replaceAll (" ", "");
		if (_key_hex_string == "") {
			return key_refresh (BigInt (0));
		}
		if ((/^[0-9a-fA-F]*$/).test (_key_hex_string)) {
			const _key_b10 = BigInt ((_key_hex_string != "") ? ("0x" + _key_hex_string) : 0);
			return key_refresh (_key_b10);
		} else {
			if (__test__index === undefined) {
				alert ("key hex invalid!");
			} else {
				__test__failed += 1;
			}
			return key_refresh (undefined);
		}
	}
	
	function key_txt_changed () {
		if (!__test__succeeded) return;
		const _key_txt_string = __key_txt_input.value.replaceAll (" ", "");
		if (_key_txt_string == "") {
			return key_refresh (BigInt (0));
		}
		if ((/^([bcdfghjlmnprstvz][aeiou])+$/).test (_key_txt_string)) {
			const _limit = BigInt (1) << BigInt (128 - 2 - 2 - 2);
			let _key_b10 = BigInt (1);
			for (let _char_column = 0; _char_column < _key_txt_string.length; _char_column += 2) {
				const _char_pair = _key_txt_string.substring (_char_column, _char_column + 2);
				const _char_index = __cvs_pair_to_index[_char_pair];
				_key_b10 = (_key_b10 * BigInt (__cvs_cardinality)) + BigInt (_char_index);
				if (_key_b10 >= _limit) {
					_key_b10 = _key_b10 / BigInt (__cvs_cardinality);
					if (__test__index === undefined) {
						alert ("key txt (cvs) truncated!");
					} else {
						__test__failed += 1;
					}
					break;
				}
			}
			_key_b10 = _key_b10 & ~_limit;
			_key_b10 = _key_b10 | (BigInt (1) << BigInt (126)) | (BigInt (2) << BigInt (124));
			return key_refresh (_key_b10);
		} else if ((/^([bcdfghjklmnpqrstvwxyz][aeiou])+$/).test (_key_txt_string)) {
			const _limit = BigInt (1) << BigInt (128 - 2 - 2 - 2);
			let _key_b10 = BigInt (1);
			for (let _char_column = 0; _char_column < _key_txt_string.length; _char_column += 2) {
				const _char_pair = _key_txt_string.substring (_char_column, _char_column + 2);
				const _char_index = __cva_pair_to_index[_char_pair];
				_key_b10 = (_key_b10 * BigInt (__cva_cardinality)) + BigInt (_char_index);
				if (_key_b10 >= _limit) {
					_key_b10 = _key_b10 / BigInt (__cva_cardinality);
					if (__test__index === undefined) {
						alert ("key txt (cva) truncated!");
					} else {
						__test__failed += 1;
					}
					break;
				}
			}
			_key_b10 = _key_b10 & ~_limit;
			_key_b10 = _key_b10 | (BigInt (1) << BigInt (126)) | (BigInt (1) << BigInt (124));
			return key_refresh (_key_b10);
		} else if ((/^[a-z]+$/).test (_key_txt_string)) {
			const _limit = BigInt (1) << BigInt (128 - 2 - 2);
			let _key_b10 = BigInt (1);
			for (const _char_txt of _key_txt_string) {
				const _char_code = _char_txt.codePointAt (0);
				const _char_index = _char_code - 97;
				_key_b10 = (_key_b10 * BigInt (26)) + BigInt (_char_index);
				if (_key_b10 >= _limit) {
					_key_b10 = _key_b10 / BigInt (26);
					if (__test__index === undefined) {
						alert ("key txt (a-z) truncated!");
					} else {
						__test__failed += 1;
					}
					break;
				}
			}
			_key_b10 = _key_b10 & ~_limit;
			_key_b10 = _key_b10 | (BigInt (1) << BigInt (126));
			return key_refresh (_key_b10);
		} else if ((/^[a-z0-9]+$/).test (_key_txt_string)) {
			const _limit = BigInt (1) << BigInt (128 - 2 - 0);
			let _key_b10 = BigInt (1);
			for (const _char_txt of _key_txt_string) {
				const _char_code = _char_txt.codePointAt (0);
				const _char_index = (_char_code >= 97) ? (_char_code - 97) : (_char_code - 48 + 26);
				_key_b10 = (_key_b10 * BigInt (36)) + BigInt (_char_index);
				if (_key_b10 >= _limit) {
					_key_b10 = _key_b10 / BigInt (36);
					if (__test__index === undefined) {
						alert ("key txt (a-z0-9) truncated!");
					} else {
						__test__failed += 1;
					}
					break;
				}
			}
			_key_b10 = _key_b10 & ~_limit;
			_key_b10 = _key_b10 | (BigInt (2) << BigInt (126));
			return key_refresh (_key_b10);
		} else if ((/^[A-Za-z0-9.-]+$/).test (_key_txt_string)) {
			const _limit = BigInt (1) << BigInt (128 - 2 - 5);
			let _key_b10 = BigInt (1);
			for (const _char_txt of _key_txt_string) {
				const _char_code = _char_txt.codePointAt (0);
				let _char_index;
				if ((_char_code >= 65) && (_char_code <= 90))
					_char_index = (_char_code - 65) + 0;
				else if ((_char_code >= 97) && (_char_code <= 122))
					_char_index = (_char_code - 97) + 26;
				else if ((_char_code >= 48) && (_char_code <= 57))
					_char_index = (_char_code - 48) + 26 + 26;
				else
					_char_index = (_char_code - 45) + 26 + 26 + 10;
				_key_b10 = (_key_b10 * BigInt (64)) + BigInt (_char_index);
				if (_key_b10 >= _limit) {
					_key_b10 = _key_b10 / BigInt (64);
					if (__test__index === undefined) {
						alert ("key txt (A-Za-z0-9) truncated!");
					} else {
						__test__failed += 1;
					}
					break;
				}
			}
			_key_b10 = _key_b10 & ~_limit;
			_key_b10 = _key_b10 | (BigInt (0) << BigInt (126));
			return key_refresh (_key_b10);
		} else if ((/^[!-~]+$/).test (_key_txt_string)) {
			const _limit = BigInt (1) << BigInt (128 - 2 - 0);
			let _key_b10 = BigInt (1);
			for (const _char_txt of _key_txt_string) {
				const _char_code = _char_txt.codePointAt (0);
				const _char_index = _char_code - 33;
				_key_b10 = (_key_b10 * BigInt (94)) + BigInt (_char_index);
				if (_key_b10 >= _limit) {
					_key_b10 = _key_b10 / BigInt (94);
					if (__test__index === undefined) {
						alert ("key txt (*) truncated!");
					} else {
						__test__failed += 1;
					}
					break;
				}
			}
			_key_b10 = _key_b10 & ~_limit;
			_key_b10 = _key_b10 | (BigInt (3) << BigInt (126));
			return key_refresh (_key_b10);
		} else {
			return key_refresh (undefined);
		}
	}
	
	
	function key_refresh (_key_b10_raw) {
		
		if (!__test__succeeded) return;
		
		if (_key_b10_raw === undefined) {
			_key_b10_raw = __key_b10_number;
		}
		if (_key_b10_raw === undefined) {
			return key_random ();
		}
		
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
		let _crc = _crc16_ccitt (_bytes);
		
		let _key_txt = "";
		let _key_txt_mode;
		{
			let _key_txt_seed = _key_b10;
			let _key_txt_mask = 2;
			_key_txt_mode = (Number (_key_txt_seed >> BigInt (128 - 2)) & ~(1 << 2)) * 10;
			if (_key_txt_mode == 10) {
				_key_txt_mask += 2;
				_key_txt_mode += Number (_key_txt_seed >> BigInt (128 - 4)) & ~(1 << 2);
			}
			_key_txt_seed = _key_txt_seed & (~ ((~ (BigInt (1) << BigInt (_key_txt_mask)) << BigInt (128 - _key_txt_mask))));
			while (true) {
				if (_key_txt_seed == 1) {
					break;
				} else if (_key_txt_seed == 0) {
					_key_txt = "";
					_key_txt_mode = -1;
					break;
				}
				if (_key_txt_mode == 11) {
					const _char_index = Number (_key_txt_seed % BigInt (__cva_cardinality));
					_key_txt_seed = _key_txt_seed / BigInt (__cva_cardinality);
					const _char_txt = __cva_index_to_pair[_char_index];
					_key_txt = _char_txt + ((_key_txt != "") ? " " : "") + _key_txt;
				} else if (_key_txt_mode == 12) {
					const _char_index = Number (_key_txt_seed % BigInt (__cvs_cardinality));
					_key_txt_seed = _key_txt_seed / BigInt (__cvs_cardinality);
					const _char_txt = __cvs_index_to_pair[_char_index];
					_key_txt = _char_txt + ((_key_txt != "") ? " " : "") + _key_txt;
				} else if (_key_txt_mode == 10) {
					const _char_index = Number (_key_txt_seed % BigInt (26));
					_key_txt_seed = _key_txt_seed / BigInt (26);
					const _char_code = 97 + _char_index;
					const _char_txt = String.fromCodePoint (_char_code);
					_key_txt = _char_txt + _key_txt;
				} else if (_key_txt_mode == 20) {
					const _char_index = Number (_key_txt_seed % BigInt (36));
					_key_txt_seed = _key_txt_seed / BigInt (36);
					const _char_code = (_char_index < 26) ? (97 + _char_index) : (48 + _char_index - 26);
					const _char_txt = String.fromCodePoint (_char_code);
					_key_txt = _char_txt + _key_txt;
				} else if (_key_txt_mode == 30) {
					const _char_index = Number (_key_txt_seed % BigInt (94));
					_key_txt_seed = _key_txt_seed / BigInt (94);
					const _char_code = 33 + _char_index;
					const _char_txt = String.fromCodePoint (_char_code);
					_key_txt = _char_txt + _key_txt;
				} else if (_key_txt_mode == 0) {
					const _char_index = Number (_key_txt_seed % BigInt (64));
					_key_txt_seed = _key_txt_seed / BigInt (64);
					let _char_code;
					if (_char_index < 26)
						_char_code = (65 + _char_index - 0);
					else if (_char_index < (26 + 26))
						_char_code = (97 + _char_index - 26);
					else if (_char_index < (26 + 26 + 10))
						_char_code = (48 + _char_index - 26 - 26);
					else
						_char_code = (45 + _char_index - 26 - 26 - 10);
					const _char_txt = String.fromCodePoint (_char_code);
					_key_txt = _char_txt + _key_txt;
				} else {
					_key_txt = "";
					_key_txt_mode = -1;
					break;
				}
			}
		}
		
		const _key_bits = new Array (128);
		const _key_bits_count_x = new Array (16) .fill (0);
		const _key_bits_count_y = new Array (16) .fill (0);
		for (let _bit_row = 0; _bit_row < 8; _bit_row += 1) {
			for (let _word_index = 0; _word_index < 2; _word_index += 1) {
				for (let _bit_column = 0; _bit_column < 8; _bit_column += 1) {
					const _bit_index = (_word_index * 64) + (_bit_row * 8) + _bit_column;
					const _byte_subindex = _bit_index % 8;
					const _byte_index = (_bit_index - _byte_subindex) / 8;
					const _bit_value = (_bytes[_byte_index] >> (7 - _byte_subindex)) & 1;
					_key_bits[_bit_index] = _bit_value;
					_key_bits_count_x[(_word_index * 8) + _bit_row] += _bit_value;
					_key_bits_count_y[(_word_index * 8) + _bit_column] += _bit_value;
				}
			}
		}
		const _crc_bits = new Array (16);
		const _crc_bits_count = new Array (2) .fill (0);
		for (let _bit_index = 0; _bit_index < 16; _bit_index += 1) {
			const _bit_value = (_crc >> (15 - _bit_index)) & 1;
			_crc_bits[_bit_index] = _bit_value;
			_crc_bits_count[(_bit_index - (_bit_index % 8)) / 8] += _bit_value;
		}
		
		const _key_b10_string = _key_b10.toString ();
		
		let _paste = [];
		let _paste_cut = "|--------------------------------------------------------------|";
		let _paste_bar = "|                                                              |";
		_paste.push (_paste_cut);
		if (_key_txt != "")
			_paste.push ("|" + ("   key txt  >>  " + _key_txt.replaceAll (" ", "")) .padEnd (_paste_cut.length - 2) + "|");
		else
			_paste.push ("|" + ("   key txt  !!") .padEnd (_paste_cut.length - 2) + "|");
		_paste.push ("|" + ("   key b10  >>  " + _key_b10_string) .padEnd (_paste_cut.length - 2) + "|");
		_paste.push ("|" + ("   key hex  >>  " + _key_hex) .padEnd (_paste_cut.length - 2) + "|");
		_paste.push (_paste_cut);
		_paste.push (_paste_bar);
		for (let _bit_row = 0; _bit_row < 8; _bit_row += 1) {
			let _paste_line = "|  ";
			_paste_line += "" + _key_bits_count_x[(0 * 8) + _bit_row] + "  ";
			for (let _word_index = 0; _word_index < 2; _word_index += 1) {
				for (let _bit_column = 0; _bit_column < 8; _bit_column += 1) {
					const _bit_index = (_word_index * 64) + (_bit_row * 8) + _bit_column;
					if ((_word_index == 1) && (_bit_column == 0))
						_paste_line += "    ";
					_paste_line += _key_bits[_bit_index] ? " @ " : " . ";
				}
			}
			_paste_line += "  " + _key_bits_count_x[(1 * 8) + _bit_row] + "";
			_paste_line += "  |";
			_paste.push (_paste_line);
			_paste.push (_paste_bar);
		}
		{
			_paste.push (_paste_bar);
			let _paste_line = "|     ";
			for (let _word_index = 0; _word_index < 2; _word_index += 1) {
				for (let _bit_column = 0; _bit_column < 8; _bit_column += 1) {
					if ((_word_index == 1) && (_bit_column == 0))
						_paste_line += "    ";
					_paste_line += " " + _key_bits_count_y[(_word_index * 8) + _bit_column] + " ";
				}
			}
			_paste_line += "     |";
			_paste.push (_paste_line);
			_paste.push (_paste_bar);
		}
		_paste.push (_paste_cut);
		{
			_paste.push (_paste_bar);
			let _paste_line = "|  ";
			_paste_line += "" + _crc_bits_count[0] + "  ";
			for (let _bit_column = 0; _bit_column < 16; _bit_column += 1) {
				if (_bit_column == 8)
					_paste_line += "    ";
				_paste_line += _crc_bits[_bit_column] ? " @ " : " . ";
			}
			_paste_line += "  " + _crc_bits_count[1] + "";
			_paste_line += "  |";
			_paste.push (_paste_line);
			_paste.push (_paste_bar);
		}
		_paste.push (_paste_cut);
		__paste_string = _paste.join ("\n");
		
		__key_bytes = _bytes;
		__key_bits = _key_bits;
		__key_bits_count_x = _key_bits_count_x;
		__key_bits_count_y = _key_bits_count_y;
		
		__crc_number = _crc;
		__crc_bits = _crc_bits;
		__crc_bits_count = _crc_bits_count;
		
		if (_key_b10 > 0) {
			__key_txt_string = _key_txt;
			__key_txt_mode = _key_txt_mode;
			__key_b10_number = _key_b10;
			__key_b10_string = _key_b10_string;
			__key_hex_string = _key_hex;
		} else {
			__key_txt_string = "";
			__key_txt_mode = -2;
			__key_b10_number = BigInt (0);
			__key_b10_string = "";
			__key_hex_string = "";
		}
		
		if (__key_b10_number != _key_b10_raw) {
			if (__test__index === undefined) {
				alert ("key truncated!");
			} else {
				__test__failed += 1;
			}
		}
		
		return __dom_refresh ();
	}
	
	
	function key_reset () {
		if (!__test__succeeded) return;
		key_refresh (BigInt (0));
	}
	
	function key_random () {
		if (!__test__succeeded) return;
		key_refresh (_key_generate ());
	}
	
	function _key_generate () {
		const _key_seeds = new BigUint64Array (2);
		crypto.getRandomValues (_key_seeds);
		const _key_b10 = (BigInt (_key_seeds[0]) << BigInt (64)) | BigInt (_key_seeds[1]);
		return (_key_b10);
	}
	
	
	pckb.__initialize = __dom_initialize;
	
	pckb.key_bit_changed = key_bit_changed;
	pckb.key_txt_changed = key_txt_changed;
	pckb.key_b10_changed = key_b10_changed;
	pckb.key_hex_changed = key_hex_changed;
	pckb.key_reset = key_reset;
	pckb.key_random = key_random;
	
	
	
	
	let __test__vectors = [
		
		{
			key_b10_string : "129405715901649668340211268476941990266",
			key_hex_string : "615aa262fdbda58aaf50326723ad797a",
			key_txt_string : "fuvitiliderarutujeconifahifohogirihida",
			key_txt_mode : 12,
			crc_number : 54567,
		},
		{
			key_b10_string : "127634112437235862071206592176394812654",
			key_hex_string : "60056f9796cec4b6a3903edf45df3cee",
			key_txt_string : "nahilogajahudafolulijinahojulematezo",
			key_txt_mode : 12,
			crc_number : 29140,
			key_hex_string_dual : "52ad5d1d808a4906ac3160ac2b830823",
		},
		
		{
			key_b10_string : "110603640824904936687205456241932490496",
			key_hex_string : "53357c838ccbecb861ea932a83a1d700",
			key_txt_string : "vedajaxokokewekudipofocexesotequwote",
			key_txt_mode : 11,
			crc_number : 4951,
		},
		
		{
			key_b10_string : "92121336848414492145574597577827583888",
			key_hex_string : "454dec92d2934cb05afc7c766c5a8790",
			key_txt_string : "dugfctxapnlwqcxsnbzchxkppo",
			key_txt_mode : 10,
			crc_number : 18914,
		},
		{
			key_b10_string : "85088214802972242082704378106661119942",
			key_hex_string : "400364e273262d1c851d115fa06127c6",
			key_txt_string : "yiesqtbjhkupxyljrnxavjba",
			key_txt_mode : 10,
			crc_number : 50696,
			key_hex_string_dual : "9c4205e941bb9558d136a38ae87eecf4",
		},
		
		{
			key_b10_string : "205269886151914689565406637013006327200",
			key_hex_string : "9a6d8ac345470bb6062254a33f189da0",
			key_txt_string : "ulz10pe6n44edg8op2kq0g72",
			key_txt_mode : 20,
			crc_number : 5235,
		},
		
		{
			key_b10_string : "286172883415773381985495046221813607292",
			key_hex_string : "d74ae47dc6f599d3f9cb847bd77d6b7c",
			key_txt_string : "!=:FX9NtvTmO/'~<\\>S",
			key_txt_mode : 30,
			crc_number : 46084,
		},
		
		{
			key_b10_string : "1684294727800762451474004771769973215",
			key_hex_string : "0144622437d611d79555caa8209c79df",
			key_txt_string : "RGIkN9YR15VVyqggnHnf",
			key_txt_mode : 0,
			crc_number : 2445,
		},
		{
			key_b10_string : "33532900053985126750087528707880000",
			key_hex_string : "0006754cb3c755ba2abecdcd08ed7440",
			key_txt_string : "nVMs8dVuiq-zc0I7XRA",
			key_txt_mode : 0,
			crc_number : 50548,
			key_hex_string_dual : "ea60c4b6f975180d032175d72d94c96a",
		},
		
		{
			key_b10_string : "47168027646745113250991940369283290814",
			key_hex_string : "237c3b4fca58c46a264d37bb1ac816be",
			key_txt_string : "",
			key_txt_mode : -1,
			crc_number : 17147,
		},
		{
			key_b10_string : "330858855078231141900554465331134321020",
			key_hex_string : "f8e918feadaca5ace2f7a156bf37d17c",
			key_txt_string : "",
			key_txt_mode : -1,
			crc_number : 7432,
		},
		{
			key_b10_string : "108138067969091014373750355512456477050",
			key_hex_string : "515aa262fdbda58aaf50326723ad797a",
			key_txt_string : "",
			key_txt_mode : -1,
			crc_number : 45113,
		},
		{
			key_b10_string : "235010124662613375119348511116225836300",
			key_hex_string : "b0cd4dbad6d7ed8f0cb0c56ce3c6750c",
			key_txt_string : "",
			key_txt_mode : -1,
			crc_number : 33605,
		},
		{
			key_b10_string : "44204631514214177107191510049129202120",
			key_hex_string : "2141809a19a88de6d4d0fc500aaf81c8",
			key_txt_string : "",
			key_txt_mode : -1,
			crc_number : 48784,
		},
		
		/*
		{
			key_b10_string : "",
			key_hex_string : "",
			key_txt_string : "",
			key_txt_mode : -2,
			crc_number : 0,
		},
		*/
	];
	
	let __test__index = undefined;
	let __test__subindex = undefined;
	let __test__failed = 0;
	let __test__succeeded = true;
	const __test__enabled = true;
	const __test__interval = 0;
	
	function __test__execute () {
		let _test_failed = false;
		if (__test__index !== undefined) {
			const _test_vector = __test__vectors[__test__index];
			const _test_failure = {};
			if (__key_b10_number != _test_vector.key_b10_number)
				_test_failure.key_b10_number = __key_b10_number;
			if (__key_b10_string != _test_vector.key_b10_string)
				_test_failure.key_b10_string = __key_b10_string;
			if (__key_hex_string != _test_vector.key_hex_string)
				_test_failure.key_hex_string = __key_hex_string;
			if (__key_txt_string.replaceAll (" ", "") != _test_vector.key_txt_string)
				_test_failure.key_txt_string = __key_txt_string;
			if (__key_txt_mode != _test_vector.key_txt_mode)
				_test_failure.key_txt_mode = __key_txt_mode;
			if (__crc_number != _test_vector.crc_number)
				_test_failure.crc_number = __crc_number;
			if (Object.keys (_test_failure) .length == 0) {
				_test_failed = false;
			} else {
				console.log ("test failed", __test__index, _test_failure, _test_vector);
				_test_failed = true;
			}
		} else {
			__dom_enable (false);
			__test__index = 0;
			__test__subindex = 0;
		}
		if (_test_failed) {
			__test__failed += 1;
		}
		if ((__test__subindex > 3) || _test_failed) {
			if (__test__vectors[__test__index].loop > 0) {
				__test__vectors[__test__index].loop -= 1;
			} else {
				__test__index += 1;
				__test__subindex = 0;
			}
		}
		if (__test__index >= __test__vectors.length) {
			if (__test__failed == 0) {
				__test__succeeded = true;
				__test__index = undefined;
				key_random ();
				__dom_enable (true);
			} else {
				__test__succeeded = false;
				__dom_break ();
				alert ("tests failed (" + __test__failed + ")");
			}
			return;
		}
		{
			if (__test__vectors[__test__index] === null)
				__test__vectors[__test__index] = {
						generate : true,
					};
			const _test_vector = {};
			Object.assign (_test_vector, __test__vectors[__test__index]);
			__test__vectors[__test__index] = _test_vector;
			if (_test_vector.generate) {
				while (true) {
					const _key_b10 = _key_generate ();
					key_refresh (_key_b10);
					Object.assign (_test_vector, {
							key_b10_number : _key_b10,
							key_b10_string : __key_b10_string,
							key_hex_string : __key_hex_string,
							key_txt_string : __key_txt_string.replaceAll (" ", ""),
							key_txt_mode : __key_txt_mode,
							crc_number : __crc_number,
						});
					if (__key_txt_string == "")
						continue;
					else
						break;
				}
				__test__subindex = 3;
			}
			if (_test_vector.key_b10_number === undefined) {
				_test_vector.key_b10_number = BigInt (_test_vector.key_b10_string);
			}
			window.setTimeout (__test__execute, __test__interval);
			switch (__test__subindex) {
				case 0 :
					key_refresh (_test_vector.key_b10_number);
					break;
				case 1 :
					__key_b10_input.value = _test_vector.key_b10_string;
					key_b10_changed ();
					break;
				case 2 :
					__key_hex_input.value = _test_vector.key_hex_string;
					key_hex_changed ();
					break;
				case 3 :
					if (_test_vector.key_txt_string != "") {
						__key_txt_input.value = _test_vector.key_txt_string;
						key_txt_changed ();
					}
					break;
			}
			__test__subindex += 1;
		}
	}
	
	function __test__execute_loop () {
		__test__vectors.push ({
				generate : true,
				loop : 128 * 1024 * 1024,
			});
		__test__execute ();
	}
	
	pckb.__test_once = function () {
			window.setTimeout (__test__execute, __test__interval);
		};
	pckb.__test_loop = function () {
			window.setTimeout (__test__execute_loop, __test__interval);
		};
	
	
	
	
	function _crc16_ccitt (_bytes) {
		let crc = 0;
		for (const b of _bytes) {
			for (let i = 0; i < 8; i += 1) {
				const bit = (((b >> (7 - i)) & 1) == 1);
				const c15 = (((crc >> 15) & 1) == 1);
				crc <<= 1;
				if (c15 ^ bit) crc ^= 0x1021;
			}
		}
		return (crc & 0xffff);
	}
	
	
	const __cvs_consonants = "bcdfghjlmnprstvz";
	const __cvs_vowels = "aeiou";
	const __cvs_pair_to_index = {};
	const __cvs_index_to_pair = [];
	for (const _consonant of __cvs_consonants) {
		for (const _vowel of __cvs_vowels) {
			const _pair = _consonant + _vowel;
			const _index = __cvs_index_to_pair.length;
			__cvs_pair_to_index[_pair] = _index;
			__cvs_index_to_pair.push (_pair);
		}
	}
	const __cvs_cardinality = __cvs_index_to_pair.length;
	
	const __cva_consonants = "bcdfghjklmnpqrstvwxyz";
	const __cva_vowels = "aeiou";
	const __cva_pair_to_index = {};
	const __cva_index_to_pair = [];
	for (const _consonant of __cva_consonants) {
		for (const _vowel of __cva_vowels) {
			const _pair = _consonant + _vowel;
			const _index = __cva_index_to_pair.length;
			__cva_pair_to_index[_pair] = _index;
			__cva_index_to_pair.push (_pair);
		}
	}
	const __cva_cardinality = __cva_index_to_pair.length;
}


pckb (pckb);


document.addEventListener ("DOMContentLoaded", function () {
		pckb.__initialize ();
	});

