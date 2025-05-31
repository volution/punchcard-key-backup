#!/usr/bin/python3




_bits_word_1 = [
    "11010111",
    "01001010",
    "11100100",
    "01111101",
    "11000110",
    "11110101",
    "10011001",
    "11010011",
]

_bits_word_2 = [
    "11111001",
    "11001011",
    "10000100",
    "01111011",
    "11010111",
    "01111101",
    "01101011",
    "01111100",
]




_k = bytes([int(_b, 2) for _b in _bits_word_1 + _bits_word_2])
assert len(_k) == 16




import random, binascii, hashlib

_k_b10 = int.from_bytes(_k, byteorder="big", signed=False)
_k_md5 = hashlib.md5(_k).hexdigest()
_k_hex = binascii.b2a_hex(_k).decode("ascii")

_k1 = _k[:8]
_k2 = _k[8:]
_c = binascii.crc_hqx(_k, 0)
_xk1 = [f"{_b:08b}" for _b in _k1]
_xk2 = [f"{_b:08b}" for _b in _k2]
_xc = f"{_c:016b}"
_xc1 = _xc[:8]
_xc2 = _xc[8:]

_xp = lambda _x : _x .replace("0", ".") .replace("1", "@")
_print = lambda _x1, _x2 : print( "|", _x1.count("1"), "", *_xp(_x1), "", *_xp(_x2), "", _x2.count("1"), "|", sep = "  " )
_print_cut = lambda _s : print( "|", _s * 62, "|", sep = "" )

_print_cut("-")
print( ">", "key b10", _k_b10, sep = "    " )
print( ">", "key hex", _k_hex, sep = "    " )
print( ">", "key md5", _k_md5, sep = "    " )
_print_cut("-") ; _print_cut(" ")
for _i in range(8) : _print(_xk1[_i], _xk2[_i]) ; _print_cut(" ")
_print_cut(" ")
print("|", " ", "",
    *[sum([_xk1[_j][_i].count("1") for _j in range(8)]) for _i in range(8)], "",
    *[sum([_xk2[_j][_i].count("1") for _j in range(8)]) for _i in range(8)], "", " ", "|", sep = "  " )
_print_cut(" ")
_print_cut("-") ; _print_cut(" ")
_print(_xc1, _xc2)
_print_cut(" ") ; _print_cut("-")

