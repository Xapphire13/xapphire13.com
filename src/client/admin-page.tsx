import './styles/admin-page.less';
import './styles/table.less';
import React from 'react';
import ReactTable, { Column } from 'react-table';
import { RouteComponentProps } from 'react-router-dom';
import * as ClientApi from './api/client-api';
import { User } from './models/user';
import Log from ':models/log';

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

export default class AdminPage extends React.Component<Props, State> {
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
    const { user } = this.props;
    const { numberOfPages, logs, loading, continuationToken } = this.state;

    return (
      <div className="admin-page">
        Welcome {user.username}
        <ReactTable
          sortable={false}
          pages={numberOfPages}
          showPageJump={false}
          showPageSizeOptions={false}
          pageSize={PAGE_SIZE}
          data={logs}
          loading={loading}
          columns={this.logColumns}
          onFetchData={async () => {
            if (continuationToken !== null) {
              this.setState({ loading: true });
              const page = await ClientApi.getLogs(continuationToken);
              const newLogs = logs.concat(page.values);
              let numberOfPages = Math.ceil(newLogs.length / PAGE_SIZE);
              if (page.continuationToken) numberOfPages++;
              this.setState({
                logs: newLogs,
                loading: false,
                continuationToken: page.continuationToken,
                numberOfPages
              });
            }
          }}
        />
      </div>
    );
  }
}
