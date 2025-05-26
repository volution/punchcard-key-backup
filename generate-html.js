
"use strict";


function pckb (pckb) {
	
	
	let __key_bit_checkboxes = undefined;
	let __crc_bit_checkboxes = undefined;
	
	let __key_txt_input = undefined;
	let __key_b10_input = undefined;
	let __key_hex_input = undefined;
	
	let __key_bytes = undefined;
	let __crc_number = undefined;
	let __key_txt_string = undefined;
	let __key_b10_number = undefined;
	let __key_b10_string = undefined;
	let __key_hex_string = undefined;
	
	__key_b10_number = BigInt ("286172883415773381985495046221813607292");
	
	
	function __dom_initialize () {
		
		__key_bit_checkboxes = new Array (128);
		for (let _word_index = 0; _word_index < 2; _word_index += 1) {
			for (let _bit_row = 0; _bit_row < 8; _bit_row += 1) {
				for (let _bit_column = 0; _bit_column < 8; _bit_column += 1) {
					const _bit_index = (_word_index * 64) + (_bit_row * 8) + _bit_column;
					__key_bit_checkboxes[_bit_index] = document.getElementById ("key-bit-" + _word_index + "-" + _bit_row + "-" + _bit_column);
				}
			}
		}
		
		__crc_bit_checkboxes = new Array (16);
		for (let _bit_column = 0; _bit_column < 16; _bit_column += 1) {
			__crc_bit_checkboxes[_bit_column] = document.getElementById ("crc-bit-" + _bit_column);
		}
		
		__key_txt_input = document.getElementById ("key-txt");
		__key_b10_input = document.getElementById ("key-b10");
		__key_hex_input = document.getElementById ("key-hex");
		
		return key_refresh (undefined);
	}
	
	
	function __dom_refresh () {
		
		for (let _bit_index = 0; _bit_index < 128; _bit_index += 1) {
			const _byte_subindex = _bit_index % 8;
			const _byte_index = (_bit_index - _byte_subindex) / 8;
			const _bit_value = (__key_bytes[_byte_index] >> (7 - _byte_subindex)) & 1;
			__key_bit_checkboxes[_bit_index].checked = _bit_value ? true : false;
		}
		
		for (let _bit_index = 0; _bit_index < 16; _bit_index += 1) {
			__crc_bit_checkboxes[15 - _bit_index].checked = (__crc_number >> _bit_index) & 1;
		}
		
		__key_txt_input.value = __key_txt_string;
		__key_b10_input.value = __key_b10_string;
		__key_hex_input.value = __key_hex_string;
		
		if (__key_b10_number != 0) {
			if (__key_txt_string == "") {
				__key_txt_input.placeholder = "(invalid)";
			} else {
				__key_txt_input.placeholder = "";
			}
			__key_b10_input.placeholder = "";
			__key_hex_input.placeholder = "";
		} else {
			__key_txt_input.placeholder = "(input)";
			__key_b10_input.placeholder = "(input)";
			__key_hex_input.placeholder = "(input)";
		}
	}
	
	
	function key_bit_changed () {
		let _key_b10 = BigInt (0);
		for (let _bit_index = 0; _bit_index < 128; _bit_index += 1) {
			_key_b10 <<= BigInt (1);
			if (__key_bit_checkboxes[_bit_index].checked)
				_key_b10 |= BigInt (1);
		}
		return key_refresh (_key_b10);
	}
	
	function key_b10_changed () {
		const _key_b10_string = __key_b10_input.value.replaceAll (" ", "");
		if (/^[0-9]*$/.test (_key_b10_string)) {
			const _key_b10 = BigInt (_key_b10_string);
			return key_refresh (_key_b10);
		} else {
			alert ("key b10 invalid!");
			return key_refresh (undefined);
		}
	}
	
	function key_hex_changed () {
		const _key_hex_string = __key_hex_input.value.replaceAll (" ", "");
		if (/^[0-9a-fA-F]*$/.test (_key_hex_string)) {
			const _key_b10 = BigInt ((_key_hex_string != "") ? ("0x" + _key_hex_string) : 0);
			return key_refresh (_key_b10);
		} else {
			alert ("key hex invalid!");
			return key_refresh (undefined);
		}
	}
	
	function key_txt_changed () {
		const _key_txt_string = __key_txt_input.value.replaceAll (" ", "");
		if (_key_txt_string == "") {
			return key_refresh (BigInt (0));
		}
		const _limit = (BigInt (1) << BigInt (126)) - BigInt (1);
		if (/^[a-z]*$/.test (_key_txt_string)) {
			let _key_b10 = BigInt (1);
			for (const _char_txt of _key_txt_string) {
				const _char_code = _char_txt.codePointAt (0);
				const _char_index = _char_code - 97;
				_key_b10 = (_key_b10 * BigInt (26)) + BigInt (_char_index);
				if (_key_b10 >= _limit) {
					_key_b10 = _key_b10 / BigInt (26);
					alert ("key txt truncated!");
					break;
				}
			}
			_key_b10 = _key_b10 | (BigInt (1) << BigInt (126));
			return key_refresh (_key_b10);
		} else if (/^[a-z0-9]*$/.test (_key_txt_string)) {
			let _key_b10 = BigInt (1);
			for (const _char_txt of _key_txt_string) {
				const _char_code = _char_txt.codePointAt (0);
				const _char_index = (_char_code >= 97) ? (_char_code - 97) : (_char_code - 48 + 26);
				_key_b10 = (_key_b10 * BigInt (36)) + BigInt (_char_index);
				if (_key_b10 >= _limit) {
					_key_b10 = _key_b10 / BigInt (36);
					alert ("key txt truncated!");
					break;
				}
			}
			_key_b10 = _key_b10 | (BigInt (2) << BigInt (126));
			return key_refresh (_key_b10);
		} else if (/^[a-zA-Z0-9.-]*$/.test (_key_txt_string)) {
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
					alert ("key txt truncated!");
					break;
				}
			}
			_key_b10 = _key_b10 | (BigInt (0) << BigInt (126));
			return key_refresh (_key_b10);
		} else if (/^[!-~]*$/.test (_key_txt_string)) {
			let _key_b10 = BigInt (1);
			for (const _char_txt of _key_txt_string) {
				const _char_code = _char_txt.codePointAt (0);
				const _char_index = _char_code - 33;
				_key_b10 = (_key_b10 * BigInt (94)) + BigInt (_char_index);
				if (_key_b10 >= _limit) {
					_key_b10 = _key_b10 / BigInt (94);
					alert ("key txt truncated!");
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
		
		__key_bytes = _bytes;
		__crc_number = _crc;
		__key_b10_number = _key_b10;
		
		if (__key_b10_number > 0) {
			__key_txt_string = _key_txt;
			__key_b10_string = _key_b10.toString ();
			__key_hex_string = _key_hex;
		} else {
			__key_txt_string = "";
			__key_b10_string = "";
			__key_hex_string = "";
		}
		
		if (__key_b10_number != _key_b10_raw) {
			alert ("key truncated!");
		}
		
		return __dom_refresh ();
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
	
	
	function key_reset () {
		key_refresh (BigInt (0));
	}
	
	function key_random () {
		const _key_seeds = new BigUint64Array (2);
		crypto.getRandomValues (_key_seeds);
		const _key_b10 = _key_seeds[0] * _key_seeds[1];
		key_refresh (BigInt (_key_b10));
	}
	
	
	pckb.__initialize = __dom_initialize;
	
	pckb.key_bit_changed = key_bit_changed;
	pckb.key_txt_changed = key_txt_changed;
	pckb.key_b10_changed = key_b10_changed;
	pckb.key_hex_changed = key_hex_changed;
	pckb.key_reset = key_reset;
	pckb.key_random = key_random;
}


pckb (pckb);


document.addEventListener ("DOMContentLoaded", function () {
		pckb.__initialize ();
	});

