import "./styles/admin-page.less";
import "react-table/react-table.css";
import * as React from "react";
import * as ClientApi from "./api/client-api";
import ReactTable, {Column} from "react-table";
import {RouteComponentProps} from "react-router-dom";
import {User} from "./models/user";
import {Log} from "../models/log";

type Props = {
  user: User;
} & RouteComponentProps<any>;

type State = {
  logs: Log[];
  loading: boolean;
  continuationToken?: string | null;
};

export class AdminPage extends React.Component<Props, State> {
  private logColumns: Column[] = [
    {
      Header: "Timestamp",
      accessor: "timestamp"
    },
    {
      Header: "Level",
      accessor: "level"
    },
    {
      Header: "Message",
      accessor: "message"
    },
    {
      Header: "Exception",
      accessor: "exception"
    }
  ];

  constructor(props: Props) {
    super(props);

    this.state = {
      logs: [],
      loading: false
    };
  }

  public render(): JSX.Element {
    return <div className="admin-page">
      Welcome {this.props.user.username}
      <ReactTable
        manual
        data={this.state.logs}
        loading={this.state.loading}
        columns={this.logColumns}
        onFetchData={async () => {
          if (this.state.continuationToken !== null) {
            this.setState({loading: true});
            const page = await ClientApi.getLogs(this.state.continuationToken);
            this.setState({
              logs: this.state.logs.concat(page.values),
              loading: false,
              continuationToken: page.continuationToken
            });
          }
        }}/>
    </div>;
  }
}
