import './styles/admin-page.less';
import './styles/table.less';
import * as React from "react";
import ReactTable, { Column } from "react-table";
import { RouteComponentProps } from "react-router-dom";
import * as ClientApi from "./api/client-api";
import { User } from './models/user';
import Log from ':entities/log';

type Props = {
  user: User;
} & RouteComponentProps<any>;

type State = {
  logs: Log[];
  loading: boolean;
  continuationToken?: string | null;
  numberOfPages: number;
};

const PAGE_SIZE = 10;

export class AdminPage extends React.Component<Props, State> {
  public state: Readonly<State>;

  private logColumns: Column[] = [
    {
      Header: 'Timestamp',
      accessor: 'timestamp'
    },
    {
      Header: 'Level',
      accessor: 'level'
    },
    {
      Header: 'Message',
      accessor: 'message'
    },
    {
      Header: 'Exception',
      accessor: 'exception'
    }
  ];

  constructor(props: Props) {
    super(props);

    this.state = {
      logs: [],
      loading: false,
      numberOfPages: -1
    };
  }

  public render(): JSX.Element {
    return (
      <div className="admin-page">
        Welcome {this.props.user.username}
        <ReactTable
          sortable={false}
          pages={this.state.numberOfPages}
          showPageJump={false}
          showPageSizeOptions={false}
          pageSize={PAGE_SIZE}
          data={this.state.logs}
          loading={this.state.loading}
          columns={this.logColumns}
          onFetchData={async () => {
            if (this.state.continuationToken !== null) {
              this.setState({ loading: true });
              const page = await ClientApi.getLogs(
                this.state.continuationToken
              );
              const logs = this.state.logs.concat(page.values);
              let numberOfPages = Math.ceil(logs.length / PAGE_SIZE);
              page.continuationToken && numberOfPages++;
              this.setState({
                logs,
                loading: false,
                continuationToken: page.continuationToken,
                numberOfPages
              });
            }
          }}
        />
           </div>;
  }
}
