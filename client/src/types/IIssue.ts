export type IIssue = {
  id: number;
  name: string;
  issue_name: string;
};

export type IIssueForm = {
  name: string;
  issue_id: string | null;
};
