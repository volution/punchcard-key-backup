

# pckb -- PunchCard Key Backup


![punch card stencil](<./stencils/cr80--export.png>)




----




## <span id="about">About</span>

This small project
-- available live at
<https://volution.ro/pckb>
(or <https://purl.org/999> for long term permanence)
-- allows one to take any 128 bits of information,
and easily create
(**and especially easily recover**)
a backup of it into a physical medium,
by using the old and tried method of
[punched cards](<https://en.wikipedia.org/wiki/Punched_card>)
(hence the project's name).

For example,
the 128 bit number represented in hexadecimal as  `d74ae47dc6f599d3f9cb847bd77d6b7c`,
can be backed up as the following standard (CR80 ID) card sized aluminium sheet,
which can then be put into a safe place:

![example of aluminium card](./documentation/example-01.jpeg)

All of this can be achieved by anyone at home, with access only to the following:
* using the self-contained HTML at the link above (<https://volution.ro/pckb>),
  either by entering the data manually, or by generating random data,
  one can get the hole punching pattern;
* (this whole procedure is described in the [help](<./sources/generate-help.txt>),
  and you could consult it for more details;)
* from the same link above, or from [here](<./stencils/stencil--one--export.pdf>),
  one can print a standard (CR80 ID) card sized stencil,
  to be used as a guide for the hole punching;
* a small sheet of aluminium;
  (I've used a 0.5mm thick one I've bought from the hardware store for ~4 EUR;)
* a [punch tool](<https://en.wikipedia.org/wiki/Punch_(tool)>),
  used to mark (with the help of the stencil)
  where the holes should be punched;
* a small drill,
  used to actually punch the holes;
  (I've used a 1.00mm drill bit adapted to a standard screwdriver;)
* a cutter, to cut the aluminium steel sheet to the standard (CR80 ID) card size;
  (I've just used a ruler, and passed the cutter multiple times over the aluminium sheet,
  and in the end, it passed through;)
* (obviously, one can just use a wood plank, nail, and rock;)  :)

The recovery is as simple as:
* use the same self-contained HTML at the link above;
* make sure the checkboxes follow the punched holes pattern (for the key);
* check that the CRC checkboxes match the punched holes pattern (for the CRC);
* recover the base 10, hexadecimal, or text representation of the backendup information;

Alternatively, without any software,
just use simple binary to decimal (or other base) conversion as described
[on Wikipedia](<https://en.wikipedia.org/wiki/Binary_number#Conversion_to_and_from_other_numeral_systems>).




----




## <span id="faq">FAQ (Frequently asked questions)</span>


### How can I trust the HTML you've provided?

You can (and should) save it locally, and use it from your computer.

It doesn't load any external resources.
None;  even the images and attachments are saved as `data:` URIs,
thus embedded into the HTML itself.


### Do I even need the HTML you've provided?

You don't.

This is just one possible implementation,
mainly meant for experimentation.

You can easily just write the following snippet to generate the bit pattern:
```
python -c '_secret = "d74ae47dc6f599d3f9cb847bd77d6b7c" ; print (bin(int(_secret,16))[2:].rjust(128,"0"))'
```

And, for the reverse just write the following snippet:
```
python -c '_bits = "11010111010010101110010001111101110001101111010110011001110100111111100111001011100001000111101111010111011111010110101101111100" ; print (("%032x"%int(_bits,2)))'
```


### What if I have more than 128 bits to save?

Use a cryptographic tool such as
<https://github.com/FiloSottile/age>
or <https://github.com/gpg/gnupg>
to encrypt your secret data with a random 128 bit password (encoded into hexadecimal),
then backup the password as described above (by using the `key hex` input field),
and mirror your encrypted data to family and friends.


### How much redundancy is there in the resulting backup?

None, besides the 16 bits of CRC.

However,
by using sturdy materials
(such as a thick stainless steel sheet),
there shouldn't be much need for redundancy.


### Does it support secret sharing?

This is in fact, just a digital-to-physical-medium encoding scheme,
thus with enough imagination, it can support secret sharing.

See the Wikipedia page about [secret sharing](<https://en.wikipedia.org/wiki/Secret_sharing>)
for possible ideas.




----




## <span id="license">Notice (copyright and licensing)</span>


### Notice -- short version

This code and documents are licensed under CC BY 4.


### Notice -- long version

For details about the copyright and licensing, please consult the [`license.txt`](./documentation/license.txt) file in the [`documentation`](./documentation) folder.

If someone requires the sources and/or documentation to be released
under a different license, please email the authors,
stating the licensing requirements, accompanied by the reasons
and other details; then, depending on the situation, the authors might
release the sources and/or documentation under a different license.

