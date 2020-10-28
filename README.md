
# cdk-website

An [AWS CDK](https://github.com/awslabs/aws-cdk) construct to instantly deploy a static website on serverless infrastructure. Easy, fast, done.

## Installation

Use the package manager npm to install cdk-website.

```bash
npm install cdk-website
```

## Usage

```ts
import { Construct, Stack, StackProps } from '@aws-cdk/core'
import { WebsiteProps, Website } from 'cdk-website'

export class CdkStack extends Stack {
    constructor(scope: Construct, id: string, props: StackProps) {
        super(scope, id, props)

        const websiteProps: WebsiteProps = {
            domain: 'aws.com',
            subdomain: 'awesome-cdk',
            websiteFolder: '../website/dist',
            indexDoc: 'index.html',
            errorDoc: 'index.html',
        }

        new Website(this, `Website`, websiteProps).deploy()
    }
}

```

## Road map

 - [ ] Add more tests
 - [ ] Add support for only domain
 - [ ] Add more configurable options if needed


## Contributing

Contributions of all kinds are welcome and celebrated. Raise an issue, submit a PR, do the right thing.

To set up a dev environment:

1. Clone repo
2. `yarn install`

Development workflow (change code and run tests automatically):

```shell
yarn test:watch
```

Build (like CI):

```shell
yarn build
```

Release new versions:

```shell
yarn bump
```

And then publish as a PR.

## License

[Apache 2.0](https://github.com/eladb/cdk-watchful/blob/master/LICENSE)