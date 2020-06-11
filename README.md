# Pull Release Notes Action

> A GitHub Action to generate a PR changelog between two refs.

![build-test](https://github.com/nblagoev/pull-release-notes-action/workflows/build-test/badge.svg)

## Usage
### Pre-requisites
Create a workflow `.yml` file in your `.github/workflows` directory. An [example workflow](#example-workflow---create-a-release) is available below. For more information, reference the GitHub Help Documentation for [Creating a workflow file](https://help.github.com/en/articles/configuring-a-workflow#creating-a-workflow-file).

### Inputs
The release notes will be generated for PRs between the base ref and the head ref.

- `base-ref`: The base ref (commit sha, branch or tag).
- `head-ref`: The head ref (commit sha, branch or tag).
- `repository`: Optional. The owner and repository name, in the format `<owner>/<repo>`. Default value is the repository where the workflow is running.

### Outputs
- `result`: The generated release notes, as markdown string.

### Example workflow - create a release
On every `push` to a tag matching the pattern `v*`, create a draft release with changelog:

```yaml
on:
  push:
    tags:
      - 'v*'

name: Create Release

jobs:
  release:
    name: Create Release
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Get Previous Tag
        run: |
          PREV_TAG=$(git describe --abbrev=0 --tags "${{ github.ref }}^")
          echo "::set-env name=baseRef::$PREV_TAG"

      - name: Generate Changelog
        id: generate_changelog
        uses: nblagoev/pull-release-notes-action@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }} # This token is provided by Actions, you do not need to create your own token
        with:
          base-ref: ${{ env.baseRef }}
          head-ref: ${{ github.ref }}

      - name: Create Release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: ${{ github.ref }}
          release_name: Release ${{ github.ref }}
          body: ${{steps.generate_changelog.outputs.result}}
          draft: true
```

This workflow will generate a changelog from the pull requests merged between the current and the previous tag. Then it will create a [Draft Release](https://help.github.com/en/articles/creating-releases) with the changelog as body.

## License
The scripts and documentation in this project are released under the [MIT License](LICENSE)
