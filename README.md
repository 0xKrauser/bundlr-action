# bundlr-action
GitHub action to upload files, folders or static/SPA websites on Arweave through Bundlr Network

## Basic usage
- Top up your Bundlr balance for the desired currency and node [here](https://77bdlboxjqhuoboppw7jhdy5yexhmpjdyaylq7jl7ipiq6eyiyga.arweave.net/_8I1hddMD0cFz32-k48dwS52PSPAMLh9K_oeiHiYRgw/)
- Checkout your repo and use the action to upload files or folders inside it
```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: |
          yarn build
      - uses: bundlr-action@v1
        with:
          path: "./dist"
          private-key: ${{ secrets.PK }}
```

You can upload files too!
```yaml
- uses: bundlr-action@v1
  with:
    path: "./image.png"
    private-key: ${{ secrets.PK }}
```

## Inputs
#### private-key (required)
`private-key` is a required string input, it is strongly suggested to follow correct opsec practices and use this private key and its wallet only for this endeavor
To Do: Accept files as input
```
  private-key:
    description: "Private Key of the account that will fund the gas costs - Please use an address limited to this purpose, use Github secrets and use good opsec in general"
    required: true
```

#### path (required)
`path` is a required string input, it should target the file or folder you want to upload to Arweave, if no folder or file is found is found at the requested destination the action will fail
```
  path:
    description: "Location of the folder or file to upload"
    required: true
    default: "./dist"
```

#### bundlr-endpoint (optional)
`bundlr-endpoint` is a string input, a URL that acts as an endpoint for the Bundlr Network, defaults to `http://node1.bundlr.network`.

More about this at the official [Bundlr Network Docs](https://docs.bundlr.network/docs/bundlers)
```
    bundlr-endpoint:
    description: "Endpoint of the Bundlr Network which will handle the transaction"
    required: false
    default: "http://node1.bundlr.network"
```

#### bundlr-currency (optional)
`bundlr-currency` is a string that declares the currency used to cover costs when uploading to Bundlr Network. defaults to `matic`

More supported currencies at the official [Bundlr Network Docs](https://docs.bundlr.network/docs/currencies)
```
  bundlr-currency:
    description: "Currency used to pay fees to the Bundlr Network"
    required: false
    default: "matic"
```

#### bundlr-price-limit (optional)
`bundlr-price-limit` is a BigInt 18 decimal string that the declares the price limit over which the action will fail, defaults to `10000000000000000000` (10 MATIC)
```
  bundlr-price-limit:
    description: "Limit on the price of the upload, 18 decimals, fails action if the price of the transaction is greater"
    required: false
    default: "10000000000000000000"
```

#### index-file (optional)
`index-file` is a string input used when you want to upload a folder as a static website, defaults to `index.html`

**Q: What if I'm not uploading a folder?** A: You don't need to override it

**Q: What if I'm uploading a folder but there's no index.html?** A: You don't need to override it

**Q: What if I'm uploading a website but the entrypoint is main.html?** A: Override it as `main.html`

**Q: What if I'm uploading a folder, there's a index.html, but I don't want to upload it as website?** A: Override it as `false`

```
  index-file:
    description: 'Name of the index file for website upload, skipped if no file is found in the path (simply set to "false" to avoid uploading as website)'
    required: false
    default: "index.html"
```

#### tags (optional)
`tags` is a string that declares an array of meta tags that describe the Arweave transaction. It might be needed in order to better filter your transactions with tools such as GraphQL. 
Or if you want to set a content type for your data (e.g. `image/png`, `text/html` etc). This will affect how your data will be rendered in the browser.
Defaults to `[]`
Learn more at the official [Bundlr Network Docs](https://docs.bundlr.network/docs/client/tags)
```
  tags:
    description: "String that describes an array of tags, see Bundlr documentation"
    required: false
    default: "[]"
```

## Outputs

#### timestamp
`timestamp` returns the time of completion for the transaction

#### transaction-id
`transaction-id` returns the id of the transaction, files can be then fetched through arweave gateways.

E.g. `https://arweave.net${transaction-id}` will redirect to the file or website entrypoint you uploaded

## Non Action Outputs
When uploading a folder the Bundlr Client will generate a `out-manifest.csv` file in the parent folder of the path you specified

This is used as a diff in order to avoid, for example, uploading javascript chunks of your website that haven't been changed after a new build, thus saving on fees.

Actions don't keep this in permanent storage, if you want to take advantage of this feature you might want to add another step to your action in order to commit the newly generated `out-manifest.csv` file to be used at the next run.

## To Do

- Fix Node Flyout on Frontend
- Write tests
- Give the option to fund Bundlr contextually to the transaction, thus avoiding the step of going to the frontend or somewhere else to deposit funds to your Bundlr Balance. See [Lazy Funding](https://docs.bundlr.network/docs/client/examples/funding-your-account#lazy-funding)
- Give the option to upload the `out-manifest.csv` as another file on Arweave, in order to fetch it again at the next run (with a parameter like `out-manifest-id` maybe).
- Give the option to generate a html directory tree for non-website folders

## Troubleshoot
#### What to check in order if the action fails
- `path`
- `bundlr-currency`
- `bundlr-endpoint`
- whether you have enough balance of the specified currency in the bundlr endpoint of your choice to cover the transaction

#### My index.html is there but all my assets are missing! (`404`)
Use relative paths (e.g. `./index.js` instead of `/index.js`) and other precautions (such as using HashRouter on react) in order to not go outside of the transaction-id.

Some website frameworks are simply not friendly to this infrastructure and might be harder to setup. (e.g. Next.js)

You can search some literature regarding this searching for other examples of websites uploaded to Arweave or to IPFS

#### I uploaded an image but I can't see it!
Specify the proper `Content-Type` with the action input `tags`, check above for links and suggestions.



