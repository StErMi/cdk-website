import { DnsValidatedCertificate } from '@aws-cdk/aws-certificatemanager';
import {
  CloudFrontWebDistribution,
  OriginAccessIdentity,
  SSLMethod,
  SecurityPolicyProtocol,
} from '@aws-cdk/aws-cloudfront';
import {
  HostedZone,
  ARecord,
  RecordTarget,
  IHostedZone,
  RecordSet,
} from '@aws-cdk/aws-route53';
import { CloudFrontTarget } from '@aws-cdk/aws-route53-targets';
import { BlockPublicAccess, Bucket, BucketProps } from '@aws-cdk/aws-s3';
import { Source, BucketDeployment } from '@aws-cdk/aws-s3-deployment';
import { RemovalPolicy, StackProps, CfnOutput, Construct } from '@aws-cdk/core';

/**
 * Props for the Website construct.
 */
export interface WebsiteProps extends StackProps {
  /**
   * the websiteIndexDocument of your S3 Bucket (also used as redirect on CloudFront errorConfigurations
   * if you have not defined an errorDoc)
   */
  readonly indexDoc: string;

  /**
   * the websiteErrorDocument of your S3 Bucket, also used as redirect on CloudFront errorConfigurations
   */
  readonly errorDoc?: string;

  /**
   * local path to the website folder you want to deploy on S3
   */
  readonly websiteBuildFolder: string;

  /**
   * the domain you want to deploy to
   */
  readonly domain: string;

  /**
   * the subdomain you want to deploy to
   */
  readonly subdomain: string;

  /**
   * the subdomain certificate ARN, if provided it will not create a new certification for the subdomain
   */
  readonly certificateARN?: string;
}

/**
 * A construct that will automatically deploy a static website or SPA to a specified domain.
 * It will take care to handle all the configuration and operation for S3, CloudFront, Route53.
 * It will also take care to re-deploy every time you make a change to your website, invalidating
 * the CloudFront distribution cache.
 */
export class Website extends Construct {
  props: WebsiteProps;

  constructor(scope: Construct, id: string, props: WebsiteProps) {
    super(scope, id);
    this.props = props;
  }

  /**
   * Get the hosted zone for the specified website
   */
  private getHostedZone(): IHostedZone {
    const zone = HostedZone.fromLookup(this, 'Zone', {
      domainName: this.props.domain,
    });
    const fullDomain = `${this.props.subdomain}.${this.props.domain}`;
    new CfnOutput(this, 'Site', { value: 'https://' + fullDomain });
    return zone;
  }

  /**
   * Get the Origin Access Identity
   */
  private getAccessIdentity(websiteBucket: Bucket): OriginAccessIdentity {
    const accessIdentity = new OriginAccessIdentity(
      this,
      'OriginAccessIdentity',
      { comment: `${websiteBucket.bucketName}-access-identity` },
    );
    return accessIdentity;
  }

  /**
   * Get/Create the content bucket
   */
  private getS3Bucket(): Bucket {
    const bucketProps = {
      websiteIndexDocument: this.props.indexDoc,
      websiteErrorDocument: this.props.errorDoc,
      publicReadAccess: false,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      removalPolicy: RemovalPolicy.DESTROY,
    } as BucketProps;
    const bucket = new Bucket(this, 'WebsiteBucket', bucketProps);
    new CfnOutput(this, 'Bucket', { value: bucket.bucketName });

    return bucket;
  }

  /**
   * TLS certificate
   */
  private getCertificate(hostedZone: IHostedZone): DnsValidatedCertificate {
    const fullDomain = `${this.props.subdomain}.${this.props.domain}`;
    const certificate = new DnsValidatedCertificate(this, 'SiteCertificate', {
      domainName: fullDomain,
      hostedZone: hostedZone,
      region: 'us-east-1',
    });

    new CfnOutput(this, 'Certificate', {
      value: certificate.certificateArn,
    });

    return certificate;
  }

  /**
   * CloudFront distribution that provides HTTPS
   */
  private getCloudFrontDistribution(
    websiteBucket: Bucket,
    accessIdentity: OriginAccessIdentity,
    certificateArn: string,
  ): CloudFrontWebDistribution {
    const fullDomain = `${this.props.subdomain}.${this.props.domain}`;
    const distribution = new CloudFrontWebDistribution(
      this,
      'SiteDistribution',
      {
        aliasConfiguration: {
          acmCertRef: certificateArn,
          names: [fullDomain],
          sslMethod: SSLMethod.SNI,
          securityPolicy: SecurityPolicyProtocol.TLS_V1_2_2019,
        },
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: websiteBucket,
              originAccessIdentity: accessIdentity,
            },
            behaviors: [{ isDefaultBehavior: true }],
          },
        ],
        errorConfigurations: [
          {
            errorCode: 403,
            responsePagePath: this.props.errorDoc
              ? `/${this.props.errorDoc}`
              : `/${this.props.indexDoc}`,
            responseCode: 200,
          },
          {
            errorCode: 404,
            responsePagePath: this.props.errorDoc
              ? `/${this.props.errorDoc}`
              : `/${this.props.indexDoc}`,
            responseCode: 200,
          },
        ],
      },
    );
    new CfnOutput(this, 'DistributionId', {
      value: distribution.distributionId,
    });

    return distribution;
  }

  /**
   * Route53 alias record for the CloudFront distribution
   */
  private addRoute53Record(
    cloudfrontDistribution: CloudFrontWebDistribution,
    hostedZone: IHostedZone,
  ): RecordSet {
    const fullDomain = `${this.props.subdomain}.${this.props.domain}`;
    const record = new ARecord(this, 'SiteAliasRecord', {
      recordName: fullDomain,
      target: RecordTarget.fromAlias(
        new CloudFrontTarget(cloudfrontDistribution),
      ),
      zone: hostedZone,
    });
    return record;
  }

  /**
   * Deploy site contents to S3 bucket
   */
  private deployBucket(
    websiteBucket: Bucket,
    cloudfrontDistribution: CloudFrontWebDistribution,
  ): BucketDeployment {
    const bucketDeployment = new BucketDeployment(this, 'BucketDeployment', {
      sources: [Source.asset(this.props.websiteBuildFolder)],
      destinationBucket: websiteBucket,
      distribution: cloudfrontDistribution,
      distributionPaths: ['/*'],
    });
    return bucketDeployment;
  }

  public deploy() {
    const websiteBucket = this.getS3Bucket();
    const accessIdentity = this.getAccessIdentity(websiteBucket);
    const hostedZone = this.getHostedZone();
    let certificateArn = this.props.certificateARN;
    if ( certificateArn === undefined || certificateArn === null ) {
      const certificate = this.getCertificate(hostedZone);
      certificateArn = certificate.certificateArn;
    }
    const distribution = this.getCloudFrontDistribution(
      websiteBucket,
      accessIdentity,
      certificateArn!,
    );
    this.addRoute53Record(distribution, hostedZone);
    this.deployBucket(websiteBucket, distribution);
  }
}
