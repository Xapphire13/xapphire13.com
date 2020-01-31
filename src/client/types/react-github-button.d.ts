declare module "react-github-button" {
  import React from "react";

  type Props = {
    type: "stargazer" | "watchers" | "forks";
    size?: "default" | "large";
    namespace: string;
    repo: string;
  };

  class GitHubButton extends React.Component<Props> {}

  export = GitHubButton;
}
