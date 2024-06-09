export type IIssue = {
  id: number;
  name: string;
  issue_type: number;
  issue_name: string;
};
export type IIssueQuery = {
  txtSearch: string;
  page: number;
  limit: number;
  sortField: string;
  sortDirection: string;
  issue_type: string;
  issue_id: string;
};

export type IIssueForm = {
  name: string;
  issue_id?: number;
};
