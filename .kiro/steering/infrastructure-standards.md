# Infrastructure Standards

## AWS Resource Tagging

All AWS resources created through Infrastructure as Code (CDK, CloudFormation, Terraform) MUST be tagged with the following standard tags:

### Required Tags

| Tag Key       | Tag Value      | Purpose                                                            |
| ------------- | -------------- | ------------------------------------------------------------------ |
| `Product`     | `index-cards`  | Identifies resources belonging to the IndexCards platform          |
| `cost-center` | `web-and-apps` | Associates resources with the web and apps cost center for billing |

### Implementation

**AWS CDK (TypeScript):**

```typescript
import * as cdk from "aws-cdk-lib";

// Apply tags at the app level (all stacks inherit)
const app = new cdk.App();
cdk.Tags.of(app).add("Product", "index-cards");
cdk.Tags.of(app).add("cost-center", "web-and-apps");

// Or apply at stack level
const stack = new cdk.Stack(app, "MyStack");
cdk.Tags.of(stack).add("Product", "index-cards");
cdk.Tags.of(stack).add("cost-center", "web-and-apps");
```

### Additional Recommended Tags

While not required, the following tags are recommended for better resource management:

| Tag Key       | Example Value                | Purpose                             |
| ------------- | ---------------------------- | ----------------------------------- |
| `Environment` | `dev`, `staging`, `prod`     | Identifies deployment environment   |
| `Stack`       | `Network`, `Database`, `API` | Identifies the infrastructure stack |
| `ManagedBy`   | `CDK`, `Terraform`           | Identifies IaC tool used            |
| `Owner`       | `platform-team`              | Identifies responsible team         |

### Validation

Use CDK Aspects or CloudFormation Guard rules to validate that all resources have required tags before deployment.

**CDK Aspect Example:**

```typescript
import { IAspect, IConstruct, Annotations, TagManager } from "aws-cdk-lib";

class RequiredTagsAspect implements IAspect {
  visit(node: IConstruct): void {
    if (node instanceof cdk.CfnResource) {
      const tags = TagManager.of(node);

      if (!tags.hasTags()) {
        Annotations.of(node).addError(
          "Resource must have Product and cost-center tags"
        );
      }
    }
  }
}

// Apply to app
Aspects.of(app).add(new RequiredTagsAspect());
```

## Cost Allocation

These tags enable:

- **Cost tracking** by product and cost center
- **Resource filtering** in AWS Console and CLI
- **Automated reporting** for billing and compliance
- **Resource lifecycle management** based on tags

## Compliance

Failure to tag resources appropriately may result in:

- Deployment failures (if validation is enforced)
- Difficulty tracking costs
- Challenges in resource management and cleanup
- Audit findings

## References

- [AWS Tagging Best Practices](https://docs.aws.amazon.com/general/latest/gr/aws_tagging.html)
- [CDK Tagging Documentation](https://docs.aws.amazon.com/cdk/v2/guide/tagging.html)
