#rsa-hybrid-crypto

Hybrid encryption module using RSA + AES-GCM
Supports large payloads (objects,strings,buffers,arrays).

To generate public and private key

commands to run:
touch <file-name>
ssh-keygen -t rsa -b 4096 -m PEM (will generate keys in two files <file-name> and <file-name>.pub)
ssh-keygen -f <file-name>.pub -e -m PEM > <file-name>.pem (will convert .pub file into .pem file)

Note:- .pub will have public key

##usage

```javascript
import { encrypt, decrypt } from "rsa-hybrid-crypto";

const payload = { name: "alice", age: "28" };
const encrypted = encrypt("your public key", payload);
const decrypted = decrypt(
  encrypted,
  "your PRIVATE_KEY",
  "passPhrase(optional)",
  "if you want parseJSON pass true"
);
```
