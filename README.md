#rsa-hybrid-crypto

Hybrid encryption module using RSA + AES-GCM
Supports large payloads (objects,strings,buffers,arrays).

##usage

```javascript

import {encrypt,decrypt} from 'rsa-hybrid-crypto';

const payload = {name:"alice",age:"28"}
const encrypted = encrypt("your public key",payload);
const decrypted = decrypt(encrypted,"your PRIVATE_KEY",'passPhrase(optional)',"if you want parseJSON pass true")