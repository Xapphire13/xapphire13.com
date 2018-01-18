import "./styles/home-page.less";
import * as React from "react";
import * as ClientApi from "./api/client-api";
import * as Utils from "./utils";
import {Post} from "../post";
import {PostPreview} from "./post-preview";
import {Disposable} from "./disposable";
import throttle = require("throttleit");

const MAX_PREVIEW_LENGTH = 4000;

type State = {
  loading: boolean;
  loadedPosts: Post[];
};

export class HomePage extends React.Component<{}, State> {
  private scrollSubscription: Disposable = { dispose: () => {} };
  private continuationToken: string | null;
  private app: HTMLElement;

  constructor(props: any) {
    super(props);
    this.state = {
      loading: false,
      loadedPosts: [],
    };
  }

  public async componentDidMount(): Promise<void> {
    this.app = document.getElementById("app")!;

    this.continuationToken = await this.loadPosts();

    while (this.continuationToken && this.app.clientHeight <= window.innerHeight) {
      this.continuationToken = await this.loadPosts();
    }

    if (this.continuationToken) {
      this.scrollSubscription = Utils.subscribeToEvent(window, "scroll", this.onScroll);
    }
  }

  public componentWillUnmount(): void {
    this.scrollSubscription.dispose();
  }

  public render(): JSX.Element {
    return <div className={`home-page${this.state.loading ? " loading" : ""}`}>
      {this.state.loadedPosts.map((post, i) =>
        <PostPreview
          id={post.id}
          key={i}
          title={post.title}
          created={new Date(post.created)}
          lastModified={new Date(post.lastModified)}
          markdownText={post.markdownText}
          tags={post.tags}
          maxLength={MAX_PREVIEW_LENGTH} />)}
    </div>;
  }

  private async loadPosts(): Promise<string | null> {
    const {loadedPosts} = this.state;
    this.setState({
      loading: true
    });

    const {continuationToken, values} = await ClientApi.getPosts(this.continuationToken);

    loadedPosts.push(...values);

    this.setState({
      loadedPosts,
      loading: false
    });

    return continuationToken;
  }

  private onScroll = throttle(async () => {
    if (window.innerHeight + window.scrollY + 200 >= this.app.offsetHeight) {
      if (this.continuationToken) {
        this.continuationToken = await this.loadPosts();
      } else {
        this.scrollSubscription.dispose();
      }
    }
  }, 500);
}
