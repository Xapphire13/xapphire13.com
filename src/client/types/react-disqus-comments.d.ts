declare module "react-disqus-comments" {
  import React from "react";

  type Props = {
    shortname: string;
    identifier: string;
    title: string;
    url: string;
    category_id?: string;
    onNewComment?: Function
  } & React.HTMLAttributes<HTMLDivElement>;

  class ReactDisqusComments extends React.Component<Props> {}

  export default ReactDisqusComments;
}
