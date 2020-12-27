const { AwsCdkConstructLibrary } = require('projen');

const project = new AwsCdkConstructLibrary({
  authorAddress: 'stermi@gmail.com',
  authorName: 'Emanuele Ricci',
  description:
    'An AWS CDK construct to instantly deploy a static website on serverless infrastructure. Easy, fast, done.',
  name: 'cdk-website',
  repository: 'https://github.com/stermi/cdk-website.git',
  keywords: ['spa', 'website', 'vue', 'react', 'angular'],

  cdkVersion: '1.80.0',
  cdkDependencies: [
    '@aws-cdk/core',
    '@aws-cdk/aws-certificatemanager',
    '@aws-cdk/aws-cloudfront',
    '@aws-cdk/aws-route53',
    '@aws-cdk/aws-route53-targets',
    '@aws-cdk/aws-s3',
    '@aws-cdk/aws-s3-deployment',
  ],
  cdkTestDependencies: ['@aws-cdk/assert'],

  catalog: {
    announce: true,
    twitter: 'stermi',
  },

  defaultReleaseBranch: 'main',
});

project.gitignore.exclude('.env', '.idea', '.vscode');

project.synth();
