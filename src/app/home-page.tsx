import "./styles/home-page.less";
import * as React from "react";
import * as ClientApi from "./client-api";
import {Post} from "./post";
import {PostPreview} from "./post-preview";
import throttle = require("throttleit");

const MAX_PREVIEW_LENGTH = 4000;

type State = {
  loading: boolean;
  loadedPosts: Post[];
};

export class HomePage extends React.Component<{}, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      loading: false,
      loadedPosts: []
    };
  }

  public componentDidMount(): void {
    window.addEventListener("scroll", this.onScroll)
    this.loadPosts();
  }

  public componentWillUnmount(): void {
    window.removeEventListener("scroll", this.onScroll);
  }

  public render(): JSX.Element {
    return <div className={`home-page${this.state.loading ? " loading" : ""}`}>
      {this.state.loadedPosts.map((post, i) =>
        <PostPreview
          id={post.id}
          key={i}
          title={post.title}
          created={post.created}
          lastModified={post.lastModified}
          markdownText={post.markdownText}
          tags={post.tags}
          maxLength={MAX_PREVIEW_LENGTH} />)}
    </div>;
  }

  private async loadPosts(): Promise<void> {
    const {loadedPosts} = this.state;
    this.setState({
      loading: true
    });

    const posts = await ClientApi.getPosts();

    for (
      let i = loadedPosts.length, c = 3;
      loadedPosts.length < posts.length && c;
      c--, i++) {
      loadedPosts.push(posts[i]);
    }

    this.setState({
      loadedPosts,
      loading: false
    });
  }

  private onScroll = throttle(() => {
    const app = document.getElementById("app")!;
    if (window.innerHeight + window.scrollY + 200 >= app.offsetHeight) {
      this.loadPosts();
    }
  }, 500);
}
