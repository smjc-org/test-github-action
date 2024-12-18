import * as core from "@actions/core";
import * as github from "@actions/github";
import { createActionAuth } from "@octokit/auth-action";

async function main() {
  try {
    const context = github.context;

    if (context.payload.issue) {
      const issueTitle = context.payload.issue.title;
      const issueNumber = context.payload.issue.number;

      const auth = createActionAuth();
      const authentication = await auth();
      console.log("Authentication: ", authentication);

      const octokit = github.getOctokit(authentication);

      const labels = issueTitle
        .match(/\[([^\[\]]+)\]/g)
        .map((label) => label.replace(/[\[\]]/g, ""));
      console.log("Issue Title: ", issueTitle);
      console.log("Labels: ", labels);

      if (labels.length > 0) {
        await octokit.rest.issues.addLabels({
          ...context.repo,
          issue_number: issueNumber,
          labels: labels,
        });
      }
    } else {
      console.log("This is not an issue event.");
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

main();
