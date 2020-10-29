# API Reference

**Classes**

Name|Description
----|-----------
[Website](#cdk-website-website)|A construct that will automatically deploy a static website or SPA to a specified domain.


**Structs**

Name|Description
----|-----------
[WebsiteProps](#cdk-website-websiteprops)|Props for the Website construct.



## class Website  <a id="cdk-website-website"></a>

A construct that will automatically deploy a static website or SPA to a specified domain.

It will take care to handle all the configuration and operation for S3, CloudFront, Route53.
It will also take care to re-deploy every time you make a change to your website, invalidating
the CloudFront distribution cache.

__Implements__: [IConstruct](#constructs-iconstruct), [IConstruct](#aws-cdk-core-iconstruct), [IConstruct](#constructs-iconstruct), [IDependable](#aws-cdk-core-idependable)
__Extends__: [Construct](#aws-cdk-core-construct)

### Initializer




```ts
new Website(scope: Construct, id: string, props: WebsiteProps)
```

* **scope** (<code>[Construct](#aws-cdk-core-construct)</code>)  *No description*
* **id** (<code>string</code>)  *No description*
* **props** (<code>[WebsiteProps](#cdk-website-websiteprops)</code>)  *No description*
  * **analyticsReporting** (<code>boolean</code>)  Include runtime versioning information in this Stack. __*Default*__: `analyticsReporting` setting of containing `App`, or value of 'aws:cdk:version-reporting' context key
  * **description** (<code>string</code>)  A description of the stack. __*Default*__: No description.
  * **env** (<code>[Environment](#aws-cdk-core-environment)</code>)  The AWS environment (account/region) where this stack will be deployed. __*Default*__: The environment of the containing `Stage` if available, otherwise create the stack will be environment-agnostic.
  * **stackName** (<code>string</code>)  Name to deploy the stack with. __*Default*__: Derived from construct path.
  * **synthesizer** (<code>[IStackSynthesizer](#aws-cdk-core-istacksynthesizer)</code>)  Synthesis method to use while deploying this stack. __*Default*__: `DefaultStackSynthesizer` if the `@aws-cdk/core:newStyleStackSynthesis` feature flag is set, `LegacyStackSynthesizer` otherwise.
  * **tags** (<code>Map<string, string></code>)  Stack tags that will be applied to all the taggable resources and the stack itself. __*Default*__: {}
  * **terminationProtection** (<code>boolean</code>)  Whether to enable termination protection for this stack. __*Default*__: false
  * **domain** (<code>string</code>)  the domain you want to deploy to. 
  * **indexDoc** (<code>string</code>)  the websiteIndexDocument of your S3 Bucket (also used as redirect on CloudFront errorConfigurations if you have not defined an errorDoc). 
  * **subdomain** (<code>string</code>)  the subdomain you want to deploy to. 
  * **websiteBuildFolder** (<code>string</code>)  local path to the website folder you want to deploy on S3. 
  * **certificateARN** (<code>string</code>)  the subdomain certificate ARN, if provided it will not create a new certification for the subdomain. __*Optional*__
  * **errorDoc** (<code>string</code>)  the websiteErrorDocument of your S3 Bucket, also used as redirect on CloudFront errorConfigurations. __*Optional*__



### Properties


Name | Type | Description 
-----|------|-------------
**props** | <code>[WebsiteProps](#cdk-website-websiteprops)</code> | <span></span>

### Methods


#### deploy() <a id="cdk-website-website-deploy"></a>



```ts
deploy(): void
```







## struct WebsiteProps  <a id="cdk-website-websiteprops"></a>


Props for the Website construct.



Name | Type | Description 
-----|------|-------------
**domain** | <code>string</code> | the domain you want to deploy to.
**indexDoc** | <code>string</code> | the websiteIndexDocument of your S3 Bucket (also used as redirect on CloudFront errorConfigurations if you have not defined an errorDoc).
**subdomain** | <code>string</code> | the subdomain you want to deploy to.
**websiteBuildFolder** | <code>string</code> | local path to the website folder you want to deploy on S3.
**analyticsReporting**? | <code>boolean</code> | Include runtime versioning information in this Stack.<br/>__*Default*__: `analyticsReporting` setting of containing `App`, or value of 'aws:cdk:version-reporting' context key
**certificateARN**? | <code>string</code> | the subdomain certificate ARN, if provided it will not create a new certification for the subdomain.<br/>__*Optional*__
**description**? | <code>string</code> | A description of the stack.<br/>__*Default*__: No description.
**env**? | <code>[Environment](#aws-cdk-core-environment)</code> | The AWS environment (account/region) where this stack will be deployed.<br/>__*Default*__: The environment of the containing `Stage` if available, otherwise create the stack will be environment-agnostic.
**errorDoc**? | <code>string</code> | the websiteErrorDocument of your S3 Bucket, also used as redirect on CloudFront errorConfigurations.<br/>__*Optional*__
**stackName**? | <code>string</code> | Name to deploy the stack with.<br/>__*Default*__: Derived from construct path.
**synthesizer**? | <code>[IStackSynthesizer](#aws-cdk-core-istacksynthesizer)</code> | Synthesis method to use while deploying this stack.<br/>__*Default*__: `DefaultStackSynthesizer` if the `@aws-cdk/core:newStyleStackSynthesis` feature flag is set, `LegacyStackSynthesizer` otherwise.
**tags**? | <code>Map<string, string></code> | Stack tags that will be applied to all the taggable resources and the stack itself.<br/>__*Default*__: {}
**terminationProtection**? | <code>boolean</code> | Whether to enable termination protection for this stack.<br/>__*Default*__: false



