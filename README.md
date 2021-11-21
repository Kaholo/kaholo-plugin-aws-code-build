# kaholo-plugin-AWS-Code-Build
Kaholo plugin for integration with AWS Code Build API.

##  Settings
1. Access key (String) **Required if not in method parameters** - The access key ID of the default user to use to authenticate to AWS.
2. Secret key (Vault) **Required if not in method parameters** - The access key secret of the default user to use to authenticate to AWS.
3. Region (String) **Required if not in method parameters** - The default AWS region to make requests on.

## Method: Start Build
Start a new build for the specified Code Build project.

## Parameters
1. Access key (String) **Required if not in settings** - The access key ID of the user to use to authenticate to AWS for this request.
2. Secret key (Vault) **Required if not in settings** - The access key secret of the user to use to authenticate to AWS for this request.
3. Region (Autocomplete) **Required if not in settings** - The AWS region to make this request on.
4. Project (Autocomplete) **Required** - The Code Build project to build.
5. Source Version (String) **Optional** - The version of the build input to be built, for this build only. If not specified, the latest version is used. Expected value depands on type of source code for this project.
* CodeCommit - The commit ID, branch, or Git tag to use.
* GitHub - The commit ID, pull request ID, branch name, or tag name that corresponds to the version of the source code you want to build. If a pull request ID is specified, it must use the format pr/pull-request-ID (for example pr/25). If a branch name is specified, the branch's HEAD commit ID is used. If not specified, the default branch's HEAD commit ID is used.
* Bitbucket - The commit ID, branch name, or tag name that corresponds to the version of the source code you want to build. If a branch name is specified, the branch's HEAD commit ID is used. If not specified, the default branch's HEAD commit ID is used.
* Amazon S3 - The version ID of the object that represents the build input ZIP file to use.
6. Enable Debug Session (Boolean) **Optional** - Specifies if session debugging is enabled for this build. You can read more on session debugging in AWS [here](https://docs.aws.amazon.com/codebuild/latest/userguide/session-manager.html).

## Method: Stop Build
Stop the specified build.

## Parameters
1. Access key (String) **Required if not in settings** - The access key ID of the user to use to authenticate to AWS for this request.
2. Secret key (Vault) **Required if not in settings** - The access key secret of the user to use to authenticate to AWS for this request.
3. Region (Autocomplete) **Required if not in settings** - The AWS region to make this request on.
4. Project (Autocomplete) **Optional** - The Code Build project of the build to stop. Used to filter builds in the 'Build" parameter.
5. Build (Autocomplete) **Required** - The build to stop.

## Method: Get Builds
Get all information on the specified build(s).

## Parameters
1. Access key (String) **Required if not in settings** - The access key ID of the user to use to authenticate to AWS for this request.
2. Secret key (Vault) **Required if not in settings** - The access key secret of the user to use to authenticate to AWS for this request.
3. Region (Autocomplete) **Required if not in settings** - The AWS region to make this request on.
4. Project (Autocomplete) **Optional** - The Code Build project of the builds to get information about. Used to filter builds in the 'Build" parameter.
5. Builds (Autocomplete) **Required** - The build(s) to stop. Can specify multiple builds by passing an array of build IDs to return information about.

## Method: Create Project From JSON
Create a new CodeBuild project from the specified JSON parameters file.

## Parameters
1. Access key (String) **Required if not in settings** - The access key ID of the user to use to authenticate to AWS for this request.
2. Secret key (Vault) **Required if not in settings** - The access key secret of the user to use to authenticate to AWS for this request.
3. Region (Autocomplete) **Required if not in settings** - The AWS region to make this request on.
4. Project JSON (Text) **Required** - The JSON object, containing the parameters to create the CodeBuild project from. Can be passed either as it's local path on the agent or from code as a JavaScript object.
[Learn More](https://docs.aws.amazon.com/codebuild/latest/userguide/create-project-cli.html)

## Method: Update Project From JSON
Update a CodeBuild project using the specified JSON parameters file.

## Parameters
1. Access key (String) **Required if not in settings** - The access key ID of the user to use to authenticate to AWS for this request.
2. Secret key (Vault) **Required if not in settings** - The access key secret of the user to use to authenticate to AWS for this request.
3. Region (Autocomplete) **Required if not in settings** - The AWS region to make this request on.
4. Project JSON (Text) **Required** - The JSON object, containing the parameters to update the CodeBuild project from. Can be passed either as it's local path on the agent or from code as a JavaScript object.
[Learn More](https://docs.aws.amazon.com/codebuild/latest/userguide/change-project-cli.html)

## Method: Get Project
Get information about the specified CodeBuild project.

## Parameters
1. Access key (String) **Required if not in settings** - The access key ID of the user to use to authenticate to AWS for this request.
2. Secret key (Vault) **Required if not in settings** - The access key secret of the user to use to authenticate to AWS for this request.
3. Region (Autocomplete) **Required if not in settings** - The AWS region to make this request on.
4. Project (Autocomplete) **Required** - The CodeBuild project to return information about.

## Method: Delete Project
Delete the specified CodeBuild project.

## Parameters
1. Access key (String) **Required if not in settings** - The access key ID of the user to use to authenticate to AWS for this request.
2. Secret key (Vault) **Required if not in settings** - The access key secret of the user to use to authenticate to AWS for this request.
3. Region (Autocomplete) **Required if not in settings** - The AWS region to make this request on.
4. Project (Autocomplete) **Required** - The CodeBuild project to delete.

## Method: List Projects
List all Code Build project names on this AWS account.

## Parameters
1. Access key (String) **Required if not in settings** - The access key ID of the user to use to authenticate to AWS for this request.
2. Secret key (Vault) **Required if not in settings** - The access key secret of the user to use to authenticate to AWS for this request.
3. Region (Autocomplete) **Required if not in settings** - The AWS region to make this request on.

## Method: List Builds
List all build IDs on this AWS account. If specified a project return only builds related to this project.

## Parameters
1. Access key (String) **Required if not in settings** - The access key ID of the user to use to authenticate to AWS for this request.
2. Secret key (Vault) **Required if not in settings** - The access key secret of the user to use to authenticate to AWS for this request.
3. Region (Autocomplete) **Required if not in settings** - The AWS region to make this request on.
4. Project (Autocomplete) **Optional** - If specified, only return builds of this project.