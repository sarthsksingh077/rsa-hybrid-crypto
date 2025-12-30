#rsa-hybrid-crypto

Hybrid encryption module using RSA + AES-GCM
Supports large payloads (objects,strings,buffers,arrays).

You can generate RSA keys using the following commands:

# Create an empty file (optional)

touch <file-name>

# Generate a 4096-bit RSA key pair in PEM format

ssh-keygen -t rsa -b 4096 -m PEM -f <file-name>

# Convert the public key (.pub) into a .pem file

ssh-keygen -f <file-name>.pub -e -m PEM > <file-name>.pem

Notes:

<file-name> is the base name for your key files.

This will create:

<file-name> → private key

<file-name>.pub → public key

<file-name>.pem → PEM-formatted public key suitable for your module

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
