
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
	let __key_txt_string = undefined;
	let __key_b10_number = undefined;
	let __key_b10_string = undefined;
	let __key_hex_string = undefined;
	let __paste_string = undefined;
	
	let __key_bits_count_x;
	let __key_bits_count_y;
	let __crc_bits_count;
	
	
	function __dom_initialize () {
		
		__key_bit_checkboxes = new Array (128);
		for (let _word_index = 0; _word_index < 2; _word_index += 1) {
			for (let _bit_row = 0; _bit_row < 8; _bit_row += 1) {
				for (let _bit_column = 0; _bit_column < 8; _bit_column += 1) {
					const _bit_index = (_word_index * 64) + (_bit_row * 8) + _bit_column;
					__key_bit_checkboxes[_bit_index] = document.getElementById ("pckb--key-bit-checkbox--" + _word_index + "-" + _bit_row + "-" + _bit_column);
				}
			}
		}
		
		__crc_bit_checkboxes = new Array (16);
		for (let _bit_column = 0; _bit_column < 16; _bit_column += 1) {
			__crc_bit_checkboxes[_bit_column] = document.getElementById ("pckb--crc-bit-checkbox--" + _bit_column);
		}
		
		__key_txt_input = document.getElementById ("pckb--key-txt--input");
		__key_b10_input = document.getElementById ("pckb--key-b10--input");
		__key_hex_input = document.getElementById ("pckb--key-hex--input");
		__paste_input = document.getElementById ("pckb--paste--input");
		
		__key_random_button = document.getElementById ("pckb--key-random--button");
		__key_reset_button = document.getElementById ("pckb--key-reset--button");
		
		if (__key_b10_number === undefined) {
			__dom_enable (false);
			window.setTimeout (__test__execute, __test__interval);
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
		const _limit = (BigInt (1) << BigInt (126)) - BigInt (1);
		if ((/^[a-z]*$/).test (_key_txt_string)) {
			let _key_b10 = BigInt (1);
			for (const _char_txt of _key_txt_string) {
				const _char_code = _char_txt.codePointAt (0);
				const _char_index = _char_code - 97;
				_key_b10 = (_key_b10 * BigInt (26)) + BigInt (_char_index);
				if (_key_b10 >= _limit) {
					_key_b10 = _key_b10 / BigInt (26);
					if (__test__index === undefined) {
						alert ("key txt truncated!");
					} else {
						__test__failed += 1;
					}
					break;
				}
			}
			_key_b10 = _key_b10 | (BigInt (1) << BigInt (126));
			return key_refresh (_key_b10);
		} else if ((/^[a-z0-9]*$/).test (_key_txt_string)) {
			let _key_b10 = BigInt (1);
			for (const _char_txt of _key_txt_string) {
				const _char_code = _char_txt.codePointAt (0);
				const _char_index = (_char_code >= 97) ? (_char_code - 97) : (_char_code - 48 + 26);
				_key_b10 = (_key_b10 * BigInt (36)) + BigInt (_char_index);
				if (_key_b10 >= _limit) {
					_key_b10 = _key_b10 / BigInt (36);
					if (__test__index === undefined) {
						alert ("key txt truncated!");
					} else {
						__test__failed += 1;
					}
					break;
				}
			}
			_key_b10 = _key_b10 | (BigInt (2) << BigInt (126));
			return key_refresh (_key_b10);
		} else if ((/^[a-zA-Z0-9.-]*$/).test (_key_txt_string)) {
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
						alert ("key txt truncated!");
					} else {
						__test__failed += 1;
					}
					break;
				}
			}
			_key_b10 = _key_b10 | (BigInt (0) << BigInt (126));
			return key_refresh (_key_b10);
		} else if ((/^[!-~]*$/).test (_key_txt_string)) {
			let _key_b10 = BigInt (1);
			for (const _char_txt of _key_txt_string) {
				const _char_code = _char_txt.codePointAt (0);
				const _char_index = _char_code - 33;
				_key_b10 = (_key_b10 * BigInt (94)) + BigInt (_char_index);
				if (_key_b10 >= _limit) {
					_key_b10 = _key_b10 / BigInt (94);
					if (__test__index === undefined) {
						alert ("key txt truncated!");
					} else {
						__test__failed += 1;
					}
					break;
				}
			}
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
		{
			let _key_txt_seed = _key_b10;
			let _key_txt_mode = Number (_key_txt_seed >> BigInt (126));
			_key_txt_seed = _key_txt_seed & ~ (BigInt (3) << BigInt (126));
			while (true) {
				if (_key_txt_seed == 1) {
					break;
				} else if (_key_txt_seed == 0) {
					_key_txt = "";
					break;
				}
				if (_key_txt_mode == 1) {
					const _char_index = Number (_key_txt_seed % BigInt (26));
					_key_txt_seed = _key_txt_seed / BigInt (26);
					const _char_code = 97 + _char_index;
					const _char_txt = String.fromCodePoint (_char_code);
					_key_txt = _char_txt + _key_txt;
				} else if (_key_txt_mode == 2) {
					const _char_index = Number (_key_txt_seed % BigInt (36));
					_key_txt_seed = _key_txt_seed / BigInt (36);
					const _char_code = (_char_index < 26) ? (97 + _char_index) : (48 + _char_index - 26);
					const _char_txt = String.fromCodePoint (_char_code);
					_key_txt = _char_txt + _key_txt;
				} else if (_key_txt_mode == 3) {
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
			const _bit_value = (_crc >> _bit_index) & 1;
			_crc_bits[_bit_index] = _bit_value;
			_crc_bits_count[(_bit_index - (_bit_index % 8)) / 8] += _bit_value;
		}
		
		const _key_b10_string = _key_b10.toString ();
		
		let _paste = [];
		let _paste_cut = "|--------------------------------------------------------------|";
		let _paste_bar = "|                                                              |";
		_paste.push (_paste_cut);
		if (_key_txt != "")
			_paste.push ("|" + ("   key txt  >>  " + _key_txt) .padEnd (_paste_cut.length - 2) + "|");
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
			__key_b10_number = _key_b10;
			__key_b10_string = _key_b10_string;
			__key_hex_string = _key_hex;
		} else {
			__key_txt_string = "";
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
		const _key_b10 = BigInt (_key_seeds[0]) * BigInt (_key_seeds[1]);
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
		{ // 01
			key_b10_number : BigInt ("92121336848414492145574597577827583888"),
			key_b10_string : "92121336848414492145574597577827583888",
			key_hex_string : "454dec92d2934cb05afc7c766c5a8790",
			key_txt_string : "dugfctxapnlwqcxsnbzchxkppo",
			crc_number : 18914,
		},
		{ // 10
			key_b10_number : BigInt ("205269886151914689565406637013006327200"),
			key_b10_string : "205269886151914689565406637013006327200",
			key_hex_string : "9a6d8ac345470bb6062254a33f189da0",
			key_txt_string : "ulz10pe6n44edg8op2kq0g72",
			crc_number : 5235,
		},
		{ // 00
			key_b10_number : BigInt ("47168027646745113250991940369283290814"),
			key_b10_string : "47168027646745113250991940369283290814",
			key_hex_string : "237c3b4fca58c46a264d37bb1ac816be",
			key_txt_string : "",
			crc_number : 17147,
		},
		{ // 11
			key_b10_number : BigInt ("330858855078231141900554465331134321020"),
			key_b10_string : "330858855078231141900554465331134321020",
			key_hex_string : "f8e918feadaca5ace2f7a156bf37d17c",
			key_txt_string : "",
			crc_number : 7432,
		},
		{ // 01
			key_b10_number : BigInt ("108138067969091014373750355512456477050"),
			key_b10_string : "108138067969091014373750355512456477050",
			key_hex_string : "515aa262fdbda58aaf50326723ad797a",
			key_txt_string : "",
			crc_number : 45113,
		},
		{ // 10
			key_b10_number : BigInt ("235010124662613375119348511116225836300"),
			key_b10_string : "235010124662613375119348511116225836300",
			key_hex_string : "b0cd4dbad6d7ed8f0cb0c56ce3c6750c",
			key_txt_string : "",
			crc_number : 33605,
		},
		{ // 00
			key_b10_number : BigInt ("44204631514214177107191510049129202120"),
			key_b10_string : "44204631514214177107191510049129202120",
			key_hex_string : "2141809a19a88de6d4d0fc500aaf81c8",
			key_txt_string : "",
			crc_number : 48784,
		},
		{ // 11
			key_b10_number : BigInt ("286172883415773381985495046221813607292"),
			key_b10_string : "286172883415773381985495046221813607292",
			key_hex_string : "d74ae47dc6f599d3f9cb847bd77d6b7c",
			key_txt_string : "!=:FX9NtvTmO/'~<\\>S",
			crc_number : 46084,
		},
		null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,
		null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,
		null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,
		null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,
	];
	
	let __test__index = undefined;
	let __test__subindex = undefined;
	let __test__failed = 0;
	let __test__succeeded = true;
	const __test__interval = 0;
	
	function __test__execute () {
		if (__test__index !== undefined) {
			const _test_vector = __test__vectors[__test__index];
			if (__key_b10_number != _test_vector.key_b10_number) {
				console.log ("test vector failed", __test__index, "key b10 number", __key_b10_number, _test_vector);
				__test__failed += 1;
			}
			if (__key_b10_string != _test_vector.key_b10_string) {
				console.log ("test vector failed", __test__index, "key b10 string", __key_b10_string, _test_vector);
				__test__failed += 1;
			}
			if (__key_hex_string != _test_vector.key_hex_string) {
				console.log ("test vector failed", __test__index, "key hex string", __key_hex_string, _test_vector);
				__test__failed += 1;
			}
			if (__key_txt_string != _test_vector.key_txt_string) {
				console.log ("test vector failed", __test__index, "key txt string", __key_txt_string, _test_vector);
				__test__failed += 1;
			}
			if (__crc_number != _test_vector.crc_number) {
				console.log ("test vector failed", __test__index, "crc number", __crc_number, _test_vector);
				__test__failed += 1;
			}
		}
		if (__test__index === undefined) {
			__test__index = 0;
			__test__subindex = 0;
		} else {
			if (__test__subindex > 4) {
				__test__index += 1;
				__test__subindex = 0;
			} else {
				__test__subindex += 1;
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
			if ((__test__vectors[__test__index] == null) || (__test__vectors[__test__index].generated)) {
				const _key_b10 = _key_generate ();
				key_refresh (_key_b10);
				__test__vectors[__test__index] = {
						key_b10_number : _key_b10,
						key_b10_string : __key_b10_string,
						key_hex_string : __key_hex_string,
						key_txt_string : __key_txt_string,
						crc_number : __crc_number,
						generated : true,
					};
			}
			const _test_vector = __test__vectors[__test__index];
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
		}
	}
	
	
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
}


pckb (pckb);


document.addEventListener ("DOMContentLoaded", function () {
		pckb.__initialize ();
	});

