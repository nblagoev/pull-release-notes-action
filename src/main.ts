import * as core from "@actions/core"
import { ReleaseNotes } from "@nblagoev/pull-release-notes"

process.on("unhandledRejection", handleError)
main().catch(handleError)

async function main(): Promise<void> {
    const [owner, repo] = core.getInput("repository", { required: true }).split("/")
    const baseRef = core.getInput("base-ref", { required: true }).replace("refs/tags/", "")
    const headRef = core.getInput("head-ref", { required: true }).replace("refs/tags/", "")

    const releaseNotes = new ReleaseNotes({
        owner,
        repo,
        fromTag: baseRef,
        toTag: headRef,
        formatter: ReleaseNotes.defaultFormatter
    })

    core.info(`Pulling release notes between base '${baseRef}' and head '${headRef}'`)
    const result = await releaseNotes.pull()
    core.info(`\n\n${result}`)
    core.setOutput("result", result)
}

function handleError(err: any): void {
    console.error(err)
    core.setFailed(`Unhandled error: ${err}`)
}
