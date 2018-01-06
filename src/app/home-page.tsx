import * as React from "react";
import {PostPreview} from "./post-preview";
import MOCK_POSTS from "./mock-posts";

const MAX_PREVIEW_LENGTH = 4000;

export class HomePage extends React.Component {
  public render(): JSX.Element {
    return <div>
      {MOCK_POSTS.map((post, i) =>
        <PostPreview
          key={i}
          title="Test"
          created={new Date()}
          lastModified={new Date()}
          markdownText={post}
          tags={["Test", "tech", "awesome"]}
          maxLength={MAX_PREVIEW_LENGTH} />)}
    </div>;
  }
}
