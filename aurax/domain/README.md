# www.newtomeauto.com — deploy folder

Everything in this folder is the complete site for the custom domain. It
streams the 288 scroll frames and vehicle stills from
https://newtomeauto.higgsfield.app so the folder itself stays tiny.

## Publish on GitHub Pages (5 minutes)
1. Create a new public repository named `newtomeauto` under the
   mjunlimitedessentials account.
2. Upload the contents of this folder to its root (index.html, site.css,
   site.js, CNAME, .nojekyll).
3. Repository Settings → Pages → Source: "Deploy from a branch",
   Branch: main, Folder: / (root). Save.
4. Under Custom domain it should already read www.newtomeauto.com
   (from the CNAME file). Tick "Enforce HTTPS" once the certificate appears.

## GoDaddy DNS for newtomeauto.com
Delete the parked A record, then add:

| Type  | Name | Value                              | TTL |
|-------|------|------------------------------------|-----|
| A     | @    | 185.199.108.153                    | 600 |
| A     | @    | 185.199.109.153                    | 600 |
| A     | @    | 185.199.110.153                    | 600 |
| A     | @    | 185.199.111.153                    | 600 |
| CNAME | www  | mjunlimitedessentials.github.io    | 600 |

Propagation usually takes 10–60 minutes. The apex (newtomeauto.com) will
redirect to www automatically once Pages sees both records.
